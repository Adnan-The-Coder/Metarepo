"use client";

import React, { useEffect, useRef, useState } from "react";

const testimonials = [
  { id: 1, quote: "What a fantastic AI ProActiv AI is, I just love it. It has completely transformed the way I approach problems and develop solutions.", name: "Manu Arora", title: "Tech Innovator & Entrepreneur", avatar: "MA", color: "#6366f1" },
  { id: 2, quote: "I made a soap with the help of AI, it was so easy to use. Truly remarkable how intuitive the entire process was.", name: "Tyler Durden", title: "Creative Director & Business Owner", avatar: "TD", color: "#ec4899" },
  { id: 3, quote: "This AI has transformed the way I work! It's like having a brilliant assistant who knows exactly what I need before I even ask!", name: "Alice Johnson", title: "Senior Software Engineer", avatar: "AJ", color: "#14b8a6" },
  { id: 4, quote: "The depth of understanding this AI demonstrates is simply astonishing. Every interaction feels purposeful and precise.", name: "Marco Rivera", title: "Product Lead", avatar: "MR", color: "#f59e0b" },
  { id: 5, quote: "I've tried dozens of AI tools. None come close to this level of sophistication. It's not just smart — it's wise.", name: "Priya Nair", title: "Data Scientist", avatar: "PN", color: "#8b5cf6" },
];

const testimonials2 = [
  { id: 6, quote: "Absolutely revolutionary, a game-changer for our industry. We've cut delivery time by 40% since adopting it.", name: "Bob Smith", title: "Industry Analyst", avatar: "BS", color: "#10b981" },
  { id: 7, quote: "I can't imagine going back to how things were before this AI. It's become the backbone of our entire workflow.", name: "Cathy Lee", title: "Product Manager", avatar: "CL", color: "#f43f5e" },
  { id: 8, quote: "It's like having a superpower! This AI tool has given us the ability to do things we never thought were possible in our field.", name: "David Wright", title: "Research Scientist", avatar: "DW", color: "#0ea5e9" },
  { id: 9, quote: "Seamlessly integrates into everything we do. The ROI within the first month alone was enough to justify the switch.", name: "Sofia Mendez", title: "Operations Lead", avatar: "SM", color: "#a855f7" },
  { id: 10, quote: "Our clients noticed the difference immediately. Quality went up, turnaround went down. That's all we ever wanted.", name: "James Park", title: "Agency Director", avatar: "JP", color: "#fb923c" },
];

const testimonials3 = [
  { id: 11, quote: "The efficiency it brings is unmatched. It's a vital tool that has helped us cut costs and improve our end product significantly.", name: "Eva Green", title: "Operations Director", avatar: "EG", color: "#22d3ee" },
  { id: 12, quote: "A robust solution that fits perfectly into our workflow. It has enhanced our team's capabilities and allowed us to tackle more complex projects.", name: "Frank Moore", title: "Project Manager", avatar: "FM", color: "#84cc16" },
  { id: 13, quote: "It's incredibly intuitive and easy to use. Even those without technical expertise can leverage its power to improve their workflows.", name: "Grace Hall", title: "Marketing Specialist", avatar: "GH", color: "#f97316" },
  { id: 14, quote: "The suggestions it gives are eerily accurate. It's like it reads the room — every time, without fail.", name: "Lena Torres", title: "UX Researcher", avatar: "LT", color: "#6366f1" },
  { id: 15, quote: "Adopting this AI was the single best strategic decision our team made this year. Results speak louder than words.", name: "Omar Hassan", title: "VP of Engineering", avatar: "OH", color: "#ec4899" },
];

const testimonials4 = [
  { id: 16, quote: "It has saved us countless hours. Highly recommended for anyone looking to enhance their efficiency and productivity.", name: "Henry Ford", title: "Operations Analyst", avatar: "HF", color: "#14b8a6" },
  { id: 17, quote: "A must-have tool for any professional. It's revolutionized the way we approach problem-solving and decision-making.", name: "Ivy Wilson", title: "Business Consultant", avatar: "IW", color: "#f59e0b" },
  { id: 18, quote: "The results are always impressive. This AI has helped us to not only meet but exceed our performance targets.", name: "Jack Brown", title: "Performance Manager", avatar: "JB", color: "#8b5cf6" },
  { id: 19, quote: "Every department has benefited. From design to analytics, it accelerates everything it touches.", name: "Nina Watts", title: "Chief of Staff", avatar: "NW", color: "#10b981" },
  { id: 20, quote: "I was skeptical at first. Now I genuinely can't imagine our process without it. Total convert.", name: "Carlos Reyes", title: "Strategy Consultant", avatar: "CR", color: "#f43f5e" },
];

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "28px 26px",
        marginBottom: "20px",
        backdropFilter: "blur(10px)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "scale(1.02)";
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${testimonial.color}40`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "scale(1)";
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "80px",
          height: "80px",
          background: `radial-gradient(circle at top right, ${testimonial.color}20, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontSize: "48px",
          lineHeight: "1",
          color: testimonial.color,
          opacity: 0.6,
          fontFamily: "Georgia, serif",
          marginBottom: "10px",
          display: "block",
        }}
      >
        "
      </div>

      <p
        style={{
          color: "rgba(255,255,255,0.82)",
          fontSize: "14.5px",
          lineHeight: "1.7",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          marginBottom: "22px",
        }}
      >
        {testimonial.quote}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${testimonial.color}cc, ${testimonial.color}55)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 700,
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            flexShrink: 0,
            boxShadow: `0 0 0 2px ${testimonial.color}40`,
          }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div
            style={{
              color: "#fff",
              fontSize: "13.5px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {testimonial.name}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "11.5px",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: "2px",
            }}
          >
            {testimonial.title}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScrollColumnProps {
  items: Testimonial[];
  direction: "up" | "down";
  speed?: number;
  parallaxOnMobile?: boolean;
}

function ScrollColumn({ items, direction, speed = 0.4, parallaxOnMobile = true }: ScrollColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mobile parallax effect (hook always registered, but is no-op unless isMobile)
  useEffect(() => {
    const el = mobileRef.current;
    if (!isMobile || !parallaxOnMobile || !el) {
      if (el) el.style.transform = "none";
      return;
    }

    let rafId: number | null = null;

    const handle = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const multiplier = Math.max(0.05, Math.min(0.16, speed * 0.08));
      const offset = (viewportCenter - rect.top) * multiplier;
      el.style.transform = `translateY(${offset}px)`;
    };

    const onScroll = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handle);
    };

    handle();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (el) el.style.transform = "none";
    };
  }, [isMobile, parallaxOnMobile, speed]);

  // Desktop animation effect (hook always registered, but active only when not mobile)
  useEffect(() => {
    const el = columnRef.current;
    if (isMobile || !el) return;

    const halfHeight = el.scrollHeight / 2;

    if (direction === "down") posRef.current = -halfHeight;

    const animate = () => {
      if (!pausedRef.current) {
        if (direction === "up") {
          posRef.current -= speed;
          if (posRef.current <= -halfHeight) posRef.current = 0;
        } else {
          posRef.current += speed;
          if (posRef.current >= 0) posRef.current = -halfHeight;
        }
        el.style.transform = `translateY(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [direction, speed, isMobile]);

  const doubled = [...items, ...items];

  if (isMobile) {
    return (
      <div className="testimonial-column" ref={mobileRef} style={{ flex: 1, minWidth: 0 }}>
        {items.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="testimonial-column"
      style={{ overflow: "hidden", flex: 1, minWidth: 0 }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div ref={columnRef} style={{ willChange: "transform" }}>
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@700;900&display=swap');

        .testimonials-section * { box-sizing: border-box; margin: 0; padding: 0; }

        .testimonial-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; height: 700px; overflow: hidden; }
        .testimonial-column { overflow: hidden; flex: 1; min-width: 0; }

        @media (max-width: 1024px) {
          .testimonial-grid { grid-template-columns: repeat(2, 1fr); height: 900px; }
        }

        @media (max-width: 767px) {
          .testimonial-grid { grid-template-columns: 1fr; height: auto; gap: 18px; padding: 0 8px; }
          .testimonial-column { overflow: visible; height: auto; }
          .testimonial-column > div { transform: none !important; }
        }
      `}</style>

      <section
        className="testimonials-section"
        style={{ background: "#080a0f", minHeight: "100vh", padding: "80px 24px", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(20,184,166,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ textAlign: "center", marginBottom: "64px", position: "relative", zIndex: 10 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(36px, 5vw, 58px)", color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "16px" }}>
            Built on <span style={{ background: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #14b8a6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Trust</span> !
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            Here's what some of our users have to say. Real stories, real results.
          </p>
        </div>

        <div style={{ maxWidth: "1300px", margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, #080a0f 0%, transparent 100%)", zIndex: 10, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to top, #080a0f 0%, transparent 100%)", zIndex: 10, pointerEvents: "none" }} />

          <div className="testimonial-grid">
            <ScrollColumn items={testimonials} direction="up" speed={0.35} parallaxOnMobile={true} />
            <ScrollColumn items={testimonials2} direction="down" speed={0.45} parallaxOnMobile={true} />
            <ScrollColumn items={testimonials3} direction="up" speed={0.38} parallaxOnMobile={true} />
            <ScrollColumn items={testimonials4} direction="down" speed={0.42} parallaxOnMobile={true} />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "64px", position: "relative", zIndex: 10 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>
            Join over 10,000+ professionals already using our platform
          </p>
          <button style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)", border: "none", borderRadius: "100px", padding: "14px 36px", color: "#fff", fontSize: "15px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", boxShadow: "0 10px 40px rgba(99,102,241,0.35)", transition: "transform 0.2s ease, box-shadow 0.2s ease" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 50px rgba(99,102,241,0.5)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 40px rgba(99,102,241,0.35)"; }}>
            Get started for free →
          </button>
        </div>
      </section>
    </>
  );
}
