import React from "react";
import { Search } from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const subjectData = [
  { subject: "Data Structures & Algorithms", code: "CS301", appeared: 4210, passed: 3494, passPercent: 83.0, avg: 71, difficulty: "Medium" },
  { subject: "Engineering Mathematics III", code: "MA301", appeared: 8640, passed: 6048, passPercent: 70.0, avg: 58, difficulty: "Hard" },
  { subject: "Digital Electronics", code: "EC201", appeared: 3610, passed: 2960, passPercent: 82.0, avg: 67, difficulty: "Medium" },
  { subject: "Thermodynamics", code: "ME301", appeared: 3890, passed: 2490, passPercent: 64.0, avg: 52, difficulty: "Hard" },
  { subject: "Fluid Mechanics", code: "CE401", appeared: 2740, passed: 1644, passPercent: 60.0, avg: 48, difficulty: "Hard" },
  { subject: "Linear Algebra", code: "MA201", appeared: 6400, passed: 5248, passPercent: 82.0, avg: 69, difficulty: "Medium" },
  { subject: "Computer Networks", code: "CS401", appeared: 4180, passed: 3636, passPercent: 87.0, avg: 74, difficulty: "Easy" },
  { subject: "Organic Chemistry", code: "CH201", appeared: 3040, passed: 2067, passPercent: 68.0, avg: 55, difficulty: "Hard" },
  { subject: "Financial Accounting", code: "BC101", appeared: 3200, passed: 2688, passPercent: 84.0, avg: 70, difficulty: "Easy" },
  { subject: "Electromagnetic Theory", code: "EC301", appeared: 3610, passed: 2202, passPercent: 61.0, avg: 49, difficulty: "Hard" },
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

// ─── Subject Wise Tab ──────────────────────────────────────────────────────────
const SubjectwiseTab = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => {
  const filteredSubjects = subjectData.filter(s =>
    s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
        <input
          type="text"
          placeholder="Search subject or code…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#161616] border border-[#222222] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-[#4b4b4b] outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Subjects", value: subjectData.length, color: "text-white" },
          { label: "Avg Pass %", value: `${(subjectData.reduce((a, s) => a + s.passPercent, 0) / subjectData.length).toFixed(1)}%`, color: "text-cyan-400" },
          { label: "Avg Score", value: `${Math.round(subjectData.reduce((a, s) => a + s.avg, 0) / subjectData.length)}/100`, color: "text-emerald-400" },
          { label: "Hard Subjects", value: subjectData.filter(s => s.difficulty === "Hard").length, color: "text-rose-400" },
        ].map(card => (
          <div key={card.label} className="bg-[#161616] border border-[#222222] rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[#6b6b6b] text-xs mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-base font-semibold text-white">Subject-wise Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {["Subject", "Code", "Appeared", "Passed", "Avg Score", "Difficulty", "Pass %"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((row, i) => (
                <tr key={i} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a]/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-white text-sm font-medium">{row.subject}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] bg-[#1c2333] text-cyan-400 px-2 py-1 rounded-md font-mono">{row.code}</span>
                  </td>
                  <td className="px-5 py-4 text-[#8b8b8b] text-sm">{row.appeared.toLocaleString()}</td>
                  <td className="px-5 py-4 text-emerald-400 text-sm">{row.passed.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8b8b8b] text-sm">{row.avg}</span>
                      <MiniBar value={row.avg} color="#06b6d4" />
                    </div>
                  </td>
                  <td className="px-5 py-4"><DiffBadge d={row.difficulty} /></td>
                  <td className="px-5 py-4">
                    <div className="space-y-1 min-w-[80px]">
                      <span className={`text-sm font-bold ${row.passPercent >= 80 ? "text-emerald-400" : row.passPercent >= 70 ? "text-amber-400" : "text-rose-400"}`}>
                        {row.passPercent}%
                      </span>
                      <MiniBar value={row.passPercent}
                        color={row.passPercent >= 80 ? "#10b981" : row.passPercent >= 70 ? "#f59e0b" : "#ef4444"} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#6b6b6b] text-sm">
                    No subjects found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubjectwiseTab;
