"use client";
import React, { useState } from "react";
import {
  GraduationCap,
  BarChart3,
  BookOpen,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Menu,
  X,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  Search,
  Minus,
} from "lucide-react";

// ─── Brand Logo ──────────────────────────────────────────────────────────────
const OULogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#06b6d4" strokeWidth="1.8" />
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="1.5" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "overview" | "classwise" | "subjectwise" | "passpercent";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const semesterOptions = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];
const yearOptions = ["2023–24", "2022–23", "2021–22", "2020–21"];

const overviewStats = [
  { label: "Total Students", value: "24,180", change: "+4.2%", up: true, icon: Users, color: "cyan" },
  { label: "Overall Pass %", value: "71.4%", change: "+2.1%", up: true, icon: CheckCircle2, color: "emerald" },
  { label: "Distinctions", value: "3,241", change: "+8.7%", up: true, icon: Award, color: "amber" },
  { label: "Backlogs", value: "6,904", change: "-3.4%", up: false, icon: AlertCircle, color: "rose" },
];

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

// ─── Nav Item (matches original) ─────────────────────────────────────────────
const NavItem = ({
  icon: Icon, label, isActive = false, onClick,
}: { icon: React.ElementType; label: string; isActive?: boolean; onClick?: () => void }) => (
  <button onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
      ${isActive ? "bg-[#1c2333] text-white" : "text-[#8b8b8b] hover:text-white hover:bg-[#141414]"}`}>
    <Icon size={20} strokeWidth={1.8} className="flex-shrink-0" />
    <span className="text-[14px] font-medium truncate">{label}</span>
  </button>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const OsmaniaDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSem, setSelectedSem] = useState("Semester 3");
  const [selectedYear, setSelectedYear] = useState("2023–24");
  const [searchQuery, setSearchQuery] = useState("");

  const closeSidebar = () => setIsSidebarOpen(false);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "classwise", label: "Class Wise", icon: Users },
    { key: "subjectwise", label: "Subject Wise", icon: BookOpen },
    { key: "passpercent", label: "Pass Percent", icon: TrendingUp },
  ];

  const filteredSubjects = subjectData.filter(s =>
    s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Scrollbar Styles */}
      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        .main-scroll::-webkit-scrollbar { width: 6px; }
        .main-scroll::-webkit-scrollbar-track { background: transparent; }
        .main-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
        .main-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.15) transparent; }
        select option { background: #161616; color: white; }
      `}</style>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[#0a0a0a] 
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col h-full overflow-hidden`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <OULogo />
            <div>
              <span className="text-white font-semibold text-[15px] leading-tight block">Osmania University</span>
              <span className="text-[#6b6b6b] text-[11px]">Results Tracker</span>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#141414] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 flex-shrink-0 space-y-2">
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-3 space-y-2">
            <p className="text-[11px] text-[#6b6b6b] font-semibold uppercase tracking-wider mb-1">Filters</p>
            <select value={selectedSem} onChange={e => setSelectedSem(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-[13px] rounded-lg px-3 py-2 outline-none focus:border-cyan-500/50">
              {semesterOptions.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-[13px] rounded-lg px-3 py-2 outline-none focus:border-cyan-500/50">
              {yearOptions.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden sidebar-scroll">
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider px-3 py-2 block">
              Analytics
            </span>
          </div>
          <div className="space-y-0.5">
            {tabs.map(t => (
              <NavItem key={t.key} icon={t.icon} label={t.label}
                isActive={activeTab === t.key} onClick={() => { setActiveTab(t.key); closeSidebar(); }} />
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 mx-1 h-px bg-[#1f1f1f]" />

          {/* Quick Info */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-4 space-y-3">
            <p className="text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Quick Stats</p>
            {[
              { label: "Active Semester", value: selectedSem },
              { label: "Academic Year", value: selectedYear },
              { label: "Total Departments", value: "32" },
              { label: "Exam Batches", value: "Nov / Apr" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[12px] text-[#6b6b6b]">{item.label}</span>
                <span className="text-[12px] text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 flex-shrink-0 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-white text-[13px] font-medium">Osmania University</p>
              <p className="text-[#6b6b6b] text-[11px]">Hyderabad, Telangana</p>
            </div>
          </div>
          {/* Credits */}
          <p className="text-[10px] text-[#3a3a3a] mt-3 text-center">
            Built by{" "}
            <a href="https://AdnanTheCoder.com" target="_blank" rel="noreferrer"
              className="text-cyan-600 hover:text-cyan-400 transition-colors">
              AdnanTheCoder.com
            </a>
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar} />
      )}

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden bg-[#0a0a0a] lg:p-2">
        <div className="h-full bg-[#111111] lg:rounded-2xl overflow-y-auto main-scroll lg:border lg:border-[#1a1a1a]">

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-[#111111] sticky top-0 z-10 border-b border-[#1a1a1a]">
            <button onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-white hover:bg-[#1a1a1a] transition-colors">
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <OULogo />
              <span className="text-white font-semibold text-[15px]">OU Results</span>
            </div>
            <div className="w-10" />
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-6">
                <span>Osmania University</span>
                <ChevronRight size={14} />
                <span>Results Analytics</span>
                <ChevronRight size={14} />
                <span className="text-white capitalize">
                  {tabs.find(t => t.key === activeTab)?.label}
                </span>
              </div>

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {tabs.find(t => t.key === activeTab)?.label}
                  </h1>
                  <p className="text-[#6b6b6b] text-sm mt-1">
                    {selectedSem} · {selectedYear} · Osmania University
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-[#161616] border border-[#222222] rounded-lg text-[#8b8b8b] hover:text-white hover:border-[#333] text-sm transition-colors">
                    <Filter size={14} />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-[#161616] border border-[#222222] rounded-lg text-[#8b8b8b] hover:text-white hover:border-[#333] text-sm transition-colors">
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* ── Tab: Overview ────────────────────────────────────────────── */}
              {activeTab === "overview" && (
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
                          {selectedSem}
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
              )}

              {/* ── Tab: Class Wise ──────────────────────────────────────────── */}
              {activeTab === "classwise" && (
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
              )}

              {/* ── Tab: Subject Wise ────────────────────────────────────────── */}
              {activeTab === "subjectwise" && (
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
              )}

              {/* ── Tab: Pass Percent ────────────────────────────────────────── */}
              {activeTab === "passpercent" && (
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
              )}

              {/* Footer Credits */}
              <div className="mt-12 pt-6 border-t border-[#1a1a1a] text-center">
                <p className="text-[11px] text-[#3a3a3a]">
                  Osmania University Results Analytics Dashboard · Built by{" "}
                  <a href="https://AdnanTheCoder.com" target="_blank" rel="noreferrer"
                    className="text-cyan-700 hover:text-cyan-500 transition-colors font-medium">
                    Adnan (AdnanTheCoder.com)
                  </a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OsmaniaDashboard;