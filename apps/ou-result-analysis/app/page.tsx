"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  BarChart3, BookOpen, Users, TrendingUp, ArrowRight,
  GraduationCap, CheckCircle2, Award, ChevronRight, ExternalLink,
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
              <p className="text-[10px] text-zinc-600 leading-none mt-0.5">Osmania University</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {["Overview", "Analytics", "Results", "About"].map(l => (
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
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-zinc-400 text-xs tracking-wide">Osmania University · Hyderabad</span>
              </div>

              {/* Headline — simple, clean, no font tricks */}
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
                <span className="text-white">Semester Results,</span>
                <br />
                <span className="text-cyan-400">Decoded.</span>
              </h1>

              <p className="text-zinc-400 text-base leading-relaxed max-w-md mb-8">
                Analytics on Osmania University exam outcomes — pass rates,
                grade distributions, and department performance across every semester.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <a href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  Explore Dashboard <ArrowRight size={14} />
                </a>
                <a href="#features" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium transition-all">
                  Learn More
                </a>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-zinc-800">
                {[
                  { n: "32", l: "Departments" },
                  { n: "24K+", l: "Students" },
                  { n: "6", l: "Semesters" },
                  { n: "3 yrs", l: "of Data" },
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
                  <span className="text-xs text-zinc-500 font-medium">Sem 3 · 2023–24</span>
                  <span className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>

                {[
                  { label: "B.E. Computer Sci.", pct: 77, color: "#06b6d4" },
                  { label: "B.Sc. Mathematics",  pct: 78, color: "#10b981" },
                  { label: "B.E. Civil",         pct: 66, color: "#f59e0b" },
                  { label: "B.Com General",      pct: 73, color: "#8b5cf6" },
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
                  <span className="text-xs text-zinc-600">Overall avg</span>
                  <span className="text-sm font-bold text-cyan-400">73.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      <section className="border-y border-zinc-800 bg-zinc-900/40 py-14">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value={24180} label="Students Tracked" />
          <Stat value={71} suffix="%" label="Overall Pass Rate" />
          <Stat value={3241} label="Distinctions" />
          <Stat value={32} label="Departments" />
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-500 mb-2">What's inside</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Four views. Full picture.</h2>
            <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
              Every angle of semester results in one clean dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card icon={BarChart3}  title="Overview"     color="bg-cyan-500/15 text-cyan-400"    desc="Pass rates, grade distribution, and year-over-year performance trends at a glance." />
            <Card icon={Users}      title="Class Wise"   color="bg-emerald-500/15 text-emerald-400" desc="Compare departments by pass rate, distinctions, and backlogs." />
            <Card icon={BookOpen}   title="Subject Wise" color="bg-amber-500/15 text-amber-400"  desc="Per-subject pass %, average scores, and difficulty ratings." />
            <Card icon={TrendingUp} title="Pass Percent" color="bg-violet-500/15 text-violet-400" desc="Multi-year trend charts showing how results shift each semester." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-zinc-800 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500 mb-2">Simple to use</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Three steps, that's it</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Select Semester",  d: "Pick the academic year and semester from the sidebar filters.",              c: "text-cyan-400",    b: "border-cyan-500/20" },
              { n: "02", t: "Choose a View",    d: "Switch between Overview, Class Wise, Subject Wise, or Pass % tabs.",        c: "text-emerald-400", b: "border-emerald-500/20" },
              { n: "03", t: "Analyse & Export", d: "Explore charts and tables. Export any view as a report.",                    c: "text-amber-400",   b: "border-amber-500/20" },
            ].map(s => (
              <div key={s.n} className={`rounded-2xl border ${s.b} bg-zinc-900/60 p-6`}>
                <p className={`text-3xl font-black mb-3 ${s.c} opacity-40 tracking-tight`}>{s.n}</p>
                <h3 className="text-white font-semibold text-sm mb-2">{s.t}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-500 mb-4">Why use this</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-5">
              For students, faculty<br />and researchers.
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Track your batch's results, review subject outcomes, or study
              multi-year trends in Osmania University examinations — all in one place.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              "Grade distribution charts for every semester",
              "Year-over-year pass percentage comparison",
              "Subject-wise breakdown with difficulty ratings",
              "Department-level performance ranking",
              "Export-ready data for reports",
              "Fully mobile responsive",
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={15} className="text-cyan-500 flex-shrink-0 mt-0.5" />
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
                <Award size={14} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold">Free & Open Access</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Ready to explore?</h2>
              <p className="text-zinc-500 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
                No sign-up needed. Open the dashboard and start exploring semester results now.
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
            <span className="text-xs font-bold text-white tracking-tight">OU Results Tracker</span>
          </div>

          <p className="text-[11px] text-zinc-700 text-center">
            Osmania University · Hyderabad &nbsp;·&nbsp; Built by{" "}
            <a href="https://AdnanTheCoder.com" target="_blank" rel="noreferrer"
              className="text-zinc-500 hover:text-cyan-400 transition-colors font-medium">
              Adnan (AdnanTheCoder.com)
            </a>
          </p>

          <div className="flex items-center gap-4 text-[11px] text-zinc-700">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              Dashboard <ExternalLink size={9} />
            </a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </footer>

    </div>
  );
}