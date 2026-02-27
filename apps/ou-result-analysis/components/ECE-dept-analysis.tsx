"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Users, 
  Award, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { StudentResult, SubjectAnalytics, SEMESTER_3_SUBJECTS } from "@/lib/types";

// NOTE: ECE Department data is large and can cause localStorage quota exceeded errors
// This component uses a smart in-memory cache (not localStorage) to avoid quota issues
// Cache is cleared when switching ECE year tabs

// API base endpoint for ECE students
const API_BASE = "https://metarepo-cf-server.ghost-server.workers.dev/ou-results/range";

// ECE API endpoints for different year ranges
const ECE_API_ENDPOINTS = [
  `${API_BASE}?rollnumber=160424735001-160424735306`, // 2nd Year (covers 001-060, 301-306)
  `${API_BASE}?rollnumber=160423735001-160423735308`, // 3rd Year (covers 001-023, 301-308)
  `${API_BASE}?rollnumber=160422735001-160422735314`, // 4th Year (covers all ranges)
];

// ECE Yearwise Rollnumber Groups - Exact ranges as specified by user
const ECE_ROLL_GROUPS = {
  "2nd Year": [
    { prefix: "160424735", ranges: [ [1, 45], [47, 60], [301, 306] ] },
  ],
  "3rd Year": [
    { prefix: "160423735", ranges: [ [1, 17], [19, 23], [301, 308] ] },
    { prefix: "160422735", ranges: [ [5, 5] ] }, // Special case: 160422735005
  ],
  "4th Year": [
    { prefix: "160422735", ranges: [ [1, 4], [6, 34], [36, 56], [58, 60], [61, 66], [68, 78], [80, 108], [301, 314] ] },
  ],
};

function isECEYearRoll(roll: string, year: keyof typeof ECE_ROLL_GROUPS): boolean {
  const groups = ECE_ROLL_GROUPS[year];
  for (const group of groups) {
    if (roll.startsWith(group.prefix)) {
      const num = parseInt(roll.slice(group.prefix.length), 10);
      for (const [start, end] of group.ranges) {
        if (num >= start && num <= end) return true;
      }
    }
  }
  // Special case for 3rd year: 160422735005
  if (year === "3rd Year" && roll === "160422735005") return true;
  return false;
}

const ECE_YEARS = ["2nd Year", "3rd Year", "4th Year"] as const;
type ECEYear = typeof ECE_YEARS[number];

// Smart in-memory cache for ECE data (per year)
const eceCache: { [year in ECEYear]?: StudentResult[] } = {};

// ─── Student Row with Expandable Details ──────────────────────────────────────
const StudentRow = ({ student, rank, selectedYear }: { student: StudentResult; rank: number; selectedYear: ECEYear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Semester mapping for each year
  const semMap = { "2nd Year": 3, "3rd Year": 5, "4th Year": 7 };
  const targetSem = semMap[selectedYear];
  
  // Get target semester result
  const semResult = student.semesterResults.find(r => r.semester === targetSem);
  const semSubjectCodes = Object.keys(SEMESTER_3_SUBJECTS); // TODO: Map to correct semester subjects if needed
  
  // Count F grades in target semester subjects
  const semSubjects = student.subjects.filter(s => semSubjectCodes.includes(s.code));
  const fCount = semSubjects.filter(s => s.grade === "F").length;
  
  // Determine result status and color
  let resultStatus = "N/A";
  let resultColor = "text-[#6b6b6b]";
  let cgpaDisplay = "-";
  
  if (semResult) {
    if (semResult.result.includes("PASSED")) {
      resultStatus = "PASSED";
      resultColor = "text-emerald-400";
    } else if (semResult.result.includes("ALREADY PROMOTED")) {
      resultStatus = "ALREADY PROMOTED";
      resultColor = "text-cyan-400";
    } else if (semResult.isPromoted) {
      resultStatus = "PROMOTED";
      resultColor = "text-amber-400";
    }
    
    if (semResult.sgpa !== null) {
      cgpaDisplay = semResult.sgpa.toFixed(2);
    }
    if (semResult.cgpa !== null) {
      cgpaDisplay = semResult.cgpa.toFixed(2);
    }
  }
  
  return (
    <>
      <tr 
        className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="text-[#6b6b6b] hover:text-white transition-colors">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <span className={`text-sm font-bold ${rank <= 3 ? "text-amber-400" : "text-[#8b8b8b]"}`}>
              #{rank}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-cyan-400 font-mono text-sm">{student.rollnumber}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-white text-sm font-medium">{student.name || "N/A"}</span>
        </td>
        <td className="px-4 py-3">
          <span className={`text-lg font-bold ${
            semResult?.sgpa && semResult.sgpa >= 8.5 ? "text-amber-400" 
            : semResult?.sgpa && semResult.sgpa >= 7.0 ? "text-emerald-400" 
            : "text-white"
          }`}>
            {semResult?.sgpa?.toFixed(2) || "-"}
          </span>
        </td>
        <td className="px-4 py-3">
          {fCount > 0 ? (
            <span className="text-rose-400 font-semibold">{fCount}</span>
          ) : (
            <span className="text-emerald-400">0</span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${resultColor}`}>{resultStatus}</span>
            {cgpaDisplay !== "-" && (
              <span className="text-[#6b6b6b] text-xs">({cgpaDisplay})</span>
            )}
          </div>
        </td>
      </tr>
      
      {/* Expanded Details */}
      {isExpanded && (
        <tr className="bg-[#0f0f0f]">
          <td colSpan={6} className="px-4 py-4">
            <div className="ml-8 space-y-4">
              {/* Semester Results */}
              <div>
                <h4 className="text-xs font-semibold text-[#6b6b6b] uppercase mb-2">Semester Results</h4>
                <div className="flex flex-wrap gap-2">
                  {student.semesterResults.map(sem => (
                    <div 
                      key={sem.semester}
                      className={`px-3 py-1.5 rounded-lg text-xs ${
                        sem.semester === targetSem ? "bg-cyan-500/20 border border-cyan-500/30" : "bg-[#1a1a1a]"
                      }`}
                    >
                      <span className="text-[#6b6b6b]">Sem {sem.semester}: </span>
                      <span className={
                        sem.result.includes("PASSED") ? "text-emerald-400" 
                        : sem.isPromoted ? "text-amber-400" 
                        : "text-cyan-400"
                      }>
                        {sem.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Target Semester Subjects */}
              <div>
                <h4 className="text-xs font-semibold text-[#6b6b6b] uppercase mb-2">
                  Semester {targetSem} Subjects ({semSubjects.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {semSubjects.map(sub => {
                    const gradeColor = sub.grade === "S" ? "text-cyan-400"
                      : sub.grade === "A" ? "text-emerald-400"
                      : sub.grade === "B" ? "text-lime-400"
                      : sub.grade === "C" ? "text-amber-400"
                      : sub.grade === "D" ? "text-orange-400"
                      : sub.grade === "E" ? "text-red-400"
                      : sub.grade === "F" ? "text-rose-500"
                      : "text-[#6b6b6b]";
                    
                    return (
                      <div 
                        key={sub.code}
                        className={`px-2 sm:px-3 py-2 rounded-lg bg-[#1a1a1a] border ${
                          sub.grade === "F" ? "border-rose-500/30" : "border-[#222]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-400 font-mono text-[9px] sm:text-[10px]">{sub.code}</span>
                          <span className={`font-bold text-sm ${gradeColor}`}>{sub.grade}</span>
                        </div>
                        <p className="text-[8px] sm:text-[9px] text-[#6b6b6b] mt-1 truncate" title={sub.name}>
                          {sub.name}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-white mt-0.5">
                          {sub.gradePoints >= 0 ? `${sub.gradePoints} pts` : "-"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ─── Loading State ────────────────────────────────────────────────────────────
const LoadingState = ({ progress }: { progress: { current: number; total: number } }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="relative">
      <Loader2 size={48} className="text-cyan-400 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <GraduationCap size={20} className="text-cyan-400" />
      </div>
    </div>
    <div className="text-center">
      <p className="text-white font-semibold">Loading ECE Results Data</p>
      <p className="text-[#6b6b6b] text-sm mt-1">
        {progress.total > 0 
          ? `Fetching from endpoint ${progress.current} of ${progress.total}...`
          : "Initializing data fetch..."
        }
      </p>
      <p className="text-[#8b8b8b] text-xs mt-2">
        Fetching from multiple rollnumber ranges to get all ECE students
      </p>
      <p className="text-[#6b6b6b] text-xs mt-1">
        ⚠️ ECE data not cached to prevent storage quota issues
      </p>
    </div>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────
const ErrorState = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <AlertCircle size={48} className="text-rose-400" />
    <div className="text-center">
      <p className="text-white font-semibold">Failed to Load ECE Data</p>
      <p className="text-[#6b6b6b] text-sm mt-1">{error}</p>
    </div>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    )}
  </div>
);

const ECEAnalysisTab = () => {
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: ECE_API_ENDPOINTS.length });
  const [selectedYear, setSelectedYear] = useState<ECEYear>("2nd Year");

  // Clear cache for previous year when switching tabs
  useEffect(() => {
    setStudents([]);
    setIsLoading(true);
    setError(null);
    setLoadingProgress({ current: 0, total: 1 });
    // If cache exists for selectedYear, use it
    if (eceCache[selectedYear]) {
      setStudents(eceCache[selectedYear]!);
      setIsLoading(false);
      return;
    }
    // Otherwise, fetch and cache
    const fetchYearData = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingProgress({ current: 0, total: 1 });
      try {
        // Find correct endpoint for year
        let endpoint = "";
        if (selectedYear === "2nd Year") endpoint = ECE_API_ENDPOINTS[0];
        else if (selectedYear === "3rd Year") endpoint = ECE_API_ENDPOINTS[1];
        else if (selectedYear === "4th Year") endpoint = ECE_API_ENDPOINTS[2];
        const res = await fetch(endpoint, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json() as { students?: StudentResult[] };
        // Filter strictly by rollnumber for selected year
        const filtered = (data.students || []).filter((s) => isECEYearRoll(s.rollnumber, selectedYear));
        eceCache[selectedYear] = filtered;
        setStudents(filtered);
        setLoadingProgress({ current: 1, total: 1 });
        if (filtered.length === 0) setError("No ECE students found for this year.");
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchYearData();
  }, [selectedYear]);
  useEffect(() => {
    const fetchAllECEData = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingProgress({ current: 0, total: ECE_API_ENDPOINTS.length });
      
      // Clear any existing ECE data from localStorage to prevent quota issues
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('ou-results') || key.includes('ece-data'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`Cleared ${keysToRemove.length} cache entries to prevent quota issues`);
      } catch (storageError) {
        console.warn('Failed to clear localStorage cache:', storageError);
      }
      
      try {
        const allStudents: StudentResult[] = [];
        const seenRollNumbers = new Set<string>();
        
        // Fetch from all ECE endpoints
        for (let i = 0; i < ECE_API_ENDPOINTS.length; i++) {
          const endpoint = ECE_API_ENDPOINTS[i];
          
          try {
            console.log(`Fetching ECE data from: ${endpoint}`);
            const res = await fetch(endpoint, {
              // Disable caching to prevent localStorage quota issues
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });
            
            if (!res.ok) {
              console.warn(`Failed to fetch from ${endpoint}: ${res.status} ${res.statusText}`);
              continue; // Skip failed endpoint but continue with others
            }
            
            const data:any = await res.json();
            const studentsData = data.students || [];
            
            console.log(`Fetched ${studentsData.length} students from endpoint ${i + 1}`);
            
            // Add unique students (avoid duplicates)
            studentsData.forEach((student: StudentResult) => {
              if (!seenRollNumbers.has(student.rollnumber)) {
                seenRollNumbers.add(student.rollnumber);
                allStudents.push(student);
              }
            });
            
          } catch (endpointError) {
            console.warn(`Error fetching from ${endpoint}:`, endpointError);
            continue; // Continue with other endpoints
          }
          
          setLoadingProgress({ current: i + 1, total: ECE_API_ENDPOINTS.length });
        }
        
        console.log(`Total unique ECE students fetched: ${allStudents.length}`);
        
        // Filter to keep only actual ECE students based on rollnumber patterns
        const eceStudents = allStudents.filter(student => {
          for (const year of ECE_YEARS) {
            if (isECEYearRoll(student.rollnumber, year)) {
              return true;
            }
          }
          return false;
        });
        
        console.log(`ECE students after filtering: ${eceStudents.length}`);
        console.log('ECE students by year:', {
          '2nd Year': eceStudents.filter(s => isECEYearRoll(s.rollnumber, '2nd Year')).length,
          '3rd Year': eceStudents.filter(s => isECEYearRoll(s.rollnumber, '3rd Year')).length,
          '4th Year': eceStudents.filter(s => isECEYearRoll(s.rollnumber, '4th Year')).length,
        });
        
        setStudents(eceStudents);
        
        if (eceStudents.length === 0) {
          setError("No ECE students found in the fetched data. Please check the API endpoints and rollnumber ranges.");
        }
        
      } catch (err: any) {
        console.error('Error fetching ECE data:', err);
        setError(`Failed to fetch ECE data: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllECEData();
  }, []);

  // Students are already filtered for selected year
  const yearStudents = students;

  // Sort by SGPA (descending) for leaderboard (Semester 3 for 2nd year, Semester 5 for 3rd, Semester 7 for 4th)
  const semMap = { "2nd Year": 3, "3rd Year": 5, "4th Year": 7 };
  const leaderboard = useMemo(() => {
    return [...yearStudents].sort((a, b) => {
      const aSem = a.semesterResults.find(r => r.semester === semMap[selectedYear]);
      const bSem = b.semesterResults.find(r => r.semester === semMap[selectedYear]);
      const aSGPA = aSem?.sgpa ?? -1;
      const bSGPA = bSem?.sgpa ?? -1;
      return bSGPA - aSGPA;
    });
  }, [yearStudents, selectedYear]);

  // Year stats
  const yearStats = useMemo(() => {
    const semSubjectCodes = Object.keys(SEMESTER_3_SUBJECTS); // TODO: Map to correct semester subjects if needed
    let passed = 0;
    let promoted = 0;
    let distinctions = 0;
    let totalBacklogs = 0;
    for (const student of yearStudents) {
      const semResult = student.semesterResults.find(r => r.semester === semMap[selectedYear]);
      if (semResult) {
        if (semResult.result.includes("PASSED") && !semResult.isPromoted) {
          passed++;
          if (semResult.sgpa && semResult.sgpa >= 8.5) distinctions++;
        } else if (semResult.isPromoted) {
          promoted++;
        }
      }
      // Count F grades (for mapped semester subjects)
      for (const sub of student.subjects) {
        if (semSubjectCodes.includes(sub.code) && sub.grade === "F") {
          totalBacklogs++;
        }
      }
    }
    return {
      total: yearStudents.length,
      passed,
      promoted,
      distinctions,
      totalBacklogs,
      passRate: yearStudents.length > 0 ? ((passed / yearStudents.length) * 100).toFixed(1) : "0.0",
    };
  }, [yearStudents, selectedYear]);

  if (isLoading) return <LoadingState progress={loadingProgress} />;
  if (error) return <ErrorState error={error} onRetry={() => { eceCache[selectedYear] = undefined; setSelectedYear(selectedYear); }} />;
  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <BookOpen size={48} className="text-[#6b6b6b]" />
        <div className="text-center">
          <p className="text-white font-semibold">No ECE Students Found</p>
          <p className="text-[#6b6b6b] text-sm mt-2">
            No students matching ECE rollnumber patterns were found in the fetched data.
          </p>
          <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-[#222]">
            <p className="text-[#8b8b8b] text-xs mb-2">Expected ECE Rollnumber Patterns:</p>
            <div className="text-[#6b6b6b] text-xs space-y-1">
              <div>• 2nd Year: 160424735001-045, 047-060, 301-306</div>
              <div>• 3rd Year: 160423735001-017, 019-023, 301-308, 160422735005</div>
              <div>• 4th Year: 160422735001-004, 006-034, 036-056, 058-060, 061-066, 068-078, 080-108, 301-314</div>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Retry Loading Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Year Filter */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users size={14} className="sm:hidden text-cyan-400" />
              <Users size={16} className="hidden sm:block text-cyan-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-xs sm:text-sm">ECE {selectedYear}</p>
              <p className="text-[#8b8b8b] text-[10px] sm:text-xs truncate">
                Students: {yearStats.total}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {ECE_YEARS.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`w-24 h-8 sm:w-28 sm:h-9 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                  selectedYear === year
                    ? "bg-cyan-500 text-white"
                    : "bg-[#1a1a1a] text-[#6b6b6b] hover:text-white hover:bg-[#222]"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Users size={14} className="text-cyan-400" />
            <span className="text-[#6b6b6b] text-[9px] sm:text-xs">Students</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-white">{yearStats.total}</p>
        </div>
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-[#6b6b6b] text-[9px] sm:text-xs">Passed</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-emerald-400">{yearStats.passed}</p>
          <p className="text-[#6b6b6b] text-[9px] sm:text-xs">{yearStats.passRate}%</p>
        </div>
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <AlertCircle size={14} className="text-amber-400" />
            <span className="text-[#6b6b6b] text-[9px] sm:text-xs">Promoted</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-amber-400">{yearStats.promoted}</p>
        </div>
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4 hidden sm:block">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Award size={14} className="text-amber-400" />
            <span className="text-[#6b6b6b] text-[9px] sm:text-xs">Distinctions</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-amber-400">{yearStats.distinctions}</p>
        </div>
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4 hidden lg:block">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <AlertCircle size={14} className="text-rose-400" />
            <span className="text-[#6b6b6b] text-[9px] sm:text-xs">Backlogs</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-rose-400">{yearStats.totalBacklogs}</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-[#161616] border border-[#222222] rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-amber-400" />
            <h2 className="text-sm sm:text-base font-semibold text-white">{selectedYear} ECE Leaderboard</h2>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#6b6b6b]">Semester {semMap[selectedYear]} · Sorted by SGPA</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">Rank</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">Roll No.</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">Name</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">SGPA</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">Backlogs</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">Result</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6b6b6b]">
                    No students found in ECE {selectedYear}
                  </td>
                </tr>
              ) : (
                leaderboard.map((student, idx) => (
                  <StudentRow 
                    key={student.rollnumber} 
                    student={student} 
                    rank={idx + 1} 
                    selectedYear={selectedYear}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Pass Rate Comparison - Current Semester */}
      <div className="bg-[#161616] border border-[#222222] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-400" />
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Semester {semMap[selectedYear]} Subject Pass Rates (ECE {selectedYear})
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#6b6b6b]">
            {Object.keys(SEMESTER_3_SUBJECTS).length} subjects tracked
          </span>
        </div>
        
        {/* Calculate year-specific pass rates */}
        <div className="space-y-2.5 sm:space-y-3">
          {Object.entries(SEMESTER_3_SUBJECTS).map(([code, name]) => {
            // Calculate pass rate for this subject in this ECE year
            let appeared = 0;
            let passed = 0;
            
            for (const student of yearStudents) {
              const sub = student.subjects.find(s => s.code === code);
              if (sub) {
                appeared++;
                if (sub.grade !== "F" && sub.grade !== "Ab") {
                  passed++;
                }
              }
            }
            
            const passRate = appeared > 0 ? (passed / appeared) * 100 : 0;
            const isLab = name.toLowerCase().includes("lab");
            
            return (
              <div key={code} className="flex items-center gap-2 sm:gap-3">
                <span className={`text-[9px] sm:text-[11px] font-mono w-8 sm:w-12 flex-shrink-0 ${isLab ? "text-amber-400" : "text-cyan-400"}`}>
                  {code}
                </span>
                <span className="hidden sm:block text-[11px] text-[#8b8b8b] w-44 flex-shrink-0 truncate" title={name}>
                  {name}
                </span>
                <div className="flex-1 h-4 sm:h-5 bg-[#1a1a1a] rounded-md overflow-hidden">
                  <div 
                    className="h-full rounded-md flex items-center justify-end px-1.5 sm:px-2 transition-all duration-700"
                    style={{
                      width: `${Math.max(passRate, 2)}%`,
                      background: passRate >= 80 
                        ? "linear-gradient(90deg,#065f46,#10b981)"
                        : passRate >= 60 
                        ? "linear-gradient(90deg,#78350f,#f59e0b)"
                        : "linear-gradient(90deg,#7f1d1d,#ef4444)"
                    }}
                  >
                    <span className="text-[9px] sm:text-[10px] font-bold text-white">{passRate.toFixed(1)}%</span>
                  </div>
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#6b6b6b] w-10 sm:w-16 text-right flex-shrink-0">
                  {passed}/{appeared}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ECEAnalysisTab;


