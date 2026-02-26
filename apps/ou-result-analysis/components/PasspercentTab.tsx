import React from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const passPercentTrend = [
  { sem: "Sem 1", "2023–24": 74, "2022–23": 70, "2021–22": 68 },
  { sem: "Sem 2", "2023–24": 71, "2022–23": 68, "2021–22": 65 },
  { sem: "Sem 3", "2023–24": 69, "2022–23": 65, "2021–22": 63 },
  { sem: "Sem 4", "2023–24": 73, "2022–23": 69, "2021–22": 67 },
  { sem: "Sem 5", "2023–24": 76, "2022–23": 72, "2021–22": 70 },
  { sem: "Sem 6", "2023–24": 71, "2022–23": 67, "2021–22": 65 },
];

// ─── Trend Sparkline (SVG) ────────────────────────────────────────────────────
const Sparkline = ({ data, color = "#06b6d4" }: { data: number[]; color?: string }) => {
  const w = 80, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

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

// ─── Pass Percent Tab ──────────────────────────────────────────────────────────
const PasspercentTab = () => {
  return (
    <div className="space-y-6">
      {/* Year comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { year: "2023–24", avg: 72.3, prev: 69.5, sparkData: [70, 68, 66, 71, 75, 74], color: "#06b6d4" },
          { year: "2022–23", avg: 69.5, prev: 67.2, sparkData: [67, 65, 63, 68, 71, 72], color: "#10b981" },
          { year: "2021–22", avg: 67.2, prev: 65.0, sparkData: [65, 63, 61, 66, 69, 67], color: "#f59e0b" },
        ].map(card => {
          const diff = (card.avg - card.prev).toFixed(1);
          const up = card.avg > card.prev;
          return (
            <div key={card.year} className="bg-[#161616] border border-[#222222] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#6b6b6b] text-sm">{card.year}</span>
                <Sparkline data={card.sparkData} color={card.color} />
              </div>
              <p className="text-3xl font-bold text-white">{card.avg}%</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{up ? "+" : ""}{diff}% vs prior year</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-year trend chart */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Semester-wise Pass % — 3 Year Trend</h2>
          <div className="flex items-center gap-4">
            {(["2023–24", "2022–23", "2021–22"] as const).map((yr, i) => (
              <div key={yr} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: ["#06b6d4", "#10b981", "#f59e0b"][i] }} />
                <span className="text-[11px] text-[#6b6b6b]">{yr}</span>
              </div>
            ))}
          </div>
        </div>
        <TrendChart />
      </div>

      {/* Semester table */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-base font-semibold text-white">Semester-wise Pass % Detail</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {["Semester", "2023–24", "2022–23", "2021–22", "YoY Change"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {passPercentTrend.map((row, i) => {
              const diff = (row["2023–24"] - row["2022–23"]).toFixed(1);
              const up = row["2023–24"] >= row["2022–23"];
              return (
                <tr key={i} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a]/50 transition-colors">
                  <td className="px-6 py-4 text-white text-sm font-medium">{row.sem}</td>
                  <td className="px-6 py-4 text-cyan-400 text-sm font-bold">{row["2023–24"]}%</td>
                  <td className="px-6 py-4 text-emerald-400 text-sm">{row["2022–23"]}%</td>
                  <td className="px-6 py-4 text-amber-400 text-sm">{row["2021–22"]}%</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}>
                      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {up ? "+" : ""}{diff}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: TrendingUp, color: "emerald",
            title: "Consistent Improvement",
            desc: "Overall pass percentage has grown by 5.1 percentage points over 3 years, reflecting curriculum and teaching reforms.",
          },
          {
            icon: AlertCircle, color: "amber",
            title: "Sem 3 Dip Pattern",
            desc: "Semester 3 consistently records the lowest pass rate across all years, suggesting challenging core subjects.",
          },
        ].map(card => (
          <div key={card.title} className="bg-[#161616] border border-[#222222] rounded-xl p-5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
              ${card.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{card.title}</p>
              <p className="text-[#6b6b6b] text-sm mt-1">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasspercentTab;
