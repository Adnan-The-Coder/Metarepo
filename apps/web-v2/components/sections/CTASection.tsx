"use client";
import Section from "@/components/ui/Section";
import Link from "next/link";

export default function CTASection() {
  return (
    <Section id="contact" title="Turn Your Idea Into an MVP" subtitle="Ship a working MVP in a week—get in touch">
      <style jsx>{`
        @keyframes border-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes button-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.5), 0 0 50px rgba(6, 182, 212, 0.3); }
        }

        .cta-container {
          position: relative;
          border-radius: 1rem;
          padding: 3rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%);
          overflow: hidden;
          animation: fade-in-scale 0.8s ease-out;
        }

        @media (min-width: 768px) {
          .cta-container {
            padding: 3.5rem 4rem;
          }
        }

        /* Animated neon border */
        .cta-container::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 2px;
          background: linear-gradient(
            45deg,
            rgba(6, 182, 212, 0.6),
            rgba(168, 85, 247, 0.6),
            rgba(236, 72, 153, 0.6),
            rgba(251, 146, 60, 0.6),
            rgba(6, 182, 212, 0.6)
          );
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: border-flow 4s ease infinite;
          opacity: 0.8;
        }

        /* Radial glow background */
        .cta-container::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150%;
          height: 150%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(6, 182, 212, 0.12) 0%,
            rgba(168, 85, 247, 0.08) 40%,
            transparent 70%
          );
          animation: glow-pulse 4s ease-in-out infinite;
          pointer-events: none;
        }

        /* Diagonal pattern overlay */
        .pattern-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 15px,
              rgba(255, 255, 255, 0.05) 15px,
              rgba(255, 255, 255, 0.05) 30px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 15px,
              rgba(255, 255, 255, 0.05) 15px,
              rgba(255, 255, 255, 0.05) 30px
            );
          pointer-events: none;
        }

        /* Grid pattern */
        .grid-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.02;
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        /* Top accent line */
        .top-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(6, 182, 212, 0.8),
            rgba(168, 85, 247, 0.8),
            transparent
          );
          animation: glow-pulse 3s ease-in-out infinite;
        }

        /* Corner accents */
        .corner-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          opacity: 0.3;
          pointer-events: none;
        }

        .corner-glow.top-left {
          top: 0;
          left: 0;
          background: radial-gradient(
            circle at top left,
            rgba(6, 182, 212, 0.4),
            transparent 70%
          );
        }

        .corner-glow.top-right {
          top: 0;
          right: 0;
          background: radial-gradient(
            circle at top right,
            rgba(168, 85, 247, 0.4),
            transparent 70%
          );
        }

        .corner-glow.bottom-left {
          bottom: 0;
          left: 0;
          background: radial-gradient(
            circle at bottom left,
            rgba(236, 72, 153, 0.4),
            transparent 70%
          );
        }

        .corner-glow.bottom-right {
          bottom: 0;
          right: 0;
          background: radial-gradient(
            circle at bottom right,
            rgba(251, 146, 60, 0.4),
            transparent 70%
          );
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
        }

        .cta-text {
          color: #cbd5e1;
          max-width: 42rem;
          margin: 0 auto;
          font-size: 1.125rem;
          line-height: 1.75;
          font-weight: 400;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .buttons-container {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .buttons-container {
            flex-direction: row;
          }
        }

        .cta-button {
          position: relative;
          padding: 0.875rem 2rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          overflow: hidden;
          letter-spacing: 0.025em;
        }

        /* Primary button (Email) */
        .cta-button.primary {
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          color: #0f172a;
          box-shadow: 
            0 10px 30px rgba(255, 255, 255, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .cta-button.primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(6, 182, 212, 0.3),
            transparent
          );
          transition: left 0.6s ease;
        }

        .cta-button.primary:hover {
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
          transform: translateY(-3px);
          box-shadow: 
            0 15px 40px rgba(255, 255, 255, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .cta-button.primary:hover::before {
          left: 100%;
        }

        .cta-button.primary:active {
          transform: translateY(-1px);
        }

        /* Secondary button (LinkedIn) */
        .cta-button.secondary {
          background: rgba(6, 182, 212, 0.1);
          color: #67e8f9;
          border: 2px solid rgba(6, 182, 212, 0.4);
          position: relative;
        }

        .cta-button.secondary::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: linear-gradient(
            135deg,
            rgba(6, 182, 212, 0.2),
            rgba(168, 85, 247, 0.2)
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .cta-button.secondary::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .cta-button.secondary:hover {
          border-color: rgba(6, 182, 212, 0.7);
          color: #a5f3fc;
          transform: translateY(-3px);
          box-shadow: 
            0 15px 40px rgba(6, 182, 212, 0.4),
            0 0 30px rgba(6, 182, 212, 0.3),
            inset 0 0 20px rgba(6, 182, 212, 0.1);
        }

        .cta-button.secondary:hover::before {
          opacity: 1;
        }

        .cta-button.secondary:hover::after {
          width: 300px;
          height: 300px;
        }

        .cta-button.secondary:active {
          transform: translateY(-1px);
        }

        .button-text {
          position: relative;
          z-index: 1;
        }

        /* Floating particles effect */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(6, 182, 212, 0.6);
          border-radius: 50%;
          pointer-events: none;
          animation: float 6s ease-in-out infinite;
        }

        .particle:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .particle:nth-child(2) {
          top: 60%;
          left: 85%;
          animation-delay: 2s;
        }

        .particle:nth-child(3) {
          top: 40%;
          left: 15%;
          animation-delay: 4s;
          background: rgba(168, 85, 247, 0.6);
        }

        .particle:nth-child(4) {
          top: 75%;
          left: 90%;
          animation-delay: 1s;
          background: rgba(236, 72, 153, 0.6);
        }
      `}</style>

      <div className="cta-container">
        <div className="pattern-overlay"></div>
        <div className="grid-overlay"></div>
        <div className="top-accent"></div>
        
        <div className="corner-glow top-left"></div>
        <div className="corner-glow top-right"></div>
        <div className="corner-glow bottom-left"></div>
        <div className="corner-glow bottom-right"></div>
        
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>

        <div className="content-wrapper">
          <p className="cta-text">
            I help founders validate ideas quickly with production‑ready
            serverless stacks and tasteful dark UI. Let's scope it and ship.
          </p>
          
          <div className="buttons-container">
            <Link href="mailto:contact@adnanthecoder.com" className="cta-button primary">
              <span className="button-text">Email Me</span>
            </Link>
            <Link 
              href="https://www.linkedin.com/in/syedadnanali99" 
              target="_blank" 
              className="cta-button secondary"
            >
              <span className="button-text">Connect on LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}