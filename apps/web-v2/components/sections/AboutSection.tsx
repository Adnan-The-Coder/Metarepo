"use client";

import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { useMemo } from "react";
import availabilityData from "@/data/availability.json";

/* ─── Badge ─────────────────────────────────────────────── */
function Badge({
  children,
  dot,
}: {
  children: React.ReactNode;
  dot?: "green" | "amber";
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dot === "green"
              ? "bg-emerald-400 animate-pulse"
              : "bg-amber-400 animate-pulse"
          }`}
        />
      )}
      {children}
    </span>
  );
}

/* ─── Spec tag ───────────────────────────────────────────── */
function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[3px] border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-white/35 tracking-wide hover:border-cyan-500/20 hover:text-white/55 transition-colors cursor-default">
      {label}
    </span>
  );
}

/* ─── Profile row ────────────────────────────────────────── */
function ProfileRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[10px] uppercase tracking-[0.14em] text-white/25 font-medium shrink-0">
        {label}
      </span>
      <span
        className={`text-xs font-semibold ${
          highlight ? "text-emerald-400" : "text-white/60"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Stat cell ──────────────────────────────────────────── */
function Stat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="group flex flex-col gap-1.5 px-4 py-4 sm:px-5 sm:py-5 border-r border-white/[0.05] last:border-r-0">
      <span
        className={`font-mono text-2xl sm:text-[2rem] font-bold leading-none tracking-tight transition-colors ${
          accent
            ? "text-amber-400 group-hover:text-amber-300"
            : "text-white group-hover:text-cyan-300"
        }`}
      >
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[0.14em] text-white/28 font-medium leading-tight">
        {label}
      </span>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function AboutSection() {
  const yearsExp = useMemo(() => {
    const start = new Date("2021-01-01");
    const now = new Date();
    let y = now.getFullYear() - start.getFullYear();
    const m = now.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < start.getDate())) y--;
    return y;
  }, []);

  const availability = useMemo(() => {
    try {
      const groups = Object.values(availabilityData).flat();
      if (!groups.length) return "1 Slot Open";
      const w = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
      return groups[w % groups.length] as string;
    } catch {
      return "1 Slot Open";
    }
  }, []);

  return (
    <Section id="about" title="">
      <div className="relative px-4 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-hidden">

        {/* Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        {/* Vignette — fades grid into edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 70% at 50% 40%, transparent 35%, var(--background, #09090b) 100%)",
          }}
        />
        {/* Glows */}
        <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-cyan-500/[0.055] blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full bg-amber-500/[0.04] blur-[80px]" />

        {/* ── Main content ── */}
        <div className="relative max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8">

          {/* ══ ROW 1: Badges ══ */}
          <div className="flex flex-wrap gap-2">
            <Badge dot="green">Available for work</Badge>
            <Badge>Backend Architect</Badge>
            <Badge>Remote · Global</Badge>
          </div>

          {/* ══ ROW 2: Headline + Card side by side (desktop) ══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 lg:gap-8 items-start">

            {/* Left col — headline, subtext, CTAs, tags */}
            <div className="flex flex-col gap-5">
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[2.8rem] font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_2px_20px_rgba(6,182,212,0.12)]">
                The backend that{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  holds when everything else breaks.
                </span>
              </h2>

              <p className="text-[0.9rem] sm:text-[0.95rem] text-white/45 leading-[1.8] max-w-lg">
                Production-grade systems for founders and engineering leads who
                can't afford downtime — adapting to the problem, not the other
                way around.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-[3px] bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-[0_0_22px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:from-cyan-300 hover:to-emerald-300 transition-all duration-200"
                >
                  Book a 15-min call
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center rounded-[3px] border border-white/[0.09] px-5 py-2.5 text-sm font-semibold text-white/50 hover:bg-white/[0.04] hover:text-white/75 transition-all duration-200"
                >
                  View Resume
                </a>
              </div>

              {/* Spec tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Distributed Systems",
                  "Microservices",
                  "Event-Driven Design",
                  "Kubernetes",
                  "Observability",
                  "API Design",
                  "System Reliability",
                ].map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            </div>

            {/* Right col — scarcity pill + profile card */}
            <div className="flex flex-col gap-3">
              {/* Scarcity pill */}
              <div className="flex items-center gap-2 self-start rounded-[3px] border border-amber-500/20 bg-amber-500/[0.05] px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                <span className="font-mono text-[11px] font-bold text-amber-300 tracking-wide">
                  {availability}
                </span>
              </div>

              {/* Profile card */}
              <Card className="overflow-hidden border-white/[0.07] bg-white/[0.025] rounded-[4px] shadow-[0_8px_28px_rgba(0,0,0,0.35)]">
                <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                <div className="p-4">
                  <ProfileRow label="Location"   value="Remote / Global" />
                  <ProfileRow label="Status"     value="Available" highlight />
                  <ProfileRow label="Experience" value={`${yearsExp}+ years`} />
                  <ProfileRow label="Focus"      value="Backend Systems" />
                </div>
              </Card>
            </div>
          </div>

          {/* ══ ROW 3: Stats bar ══ */}
          <div className="rounded-[3px] border border-white/[0.06] bg-white/[0.015] shadow-[0_4px_20px_rgba(0,0,0,0.28)] overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4">
              <Stat value={`${yearsExp}+`} label="Years Experience" />
              <Stat value="30+"           label="Services Deployed" accent />
              <Stat value="99.9%"         label="Uptime SLA" />
              <Stat value="12+"           label="Products Scaled" accent />
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
}