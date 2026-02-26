"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  BarChart3, BookOpen, Users, TrendingUp, ArrowRight,
  GraduationCap, CheckCircle2, Award, ChevronRight, ExternalLink,
  Code, Database, Cpu, AlertCircle,
} from "lucide-react";

// ── Animated Counter ──────────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function Stat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
        {count.toLocaleString()}<span className="text-cyan-400">{suffix}</span>
      </p>
      <p className="text-xs text-zinc-500 mt-1 tracking-wide">{label}</p>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function Card({ icon: Icon, title, desc, color }: {
  icon: React.ElementType; title: string; desc: string; color: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-zinc-600 transition-all duration-300 hover:-translate-y-0.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={18} />
      </div>
      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ── Semester 3 Subject List ───────────────────────────────────────────────────
const SEMESTER_3_SUBJECTS = [
  { code: "301E", name: "OOP Using Java", isLab: false },
  { code: "301F", name: "OOP Using Java Lab", isLab: true },
  { code: "302P", name: "Applied Operations Research", isLab: false },
  { code: "316", name: "Basic Electronics", isLab: false },
  { code: "391", name: "Effective Tech. Comm.", isLab: false },
  { code: "318", name: "Discrete Mathematics", isLab: false },
  { code: "319", name: "Logic & Switching Theory", isLab: false },
  { code: "367", name: "Basic Electronics Lab", isLab: true },
  { code: "371", name: "Data Structures Lab", isLab: true },
  { code: "317", name: "Data Structures", isLab: false },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 flex items-center border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="w-full max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
              <GraduationCap size={14} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none tracking-tight">OU Results</p>
              <p className="text-[10px] text-zinc-600 leading-none mt-0.5">CSE Sem-3 · Feb 2026</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {["Overview", "Divisions", "Subjects", "Leaderboard"].map(l => (
              <a key={l} href="#" className="text-xs text-zinc-500 hover:text-white transition-colors tracking-wide">{l}</a>
            ))}
          </nav>

          <a href="/dashboard" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors">
            Dashboard <ArrowRight size={12} />
          </a>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center min-h-screen pt-14 overflow-hidden">

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(#52525b 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        {/* Soft glow blobs */}
        <div className="absolute top-0 left-0 w-[480px] h-[480px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-teal-500/8 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-center">

            {/* Left — copy */}
            <div>
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-400 text-xs tracking-wide">B.E. Computer Science · Semester 3</span>
              </div>

              {/* Headline — simple, clean, no font tricks */}
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
                <span className="text-white">CSE Results</span>
                <br />
                <span className="text-cyan-400">Feb 2026.</span>
              </h1>

              <p className="text-zinc-400 text-base leading-relaxed max-w-md mb-8">
                Complete analytics for Osmania University CSE Semester 3 results —
                division-wise leaderboards, subject pass rates, grade distributions, 
                and individual student performance.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <a href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  View Dashboard <ArrowRight size={14} />
                </a>
                <a href="#features" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium transition-all">
                  Learn More
                </a>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-zinc-800">
                {[
                  { n: "481", l: "Students" },
                  { n: "8", l: "Divisions" },
                  { n: "10", l: "Subjects" },
                  { n: "60", l: "Per Division" },
                ].map(s => (
                  <div key={s.l}>
                    <p className="text-lg font-bold text-white">{s.n}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating preview card */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs text-zinc-500 font-medium">Sem 3 · Feb 2026</span>
                  <span className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Data
                  </span>
                </div>

                {[
                  { label: "317 - Data Structures", pct: 82, color: "#10b981" },
                  { label: "318 - Discrete Math", pct: 89, color: "#06b6d4" },
                  { label: "301E - OOP Java",      pct: 73, color: "#f59e0b" },
                  { label: "316 - Basic Electronics", pct: 71, color: "#ef4444" },
                ].map(row => (
                  <div key={row.label} className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-zinc-400">{row.label}</span>
                      <span className="text-xs font-bold" style={{ color: row.color }}>{row.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                    </div>
                  </div>
                ))}

                <div className="mt-5 pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs text-zinc-600">Subject Pass Rates</span>
                  <a href="/dashboard" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    View All <ChevronRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      <section className="border-y border-zinc-800 bg-zinc-900/40 py-14">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value={481} label="Students Tracked" />
          <Stat value={417} label="S Grades (90%+)" />
          <Stat value={750} label="F Grades (Backlogs)" />
          <Stat value={10} label="Core Subjects" />
        </div>
      </section>

      {/* ── DIVISIONS ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-500 mb-2">8 Divisions</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">CSE Class Structure</h2>
            <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
              481 students divided into 8 divisions, 60 students each.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {["A", "B", "C", "D", "E", "F", "G", "H"].map((div, i) => {
              const start = 1 + i * 60;
              const end = start + 59;
              return (
                <div key={div} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center hover:border-cyan-500/30 transition-colors">
                  <p className="text-2xl font-bold text-cyan-400 mb-1">{div}</p>
                  <p className="text-[10px] text-zinc-600 font-mono">
                    {String(start).padStart(3, "0")}-{String(end).padStart(3, "0")}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="text-center text-zinc-600 text-xs mt-6">
            Roll Numbers: <span className="text-zinc-400 font-mono">160424733001</span> to <span className="text-zinc-400 font-mono">160424733480</span>
          </p>
        </div>
      </section>

      {/* ── SUBJECTS ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500 mb-2">Semester 3 Curriculum</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">10 Core Subjects</h2>
            <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
              7 Theory subjects + 3 Lab practicals for CSE Semester 3
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {SEMESTER_3_SUBJECTS.map(sub => (
              <div key={sub.code} className={`rounded-xl border p-4 ${
                sub.isLab 
                  ? "border-amber-500/30 bg-amber-500/5" 
                  : "border-zinc-800 bg-zinc-900/60"
              } hover:border-zinc-600 transition-colors`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${sub.isLab ? "text-amber-400" : "text-cyan-400"}`}>
                    {sub.code}
                  </span>
                  {sub.isLab && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">LAB</span>
                  )}
                </div>
                <p className="text-white text-sm font-medium">{sub.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 border-y border-zinc-800 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-500 mb-2">Dashboard Features</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Four powerful views</h2>
            <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
              Every angle of Semester 3 results in one clean dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card icon={BarChart3}  title="Overview"     color="bg-cyan-500/15 text-cyan-400"    desc="Total students, pass %, promoted count, distinctions, subject-wise grade breakdown." />
            <Card icon={Users}      title="Division Wise"   color="bg-emerald-500/15 text-emerald-400" desc="Filter by Division A-H. Leaderboard sorted by SGPA with expandable student details." />
            <Card icon={BookOpen}   title="Subject Wise" color="bg-amber-500/15 text-amber-400"  desc="Per-subject S/A/B/C/D/E/F grade counts. Pass rates for all 10 subjects." />
            <Card icon={TrendingUp} title="Pass Analysis" color="bg-violet-500/15 text-violet-400" desc="Passed vs Promoted breakdown. Students with backlogs vs clear passes." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-500 mb-2">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Three simple steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Select Division",  d: "Choose from Division A through H using the filter buttons.",              c: "text-cyan-400",    b: "border-cyan-500/20", icon: Users },
              { n: "02", t: "View Leaderboard",    d: "See students ranked by SGPA. Click any student to expand their full subject-wise results.",        c: "text-emerald-400", b: "border-emerald-500/20", icon: Award },
              { n: "03", t: "Analyze Subjects", d: "Check pass rates and grade distribution for each of the 10 Semester 3 subjects.",                    c: "text-amber-400",   b: "border-amber-500/20", icon: BookOpen },
            ].map(s => (
              <div key={s.n} className={`rounded-2xl border ${s.b} bg-zinc-900/60 p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-800`}>
                    <s.icon size={18} className={s.c} />
                  </div>
                  <p className={`text-2xl font-black ${s.c} opacity-60 tracking-tight`}>{s.n}</p>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{s.t}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRADE LEGEND ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-zinc-800 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-500 mb-2">Grading System</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">OU Grade Scale</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { grade: "S", range: "90-100%", color: "#06b6d4", desc: "Outstanding" },
              { grade: "A", range: "80-89%", color: "#10b981", desc: "Excellent" },
              { grade: "B", range: "70-79%", color: "#84cc16", desc: "Good" },
              { grade: "C", range: "60-69%", color: "#f59e0b", desc: "Average" },
              { grade: "D", range: "50-59%", color: "#f97316", desc: "Below Avg" },
              { grade: "E", range: "40-49%", color: "#ef4444", desc: "Poor" },
              { grade: "F", range: "<40%", color: "#6b7280", desc: "Fail" },
            ].map(g => (
              <div key={g.grade} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
                <p className="text-3xl font-bold mb-1" style={{ color: g.color }}>{g.grade}</p>
                <p className="text-[10px] text-zinc-500 font-mono">{g.range}</p>
                <p className="text-xs text-zinc-600 mt-1">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-500 mb-4">Why use this</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-5">
              For CSE students,<br />faculty & parents.
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Find your rank in the division, check which subjects have the lowest pass rates,
              and see detailed grade breakdowns — all from official OU results data.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              "Division-wise student leaderboards by SGPA",
              "Expandable rows showing all subject grades",
              "Grade distribution table for each subject",
              "Pass vs Promoted vs Failed categorization",
              "Labs and theory subjects highlighted",
              "Real data from official OU results API",
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 p-10 text-center overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-4">
                <Cpu size={14} className="text-cyan-400" />
                <span className="text-cyan-400 text-xs font-semibold">CSE Semester 3 · Feb 2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Ready to check results?</h2>
              <p className="text-zinc-500 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
                No sign-up needed. Open the dashboard and explore your division's results now.
              </p>
              <a href="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all hover:shadow-[0_0_24px_rgba(6,182,212,0.35)]">
                Open Dashboard <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
              <GraduationCap size={12} className="text-cyan-400" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">OU Results · CSE Sem-3</span>
          </div>

          <p className="text-[11px] text-zinc-700 text-center">
            Osmania University · Hyderabad &nbsp;·&nbsp; Built by{" "}
            <a href="https://AdnanTheCoder.com" target="_blank" rel="noreferrer"
              className="text-zinc-500 hover:text-cyan-400 transition-colors font-medium">
              Adnan (AdnanTheCoder.com)
            </a>
          </p>

          <div className="flex items-center gap-4 text-[11px] text-zinc-700">
            <a href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
              Dashboard <ExternalLink size={9} />
            </a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </footer>

    </div>
  );
}