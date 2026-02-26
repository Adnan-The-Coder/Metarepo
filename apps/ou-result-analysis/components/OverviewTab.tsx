"use client";

import React from "react";
import { 
  Users, 
  CheckCircle2, 
  Award, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  BookOpen,
  GraduationCap,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { SemesterAnalytics, SubjectAnalytics, SubjectGradeBreakdown, SEMESTER_3_SUBJECTS } from "@/lib/types";

// ─── Props ────────────────────────────────────────────────────────────────────
interface OverviewTabProps {
  analytics: SemesterAnalytics | null;
  isLoading: boolean;
  loadingProgress: { current: number; total: number };
  error: string | null;
  selectedSemester: number;
  onRefresh?: () => void;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardData {
  label: string;
  value: string;
  change?: string;
  up?: boolean;
  icon: React.ElementType;
  color: "cyan" | "emerald" | "amber" | "rose";
}

const StatCard = ({ stat }: { stat: StatCardData }) => {
  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-500/20 text-cyan-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/20 text-amber-400",
    rose: "bg-rose-500/20 text-rose-400",
  };
  
  return (
    <div className="bg-[#161616] border border-[#222222] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
          <stat.icon size={20} />
        </div>
        {stat.change && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${stat.up ? "text-emerald-400" : "text-rose-400"}`}>
            {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {stat.change}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{stat.value}</p>
        <p className="text-[#6b6b6b] text-sm mt-0.5">{stat.label}</p>
      </div>
    </div>
  );
};

// ─── Subject Performance Chart ────────────────────────────────────────────────
const SubjectPerformanceChart = ({ subjects }: { subjects: SubjectAnalytics[] }) => {
  if (!subjects || subjects.length === 0) {
    return <p className="text-[#6b6b6b] text-sm">No subject data available</p>;
  }
  
  // Sort by pass percentage (lowest first for visibility) - show ALL subjects
  const sortedSubjects = [...subjects].sort((a, b) => a.passPercentage - b.passPercentage);
  
  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {sortedSubjects.map((subject) => {
        const color = subject.passPercentage >= 80 ? "#10b981" 
          : subject.passPercentage >= 60 ? "#f59e0b" 
          : "#ef4444";
        
        // Determine if it's a lab subject
        const isLab = subject.name.toLowerCase().includes("lab");
        
        return (
          <div key={subject.code} className="flex items-center gap-3">
            <span className={`text-[10px] font-mono w-12 flex-shrink-0 ${isLab ? "text-amber-400" : "text-cyan-400"}`}>
              {subject.code}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-white truncate max-w-[180px]" title={subject.name}>
                  {subject.name}
                  {isLab && <span className="ml-1 text-amber-400 text-[9px]">(LAB)</span>}
                </span>
                <span className="text-[10px] text-[#6b6b6b]">
                  {subject.totalPassed}/{subject.totalAppeared}
                </span>
              </div>
              <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${subject.passPercentage}%`, background: color }}
                />
              </div>
            </div>
            <span 
              className="text-[11px] font-semibold w-14 text-right flex-shrink-0"
              style={{ color }}
            >
              {subject.passPercentage.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Subject Grade Breakdown Table ────────────────────────────────────────────
const SubjectGradeTable = ({ breakdown }: { breakdown: SubjectGradeBreakdown[] }) => {
  if (!breakdown || breakdown.length === 0) {
    return <p className="text-[#6b6b6b] text-sm">No grade breakdown available</p>;
  }
  
  const gradeColors = {
    S: "#06b6d4",
    A: "#10b981",
    B: "#84cc16",
    C: "#f59e0b",
    D: "#f97316",
    E: "#ef4444",
    F: "#6b7280",
  };
  
  return (
    <div>
      {/* Legend explaining what numbers mean */}
      <div className="mb-4 p-3 bg-[#1a1a1a] rounded-lg">
        <p className="text-[11px] text-[#8b8b8b]">
          <span className="text-white font-medium">Numbers = Student Count per Grade</span> · 
          Each cell shows how many students scored that grade in the subject
        </p>
        <div className="flex flex-wrap gap-3 mt-2 text-[10px]">
          <span><span style={{ color: gradeColors.S }} className="font-semibold">S</span> = 90-100% (Outstanding)</span>
          <span><span style={{ color: gradeColors.A }} className="font-semibold">A</span> = 80-89%</span>
          <span><span style={{ color: gradeColors.B }} className="font-semibold">B</span> = 70-79%</span>
          <span><span style={{ color: gradeColors.C }} className="font-semibold">C</span> = 60-69%</span>
          <span><span style={{ color: gradeColors.D }} className="font-semibold">D</span> = 50-59%</span>
          <span><span style={{ color: gradeColors.E }} className="font-semibold">E</span> = 40-49%</span>
          <span><span style={{ color: gradeColors.F }} className="font-semibold">F</span> = Fail (&lt;40%)</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-[#222]">
              <th className="text-left text-[#6b6b6b] font-medium py-2 px-2 min-w-[200px]">Subject</th>
              <th className="text-center font-medium py-2 px-2 w-12" style={{ color: gradeColors.S }}>S</th>
              <th className="text-center font-medium py-2 px-2 w-12" style={{ color: gradeColors.A }}>A</th>
              <th className="text-center font-medium py-2 px-2 w-12" style={{ color: gradeColors.B }}>B</th>
              <th className="text-center font-medium py-2 px-2 w-12" style={{ color: gradeColors.C }}>C</th>
              <th className="text-center font-medium py-2 px-2 w-12" style={{ color: gradeColors.D }}>D</th>
              <th className="text-center font-medium py-2 px-2 w-12" style={{ color: gradeColors.E }}>E</th>
              <th className="text-center font-medium py-2 px-2 w-12" style={{ color: gradeColors.F }}>F</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((sub) => {
              const isLab = sub.name.toLowerCase().includes("lab");
              return (
                <tr key={sub.code} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]">
                  <td className="py-3 px-2">
                    <div className="flex flex-col">
                      <span className={`font-mono text-[12px] ${isLab ? "text-amber-400" : "text-cyan-400"}`}>
                        {sub.code}
                      </span>
                      <span className="text-[#9b9b9b] text-[10px] mt-0.5">{sub.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 text-white font-medium">{sub.sCount > 0 ? sub.sCount : "-"}</td>
                  <td className="text-center py-3 px-2 text-white font-medium">{sub.aCount > 0 ? sub.aCount : "-"}</td>
                  <td className="text-center py-3 px-2 text-white font-medium">{sub.bCount > 0 ? sub.bCount : "-"}</td>
                  <td className="text-center py-3 px-2 text-white font-medium">{sub.cCount > 0 ? sub.cCount : "-"}</td>
                  <td className="text-center py-3 px-2 text-white font-medium">{sub.dCount > 0 ? sub.dCount : "-"}</td>
                  <td className="text-center py-3 px-2 text-white font-medium">{sub.eCount > 0 ? sub.eCount : "-"}</td>
                  <td className="text-center py-3 px-2 text-rose-400 font-semibold">{sub.fCount > 0 ? sub.fCount : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
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
    {progress.total > 0 && (
      <div className="w-64 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${(progress.current / progress.total) * 100}%` }}
        />
      </div>
    )}
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

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab: React.FC<OverviewTabProps> = ({
  analytics,
  isLoading,
  loadingProgress,
  error,
  selectedSemester,
  onRefresh,
}) => {
  // Show loading state
  if (isLoading) {
    return <LoadingState progress={loadingProgress} />;
  }
  
  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }
  
  // No data available
  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen size={48} className="text-[#6b6b6b]" />
        <p className="text-[#6b6b6b] mt-4">No analytics data available</p>
      </div>
    );
  }
  
  const { overviewStats, subjects, subjectGradeBreakdown } = analytics;
  
  // Build stat cards from live data
  const statCards: StatCardData[] = [
    { 
      label: "Total Students", 
      value: overviewStats.totalStudents.toLocaleString(),
      icon: Users, 
      color: "cyan" 
    },
    { 
      label: "Passed (No Backlogs)", 
      value: `${overviewStats.passedNoBacklogs}`,
      change: `${overviewStats.passPercentage.toFixed(1)}%`,
      up: overviewStats.passPercentage >= 70,
      icon: CheckCircle2, 
      color: "emerald" 
    },
    { 
      label: "Promoted (Backlogs)", 
      value: overviewStats.promotedWithBacklogs.toLocaleString(),
      change: `${((overviewStats.promotedWithBacklogs / overviewStats.totalStudents) * 100).toFixed(1)}%`,
      up: false,
      icon: AlertCircle, 
      color: "amber" 
    },
    { 
      label: "Total F Grades (Sem 3)", 
      value: overviewStats.totalBacklogs.toLocaleString(),
      change: `${overviewStats.studentsWithFGrades} students`,
      up: false,
      icon: AlertCircle, 
      color: "rose" 
    },
  ];
  
  // Find hardest and easiest subjects
  const hardestSubject = subjects.length > 0 
    ? subjects.reduce((a, b) => a.passPercentage < b.passPercentage ? a : b)
    : null;
  const easiestSubject = subjects.length > 0 
    ? subjects.reduce((a, b) => a.passPercentage > b.passPercentage ? a : b)
    : null;
  
  return (
    <div className="space-y-6">
      {/* Semester 3 Notice */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap size={16} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Semester {selectedSemester} Analysis</p>
            <p className="text-[#8b8b8b] text-xs mt-1">
              {selectedSemester === 3 
                ? `Showing data for ${Object.keys(SEMESTER_3_SUBJECTS).length} core subjects. Backlog subjects from Sem 1 & 2 are separate.`
                : "Showing backlog/previous semester data."
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Subject Grade Breakdown (Full Width) */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Subject-wise Grade Breakdown</h2>
          <span className="text-[11px] text-[#6b6b6b] bg-[#1a1a1a] px-2 py-1 rounded-lg">
            Sem {selectedSemester} · All {subjectGradeBreakdown.length} Subjects
          </span>
        </div>
        <SubjectGradeTable breakdown={subjectGradeBreakdown} />
      </div>

      {/* Subject Pass Rate (Full Width) */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Subject Pass Rate (All {subjects.length} Subjects)</h2>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Labs included</span>
            <span className="text-[11px] text-[#6b6b6b] bg-[#1a1a1a] px-2 py-1 rounded-lg">
              {subjects.length} subjects
            </span>
          </div>
        </div>
        <SubjectPerformanceChart subjects={subjects} />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-5">
          <p className="text-[#6b6b6b] text-xs">Distinctions (≥8.5 SGPA)</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{overviewStats.distinctionCount}</p>
          <p className="text-[#6b6b6b] text-xs mt-1">
            {((overviewStats.distinctionCount / overviewStats.totalStudents) * 100).toFixed(1)}% of total
          </p>
        </div>
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-5">
          <p className="text-[#6b6b6b] text-xs">First Class (7.0-8.4)</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{overviewStats.firstClassCount}</p>
          <p className="text-[#6b6b6b] text-xs mt-1">
            {((overviewStats.firstClassCount / overviewStats.totalStudents) * 100).toFixed(1)}% of total
          </p>
        </div>
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-5">
          <p className="text-[#6b6b6b] text-xs">Second Class (5.0-6.9)</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{overviewStats.secondClassCount}</p>
          <p className="text-[#6b6b6b] text-xs mt-1">
            {((overviewStats.secondClassCount / overviewStats.totalStudents) * 100).toFixed(1)}% of total
          </p>
        </div>
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-5">
          <p className="text-[#6b6b6b] text-xs">Average SGPA</p>
          <p className="text-2xl font-bold text-white mt-1">{overviewStats.averageSGPA.toFixed(2)}</p>
          <p className="text-[#6b6b6b] text-xs mt-1">
            {overviewStats.averageSGPA >= 7 ? "Good performance" : overviewStats.averageSGPA >= 5 ? "Average" : "Needs improvement"}
          </p>
        </div>
      </div>

      {/* Bottom summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {hardestSubject && (
          <div className="bg-[#161616] border border-[#222222] rounded-xl p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-rose-500/20 text-rose-400">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-[#6b6b6b] text-xs">Hardest Subject</p>
              <p className="text-white font-semibold text-sm mt-0.5">{hardestSubject.code}</p>
              <p className="text-[#6b6b6b] text-xs">{hardestSubject.passPercentage.toFixed(1)}% pass rate</p>
            </div>
          </div>
        )}
        {easiestSubject && (
          <div className="bg-[#161616] border border-[#222222] rounded-xl p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-500/20 text-emerald-400">
              <Award size={18} />
            </div>
            <div>
              <p className="text-[#6b6b6b] text-xs">Easiest Subject</p>
              <p className="text-white font-semibold text-sm mt-0.5">{easiestSubject.code}</p>
              <p className="text-[#6b6b6b] text-xs">{easiestSubject.passPercentage.toFixed(1)}% pass rate</p>
            </div>
          </div>
        )}
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-cyan-500/20 text-cyan-400">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[#6b6b6b] text-xs">Analysis Status</p>
            <p className="text-white font-semibold text-sm mt-0.5">Complete</p>
            <p className="text-[#6b6b6b] text-xs">{overviewStats.totalStudents} records processed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
