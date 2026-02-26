"use client";
import React, { useState } from "react";
import OverviewTab from "@/components/OverviewTab";
import ClasswiseTab from "@/components/ClasswiseTab";
import SubjectwiseTab from "@/components/SubjectwiseTab";
import PasspercentTab from "@/components/PasspercentTab";
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
  // Filters are now static
  const selectedSem = "Semester 3";
  const selectedYear = "February-2026";
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

        {/* Sidebar Info Card (visually enhanced) */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="relative bg-gradient-to-br from-[#0f3443] via-[#34e89e]/30 to-[#43cea2]/20 border border-cyan-700/30 rounded-2xl p-7 flex flex-col items-center justify-center shadow-xl overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="160" cy="20" rx="60" ry="18" fill="#06b6d4" fillOpacity="0.08" />
                <ellipse cx="40" cy="80" rx="50" ry="14" fill="#10b981" fillOpacity="0.07" />
              </svg>
            </div>
            <div className="relative flex flex-col items-center gap-2 z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-900/30 border border-cyan-700/30 mb-1 shadow-md">
                <GraduationCap size={28} className="text-cyan-300 drop-shadow" />
              </div>
              <span className="text-xl font-extrabold text-cyan-200 tracking-tight drop-shadow-sm text-center">Feb 24 Result Analysis</span>
            </div>
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
                    {selectedYear} · Osmania University
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


              {/* Tab Content Components */}
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "classwise" && <ClasswiseTab />}
              {activeTab === "subjectwise" && <SubjectwiseTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
              {activeTab === "passpercent" && <PasspercentTab />}

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