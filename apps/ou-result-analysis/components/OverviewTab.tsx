import React from "react";
import { Users, CheckCircle2, Award, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const overviewStats = [
  { label: "Total Students", value: "481", change: "+4.2%", up: true, icon: Users, color: "cyan" },
  { label: "Overall Pass %", value: "71.4%", change: "+2.1%", up: true, icon: CheckCircle2, color: "emerald" },
  { label: "Distinctions", value: "3,241", change: "+8.7%", up: true, icon: Award, color: "amber" },
  { label: "Backlogs", value: "6,904", change: "-3.4%", up: false, icon: AlertCircle, color: "rose" },
];

const passPercentTrend = [
  { sem: "Sem 1", "2023–24": 74, "2022–23": 70, "2021–22": 68 },
  { sem: "Sem 2", "2023–24": 71, "2022–23": 68, "2021–22": 65 },
  { sem: "Sem 3", "2023–24": 69, "2022–23": 65, "2021–22": 63 },
  { sem: "Sem 4", "2023–24": 73, "2022–23": 69, "2021–22": 67 },
  { sem: "Sem 5", "2023–24": 76, "2022–23": 72, "2021–22": 70 },
  { sem: "Sem 6", "2023–24": 71, "2022–23": 67, "2021–22": 65 },
];

const gradeDistribution = [
  { grade: "O (90–100)", count: 1240, pct: 5.1, color: "#06b6d4" },
  { grade: "A+ (80–89)", count: 2001, pct: 8.3, color: "#10b981" },
  { grade: "A (70–79)", count: 4362, pct: 18.0, color: "#84cc16" },
  { grade: "B+ (60–69)", count: 5814, pct: 24.0, color: "#f59e0b" },
  { grade: "B (50–59)", count: 3840, pct: 15.9, color: "#f97316" },
  { grade: "C (40–49)", count: 1031, pct: 4.3, color: "#ef4444" },
  { grade: "F (<40)", count: 5892, pct: 24.4, color: "#6b7280" },
];

// ─── Mini Bar ─────────────────────────────────────────────────────────────────
const MiniBar = ({ value, max = 100, color = "#06b6d4" }: { value: number; max?: number; color?: string }) => (
  <div className="w-full h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${(value / max) * 100}%`, background: color }}
    />
  </div>
);

// ─── Horizontal Bar Chart ─────────────────────────────────────────────────────
const HBarChart = () => (
  <div className="space-y-3">
    {gradeDistribution.map((g) => (
      <div key={g.grade} className="flex items-center gap-3">
        <span className="text-[11px] text-[#6b6b6b] w-28 flex-shrink-0">{g.grade}</span>
        <div className="flex-1 h-5 bg-[#1a1a1a] rounded-md overflow-hidden">
          <div
            className="h-full rounded-md flex items-center px-2 transition-all duration-700"
            style={{ width: `${g.pct}%`, background: `${g.color}22`, borderLeft: `2px solid ${g.color}` }}
          >
            <span className="text-[10px] font-bold" style={{ color: g.color }}>{g.pct}%</span>
          </div>
        </div>
        <span className="text-[11px] text-[#6b6b6b] w-14 text-right flex-shrink-0">{g.count.toLocaleString()}</span>
      </div>
    ))}
  </div>
);

// ─── Line Chart (SVG) ─────────────────────────────────────────────────────────
const TrendChart = () => {
  const years = ["2023–24", "2022–23", "2021–22"] as const;
  const colors = ["#06b6d4", "#10b981", "#f59e0b"];
  const w = 500, h = 120, padL = 32, padR = 16, padT = 10, padB = 24;
  const iw = w - padL - padR, ih = h - padT - padB;
  const sems = passPercentTrend.length;
  const yMin = 58, yMax = 80;

  const toX = (i: number) => padL + (i / (sems - 1)) * iw;
  const toY = (v: number) => padT + ih - ((v - yMin) / (yMax - yMin)) * ih;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32">
      {/* Grid lines */}
      {[60, 65, 70, 75, 80].map(v => (
        <line key={v} x1={padL} y1={toY(v)} x2={w - padR} y2={toY(v)}
          stroke="#1f1f1f" strokeWidth="1" />
      ))}
      {[60, 65, 70, 75, 80].map(v => (
        <text key={v} x={padL - 4} y={toY(v) + 4} textAnchor="end"
          fontSize="9" fill="#4b5563">{v}%</text>
      ))}
      {/* Lines */}
      {years.map((yr, yi) => {
        const pts = passPercentTrend.map((d, i) => `${toX(i)},${toY(d[yr])}`).join(" ");
        return <polyline key={yr} points={pts} fill="none" stroke={colors[yi]}
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />;
      })}
      {/* Dots */}
      {years.map((yr, yi) =>
        passPercentTrend.map((d, i) => (
          <circle key={`${yr}-${i}`} cx={toX(i)} cy={toY(d[yr])} r="3"
            fill="#111111" stroke={colors[yi]} strokeWidth="1.5" />
        ))
      )}
      {/* X labels */}
      {passPercentTrend.map((d, i) => (
        <text key={i} x={toX(i)} y={h - 4} textAnchor="middle"
          fontSize="9" fill="#6b7280">{d.sem}</text>
      ))}
    </svg>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ stat }: { stat: typeof overviewStats[0] }) => {
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
        <span className={`text-xs font-semibold flex items-center gap-1 ${stat.up ? "text-emerald-400" : "text-rose-400"}`}>
          {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {stat.change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{stat.value}</p>
        <p className="text-[#6b6b6b] text-sm mt-0.5">{stat.label}</p>
      </div>
    </div>
  );
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map(s => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Grade Distribution + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Grade Distribution</h2>
            <span className="text-[11px] text-[#6b6b6b] bg-[#1a1a1a] px-2 py-1 rounded-lg">
              Feb-26, Results Analysis
            </span>
          </div>
          <HBarChart />
        </div>

        <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">Pass % Trend</h2>
            <div className="flex items-center gap-3">
              {(["2023–24", "2022–23", "2021–22"] as const).map((yr, i) => (
                <div key={yr} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: ["#06b6d4", "#10b981", "#f59e0b"][i] }} />
                  <span className="text-[10px] text-[#6b6b6b]">{yr}</span>
                </div>
              ))}
            </div>
          </div>
          <TrendChart />
          <p className="text-[11px] text-[#6b6b6b] mt-2">
            Pass percentage across semesters — year-over-year comparison.
          </p>
        </div>
      </div>

      {/* Bottom summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Highest Pass Dept.", value: "B.Sc. Mathematics", sub: "78.0% pass rate", icon: Award, color: "emerald" },
          { label: "Lowest Pass Dept.", value: "B.E. Civil", sub: "66.0% pass rate", icon: AlertCircle, color: "rose" },
          { label: "Exam Completion", value: "100%", sub: "All batches processed", icon: CheckCircle2, color: "cyan" },
        ].map(card => (
          <div key={card.label} className="bg-[#161616] border border-[#222222] rounded-xl p-5 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
              ${card.color === "emerald" ? "bg-emerald-500/20 text-emerald-400"
                : card.color === "rose" ? "bg-rose-500/20 text-rose-400"
                : "bg-cyan-500/20 text-cyan-400"}`}>
              <card.icon size={18} />
            </div>
            <div>
              <p className="text-[#6b6b6b] text-xs">{card.label}</p>
              <p className="text-white font-semibold text-sm mt-0.5">{card.value}</p>
              <p className="text-[#6b6b6b] text-xs">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewTab;
