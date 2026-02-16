'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';

type Dot = {
  id: string;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  glowIntensity: number;
  hue: number;
  saturation: number;
};


const Background = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [dots, setDots] = useState([]);
  const [dots, setDots] = useState<Dot[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Generate dots
  useEffect(() => {
    const generateDots = () => {
      const dotsArray = [];
      const dotSize = 4;
      const spacing = 20;
      const rows = Math.ceil(window.innerHeight / spacing) + 4;
      const cols = Math.ceil(window.innerWidth / spacing) + 4;

      for (let row = 0; row < rows; row++) {
        const baseColCount = cols;
        const colVariation = Math.floor(Math.random() * 3) - 1;
        const actualCols = Math.max(1, baseColCount + colVariation);

        for (let col = 0; col < actualCols; col++) {
          const baseX = col * spacing + spacing / 2;
          const baseY = row * spacing + spacing / 2;
          const offsetX = (Math.random() - 0.5) * 2;
          const offsetY = (Math.random() - 0.5) * 2;

          if (Math.random() < 0.05) continue;

          dotsArray.push({
            id: `${row}-${col}`,
            x: baseX + offsetX,
            y: baseY + offsetY,
            size: dotSize + (Math.random() - 0.5) * 0.5,
            baseOpacity: 0.25 + Math.random() * 0.15,
            glowIntensity: 0,
            hue: 160 + Math.random() * 20,
            saturation: 80 + Math.random() * 20,
          });
        }
      }

      setDots(dotsArray);
    };

    generateDots();
    window.addEventListener('resize', generateDots);
    return () => window.removeEventListener('resize', generateDots);
  }, []);

  // Glow on mouse move
  const handleMouseMove = useCallback((e:any) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePosition({ x: mouseX, y: mouseY });

    setDots((prevDots:any) =>
      prevDots.map((dot:any) => {
        const distance = Math.sqrt(
          Math.pow(dot.x - mouseX, 2) + Math.pow(dot.y - mouseY, 2)
        );

        const maxGlowDistance = 100;
        let glowIntensity = 0;

        if (distance < maxGlowDistance) {
          glowIntensity = Math.pow((maxGlowDistance - distance) / maxGlowDistance, 2);
        }

        return { ...dot, glowIntensity };
      })
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDots((prevDots:any) =>
      prevDots.map((dot:any) => ({ ...dot, glowIntensity: 0 }))
    );
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-black -z-10">
      {/* Global Styles */}
      <style jsx>{`
        .grid-dot {
          position: absolute;
          border-radius: 50%;
          transition: all 0.2s ease-out;
          pointer-events: none;
        }

        .grid-dot::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300%;
          height: 300%;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.2s ease-out;
          pointer-events: none;
          background: var(--glow-background, transparent);
        }

        .grid-dot.glowing::before {
          opacity: 1;
        }

        .grid-dot.intense-glow::before {
          width: 500%;
          height: 500%;
          opacity: 1;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.01;
          background-image:
            linear-gradient(rgba(0, 100, 50, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 100, 50, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .texture-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 25% 25%, rgba(0, 50, 30, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0, 40, 25, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 10%,
            rgba(0, 0, 0, 0.2) 40%,
            rgba(0, 0, 0, 0.6) 80%,
            rgba(0, 0, 0, 0.9) 100%
          );
          pointer-events: none;
        }
      `}</style>

      {/* Grid & Texture */}
      <div className="grid-overlay" />
      <div className="texture-overlay" />

      {/* Dots */}
      {dots.map((dot:any) => {
        const glowOpacity = Math.min(1, dot.baseOpacity + dot.glowIntensity * 0.9);
        const size = dot.size + dot.glowIntensity * 3;
        const isGlowing = dot.glowIntensity > 0.1;
        const isIntenseGlow = dot.glowIntensity > 0.6;

        const lightness = 15 + dot.glowIntensity * 70;
        const glowColor = `hsl(${dot.hue}, ${dot.saturation}%, ${lightness}%)`;
        const radialGradient = `radial-gradient(circle, ${glowColor}60 0%, ${glowColor}20 40%, transparent 70%)`;

        return (
          <div
            key={dot.id}
            className={`grid-dot ${isGlowing ? 'glowing' : ''} ${isIntenseGlow ? 'intense-glow' : ''}`}
            style={{
              left: `${dot.x}px`,
              top: `${dot.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: glowColor,
              opacity: glowOpacity,
              boxShadow: isGlowing
                ? `
                    0 0 ${dot.glowIntensity * 15}px ${glowColor},
                    0 0 ${dot.glowIntensity * 25}px ${glowColor}40,
                    inset 0 0 ${size / 2}px ${glowColor}20
                  `
                : `inset 0 0 2px hsl(${dot.hue}, ${dot.saturation}%, 10%)`,
              transform: `translate(-50%, -50%) scale(${1 + dot.glowIntensity * 0.3})`,
              border: isGlowing
                ? `1px solid ${glowColor}60`
                : `1px solid hsl(${dot.hue}, ${dot.saturation / 2}%, 8%)`,
              '--glow-background': radialGradient,
            } as React.CSSProperties & { [key: string]: any }}
          />
        );
      })}

      {/* Vignette */}
      <div className="vignette" />

      {/* Cursor Glow */}
      <div
        className="fixed pointer-events-none transition-opacity duration-300 rounded-full"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          width: '120px',
          height: '120px',
          background:
            'radial-gradient(circle, rgba(0, 150, 100, 0.08) 0%, rgba(0, 100, 70, 0.04) 50%, transparent 80%)',
          opacity: mousePosition.x > 0 ? 1 : 0,
        }}
      />
    </div>
  );
};

export default Background;
