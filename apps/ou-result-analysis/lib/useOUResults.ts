"use client";

import { useState, useEffect, useCallback } from "react";
import { APIResponse, APIResultEntry, StudentResult, SemesterAnalytics } from "./types";
import { parseAllResults, computeSemesterAnalytics, getAvailableSemesters } from "./parseOUResults";

const API_URL = "https://metarepo-cf-server.ghost-server.workers.dev/ou-results";
const CACHE_KEY = "ou-results-cache";
const CACHE_TIMESTAMP_KEY = "ou-results-cache-timestamp";
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes cache

interface CacheData {
  entries: APIResultEntry[];
  total: number;
  timestamp: number;
}

interface UseOUResultsReturn {
  // Raw data
  entries: APIResultEntry[];
  students: StudentResult[];
  
  // Analytics
  semesterAnalytics: SemesterAnalytics | null;
  availableSemesters: number[];
  selectedSemester: number;
  setSelectedSemester: (semester: number) => void;
  
  // Loading state
  isLoading: boolean;
  loadingProgress: { current: number; total: number };
  error: string | null;
  
  // Actions
  refetch: () => Promise<void>;
  clearCache: () => void;
}

/**
 * Fetches a single page of results
 */
async function fetchPage(page: number, limit = 100): Promise<APIResponse> {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch page ${page}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches all pages of results
 */
async function fetchAllResults(
  onProgress?: (current: number, total: number) => void
): Promise<APIResultEntry[]> {
  const allEntries: APIResultEntry[] = [];
  const limit = 100;
  
  // First, get total count
  const firstPage = await fetchPage(1, limit);
  allEntries.push(...firstPage.data);
  
  const total = firstPage.pagination.total;
  const totalPages = firstPage.pagination.totalPages;
  
  onProgress?.(allEntries.length, total);
  
  // Fetch remaining pages
  for (let page = 2; page <= totalPages; page++) {
    const pageData = await fetchPage(page, limit);
    allEntries.push(...pageData.data);
    onProgress?.(allEntries.length, total);
  }
  
  return allEntries;
}

/**
 * Custom hook for fetching and managing OU Results data
 */
export function useOUResults(): UseOUResultsReturn {
  const [entries, setEntries] = useState<APIResultEntry[]>([]);
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number>(3);
  const [semesterAnalytics, setSemesterAnalytics] = useState<SemesterAnalytics | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Load data from localStorage cache
   */
  const loadFromCache = useCallback((): CacheData | null => {
    if (typeof window === "undefined") return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const cacheTime = parseInt(timestamp, 10);
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - cacheTime < CACHE_DURATION) {
          const data = JSON.parse(cached) as CacheData;
          return data;
        }
      }
    } catch (err) {
      console.error("Error loading from cache:", err);
    }
    
    return null;
  }, []);
  
  /**
   * Save data to localStorage cache
   */
  const saveToCache = useCallback((entries: APIResultEntry[]) => {
    if (typeof window === "undefined") return;
    
    try {
      const cacheData: CacheData = {
        entries,
        total: entries.length,
        timestamp: Date.now(),
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.error("Error saving to cache:", err);
    }
  }, []);
  
  /**
   * Clear localStorage cache
   */
  const clearCache = useCallback(() => {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  }, []);
  
  /**
   * Process entries into students and compute analytics
   */
  const processData = useCallback((entries: APIResultEntry[]) => {
    const parsedStudents = parseAllResults(entries);
    setStudents(parsedStudents);
    
    const semesters = getAvailableSemesters(parsedStudents);
    setAvailableSemesters(semesters);
    
    // Default to semester 3 if available
    const defaultSemester = semesters.includes(3) ? 3 : semesters[semesters.length - 1] || 3;
    setSelectedSemester(defaultSemester);
    
    // Compute analytics for selected semester
    const analytics = computeSemesterAnalytics(parsedStudents, defaultSemester);
    setSemesterAnalytics(analytics);
  }, []);
  
  /**
   * Fetch all data (with cache check)
   */
  const fetchData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try loading from cache first
      if (!forceRefresh) {
        const cached = loadFromCache();
        if (cached && cached.entries.length > 0) {
          console.log(`Loaded ${cached.entries.length} entries from cache`);
          setEntries(cached.entries);
          setLoadingProgress({ current: cached.total, total: cached.total });
          processData(cached.entries);
          setIsLoading(false);
          return;
        }
      }
      
      // Fetch from API
      console.log("Fetching data from API...");
      const allEntries = await fetchAllResults((current, total) => {
        setLoadingProgress({ current, total });
      });
      
      console.log(`Fetched ${allEntries.length} entries from API`);
      setEntries(allEntries);
      
      // Save to cache
      saveToCache(allEntries);
      
      // Process data
      processData(allEntries);
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [loadFromCache, saveToCache, processData]);
  
  /**
   * Refetch data (force refresh)
   */
  const refetch = useCallback(async () => {
    clearCache();
    await fetchData(true);
  }, [fetchData, clearCache]);
  
  /**
   * Update analytics when semester changes
   */
  useEffect(() => {
    if (students.length > 0) {
      const analytics = computeSemesterAnalytics(students, selectedSemester);
      setSemesterAnalytics(analytics);
    }
  }, [selectedSemester, students]);
  
  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    entries,
    students,
    semesterAnalytics,
    availableSemesters,
    selectedSemester,
    setSelectedSemester,
    isLoading,
    loadingProgress,
    error,
    refetch,
    clearCache,
  };
}

export default useOUResults;
