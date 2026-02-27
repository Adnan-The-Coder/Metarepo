"use client";
import React, { useState } from "react";
import OverviewTab from "@/components/OverviewTab";
import ClasswiseTab from "@/components/ClasswiseTab";
import SubjectwiseTab from "@/components/SubjectwiseTab";
import PasspercentTab from "@/components/PasspercentTab";
import ECEAnalysisTab from "@/components/ECE-dept-analysis";
import { useOUResults } from "@/lib";
import {
  GraduationCap,
  BarChart3,
  BookOpen,
  Users,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
  Download,
  FileDown,
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
type Tab = "overview" | "classwise" | "subjectwise" | "passpercent" | "ece";

// ─── CSV Export Function ─────────────────────────────────────────────────────
const exportToCSV = (students: { rollnumber: string; name: string; subjects: { code: string; name: string; grade: string; credits: number }[]; semesterResults: { semester: number; result: string; sgpa: number | null }[] }[], filename: string, semester = 3) => {
  if (!students.length) return;
  
  // Get all unique subject codes for column headers
  const allSubjectCodes = new Set<string>();
  students.forEach(s => s.subjects.forEach(sub => allSubjectCodes.add(sub.code)));
  const subjectCodes = Array.from(allSubjectCodes).sort();
  
  // Build CSV content with individual subject columns
  const headers = ["Roll Number", "Name", "Result", "SGPA", "Total Credits", ...subjectCodes];
  const rows = students.map(s => {
    const subjectGradeMap = new Map(s.subjects.map(sub => [sub.code, sub.grade]));
    const totalCredits = s.subjects.reduce((sum, sub) => sum + sub.credits, 0);
    const subjectGrades = subjectCodes.map(code => subjectGradeMap.get(code) || "-");
    
    // Get semester result
    const semResult = s.semesterResults.find(sr => sr.semester === semester);
    const result = semResult?.result || "-";
    const sgpa = semResult?.sgpa?.toFixed(2) || "-";
    
    return [
      s.rollnumber,
      `"${s.name.replace(/"/g, '""')}"`, // Properly escape names with quotes
      result,
      sgpa,
      totalCredits.toString(),
      ...subjectGrades
    ].join(",");
  });
  
  const csvContent = [headers.join(","), ...rows].join("\n");
  
  // Add BOM for Excel UTF-8 compatibility
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ─── PDF Print Function ──────────────────────────────────────────────────────
const handlePrintPDF = () => {
  // Small delay to ensure print styles take effect
  setTimeout(() => {
    window.print();
  }, 100);
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
  
  // Use the OU Results hook for live data
  const {
    students,
    semesterAnalytics,
    selectedSemester,
    isLoading,
    loadingProgress,
    error,
    refetch,
  } = useOUResults();
  
  // Computed values
  const selectedSem = `Semester ${selectedSemester}`;
  const selectedYear = "February-2026";

  const closeSidebar = () => setIsSidebarOpen(false);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "classwise", label: "Class Wise", icon: Users },
    { key: "subjectwise", label: "Subject Wise", icon: BookOpen },
    { key: "passpercent", label: "Pass Percent", icon: TrendingUp },
    { key: "ece", label: "ECE Dept", icon: GraduationCap },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Scrollbar & Print Styles */}
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
        
        @media print {
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            color-adjust: exact !important;
          }
          
          html, body { 
            height: auto !important;
            overflow: visible !important;
            background: #fff !important;
          }
          
          /* Hide non-essential */
          aside, .lg\\:hidden, button, .mobile-header { 
            display: none !important; 
          }
          
          /* Main container */
          .flex.h-screen {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          main, .main-scroll, .flex-1 {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
            position: static !important;
          }
          
          .main-scroll {
            border: none !important;
            border-radius: 0 !important;
          }
          
          /* Convert dark to light theme */
          .bg-\\[\\#0a0a0a\\], .bg-\\[\\#111111\\], .bg-\\[\\#161616\\], .bg-\\[\\#1a1a1a\\], .bg-\\[\\#1f1f1f\\], .bg-\\[\\#1c2333\\] {
            background: #ffffff !important;
            border: 1px solid #e5e7eb !important;
          }
          
          /* Text colors for print */
          .text-white { color: #111827 !important; }
          .text-\\[\\#8b8b8b\\], .text-\\[\\#6b6b6b\\], .text-\\[\\#4b4b4b\\], .text-\\[\\#3a3a3a\\] { color: #6b7280 !important; }
          
          /* Colored text - keep but ensure visible */
          .text-cyan-400, .text-cyan-300, .text-cyan-200 { color: #0891b2 !important; }
          .text-emerald-400, .text-emerald-300 { color: #059669 !important; }
          .text-amber-400, .text-amber-300 { color: #d97706 !important; }
          .text-rose-400, .text-rose-300 { color: #e11d48 !important; }
          .text-purple-400 { color: #9333ea !important; }
          .text-blue-400 { color: #2563eb !important; }
          
          /* Keep gradient backgrounds as solid colors */
          [class*="bg-gradient-to"] {
            background: #f3f4f6 !important;
          }
          
          /* Tables */
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          
          /* Cards don't break */
          .rounded-xl, .rounded-2xl {
            page-break-inside: avoid;
            margin-bottom: 8px !important;
          }
          
          /* Borders visible */
          .border, [class*="border-"] {
            border-color: #e5e7eb !important;
          }
          
          /* SVG Charts */
          svg { max-width: 100%; height: auto; }
          svg text { fill: #374151 !important; }
          svg circle, svg rect, svg path { 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Page setup */
          @page { 
            margin: 0.75cm; 
            size: A4 portrait; 
          }
          
          /* Print header */
          .print-header {
            display: block !important;
            text-align: center;
            padding: 16px 0;
            border-bottom: 2px solid #0891b2;
            margin-bottom: 20px;
          }
          
          /* Footer hide */
          .mt-12.pt-6 { display: none !important; }
        }
        
        .print-header { display: none; }
      `}</style>

      {/* Print Header - Only shows when printing */}
      <div className="print-header">
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          Osmania University Results Analytics
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
          {selectedYear} · Semester {selectedSemester} · {tabs.find(t => t.key === activeTab)?.label}
        </p>
      </div>

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
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">

              {/* Breadcrumb - Hidden on small mobile, shown from sm: */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-[#6b6b6b] mb-6 overflow-x-auto">
                <span className="whitespace-nowrap">Osmania University</span>
                <ChevronRight size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Results Analytics</span>
                <ChevronRight size={14} className="flex-shrink-0" />
                <span className="text-white capitalize whitespace-nowrap">
                  {tabs.find(t => t.key === activeTab)?.label}
                </span>
              </div>

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {tabs.find(t => t.key === activeTab)?.label}
                  </h1>
                  <p className="text-[#6b6b6b] text-xs sm:text-sm mt-1">
                    {selectedYear} · Osmania University
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => exportToCSV(students, `OU_Results_Sem${selectedSemester}_${selectedYear}_${activeTab}.csv`, selectedSemester)}
                    disabled={isLoading || students.length === 0}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 bg-[#161616] border border-[#222222] rounded-lg text-[#8b8b8b] hover:text-white hover:border-[#333] text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileDown size={14} />
                    <span className="hidden xs:inline">CSV</span>
                  </button>
                  <button 
                    onClick={handlePrintPDF}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 bg-[#161616] border border-[#222222] rounded-lg text-[#8b8b8b] hover:text-white hover:border-[#333] text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={14} />
                    <span className="hidden xs:inline">PDF</span>
                  </button>
                </div>
              </div>


              {/* Tab Content Components */}
              {activeTab === "overview" && (
                <OverviewTab
                  analytics={semesterAnalytics}
                  isLoading={isLoading}
                  loadingProgress={loadingProgress}
                  error={error}
                  selectedSemester={selectedSemester}
                  onRefresh={refetch}
                />
              )}
              {activeTab === "classwise" && (
                <ClasswiseTab
                  students={students}
                  subjects={semesterAnalytics?.subjects || []}
                  isLoading={isLoading}
                  loadingProgress={loadingProgress}
                  error={error}
                  onRefresh={refetch}
                />
              )}
              {activeTab === "subjectwise" && (
                <SubjectwiseTab
                  subjects={semesterAnalytics?.subjects || []}
                  gradeBreakdown={semesterAnalytics?.subjectGradeBreakdown || []}
                  isLoading={isLoading}
                  loadingProgress={loadingProgress}
                  error={error}
                  onRefresh={refetch}
                />
              )}
              {activeTab === "passpercent" && (
                <PasspercentTab
                  students={students}
                  subjects={semesterAnalytics?.subjects || []}
                  overviewStats={semesterAnalytics?.overviewStats || null}
                  isLoading={isLoading}
                  loadingProgress={loadingProgress}
                  error={error}
                  onRefresh={refetch}
                />
              )}
              {activeTab === "ece" && (
                <ECEAnalysisTab />
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