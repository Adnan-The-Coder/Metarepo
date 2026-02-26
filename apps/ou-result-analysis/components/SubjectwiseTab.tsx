"use client";
import React, { useState, useMemo } from "react";
import { Search, RefreshCw, AlertCircle, BookOpen, TrendingUp, TrendingDown, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { SubjectAnalytics, SubjectGradeBreakdown } from "@/lib/types";

// ─── Props ────────────────────────────────────────────────────────────────────
interface SubjectwiseTabProps {
  subjects: SubjectAnalytics[];
  gradeBreakdown: SubjectGradeBreakdown[];
  isLoading: boolean;
  loadingProgress: { current: number; total: number };
  error: string | null;
  onRefresh: () => void;
}

// ─── Grade Colors ─────────────────────────────────────────────────────────────
const GRADE_COLORS: Record<string, string> = {
  S: "#06b6d4",
  A: "#10b981",
  B: "#84cc16",
  C: "#f59e0b",
  D: "#f97316",
  E: "#ef4444",
  F: "#6b7280",
  Ab: "#374151",
};

// ─── Mini Bar ─────────────────────────────────────────────────────────────────
const MiniBar = ({ value, max = 100, color = "#06b6d4" }: { value: number; max?: number; color?: string }) => (
  <div className="w-full h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${(value / max) * 100}%`, background: color }}
    />
  </div>
);

// ─── Difficulty Badge ─────────────────────────────────────────────────────────
const DiffBadge = ({ d }: { d: string }) => {
  const map: Record<string, string> = {
    Easy: "bg-emerald-500/15 text-emerald-400",
    Medium: "bg-amber-500/15 text-amber-400",
    Hard: "bg-rose-500/15 text-rose-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${map[d] || ""}`}>{d}</span>
  );
};

// ─── Lab Badge ────────────────────────────────────────────────────────────────
const LabBadge = () => (
  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-semibold">LAB</span>
);

// ─── Grade Distribution Bar ───────────────────────────────────────────────────
const GradeDistributionBar = ({ breakdown }: { breakdown: SubjectGradeBreakdown }) => {
  const total = breakdown.totalAppeared || 1;
  const grades = [
    { key: "S", count: breakdown.sCount },
    { key: "A", count: breakdown.aCount },
    { key: "B", count: breakdown.bCount },
    { key: "C", count: breakdown.cCount },
    { key: "D", count: breakdown.dCount },
    { key: "E", count: breakdown.eCount },
    { key: "F", count: breakdown.fCount },
  ];
  
  return (
    <div className="flex h-2 rounded-full overflow-hidden bg-[#1f1f1f]">
      {grades.map(g => {
        const pct = (g.count / total) * 100;
        if (pct === 0) return null;
        return (
          <div
            key={g.key}
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, background: GRADE_COLORS[g.key] }}
            title={`${g.key}: ${g.count} (${pct.toFixed(1)}%)`}
          />
        );
      })}
    </div>
  );
};

// ─── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ active, asc }: { active: boolean; asc: boolean }) => (
  <span className={`ml-1 inline-flex ${active ? "text-cyan-400" : "text-[#4b4b4b]"}`}>
    {asc ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
  </span>
);

// ─── Loading State ────────────────────────────────────────────────────────────
const LoadingState = ({ progress }: { progress: { current: number; total: number } }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <RefreshCw size={28} className="text-cyan-400 animate-spin" />
    <p className="text-[#6b6b6b] text-sm">Loading subject data...</p>
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

// ─── Filter Types ─────────────────────────────────────────────────────────────
type SortKey = "name" | "passRate" | "difficulty" | "avgGradePoints";
type SubjectType = "all" | "theory" | "lab";

// ─── Subject Wise Tab ──────────────────────────────────────────────────────────
const SubjectwiseTab = ({
  subjects,
  gradeBreakdown,
  isLoading,
  loadingProgress,
  error,
  onRefresh,
}: SubjectwiseTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("passRate");
  const [sortAsc, setSortAsc] = useState(false);
  const [subjectType, setSubjectType] = useState<SubjectType>("all");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  // ─── Lab Detection ─────────────────────────────────────────────────────────
  const isLabSubject = (code: string, name: string) => {
    return name.toLowerCase().includes("lab") || 
           code.endsWith("F") || 
           code === "367" || 
           code === "371";
  };

  // ─── Filtered & Sorted Subjects ────────────────────────────────────────────
  const filteredSubjects = useMemo(() => {
    let result = subjects.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by type
    if (subjectType === "lab") {
      result = result.filter(s => isLabSubject(s.code, s.name));
    } else if (subjectType === "theory") {
      result = result.filter(s => !isLabSubject(s.code, s.name));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "passRate":
          cmp = a.passPercentage - b.passPercentage;
          break;
        case "difficulty": {
          const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
          cmp = diffOrder[a.difficulty] - diffOrder[b.difficulty];
          break;
        }
        case "avgGradePoints":
          cmp = a.averageGradePoints - b.averageGradePoints;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [subjects, searchQuery, subjectType, sortKey, sortAsc]);

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (subjects.length === 0) return null;
    const avgPassRate = subjects.reduce((a, s) => a + s.passPercentage, 0) / subjects.length;
    const avgGradePoints = subjects.reduce((a, s) => a + s.averageGradePoints, 0) / subjects.length;
    const hardSubjects = subjects.filter(s => s.difficulty === "Hard").length;
    const labCount = subjects.filter(s => isLabSubject(s.code, s.name)).length;
    const highestPass = subjects.reduce((max, s) => s.passPercentage > max.passPercentage ? s : max, subjects[0]);
    const lowestPass = subjects.reduce((min, s) => s.passPercentage < min.passPercentage ? s : min, subjects[0]);
    return { avgPassRate, avgGradePoints, hardSubjects, labCount, highestPass, lowestPass };
  }, [subjects]);

  // ─── Get Grade Breakdown for a Subject ─────────────────────────────────────
  const getBreakdown = (code: string) => gradeBreakdown.find(b => b.code === code);

  // ─── Handle Sort ───────────────────────────────────────────────────────────
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  // ─── Loading & Error States ────────────────────────────────────────────────
  if (isLoading) return <LoadingState progress={loadingProgress} />;
  if (error) return <ErrorState error={error} onRetry={onRefresh} />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
          <input
            type="text"
            placeholder="Search subject or code…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#161616] border border-[#222222] rounded-xl pl-9 pr-4 py-2.5 sm:py-3 text-sm text-white placeholder-[#4b4b4b] outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "theory", "lab"] as SubjectType[]).map(type => (
            <button
              key={type}
              onClick={() => setSubjectType(type)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                subjectType === type
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-[#161616] text-[#8b8b8b] border border-[#222222] hover:text-white"
              }`}
            >
              {type === "all" ? "All" : type === "theory" ? "Theory" : "Labs"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      {stats && (
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-2xl font-bold text-white">{subjects.length}</p>
            <p className="text-[#6b6b6b] text-[9px] sm:text-xs mt-1">Total Subjects</p>
          </div>
          <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-2xl font-bold text-cyan-400">{stats.avgPassRate.toFixed(1)}%</p>
            <p className="text-[#6b6b6b] text-[9px] sm:text-xs mt-1">Avg Pass Rate</p>
          </div>
          <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-2xl font-bold text-emerald-400">{stats.avgGradePoints.toFixed(1)}</p>
            <p className="text-[#6b6b6b] text-[9px] sm:text-xs mt-1">Avg GP</p>
          </div>
          <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4 text-center hidden sm:block">
            <p className="text-lg sm:text-2xl font-bold text-rose-400">{stats.hardSubjects}</p>
            <p className="text-[#6b6b6b] text-[9px] sm:text-xs mt-1">Hard Subjects</p>
          </div>
          <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4 text-center hidden lg:block">
            <p className="text-lg sm:text-2xl font-bold text-amber-400">{stats.labCount}</p>
            <p className="text-[#6b6b6b] text-[9px] sm:text-xs mt-1">Lab Practicals</p>
          </div>
          <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4 text-center hidden lg:block">
            <p className="text-lg sm:text-2xl font-bold text-violet-400">{subjects.length - stats.labCount}</p>
            <p className="text-[#6b6b6b] text-[9px] sm:text-xs mt-1">Theory Subjects</p>
          </div>
        </div>
      )}

      {/* Top/Bottom Performers */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[#8b8b8b] text-[10px] sm:text-xs">Highest Pass Rate</p>
                <p className="text-white font-semibold text-xs sm:text-sm truncate">{stats.highestPass.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-xl sm:text-2xl font-bold">{stats.highestPass.passPercentage.toFixed(1)}%</span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#6b6b6b] bg-[#1f1f1f] px-2 py-1 rounded">{stats.highestPass.code}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <TrendingDown size={16} className="text-rose-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[#8b8b8b] text-[10px] sm:text-xs">Lowest Pass Rate</p>
                <p className="text-white font-semibold text-xs sm:text-sm truncate">{stats.lowestPass.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rose-400 text-xl sm:text-2xl font-bold">{stats.lowestPass.passPercentage.toFixed(1)}%</span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#6b6b6b] bg-[#1f1f1f] px-2 py-1 rounded">{stats.lowestPass.code}</span>
            </div>
          </div>
        </div>
      )}

      {/* Grade Distribution Legend */}
      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-2 sm:mb-3">Grade Legend</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {Object.entries(GRADE_COLORS).map(([grade, color]) => (
            <div key={grade} className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm" style={{ background: color }} />
              <span className="text-[10px] sm:text-xs text-[#8b8b8b]">{grade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Table */}
      <div className="bg-[#161616] border border-[#222222] rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
            <BookOpen size={14} className="text-cyan-400" />
            Subject-wise Results
          </h2>
          <span className="text-[#6b6b6b] text-[10px] sm:text-xs">{filteredSubjects.length} subjects</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap">
                  <button onClick={() => handleSort("name")} className="flex items-center hover:text-white transition-colors">
                    Subject <SortIcon active={sortKey === "name"} asc={sortAsc} />
                  </button>
                </th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap">Code</th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap">Appeared</th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap">Passed</th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap">
                  <button onClick={() => handleSort("avgGradePoints")} className="flex items-center hover:text-white transition-colors">
                    Avg GP <SortIcon active={sortKey === "avgGradePoints"} asc={sortAsc} />
                  </button>
                </th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap">
                  <button onClick={() => handleSort("difficulty")} className="flex items-center hover:text-white transition-colors">
                    Difficulty <SortIcon active={sortKey === "difficulty"} asc={sortAsc} />
                  </button>
                </th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                  <button onClick={() => handleSort("passRate")} className="flex items-center hover:text-white transition-colors">
                    Pass % <SortIcon active={sortKey === "passRate"} asc={sortAsc} />
                  </button>
                </th>
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                  Grade Distribution
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((row) => {
                const isLab = isLabSubject(row.code, row.name);
                const breakdown = getBreakdown(row.code);
                const isExpanded = expandedSubject === row.code;
                
                return (
                  <React.Fragment key={row.code}>
                    <tr 
                      className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedSubject(isExpanded ? null : row.code)}
                    >
                      <td className="px-3 sm:px-5 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-white text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none">{row.name}</span>
                          {isLab && <LabBadge />}
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4">
                        <span className="text-[10px] sm:text-[11px] bg-[#1c2333] text-cyan-400 px-1.5 sm:px-2 py-1 rounded-md font-mono">{row.code}</span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-[#8b8b8b] text-xs sm:text-sm">{row.totalAppeared.toLocaleString()}</td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-emerald-400 text-xs sm:text-sm font-medium">{row.totalPassed.toLocaleString()}</td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4">
                        <span className="text-cyan-400 text-xs sm:text-sm font-bold">{row.averageGradePoints.toFixed(1)}</span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4"><DiffBadge d={row.difficulty} /></td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4">
                        <div className="space-y-1 min-w-[60px] sm:min-w-[80px]">
                          <span className={`text-xs sm:text-sm font-bold ${row.passPercentage >= 80 ? "text-emerald-400" : row.passPercentage >= 70 ? "text-amber-400" : "text-rose-400"}`}>
                            {row.passPercentage.toFixed(1)}%
                          </span>
                          <MiniBar 
                            value={row.passPercentage}
                            color={row.passPercentage >= 80 ? "#10b981" : row.passPercentage >= 70 ? "#f59e0b" : "#ef4444"} 
                          />
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 min-w-[100px] sm:min-w-[150px]">
                        {breakdown && <GradeDistributionBar breakdown={breakdown} />}
                      </td>
                    </tr>
                    
                    {/* Expanded Details */}
                    {isExpanded && breakdown && (
                      <tr className="bg-[#0f0f0f]">
                        <td colSpan={8} className="px-3 sm:px-5 py-3 sm:py-4">
                          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
                            {[
                              { grade: "S", count: breakdown.sCount, label: "90-100%", color: GRADE_COLORS.S },
                              { grade: "A", count: breakdown.aCount, label: "70-89%", color: GRADE_COLORS.A },
                              { grade: "B", count: breakdown.bCount, label: "60-69%", color: GRADE_COLORS.B },
                              { grade: "C", count: breakdown.cCount, label: "50-59%", color: GRADE_COLORS.C },
                              { grade: "D", count: breakdown.dCount, label: "45-49%", color: GRADE_COLORS.D },
                              { grade: "E", count: breakdown.eCount, label: "40-44%", color: GRADE_COLORS.E },
                              { grade: "F", count: breakdown.fCount, label: "<40%", color: GRADE_COLORS.F },
                              { grade: "Ab", count: breakdown.abCount, label: "Absent", color: GRADE_COLORS.Ab },
                            ].map(g => (
                              <div key={g.grade} className="bg-[#161616] border border-[#222222] rounded-lg p-2 sm:p-3 text-center">
                                <p className="text-base sm:text-xl font-bold" style={{ color: g.color }}>{g.count}</p>
                                <p className="text-white text-[10px] sm:text-xs font-semibold mt-0.5">{g.grade}</p>
                                <p className="text-[#4b4b4b] text-[8px] sm:text-[10px]">{g.label}</p>
                                <p className="text-[#6b6b6b] text-[8px] sm:text-[10px] mt-0.5">
                                  {((g.count / (breakdown.totalAppeared || 1)) * 100).toFixed(1)}%
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-[#6b6b6b]">
                            <span>Total Failed: <span className="text-rose-400 font-semibold">{row.totalFailed}</span></span>
                            <span>Total Absent: <span className="text-[#8b8b8b] font-semibold">{row.totalAbsent}</span></span>
                            <span>Pass Rate: <span className="text-emerald-400 font-semibold">{row.passPercentage.toFixed(1)}%</span></span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[#6b6b6b] text-sm">
                    {searchQuery ? `No subjects found matching "${searchQuery}"` : "No subjects available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Performance Chart */}
      <div className="bg-[#161616] border border-[#222222] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2 mb-4">
          <BarChart3 size={14} className="text-cyan-400" />
          Pass Rate Comparison
        </h2>
        <div className="space-y-2.5 sm:space-y-3">
          {filteredSubjects.map(sub => {
            const passColor = sub.passPercentage >= 80 ? "#10b981" : sub.passPercentage >= 70 ? "#f59e0b" : "#ef4444";
            return (
              <div key={sub.code} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 bg-[#1c2333] px-1 sm:px-1.5 py-0.5 rounded flex-shrink-0">{sub.code}</span>
                    <span className="text-[10px] sm:text-xs text-white truncate">{sub.name}</span>
                    {isLabSubject(sub.code, sub.name) && <LabBadge />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold ml-2 flex-shrink-0" style={{ color: passColor }}>
                    {sub.passPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 group-hover:opacity-80"
                    style={{ width: `${sub.passPercentage}%`, background: passColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectwiseTab;
