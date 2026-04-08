"use client";
import React, { useState, useEffect, useRef } from 'react';

type TerminalLine = {
  text: string;
  delay: number;
  color: string;
  type?: 'cmd' | 'output' | 'success' | 'info';
};

type WorkMetric = {
  label: string;
  value: string;
  sub: string;
  color: string;
  pulse: string;
};

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [tickUptime, setTickUptime] = useState(0);
  const [visibleMetrics, setVisibleMetrics] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // --- BUSINESS-FOCUSED terminal sequences ---
  const commandSets: TerminalLine[][] = [
    [
      { text: '$ deploy crm-system --client="RetailCo"', delay: 700, color: '#00e5ff', type: 'cmd' },
      { text: '  › Bundling 43 modules...', delay: 400, color: '#64748b', type: 'output' },
      { text: '  › Database migrations applied', delay: 350, color: '#64748b', type: 'output' },
      { text: '  ✓ CRM live at crm.retailco.com', delay: 300, color: '#00ff88', type: 'success' },
      { text: '  ✓ 12,000 contacts imported', delay: 250, color: '#00ff88', type: 'success' },
    ],
    [
      { text: '$ build mvp --scope="EdTech LMS"', delay: 700, color: '#00e5ff', type: 'cmd' },
      { text: '  › Course engine scaffolded', delay: 400, color: '#64748b', type: 'output' },
      { text: '  › Payment gateway integrated', delay: 350, color: '#64748b', type: 'output' },
      { text: '  ✓ MVP shipped in 18 days', delay: 300, color: '#00ff88', type: 'success' },
      { text: '  ✓ First 200 students enrolled', delay: 250, color: '#a78bfa', type: 'info' },
    ],
    [
      { text: '$ automate workflow --type="lead-pipeline"', delay: 700, color: '#00e5ff', type: 'cmd' },
      { text: '  › Webhook triggers configured', delay: 400, color: '#64748b', type: 'output' },
      { text: '  › CRM sync established', delay: 350, color: '#64748b', type: 'output' },
      { text: '  ✓ 6hrs/week saved for client', delay: 300, color: '#00ff88', type: 'success' },
      { text: '  ✓ Pipeline conversion +34%', delay: 250, color: '#a78bfa', type: 'info' },
    ],
    [
      { text: '$ brand design --client="FinanceStartup"', delay: 700, color: '#00e5ff', type: 'cmd' },
      { text: '  › Logo system generated', delay: 350, color: '#64748b', type: 'output' },
      { text: '  › Color palette & typography locked', delay: 300, color: '#64748b', type: 'output' },
      { text: '  ✓ Brand guide delivered', delay: 250, color: '#00ff88', type: 'success' },
    ],
  ];

  const workMetrics: WorkMetric[] = [
    { label: 'MVPs Shipped', value: '14+', sub: 'end-to-end builds', color: '#00e5ff', pulse: '#00e5ff' },
    { label: 'Businesses Served', value: '20+', sub: 'across industries', color: '#00ff88', pulse: '#00ff88' },
    { label: 'Automations Live', value: '1k+', sub: 'tasks automated/mo', color: '#a78bfa', pulse: '#a78bfa' },
    { label: 'Avg. Delivery', value: '18d', sub: 'concept to launch', color: '#fbbf24', pulse: '#fbbf24' },
  ];

  const offerings = [
    { icon: '⬡', label: 'End-to-End MVPs', desc: 'Full stack from zero to launch' },
    { icon: '⬡', label: 'CRM & LMS Systems', desc: 'Custom tools that replace off-shelf software' },
    { icon: '⬡', label: 'Business Automation', desc: 'Eliminate repetitive ops with code' },
    { icon: '⬡', label: 'Brand Identity', desc: 'Visual systems that mean business' },
  ];

  // Terminal animation
  useEffect(() => {
    let currentSet = 0;
    let currentLine = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const runNext = () => {
      const set = commandSets[currentSet];
      const line = set[currentLine];
      setTerminalLines(prev => [...prev, line].slice(-10));
      currentLine++;
      if (currentLine >= set.length) {
        currentLine = 0;
        currentSet = (currentSet + 1) % commandSets.length;
        timeout = setTimeout(runNext, 2200);
      } else {
        timeout = setTimeout(runNext, line.delay);
      }
    };
    runNext();
    return () => clearTimeout(timeout);
  }, []);

  // Uptime ticker
  useEffect(() => {
    const iv = setInterval(() => setTickUptime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  // Cursor blink
  useEffect(() => {
    const iv = setInterval(() => setCursorBlink(b => !b), 530);
    return () => clearInterval(iv);
  }, []);

  // Staggered metric reveal
  useEffect(() => {
    const t = setTimeout(() => setVisibleMetrics(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Glitch effect on name
  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 180);
    };
    const iv = setInterval(triggerGlitch, 4200);
    return () => clearInterval(iv);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.05,
      size: Math.random() * 1.2 + 0.4,
    }));

    let time = 0;
    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.045)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${p.alpha * 0.5})`;
        ctx.fill();
        particles.slice(i + 1).forEach(o => {
          const d = Math.hypot(p.x - o.x, p.y - o.y);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 80) * 0.04})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Horizontal scan lines - subtle
      const scanY = (time * 60) % canvas.height;
      const sg = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 2);
      sg.addColorStop(0, 'rgba(0,229,255,0)');
      sg.addColorStop(1, 'rgba(0,229,255,0.025)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 40, canvas.width, 42);

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

        .hero-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .hero-sub {
          font-family: 'Space Grotesk', sans-serif;
        }

        .glitch-wrap { position: relative; display: inline-block; }
        .glitch-wrap.active .glitch-main { opacity: 0; }
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
          opacity: 0;
        }
        .glitch-wrap.active::before {
          color: #00e5ff;
          opacity: 0.8;
          clip-path: polygon(0 20%, 100% 20%, 100% 45%, 0 45%);
          transform: translateX(-3px);
          animation: none;
        }
        .glitch-wrap.active::after {
          color: #ff00aa;
          opacity: 0.8;
          clip-path: polygon(0 55%, 100% 55%, 100% 80%, 0 80%);
          transform: translateX(3px);
          animation: none;
        }

        .cta-primary {
          position: relative;
          overflow: hidden;
          background: #00e5ff;
          color: #000;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          letter-spacing: 0.04em;
          transition: all 0.2s;
        }
        .cta-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .cta-primary:hover::after { transform: translateX(100%); }
        .cta-primary:hover { background: #33ecff; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,229,255,0.35); }

        .cta-secondary {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          border: 1px solid rgba(0,229,255,0.3);
          color: rgba(0,229,255,0.9);
          transition: all 0.2s;
          background: transparent;
        }
        .cta-secondary:hover {
          border-color: rgba(0,229,255,0.7);
          color: #fff;
          background: rgba(0,229,255,0.06);
          transform: translateY(-2px);
        }

        .metric-card {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.025);
          backdrop-filter: blur(8px);
          transition: all 0.3s;
        }
        .metric-card:hover {
          border-color: rgba(0,229,255,0.2);
          background: rgba(0,229,255,0.04);
        }

        .offering-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: all 0.2s;
        }
        .offering-row:hover {
          border-bottom-color: rgba(0,229,255,0.15);
          background: rgba(0,229,255,0.02);
        }
        .offering-row:last-child { border-bottom: none; }

        .terminal-box {
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(0,229,255,0.12);
          backdrop-filter: blur(12px);
        }

        .tag-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          border: 1px solid rgba(0,229,255,0.2);
          color: rgba(0,229,255,0.6);
          background: rgba(0,229,255,0.04);
          letter-spacing: 0.1em;
        }

        .status-dot {
          animation: statusPulse 2s ease-in-out infinite;
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,255,136,0.5); }
          50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(0,255,136,0); }
        }

        .fade-up {
          animation: fadeUp 0.6s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .corner-tl { border-top: 1.5px solid rgba(0,229,255,0.25); border-left: 1.5px solid rgba(0,229,255,0.25); }
        .corner-tr { border-top: 1.5px solid rgba(0,229,255,0.25); border-right: 1.5px solid rgba(0,229,255,0.25); }
        .corner-bl { border-bottom: 1.5px solid rgba(0,229,255,0.25); border-left: 1.5px solid rgba(0,229,255,0.25); }
        .corner-br { border-bottom: 1.5px solid rgba(0,229,255,0.25); border-right: 1.5px solid rgba(0,229,255,0.25); }

        @media (max-width: 1023px) {
          .hero-headline { font-size: clamp(2.8rem, 10vw, 5rem); }
        }
      `}</style>

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Radial vignette */}
      <div className="absolute inset-0 z-1" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Mouse glow */}
      <div
        className="fixed pointer-events-none z-10 hidden md:block"
        style={{
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)',
          transform: `translate(${mousePosition.x - 180}px, ${mousePosition.y - 180}px)`,
          transition: 'transform 0.12s linear',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-10 h-10 corner-tl z-40" />
      <div className="absolute top-0 right-0 w-10 h-10 corner-tr z-40" />
      <div className="absolute bottom-0 left-0 w-10 h-10 corner-bl z-40" />
      <div className="absolute bottom-0 right-0 w-10 h-10 corner-br z-40" />

      {/* STATUS BAR */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-2.5" style={{ borderBottom: '1px solid rgba(0,229,255,0.07)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-3">
          <div className="status-dot w-2 h-2 rounded-full" style={{ background: '#00ff88' }} />
          <span className="text-xs" style={{ color: 'rgba(0,229,255,0.5)', letterSpacing: '0.12em' }}>SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(100,116,139,0.8)', letterSpacing: '0.08em' }}>
          <span className="hidden sm:block">SESSION {formatUptime(tickUptime)}</span>
          <span>ADNAN.DEV</span>
        </div>
      </div>

      {/* ===================== MAIN LAYOUT ===================== */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center pt-12">

        {/* DESKTOP */}
        <div className="hidden lg:grid max-w-7xl mx-auto w-full px-10 gap-10" style={{ gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', minHeight: 'calc(100vh - 48px)' }}>

          {/* LEFT — Terminal work log */}
          <div className="flex flex-col gap-5">
            {/* Live badge */}
            <div className="flex items-center gap-2">
              <div className="status-dot w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88' }} />
              <span className="text-xs" style={{ color: 'rgba(0,229,255,0.45)', letterSpacing: '0.15em' }}>LIVE BUILD LOG</span>
            </div>

            {/* Terminal */}
            <div className="terminal-box rounded-lg p-4 space-y-1.5 min-h-48">
              {terminalLines.map((line, i) => (
                <div
                  key={i}
                  className="text-xs leading-relaxed fade-up"
                  style={{ color: line.color, opacity: 0.85 + (i / terminalLines.length) * 0.15 }}
                >
                  {line.text}
                </div>
              ))}
              <span className="text-xs" style={{ color: '#00e5ff', opacity: cursorBlink ? 0.9 : 0 }}>█</span>
            </div>

            {/* Offerings list */}
            <div className="space-y-0 mt-2">
              <div className="text-xs mb-3" style={{ color: 'rgba(0,229,255,0.35)', letterSpacing: '0.12em' }}>WHAT I BUILD</div>
              {offerings.map((o, i) => (
                <div key={i} className="offering-row flex items-start gap-3 py-2.5 px-1 cursor-default">
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: '#00e5ff', opacity: 0.5 }}>⬡</span>
                  <div>
                    <div className="text-xs hero-sub font-semibold" style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.02em' }}>{o.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.8)' }}>{o.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER — Main hero content */}
          <div className="flex flex-col items-center text-center px-6">

            {/* Eyebrow */}
            <div className="tag-badge px-3 py-1 rounded-full mb-8 fade-up">
              FULL STACK BUILDER · MVP → PRODUCTION
            </div>

            {/* Name */}
            <div className="mb-3">
              <div
                className={`glitch-wrap ${glitchActive ? 'active' : ''}`}
                data-text="ADNAN"
              >
                <h1
                  className="glitch-main hero-headline"
                  style={{
                    fontSize: 'clamp(4rem, 8vw, 7rem)',
                    color: '#ffffff',
                    lineHeight: 1,
                    textShadow: '0 0 60px rgba(0,229,255,0.15)',
                  }}
                >
                  ADNAN
                </h1>
              </div>
            </div>

            {/* Tagline */}
            <h2
              className="hero-sub font-semibold mb-5"
              style={{
                fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)',
                color: 'rgba(0,229,255,0.7)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              I Turn Business Pain Into Working Software
            </h2>

            {/* Value prop */}
            <p
              className="hero-sub mb-3 max-w-xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.75 }}
            >
              Full stack developer specialising in MVPs, CRMs, LMS platforms, automation systems — and the brand identity to match.
            </p>
            <p
              className="hero-sub mb-12 max-w-lg mx-auto font-semibold"
              style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: 1.7 }}
            >
              You describe the problem. I ship the solution.
            </p>

            {/* CTAs */}
            <div className="flex gap-4 mb-14">
              <button
                className="cta-primary px-9 py-3.5 rounded-lg text-sm"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See My Work →
              </button>
              <button
                className="cta-secondary px-9 py-3.5 rounded-lg text-sm"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start a Project
              </button>
            </div>

            {/* Metrics row */}
            <div
              className="grid grid-cols-4 gap-3 w-full max-w-xl"
              style={{ opacity: visibleMetrics ? 1 : 0, transition: 'opacity 0.8s ease' }}
            >
              {workMetrics.map((m, i) => (
                <div
                  key={i}
                  className="metric-card rounded-lg py-3 px-2 text-center"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="hero-sub font-bold mb-0.5"
                    style={{ fontSize: '1.4rem', color: m.color, lineHeight: 1 }}
                  >
                    {m.value}
                  </div>
                  <div className="text-xs font-semibold hero-sub" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(100,116,139,0.7)', letterSpacing: '0.05em' }}>{m.sub}</div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT — Availability & tech stack signal */}
          <div className="flex flex-col gap-5">

            {/* Availability card */}
            <div className="terminal-box rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="status-dot w-2 h-2 rounded-full" style={{ background: '#00ff88' }} />
                <span className="text-xs" style={{ color: '#00ff88', letterSpacing: '0.12em' }}>AVAILABLE FOR WORK</span>
              </div>
              <div className="space-y-2 text-xs" style={{ color: 'rgba(100,116,139,0.9)' }}>
                <div className="flex justify-between">
                  <span>Response time</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>&lt; 24h</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. delivery</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>14–21 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>UTC+5:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Current slot</span>
                  <span style={{ color: '#00ff88' }}>Open</span>
                </div>
              </div>
            </div>

            {/* Stack tags */}
            <div className="terminal-box rounded-lg p-4">
              <div className="text-xs mb-3" style={{ color: 'rgba(0,229,255,0.35)', letterSpacing: '0.12em' }}>TECH STACK</div>
              <div className="flex flex-wrap gap-1.5">
                {['Next.js','React','Node','TypeScript','PostgreSQL','Redis','Docker','Prisma','Stripe','Tailwind','AWS','Figma'].map(t => (
                  <span key={t} className="tag-badge px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </div>

            {/* Mini testimonial */}
            <div className="terminal-box rounded-lg p-4">
              <div className="text-xs mb-3" style={{ color: 'rgba(0,229,255,0.35)', letterSpacing: '0.12em' }}>CLIENT SIGNAL</div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                "Shipped our entire CRM + onboarding flow in 3 weeks. The system replaced three separate SaaS tools we were paying for."
              </p>
              <div className="mt-2 text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>— Founder, B2B SaaS</div>
            </div>

            {/* Direct link */}
            <button
              className="cta-primary w-full py-3 rounded-lg text-sm text-center"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book a Discovery Call
            </button>
          </div>

        </div>

        {/* =================== MOBILE =================== */}
        <div className="lg:hidden flex flex-col px-5 pt-8 pb-16 min-h-screen justify-center gap-6 max-w-lg mx-auto w-full">

          {/* Eyebrow */}
          <div className="tag-badge w-fit px-3 py-1 rounded-full fade-up">
            FULL STACK BUILDER · MVP → PRODUCTION
          </div>

          {/* Headline */}
          <div>
            <h1
              className="hero-headline mb-2"
              style={{ fontSize: 'clamp(3.2rem, 14vw, 5rem)', color: '#fff', lineHeight: 1, textShadow: '0 0 40px rgba(0,229,255,0.12)' }}
            >
              ADNAN
            </h1>
            <h2
              className="hero-sub font-semibold"
              style={{ fontSize: '0.8rem', color: 'rgba(0,229,255,0.65)', letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              I Turn Business Pain Into Working Software
            </h2>
          </div>

          <p className="hero-sub text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            MVPs, CRMs, LMS platforms, automation systems — and the brand identity to match. You describe the problem. I ship the solution.
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            {workMetrics.map((m, i) => (
              <div key={i} className="metric-card rounded-lg py-3 px-3">
                <div className="hero-sub font-bold" style={{ fontSize: '1.5rem', color: m.color, lineHeight: 1 }}>{m.value}</div>
                <div className="text-xs hero-sub font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{m.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(100,116,139,0.6)' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            <button
              className="cta-primary w-full py-3.5 rounded-lg text-sm"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See My Work →
            </button>
            <button
              className="cta-secondary w-full py-3.5 rounded-lg text-sm"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book a Discovery Call
            </button>
          </div>

          {/* Availability + terminal — compact */}
          <div className="terminal-box rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="status-dot w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88' }} />
                <span className="text-xs" style={{ color: '#00ff88', letterSpacing: '0.1em' }}>AVAILABLE NOW</span>
              </div>
              <span className="text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>UTC+5:30</span>
            </div>
            <div className="space-y-1">
              {terminalLines.slice(-4).map((line, i) => (
                <div key={i} className="text-xs leading-relaxed" style={{ color: line.color, opacity: 0.75 }}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5">
            {['Next.js','React','Node.js','TypeScript','PostgreSQL','Docker','Stripe','AWS'].map(t => (
              <span key={t} className="tag-badge px-2 py-0.5 rounded">{t}</span>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Hero;