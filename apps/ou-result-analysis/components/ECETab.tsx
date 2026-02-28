"use client";

import React, { useState, useMemo } from "react";
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
  Calendar,
} from "lucide-react";
import { StudentResult, APIResultEntry } from "@/lib/types";

// ─── ECE Year Types ───────────────────────────────────────────────────────────
type ECEYear = "2nd" | "3rd" | "4th";

// ─── ECE Roll Number Validation Functions ─────────────────────────────────────

/**
 * Check if roll number belongs to ECE 2nd Year (2024 batch)
 * Prefix: 160424735
 * Valid ranges: 001-045, 047-060, 301-306
 * Invalid: 046
 */
function isECE2ndYear(rollnumber: string): boolean {
  const prefix = "160424735";
  if (!rollnumber.startsWith(prefix)) return false;

  const suffix = rollnumber.slice(prefix.length);
  const num = parseInt(suffix, 10);
  if (isNaN(num)) return false;

  // Valid ranges: 001-045, 047-060, 301-306
  if (num >= 1 && num <= 45) return true;
  if (num >= 47 && num <= 60) return true;
  if (num >= 301 && num <= 306) return true;

  return false;
}

/**
 * Check if roll number belongs to ECE 3rd Year (2023 batch)
 * Prefix: 160423735
 * Valid ranges: 001-017, 019-023, 025-058, 301-308
 * Invalid: 018, 024
 * Special: 160422735005 (from 2022 batch)
 */
function isECE3rdYear(rollnumber: string): boolean {
  // Special case: 160422735005
  if (rollnumber === "160422735005") return true;

  const prefix = "160423735";
  if (!rollnumber.startsWith(prefix)) return false;

  const suffix = rollnumber.slice(prefix.length);
  const num = parseInt(suffix, 10);
  if (isNaN(num)) return false;

  // Valid ranges: 001-017, 019-023, 025-058, 301-308
  if (num >= 1 && num <= 17) return true;
  if (num >= 19 && num <= 23) return true;
  if (num >= 25 && num <= 58) return true;
  if (num >= 301 && num <= 308) return true;

  return false;
}

/**
 * Check if roll number belongs to ECE 4th Year (2022 batch)
 * Prefix: 160422735
 * Valid ranges: 001-004, 006-034, 036-056, 058-060, 061-066, 068-078, 080-108, 301-314
 * Invalid: 005 (special - in 3rd year), 035, 057, 067, 079
 */
function isECE4thYear(rollnumber: string): boolean {
  const prefix = "160422735";
  if (!rollnumber.startsWith(prefix)) return false;

  // Exclude special case that belongs to 3rd year
  if (rollnumber === "160422735005") return false;

  const suffix = rollnumber.slice(prefix.length);
  const num = parseInt(suffix, 10);
  if (isNaN(num)) return false;

  // Valid ranges
  if (num >= 1 && num <= 4) return true;
  if (num >= 6 && num <= 34) return true;
  if (num >= 36 && num <= 56) return true;
  if (num >= 58 && num <= 60) return true;
  if (num >= 61 && num <= 66) return true;
  if (num >= 68 && num <= 78) return true;
  if (num >= 80 && num <= 108) return true;
  if (num >= 301 && num <= 314) return true;

  return false;
}

/**
 * Get ECE year for a roll number
 */
function getECEYear(rollnumber: string): ECEYear | null {
  if (isECE2ndYear(rollnumber)) return "2nd";
  if (isECE3rdYear(rollnumber)) return "3rd";
  if (isECE4thYear(rollnumber)) return "4th";
  return null;
}

/**
 * Get batch prefix display for a year
 */
function getYearInfo(year: ECEYear): { batch: string; prefix: string; ranges: string } {
  switch (year) {
    case "2nd":
      return {
        batch: "'24 Batch",
        prefix: "160424735",
        ranges: "001-045, 047-060, 301-306",
      };
    case "3rd":
      return {
        batch: "'23 Batch",
        prefix: "160423735",
        ranges: "001-017, 019-023, 025-058, 301-308 + Special",
      };
    case "4th":
      return {
        batch: "'22 Batch",
        prefix: "160422735",
        ranges: "001-004, 006-034, 036-056, 058-108, 301-314",
      };
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface ECETabProps {
  students: StudentResult[];
  entries: APIResultEntry[];
  isLoading: boolean;
  loadingProgress: { current: number; total: number };
  error: string | null;
  onRefresh?: () => void;
}

// ─── Student Row with Expandable Details ──────────────────────────────────────
const StudentRow = ({
  student,
  rank,
  htmlResponse,
}: {
  student: StudentResult;
  rank: number;
  htmlResponse?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get relevant semester result based on year
  const eceYear = getECEYear(student.rollnumber);
  const targetSemester = eceYear === "2nd" ? 3 : eceYear === "3rd" ? 5 : 7;
  const semResult = student.semesterResults.find((r) => r.semester === targetSemester);

  // Count F grades
  const fCount = student.subjects.filter((s) => s.grade === "F").length;

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
          <span
            className={`text-lg font-bold ${
              semResult?.sgpa && semResult.sgpa >= 8.5
                ? "text-amber-400"
                : semResult?.sgpa && semResult.sgpa >= 7.0
                ? "text-emerald-400"
                : "text-white"
            }`}
          >
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
            {cgpaDisplay !== "-" && <span className="text-[#6b6b6b] text-xs">({cgpaDisplay})</span>}
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
                <h4 className="text-xs font-semibold text-[#6b6b6b] uppercase mb-2">
                  Semester Results
                </h4>
                <div className="flex flex-wrap gap-2">
                  {student.semesterResults.map((sem) => (
                    <div
                      key={sem.semester}
                      className={`px-3 py-1.5 rounded-lg text-xs ${
                        sem.semester === targetSemester
                          ? "bg-cyan-500/20 border border-cyan-500/30"
                          : "bg-[#1a1a1a]"
                      }`}
                    >
                      <span className="text-[#6b6b6b]">Sem {sem.semester}: </span>
                      <span
                        className={
                          sem.result.includes("PASSED")
                            ? "text-emerald-400"
                            : sem.isPromoted
                            ? "text-amber-400"
                            : "text-cyan-400"
                        }
                      >
                        {sem.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Subjects */}
              <div>
                <h4 className="text-xs font-semibold text-[#6b6b6b] uppercase mb-2">
                  Subjects ({student.subjects.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {student.subjects.map((sub) => {
                    const gradeColor =
                      sub.grade === "S"
                        ? "text-cyan-400"
                        : sub.grade === "A"
                        ? "text-emerald-400"
                        : sub.grade === "B"
                        ? "text-lime-400"
                        : sub.grade === "C"
                        ? "text-amber-400"
                        : sub.grade === "D"
                        ? "text-orange-400"
                        : sub.grade === "E"
                        ? "text-red-400"
                        : sub.grade === "F"
                        ? "text-rose-500"
                        : "text-[#6b6b6b]";

                    return (
                      <div
                        key={sub.code}
                        className={`px-2 sm:px-3 py-2 rounded-lg bg-[#1a1a1a] border ${
                          sub.grade === "F" ? "border-rose-500/30" : "border-[#222]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-400 font-mono text-[9px] sm:text-[10px]">
                            {sub.code}
                          </span>
                          <span className={`font-bold text-sm ${gradeColor}`}>{sub.grade}</span>
                        </div>
                        <p
                          className="text-[8px] sm:text-[9px] text-[#6b6b6b] mt-1 truncate"
                          title={sub.name}
                        >
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

              {/* HTML Response Preview (Raw Result) */}
              {htmlResponse && (
                <div>
                  <h4 className="text-xs font-semibold text-[#6b6b6b] uppercase mb-2">
                    Original Result (HTML)
                  </h4>
                  <div className="bg-white rounded-lg p-4 border border-[#333] overflow-x-auto max-h-[500px] overflow-y-auto shadow-inner">
                    <div
                      className="text-sm text-black 
                        [&_table]:w-full [&_table]:border-collapse [&_table]:mb-2
                        [&_td]:p-2 [&_td]:border [&_td]:border-gray-300 [&_td]:text-black
                        [&_th]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:font-semibold
                        [&_tr]:border [&_tr]:border-gray-200
                        [&_font]:!text-inherit [&_font[color]]:!text-black
                        [&_b]:font-bold [&_b]:text-black
                        [&_a]:text-blue-600 [&_a]:underline
                        [&_center]:text-center
                        [&_img]:max-w-full [&_img]:h-auto"
                      dangerouslySetInnerHTML={{ __html: htmlResponse }}
                    />
                  </div>
                </div>
              )}
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
      <p className="text-white font-semibold">Loading Results Data</p>
      <p className="text-[#6b6b6b] text-sm mt-1">
        {progress.total > 0
          ? `Fetched ${progress.current} of ${progress.total} records...`
          : "Connecting to server..."}
      </p>
    </div>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────
const ErrorState = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <AlertCircle size={48} className="text-rose-400" />
    <div className="text-center">
      <p className="text-white font-semibold">Failed to Load Data</p>
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

// ─── ECE Tab Component ────────────────────────────────────────────────────────
const ECETab: React.FC<ECETabProps> = ({
  students,
  entries,
  isLoading,
  loadingProgress,
  error,
  onRefresh,
}) => {
  const [selectedYear, setSelectedYear] = useState<ECEYear>("2nd");

  // Create a map of rollnumber -> html_response for quick lookup
  const htmlResponseMap = useMemo(() => {
    const map = new Map<string, string>();
    entries.forEach((entry) => {
      map.set(entry.rollnumber, entry.html_response);
    });
    return map;
  }, [entries]);

  // Filter students by selected year
  const yearStudents = useMemo(() => {
    return students.filter((s) => getECEYear(s.rollnumber) === selectedYear);
  }, [students, selectedYear]);

  // Get target semester for selected year
  const targetSemester = selectedYear === "2nd" ? 3 : selectedYear === "3rd" ? 5 : 7;

  // Sort by SGPA (descending) for leaderboard
  const leaderboard = useMemo(() => {
    return [...yearStudents].sort((a, b) => {
      const aSem = a.semesterResults.find((r) => r.semester === targetSemester);
      const bSem = b.semesterResults.find((r) => r.semester === targetSemester);
      const aSGPA = aSem?.sgpa ?? -1;
      const bSGPA = bSem?.sgpa ?? -1;
      return bSGPA - aSGPA; // Descending
    });
  }, [yearStudents, targetSemester]);

  // Year stats
  const yearStats = useMemo(() => {
    let passed = 0;
    let promoted = 0;
    let distinctions = 0;
    let totalBacklogs = 0;

    for (const student of yearStudents) {
      const semResult = student.semesterResults.find((r) => r.semester === targetSemester);

      if (semResult) {
        if (semResult.result.includes("PASSED") && !semResult.isPromoted) {
          passed++;
          if (semResult.sgpa && semResult.sgpa >= 8.5) {
            distinctions++;
          }
        } else if (semResult.isPromoted) {
          promoted++;
        }
      }

      // Count F grades
      for (const sub of student.subjects) {
        if (sub.grade === "F") {
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
  }, [yearStudents, targetSemester]);

  const yearInfo = getYearInfo(selectedYear);

  // Show loading state
  if (isLoading) {
    return <LoadingState progress={loadingProgress} />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  // No data available
  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen size={48} className="text-[#6b6b6b]" />
        <p className="text-[#6b6b6b] mt-4">No student data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ECE MJCET Brand Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white leading-tight">ECE Department</h1>
        <div className="flex items-center gap-2 mt-1">
          <GraduationCap size={18} className="text-amber-400" />
          <span className="text-amber-400 text-sm font-semibold">ECE MJCET</span>
          <span className="text-amber-300 text-xs font-medium">Year-wise Student Stats</span>
        </div>
        <p className="text-[#8b8b8b] text-xs mt-1">February-2026 · Osmania University</p>
      </div>

      {/* Year Filter */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar size={14} className="sm:hidden text-amber-400" />
              <Calendar size={16} className="hidden sm:block text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-xs sm:text-sm">
                ECE {selectedYear} Year ({yearInfo.batch})
              </p>
              <p className="text-[#8b8b8b] text-[10px] sm:text-xs truncate">
                Prefix: {yearInfo.prefix} · Ranges: {yearInfo.ranges}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {(["2nd", "3rd", "4th"] as ECEYear[]).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                  selectedYear === year
                    ? "bg-amber-500 text-white"
                    : "bg-[#1a1a1a] text-[#6b6b6b] hover:text-white hover:bg-[#222]"
                }`}
              >
                {year} Year
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Users size={14} className="text-amber-400" />
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
            <h2 className="text-sm sm:text-base font-semibold text-white">
              ECE {selectedYear} Year Leaderboard
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#6b6b6b]">
            Semester {targetSemester} · Sorted by SGPA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">
                  Rank
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">
                  Roll No.
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">
                  Name
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">
                  SGPA
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">
                  Backlogs
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6b6b6b]">
                    No students found in ECE {selectedYear} Year
                  </td>
                </tr>
              ) : (
                leaderboard.map((student, idx) => (
                  <StudentRow
                    key={student.rollnumber}
                    student={student}
                    rank={idx + 1}
                    htmlResponse={htmlResponseMap.get(student.rollnumber)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Year Summary Info */}
      <div className="bg-[#161616] border border-[#222222] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-400" />
            <h2 className="text-sm sm:text-base font-semibold text-white">
              ECE {selectedYear} Year Overview
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#6b6b6b]">
            {yearInfo.batch} · Semester {targetSemester}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-[#6b6b6b] text-xs mb-1">Roll Prefix</p>
            <p className="text-cyan-400 font-mono text-sm">{yearInfo.prefix}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-[#6b6b6b] text-xs mb-1">Batch</p>
            <p className="text-white font-semibold text-sm">{yearInfo.batch}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-[#6b6b6b] text-xs mb-1">Target Semester</p>
            <p className="text-amber-400 font-semibold text-sm">Semester {targetSemester}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-[#6b6b6b] text-xs mb-1">Students Found</p>
            <p className="text-white font-semibold text-sm">{yearStats.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECETab;
