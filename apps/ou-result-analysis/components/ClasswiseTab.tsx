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
} from "lucide-react";
import { StudentResult, SubjectAnalytics, SEMESTER_3_SUBJECTS } from "@/lib/types";

// ─── Division Mapping ─────────────────────────────────────────────────────────
const DIVISIONS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
type Division = typeof DIVISIONS[number];

const getDivisionRange = (div: Division): { start: number; end: number } => {
  const divIndex = DIVISIONS.indexOf(div);
  const start = 1 + divIndex * 60;
  const end = start + 59;
  return { start, end };
};

const getStudentDivision = (rollnumber: string): Division | null => {
  // Extract last 3 digits - e.g., "160424733045" -> 45
  const lastDigits = parseInt(rollnumber.slice(-3), 10);
  if (isNaN(lastDigits) || lastDigits < 1 || lastDigits > 480) return null;
  
  const divIndex = Math.floor((lastDigits - 1) / 60);
  return DIVISIONS[divIndex] || null;
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface ClasswiseTabProps {
  students: StudentResult[];
  subjects: SubjectAnalytics[];
  isLoading: boolean;
  loadingProgress: { current: number; total: number };
  error: string | null;
  onRefresh?: () => void;
}

// ─── Student Row with Expandable Details ──────────────────────────────────────
const StudentRow = ({ student, rank }: { student: StudentResult; rank: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get Semester 3 result
  const sem3Result = student.semesterResults.find(r => r.semester === 3);
  const sem3SubjectCodes = Object.keys(SEMESTER_3_SUBJECTS);
  
  // Count F grades in Sem 3 subjects
  const sem3Subjects = student.subjects.filter(s => sem3SubjectCodes.includes(s.code));
  const fCount = sem3Subjects.filter(s => s.grade === "F").length;
  
  // Determine result status and color
  let resultStatus = "N/A";
  let resultColor = "text-[#6b6b6b]";
  let cgpaDisplay = "-";
  
  if (sem3Result) {
    if (sem3Result.result.includes("PASSED")) {
      resultStatus = "PASSED";
      resultColor = "text-emerald-400";
    } else if (sem3Result.result.includes("ALREADY PROMOTED")) {
      resultStatus = "ALREADY PROMOTED";
      resultColor = "text-cyan-400";
    } else if (sem3Result.isPromoted) {
      resultStatus = "PROMOTED";
      resultColor = "text-amber-400";
    }
    
    if (sem3Result.sgpa !== null) {
      cgpaDisplay = sem3Result.sgpa.toFixed(2);
    }
    if (sem3Result.cgpa !== null) {
      cgpaDisplay = sem3Result.cgpa.toFixed(2);
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
            sem3Result?.sgpa && sem3Result.sgpa >= 8.5 ? "text-amber-400" 
            : sem3Result?.sgpa && sem3Result.sgpa >= 7.0 ? "text-emerald-400" 
            : "text-white"
          }`}>
            {sem3Result?.sgpa?.toFixed(2) || "-"}
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
                        sem.semester === 3 ? "bg-cyan-500/20 border border-cyan-500/30" : "bg-[#1a1a1a]"
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
              
              {/* Semester 3 Subjects */}
              <div>
                <h4 className="text-xs font-semibold text-[#6b6b6b] uppercase mb-2">
                  Semester 3 Subjects ({sem3Subjects.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {sem3Subjects.map(sub => {
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
                        className={`px-3 py-2 rounded-lg bg-[#1a1a1a] border ${
                          sub.grade === "F" ? "border-rose-500/30" : "border-[#222]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-400 font-mono text-[10px]">{sub.code}</span>
                          <span className={`font-bold ${gradeColor}`}>{sub.grade}</span>
                        </div>
                        <p className="text-[9px] text-[#6b6b6b] mt-1 truncate" title={sub.name}>
                          {sub.name}
                        </p>
                        <p className="text-[10px] text-white mt-0.5">
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
      <p className="text-white font-semibold">Loading Results Data</p>
      <p className="text-[#6b6b6b] text-sm mt-1">
        {progress.total > 0 
          ? `Fetched ${progress.current} of ${progress.total} records...`
          : "Connecting to server..."
        }
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

// ─── Class Wise Tab ───────────────────────────────────────────────────────────
const ClasswiseTab: React.FC<ClasswiseTabProps> = ({
  students,
  subjects,
  isLoading,
  loadingProgress,
  error,
  onRefresh,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<Division>("A");
  
  // Filter students by division
  const divisionStudents = useMemo(() => {
    return students.filter(s => getStudentDivision(s.rollnumber) === selectedDivision);
  }, [students, selectedDivision]);
  
  // Sort by SGPA (descending) for leaderboard
  const leaderboard = useMemo(() => {
    return [...divisionStudents].sort((a, b) => {
      const aSem3 = a.semesterResults.find(r => r.semester === 3);
      const bSem3 = b.semesterResults.find(r => r.semester === 3);
      const aSGPA = aSem3?.sgpa ?? -1;
      const bSGPA = bSem3?.sgpa ?? -1;
      return bSGPA - aSGPA; // Descending
    });
  }, [divisionStudents]);
  
  // Division stats
  const divisionStats = useMemo(() => {
    const sem3SubjectCodes = Object.keys(SEMESTER_3_SUBJECTS);
    let passed = 0;
    let promoted = 0;
    let distinctions = 0;
    let totalBacklogs = 0;
    
    for (const student of divisionStudents) {
      const sem3Result = student.semesterResults.find(r => r.semester === 3);
      
      if (sem3Result) {
        if (sem3Result.result.includes("PASSED") && !sem3Result.isPromoted) {
          passed++;
          if (sem3Result.sgpa && sem3Result.sgpa >= 8.5) {
            distinctions++;
          }
        } else if (sem3Result.isPromoted) {
          promoted++;
        }
      }
      
      // Count F grades
      for (const sub of student.subjects) {
        if (sem3SubjectCodes.includes(sub.code) && sub.grade === "F") {
          totalBacklogs++;
        }
      }
    }
    
    return {
      total: divisionStudents.length,
      passed,
      promoted,
      distinctions,
      totalBacklogs,
      passRate: divisionStudents.length > 0 
        ? ((passed / divisionStudents.length) * 100).toFixed(1) 
        : "0.0",
    };
  }, [divisionStudents]);
  
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
    <div className="space-y-6">
      {/* Division Filter */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Users size={16} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">CSE Division {selectedDivision}</p>
              <p className="text-[#8b8b8b] text-xs">
                Roll Numbers: 160424733{String(getDivisionRange(selectedDivision).start).padStart(3, "0")} - 160424733{String(getDivisionRange(selectedDivision).end).padStart(3, "0")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {DIVISIONS.map(div => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                  selectedDivision === div
                    ? "bg-cyan-500 text-white"
                    : "bg-[#1a1a1a] text-[#6b6b6b] hover:text-white hover:bg-[#222]"
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-cyan-400" />
            <span className="text-[#6b6b6b] text-xs">Students</span>
          </div>
          <p className="text-2xl font-bold text-white">{divisionStats.total}</p>
        </div>
        
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-[#6b6b6b] text-xs">Passed</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{divisionStats.passed}</p>
          <p className="text-[#6b6b6b] text-xs">{divisionStats.passRate}%</p>
        </div>
        
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-amber-400" />
            <span className="text-[#6b6b6b] text-xs">Promoted</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{divisionStats.promoted}</p>
        </div>
        
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-amber-400" />
            <span className="text-[#6b6b6b] text-xs">Distinctions</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{divisionStats.distinctions}</p>
        </div>
        
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-rose-400" />
            <span className="text-[#6b6b6b] text-xs">Total Backlogs</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">{divisionStats.totalBacklogs}</p>
        </div>
      </div>
      
      {/* Leaderboard */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-400" />
            <h2 className="text-base font-semibold text-white">Division {selectedDivision} Leaderboard</h2>
          </div>
          <span className="text-[11px] text-[#6b6b6b]">Semester 3 · Sorted by SGPA</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase">Roll No.</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase">SGPA</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase">Backlogs</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase">Result</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6b6b6b]">
                    No students found in Division {selectedDivision}
                  </td>
                </tr>
              ) : (
                leaderboard.map((student, idx) => (
                  <StudentRow key={student.rollnumber} student={student} rank={idx + 1} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Subject Pass Rate Comparison - Semester 3 */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-400" />
            <h2 className="text-base font-semibold text-white">Semester 3 Subject Pass Rates</h2>
          </div>
          <span className="text-[11px] text-[#6b6b6b]">Division {selectedDivision} · {subjects.length} subjects</span>
        </div>
        
        {/* Calculate division-specific pass rates */}
        <div className="space-y-3">
          {Object.entries(SEMESTER_3_SUBJECTS).map(([code, name]) => {
            // Calculate pass rate for this subject in this division
            let appeared = 0;
            let passed = 0;
            
            for (const student of divisionStudents) {
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
              <div key={code} className="flex items-center gap-3">
                <span className={`text-[11px] font-mono w-12 flex-shrink-0 ${isLab ? "text-amber-400" : "text-cyan-400"}`}>
                  {code}
                </span>
                <span className="text-[11px] text-[#8b8b8b] w-44 flex-shrink-0 truncate" title={name}>
                  {name}
                </span>
                <div className="flex-1 h-5 bg-[#1a1a1a] rounded-md overflow-hidden">
                  <div 
                    className="h-full rounded-md flex items-center justify-end px-2 transition-all duration-700"
                    style={{
                      width: `${Math.max(passRate, 2)}%`,
                      background: passRate >= 80 
                        ? "linear-gradient(90deg,#065f46,#10b981)"
                        : passRate >= 60 
                        ? "linear-gradient(90deg,#78350f,#f59e0b)"
                        : "linear-gradient(90deg,#7f1d1d,#ef4444)"
                    }}
                  >
                    <span className="text-[10px] font-bold text-white">{passRate.toFixed(1)}%</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#6b6b6b] w-16 text-right">
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

export default ClasswiseTab;
