import React from "react";
import { Users, Award, TrendingUp } from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const classData = [
  { class: "B.E. Computer Science", students: 4820, passed: 3726, distinctions: 812, backlogs: 394, passPercent: 77.3 },
  { class: "B.E. Electronics & Comm.", students: 3610, passed: 2652, distinctions: 503, backlogs: 445, passPercent: 73.5 },
  { class: "B.E. Mechanical", students: 3890, passed: 2682, distinctions: 361, backlogs: 712, passPercent: 68.9 },
  { class: "B.E. Civil", students: 2740, passed: 1808, distinctions: 224, backlogs: 520, passPercent: 66.0 },
  { class: "B.Sc. Mathematics", students: 2180, passed: 1700, distinctions: 380, backlogs: 242, passPercent: 78.0 },
  { class: "B.Sc. Physics", students: 1860, passed: 1395, distinctions: 298, backlogs: 231, passPercent: 75.0 },
  { class: "B.Com General", students: 3200, passed: 2336, distinctions: 412, backlogs: 512, passPercent: 73.0 },
  { class: "B.A. English Literature", students: 1880, passed: 1372, distinctions: 251, backlogs: 248, passPercent: 73.0 },
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

// ─── Class Wise Tab ───────────────────────────────────────────────────────────
const ClasswiseTab = () => {
  const selectedSem = "Semester 3";
  const selectedYear = "February-2026";

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Classes", value: classData.length, icon: Users, color: "cyan" },
          { label: "Best Performing", value: "B.Sc. Math", icon: Award, color: "emerald" },
          { label: "Avg Pass Rate", value: "72.0%", icon: TrendingUp, color: "amber" },
        ].map(card => (
          <div key={card.label} className="bg-[#161616] border border-[#222222] rounded-xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${card.color === "cyan" ? "bg-cyan-500/20 text-cyan-400"
                : card.color === "emerald" ? "bg-emerald-500/20 text-emerald-400"
                : "bg-amber-500/20 text-amber-400"}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-[#6b6b6b] text-sm">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Class-wise Breakdown</h2>
          <span className="text-[11px] text-[#6b6b6b]">{selectedSem} · {selectedYear}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {["Class / Programme", "Students", "Passed", "Distinctions", "Backlogs", "Pass %"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classData.map((row, i) => (
                <tr key={i} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a]/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                      <span className="text-white text-sm font-medium">{row.class}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#8b8b8b] text-sm">{row.students.toLocaleString()}</td>
                  <td className="px-5 py-4 text-emerald-400 text-sm font-medium">{row.passed.toLocaleString()}</td>
                  <td className="px-5 py-4 text-amber-400 text-sm">{row.distinctions.toLocaleString()}</td>
                  <td className="px-5 py-4 text-rose-400 text-sm">{row.backlogs.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${row.passPercent >= 75 ? "text-emerald-400" : row.passPercent >= 68 ? "text-amber-400" : "text-rose-400"}`}>
                          {row.passPercent}%
                        </span>
                      </div>
                      <MiniBar value={row.passPercent}
                        color={row.passPercent >= 75 ? "#10b981" : row.passPercent >= 68 ? "#f59e0b" : "#ef4444"} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual bars */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Pass Rate Comparison</h2>
        <div className="space-y-4">
          {[...classData].sort((a, b) => b.passPercent - a.passPercent).map(row => (
            <div key={row.class} className="flex items-center gap-4">
              <span className="text-[12px] text-[#8b8b8b] w-44 flex-shrink-0 truncate">{row.class}</span>
              <div className="flex-1 h-6 bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="h-full rounded-lg flex items-center justify-end px-3 transition-all duration-700"
                  style={{
                    width: `${row.passPercent}%`,
                    background: row.passPercent >= 75
                      ? "linear-gradient(90deg,#065f46,#10b981)"
                      : row.passPercent >= 68
                      ? "linear-gradient(90deg,#78350f,#f59e0b)"
                      : "linear-gradient(90deg,#7f1d1d,#ef4444)"
                  }}>
                  <span className="text-[11px] font-bold text-white">{row.passPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClasswiseTab;
