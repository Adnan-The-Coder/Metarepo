"use client";
import React, { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, Users, CheckCircle2, AlertTriangle, XCircle, Award, BarChart3, PieChart } from "lucide-react";
import { StudentResult, SubjectAnalytics, OverviewStats, SEMESTER_3_SUBJECTS } from "@/lib/types";

// ─── Props ────────────────────────────────────────────────────────────────────
interface PasspercentTabProps {
  students: StudentResult[];
  subjects: SubjectAnalytics[];
  overviewStats: OverviewStats | null;
  isLoading: boolean;
  loadingProgress: { current: number; total: number };
  error: string | null;
  onRefresh: () => void;
}

// ─── Divisions ────────────────────────────────────────────────────────────────
const DIVISIONS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
type Division = typeof DIVISIONS[number];

const getDivisionFromRoll = (rollnumber: string): Division | null => {
  const last3 = parseInt(rollnumber.slice(-3), 10);
  if (isNaN(last3) || last3 < 1) return null;
  const divIndex = Math.floor((last3 - 1) / 60);
  return divIndex >= 0 && divIndex < 8 ? DIVISIONS[divIndex] : null;
};

// ─── Grade Colors ─────────────────────────────────────────────────────────────
const RESULT_COLORS = {
  passed: "#10b981",
  promoted: "#f59e0b",
  failed: "#ef4444",
};

// ─── Loading State ────────────────────────────────────────────────────────────
const LoadingState = ({ progress }: { progress: { current: number; total: number } }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <RefreshCw size={28} className="text-cyan-400 animate-spin" />
    <p className="text-[#6b6b6b] text-sm">Loading pass analysis...</p>
    {progress.total > 0 && (
      <div className="w-48">  
        <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
        <p className="text-[#4b4b4b] text-xs mt-2 text-center">{progress.current} / {progress.total}</p>
      </div>
    )}
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center">
      <AlertCircle size={24} className="text-rose-400" />
    </div>
    <p className="text-rose-400 text-sm text-center max-w-md">{error}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-[#1c2333] text-cyan-400 rounded-lg text-sm hover:bg-[#243044] transition-colors"
    >
      <RefreshCw size={14} /> Retry
    </button>
  </div>
);

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const DonutChart = ({ passed, promoted, failed }: { passed: number; promoted: number; failed: number }) => {
  const total = passed + promoted + failed || 1;
  const passedPct = (passed / total) * 100;
  const promotedPct = (promoted / total) * 100;
  const failedPct = (failed / total) * 100;
  
  // Responsive size
  const size = 140;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const passedOffset = 0;
  const promotedOffset = (passedPct / 100) * circumference;
  const failedOffset = ((passedPct + promotedPct) / 100) * circumference;
  
  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Passed */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={RESULT_COLORS.passed}
          strokeWidth={stroke}
          strokeDasharray={`${(passedPct / 100) * circumference} ${circumference}`}
          strokeDashoffset={0}
        />
        {/* Promoted */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={RESULT_COLORS.promoted}
          strokeWidth={stroke}
          strokeDasharray={`${(promotedPct / 100) * circumference} ${circumference}`}
          strokeDashoffset={-promotedOffset}
        />
        {/* Failed */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={RESULT_COLORS.failed}
          strokeWidth={stroke}
          strokeDasharray={`${(failedPct / 100) * circumference} ${circumference}`}
          strokeDashoffset={-failedOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl sm:text-2xl font-bold text-white">{total}</p>
        <p className="text-[9px] sm:text-[10px] text-[#6b6b6b]">Students</p>
      </div>
    </div>
  );
};

// ─── Bar Chart for Division ───────────────────────────────────────────────────
const DivisionBarChart = ({ divisionStats }: { divisionStats: { div: string; passed: number; promoted: number; failed: number; total: number }[] }) => {
  const maxTotal = Math.max(...divisionStats.map(d => d.total), 1);
  
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {divisionStats.map(d => {
        const passRate = d.total > 0 ? ((d.passed / d.total) * 100).toFixed(1) : "0.0";
        return (
          <div key={d.div} className="group">
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#1c2333] flex items-center justify-center text-cyan-400 font-bold text-xs sm:text-sm">{d.div}</span>
                <span className="text-[10px] sm:text-xs text-[#8b8b8b]">{d.total} students</span>
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${parseFloat(passRate) >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
                {passRate}% clear
              </span>
            </div>
            <div className="h-2.5 sm:h-3 bg-[#1f1f1f] rounded-full overflow-hidden flex">
              <div 
                className="h-full transition-all duration-500"
                style={{ width: `${(d.passed / maxTotal) * 100}%`, background: RESULT_COLORS.passed }}
                title={`Passed: ${d.passed}`}
              />
              <div 
                className="h-full transition-all duration-500"
                style={{ width: `${(d.promoted / maxTotal) * 100}%`, background: RESULT_COLORS.promoted }}
                title={`Promoted: ${d.promoted}`}
              />
              <div 
                className="h-full transition-all duration-500"
                style={{ width: `${(d.failed / maxTotal) * 100}%`, background: RESULT_COLORS.failed }}
                title={`Failed: ${d.failed}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Subject Pass Rate Bars ───────────────────────────────────────────────────
const SubjectPassBars = ({ subjects }: { subjects: SubjectAnalytics[] }) => {
  const sorted = [...subjects].sort((a, b) => b.passPercentage - a.passPercentage);
  
  return (
    <div className="space-y-2">
      {sorted.map(sub => {
        const color = sub.passPercentage >= 80 ? "#10b981" : sub.passPercentage >= 70 ? "#f59e0b" : "#ef4444";
        const isLab = sub.name.toLowerCase().includes("lab");
        return (
          <div key={sub.code} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400 bg-[#1c2333] px-1 sm:px-1.5 py-0.5 rounded flex-shrink-0">{sub.code}</span>
                <span className="text-[10px] sm:text-[11px] text-white truncate">{sub.name}</span>
                {isLab && <span className="text-[7px] sm:text-[8px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 flex-shrink-0">LAB</span>}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold ml-2 flex-shrink-0" style={{ color }}>{sub.passPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${sub.passPercentage}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Pass Percent Tab ──────────────────────────────────────────────────────────
const PasspercentTab = ({
  students,
  subjects,
  // overviewStats can be used for additional analytics if needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  overviewStats,
  isLoading,
  loadingProgress,
  error,
  onRefresh,
}: PasspercentTabProps) => {
  const [selectedDivision, setSelectedDivision] = useState<Division | "all">("all");
  
  // ─── Compute Division Stats ────────────────────────────────────────────────
  const divisionStats = useMemo(() => {
    const stats: Record<Division, { passed: number; promoted: number; failed: number; total: number }> = {
      A: { passed: 0, promoted: 0, failed: 0, total: 0 },
      B: { passed: 0, promoted: 0, failed: 0, total: 0 },
      C: { passed: 0, promoted: 0, failed: 0, total: 0 },
      D: { passed: 0, promoted: 0, failed: 0, total: 0 },
      E: { passed: 0, promoted: 0, failed: 0, total: 0 },
      F: { passed: 0, promoted: 0, failed: 0, total: 0 },
      G: { passed: 0, promoted: 0, failed: 0, total: 0 },
      H: { passed: 0, promoted: 0, failed: 0, total: 0 },
    };
    
    const sem3Codes = Object.keys(SEMESTER_3_SUBJECTS);
    
    for (const student of students) {
      const div = getDivisionFromRoll(student.rollnumber);
      if (!div) continue;
      
      stats[div].total++;
      
      // Get Sem 3 result
      const sem3 = student.semesterResults.find(s => s.semester === 3);
      if (!sem3) {
        stats[div].failed++;
        continue;
      }
      
      // Check for F grades in Sem 3 subjects
      const sem3Subjects = student.subjects.filter(s => sem3Codes.includes(s.code));
      const hasF = sem3Subjects.some(s => s.grade === "F");
      
      if (sem3.result.includes("PASSED") && !hasF) {
        stats[div].passed++;
      } else if (sem3.result.includes("PROMOTED") || (sem3.result.includes("PASSED") && hasF)) {
        stats[div].promoted++;
      } else {
        stats[div].failed++;
      }
    }
    
    return DIVISIONS.map(d => ({ div: d, ...stats[d] }));
  }, [students]);
  
  // ─── Overall Stats for Selected Division ───────────────────────────────────
  const selectedStats = useMemo(() => {
    if (selectedDivision === "all") {
      const totalPassed = divisionStats.reduce((a, d) => a + d.passed, 0);
      const totalPromoted = divisionStats.reduce((a, d) => a + d.promoted, 0);
      const totalFailed = divisionStats.reduce((a, d) => a + d.failed, 0);
      return { passed: totalPassed, promoted: totalPromoted, failed: totalFailed, total: students.length };
    }
    const div = divisionStats.find(d => d.div === selectedDivision);
    return div ? { ...div } : { passed: 0, promoted: 0, failed: 0, total: 0 };
  }, [selectedDivision, divisionStats, students.length]);
  
  // ─── Best/Worst Division ───────────────────────────────────────────────────
  const { bestDiv, worstDiv } = useMemo(() => {
    const sorted = divisionStats
      .filter(d => d.total > 0)
      .map(d => ({ ...d, passRate: (d.passed / d.total) * 100 }))
      .sort((a, b) => b.passRate - a.passRate);
    return {
      bestDiv: sorted[0] || null,
      worstDiv: sorted[sorted.length - 1] || null,
    };
  }, [divisionStats]);
  
  // ─── Subject Stats ─────────────────────────────────────────────────────────
  const subjectStats = useMemo(() => {
    const sorted = [...subjects].sort((a, b) => b.passPercentage - a.passPercentage);
    return {
      highestPass: sorted[0] || null,
      lowestPass: sorted[sorted.length - 1] || null,
      avgPassRate: subjects.reduce((a, s) => a + s.passPercentage, 0) / (subjects.length || 1),
    };
  }, [subjects]);
  
  // ─── Loading & Error States ────────────────────────────────────────────────
  if (isLoading) return <LoadingState progress={loadingProgress} />;
  if (error) return <ErrorState error={error} onRetry={onRefresh} />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Division Filter */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <button
          onClick={() => setSelectedDivision("all")}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            selectedDivision === "all"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-[#161616] text-[#8b8b8b] border border-[#222222] hover:text-white"
          }`}
        >
          All
        </button>
        {DIVISIONS.map(div => (
          <button
            key={div}
            onClick={() => setSelectedDivision(div)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
              selectedDivision === div
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-[#161616] text-[#8b8b8b] border border-[#222222] hover:text-white"
            }`}
          >
            {div}
          </button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-4 sm:p-5 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1c2333] flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <Users size={18} className="text-white" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{selectedStats.total}</p>
          <p className="text-[#6b6b6b] text-[10px] sm:text-xs mt-1">Total Students</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 sm:p-5 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{selectedStats.passed}</p>
          <p className="text-[#6b6b6b] text-[10px] sm:text-xs mt-1">Passed (Clear)</p>
          <p className="text-emerald-400/60 text-[9px] sm:text-[10px] mt-0.5">
            {((selectedStats.passed / (selectedStats.total || 1)) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-4 sm:p-5 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <AlertTriangle size={18} className="text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-400">{selectedStats.promoted}</p>
          <p className="text-[#6b6b6b] text-[10px] sm:text-xs mt-1">Promoted</p>
          <p className="text-amber-400/60 text-[9px] sm:text-[10px] mt-0.5">
            {((selectedStats.promoted / (selectedStats.total || 1)) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-xl p-4 sm:p-5 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <XCircle size={18} className="text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-400">{selectedStats.failed}</p>
          <p className="text-[#6b6b6b] text-[10px] sm:text-xs mt-1">Failed</p>
          <p className="text-rose-400/60 text-[9px] sm:text-[10px] mt-0.5">
            {((selectedStats.failed / (selectedStats.total || 1)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Donut Chart + Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[#161616] border border-[#222222] rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2 mb-4 sm:mb-6">
            <PieChart size={14} className="text-cyan-400" />
            Result Distribution
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <DonutChart 
              passed={selectedStats.passed} 
              promoted={selectedStats.promoted} 
              failed={selectedStats.failed} 
            />
            <div className="space-y-3 sm:space-y-4 flex-1 w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ background: RESULT_COLORS.passed }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs sm:text-sm font-medium">Passed (No Backlogs)</p>
                  <p className="text-[#6b6b6b] text-[9px] sm:text-xs truncate">Cleared all Sem 3 subjects</p>
                </div>
                <span className="text-emerald-400 font-bold text-sm sm:text-base">{selectedStats.passed}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ background: RESULT_COLORS.promoted }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs sm:text-sm font-medium">Promoted (With Backlogs)</p>
                  <p className="text-[#6b6b6b] text-[9px] sm:text-xs truncate">Moved to next sem with F grades</p>
                </div>
                <span className="text-amber-400 font-bold text-sm sm:text-base">{selectedStats.promoted}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ background: RESULT_COLORS.failed }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs sm:text-sm font-medium">Failed</p>
                  <p className="text-[#6b6b6b] text-[9px] sm:text-xs">Did not clear semester</p>
                </div>
                <span className="text-rose-400 font-bold text-sm sm:text-base">{selectedStats.failed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best/Worst Division Cards */}
        <div className="space-y-3 sm:space-y-4">
          {bestDiv && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Award size={20} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#8b8b8b] text-[10px] sm:text-xs">Best Performing Division</p>
                  <p className="text-white font-semibold text-base sm:text-lg">Division {bestDiv.div}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-xl sm:text-2xl font-bold">{bestDiv.passRate.toFixed(1)}%</p>
                  <p className="text-[#6b6b6b] text-[9px] sm:text-xs">pass rate</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="bg-[#0a0a0a]/50 rounded-lg p-1.5 sm:p-2">
                  <p className="text-emerald-400 font-bold text-sm sm:text-base">{bestDiv.passed}</p>
                  <p className="text-[8px] sm:text-[10px] text-[#6b6b6b]">Passed</p>
                </div>
                <div className="bg-[#0a0a0a]/50 rounded-lg p-1.5 sm:p-2">
                  <p className="text-amber-400 font-bold text-sm sm:text-base">{bestDiv.promoted}</p>
                  <p className="text-[8px] sm:text-[10px] text-[#6b6b6b]">Promoted</p>
                </div>
                <div className="bg-[#0a0a0a]/50 rounded-lg p-1.5 sm:p-2">
                  <p className="text-[#8b8b8b] font-bold text-sm sm:text-base">{bestDiv.total}</p>
                  <p className="text-[8px] sm:text-[10px] text-[#6b6b6b]">Total</p>
                </div>
              </div>
            </div>
          )}
          
          {worstDiv && worstDiv.div !== bestDiv?.div && (
            <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} className="text-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#8b8b8b] text-[10px] sm:text-xs">Needs Improvement</p>
                  <p className="text-white font-semibold text-base sm:text-lg">Division {worstDiv.div}</p>
                </div>
                <div className="text-right">
                  <p className="text-rose-400 text-xl sm:text-2xl font-bold">{worstDiv.passRate.toFixed(1)}%</p>
                  <p className="text-[#6b6b6b] text-[9px] sm:text-xs">pass rate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Division-wise Breakdown */}
      <div className="bg-[#161616] border border-[#222222] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2 mb-1 sm:mb-2">
          <BarChart3 size={14} className="text-cyan-400" />
          Division-wise Breakdown
        </h2>
        <p className="text-[#6b6b6b] text-[10px] sm:text-xs mb-4 sm:mb-6">Pass vs Promoted vs Failed for each division</p>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded" style={{ background: RESULT_COLORS.passed }} />
            <span className="text-[10px] sm:text-xs text-[#8b8b8b]">Passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded" style={{ background: RESULT_COLORS.promoted }} />
            <span className="text-[10px] sm:text-xs text-[#8b8b8b]">Promoted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded" style={{ background: RESULT_COLORS.failed }} />
            <span className="text-[10px] sm:text-xs text-[#8b8b8b]">Failed</span>
          </div>
        </div>
        
        <DivisionBarChart divisionStats={divisionStats} />
      </div>

      {/* Subject Pass Rate */}
      <div className="bg-[#161616] border border-[#222222] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1 sm:mb-2">
          <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp size={14} className="text-cyan-400" />
            Subject-wise Pass Rates
          </h2>
          <span className="text-[10px] sm:text-xs text-[#6b6b6b]">Avg: {subjectStats.avgPassRate.toFixed(1)}%</span>
        </div>
        <p className="text-[#6b6b6b] text-[10px] sm:text-xs mb-4 sm:mb-6">Semester 3 subjects ranked by pass percentage</p>
        
        {/* Top/Bottom Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {subjectStats.highestPass && (
            <div className="flex items-center gap-2 sm:gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 sm:p-3">
              <TrendingUp size={14} className="text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] sm:text-[10px] text-emerald-400/60">Highest Pass Rate</p>
                <p className="text-white text-xs sm:text-sm font-medium truncate">{subjectStats.highestPass.name}</p>
              </div>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">{subjectStats.highestPass.passPercentage.toFixed(1)}%</span>
            </div>
          )}
          {subjectStats.lowestPass && (
            <div className="flex items-center gap-2 sm:gap-3 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 sm:p-3">
              <TrendingDown size={14} className="text-rose-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] sm:text-[10px] text-rose-400/60">Lowest Pass Rate</p>
                <p className="text-white text-xs sm:text-sm font-medium truncate">{subjectStats.lowestPass.name}</p>
              </div>
              <span className="text-rose-400 font-bold text-sm sm:text-base">{subjectStats.lowestPass.passPercentage.toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        <SubjectPassBars subjects={subjects} />
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-500/20">
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-xs sm:text-sm">Clear Pass Rate</p>
            <p className="text-[#6b6b6b] text-[10px] sm:text-sm mt-1">
              {((selectedStats.passed / (selectedStats.total || 1)) * 100).toFixed(1)}% cleared Sem 3 without backlogs. 
              {selectedStats.passed} out of {selectedStats.total}.
            </p>
          </div>
        </div>
        <div className="bg-[#161616] border border-[#222222] rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-500/20">
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-xs sm:text-sm">Backlog Analysis</p>
            <p className="text-[#6b6b6b] text-[10px] sm:text-sm mt-1">
              {selectedStats.promoted} students ({((selectedStats.promoted / (selectedStats.total || 1)) * 100).toFixed(1)}%) 
              promoted with backlogs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasspercentTab;
