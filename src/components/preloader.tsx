"use client";

import React, { useEffect, useState, useRef } from "react";
import logoData from "./logo-data.json";

interface PreloaderProps {
  progress?: number; // 0 to 100
  onComplete?: () => void;
}

export function Preloader({ progress = 0, onComplete }: PreloaderProps) {
  // State for which circles in R2C2 are currently glowing (initialized with 6-7 random pixels)
  const [glowingIndices, setGlowingIndices] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    const count = logoData.r2c2.length;
    while (initial.size < 6) {
      initial.add(Math.floor(Math.random() * count));
    }
    return initial;
  });
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const ledCanvasRef = useRef<HTMLCanvasElement>(null);

  // Smooth progress animation dynamically synchronized to real frame loading
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          const step = Math.max(1, Math.ceil((progress - prev) / 5));
          const next = Math.min(progress, prev + step);
          if (next >= 100 && !isFinished) {
            setIsFinished(true);
            setTimeout(() => {
              setShouldRender(false);
              onComplete?.();
            }, 700);
          }
          return next;
        }
        return prev;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [progress, isFinished, onComplete]);

  // Dynamic glowing loop maintaining 6 to 7 glowing pixels simultaneously in logo
  useEffect(() => {
    if (isFinished) return;

    const r2c2Count = logoData.r2c2.length; // 49 circles in 7x7 matrix

    const glowInterval = setInterval(() => {
      setGlowingIndices((prev) => {
        const next = new Set(prev);
        const currentArr = Array.from(next);

        // Gently cycle out 2 to 3 active glowing pixels
        const numToTurnOff = Math.min(currentArr.length, Math.floor(Math.random() * 2) + 2);
        for (let i = 0; i < numToTurnOff; i++) {
          if (currentArr.length === 0) break;
          const randomIdx = Math.floor(Math.random() * currentArr.length);
          next.delete(currentArr[randomIdx]);
          currentArr.splice(randomIdx, 1);
        }

        // Add new random circles to maintain target 6 to 7 active pixels
        const targetCount = Math.random() > 0.5 ? 6 : 7;
        let attempts = 0;
        while (next.size < targetCount && attempts < 50) {
          attempts++;
          const randomCircleIdx = Math.floor(Math.random() * r2c2Count);
          next.add(randomCircleIdx);
        }

        return next;
      });
    }, 550);

    return () => clearInterval(glowInterval);
  }, [isFinished]);

  // ── Ambient LED pixel-wall canvas background (from maxtellindia.com) ─────
  useEffect(() => {
    if (isFinished) return;
    const canvas = ledCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let cols = 0;
    let rows = 0;
    let cell = 18;
    let gap = 2;
    let cellsState: { v: number; target: number; speed: number; isPurple?: boolean }[] = [];
    let animId: number;
    let triggerTimeout: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const isMobile = W < 768;
      cell = isMobile ? 10 : 18;
      gap = isMobile ? 1.5 : 2;
      cols = Math.ceil(W / cell) + 1;
      rows = Math.ceil(H / cell) + 1;
      cellsState = new Array(cols * rows).fill(0).map(() => ({
        v: Math.random() * 0.14,
        target: Math.random() * 0.14,
        speed: 0.01 + Math.random() * 0.02,
        isPurple: Math.random() < 0.12,
      }));
    };

    window.addEventListener("resize", resize);
    resize();

    // occasionally trigger a bright pixel (from maxtellindia.com)
    const trigger = () => {
      if (!isMounted) return;
      const idx = Math.floor(Math.random() * cellsState.length);
      if (cellsState[idx]) {
        cellsState[idx].target = 0.55 + Math.random() * 0.45;
      }
      if (Math.random() < 0.92) {
        triggerTimeout = setTimeout(trigger, 35 + Math.random() * 80);
      } else {
        triggerTimeout = setTimeout(trigger, 100);
      }
    };
    trigger();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const s = cellsState[i];
          if (!s) continue;
          s.v += (s.target - s.v) * s.speed;
          if (Math.abs(s.target - s.v) < 0.01 && s.target > 0.2) {
            s.target = Math.random() * 0.14;
          }
          const alpha = s.v;
          if (alpha > 0.02) {
            if (s.isPurple && alpha < 0.35) {
              ctx.fillStyle = `rgba(104, 14, 166, ${alpha.toFixed(3)})`;
            } else {
              const cyan = alpha > 0.38;
              ctx.fillStyle = cyan
                ? `rgba(51, 224, 255, ${alpha.toFixed(3)})`
                : `rgba(47, 107, 255, ${alpha.toFixed(3)})`;
            }
            ctx.fillRect(c * cell + gap, r * cell + gap, cell - gap * 2, cell - gap * 2);
          }
        }
      }
      if (isMounted) {
        animId = requestAnimationFrame(draw);
      }
    };
    draw();

    return () => {
      isMounted = false;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
      if (triggerTimeout) clearTimeout(triggerTimeout);
    };
  }, [isFinished]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060a13] transition-all duration-1000 ease-out select-none overflow-hidden ${
        isFinished
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100 pointer-events-auto"
      }`}
    >
      {/* ── maxtellindia.com Live Ambient LED Canvas Background ────── */}
      <canvas
        ref={ledCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-65"
      />

      {/* ── maxtellindia.com Exact Vignette ────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(6, 10, 19, 0) 0%, rgba(6, 10, 19, 0.55) 55%, rgba(6, 10, 19, 0.96) 100%)",
        }}
      />

      {/* ── Main Logo Preloader Container ───────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Text above logo (matching same distance as progress info below) */}
        <p className="mb-4 text-[9px] sm:text-[11px] font-normal tracking-wider text-zinc-300 select-none animate-breathe">
          Crafting Brilliance
        </p>

        {/* SVG Logo Graphic (Isolated from background grid) */}
        <div className="relative h-24 w-16 sm:h-32 sm:w-24 md:h-36 md:w-28">
          <svg
            viewBox="0 0 929 1426"
            className="h-full w-full overflow-visible"
          >
            {/* Solid background discs for every circle to prevent the grid from bleeding through */}
            <g>
              {[
                ...logoData.r1c2,
                ...logoData.r2c1,
                ...logoData.r3c1,
                ...logoData.r3c2,
                ...logoData.r2c2,
              ].map((c, i) => (
                <circle
                  key={`base-disc-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#060a16"
                />
              ))}
            </g>

            {/* Static Background Clusters (R1C2, R2C1, R3C1, R3C2) */}
            <g>
              {/* Row 1, Col 2 (Top Right) */}
              {logoData.r1c2.map((c, i) => (
                <circle
                  key={`r1c2-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#16c0f1"
                  opacity={0.32}
                />
              ))}

              {/* Row 2, Col 1 (Middle Left) */}
              {logoData.r2c1.map((c, i) => (
                <circle
                  key={`r2c1-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#16c0f1"
                  opacity={0.32}
                />
              ))}

              {/* Row 3, Col 1 (Bottom Left) */}
              {logoData.r3c1.map((c, i) => (
                <circle
                  key={`r3c1-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#16c0f1"
                  opacity={0.32}
                />
              ))}

              {/* Row 3, Col 2 (Bottom Right) */}
              {logoData.r3c2.map((c, i) => (
                <circle
                  key={`r3c2-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#16c0f1"
                  opacity={0.32}
                />
              ))}
            </g>

            {/* ACTIVE LOADING MATRIX: Row 2, Col 2 (Second Row, Second Column) */}
            <g>
              {logoData.r2c2.map((c, i) => {
                const isGlowing = glowingIndices.has(i);
                return (
                  <circle
                    key={`r2c2-${i}`}
                    cx={c.cx}
                    cy={c.cy}
                    r={c.r}
                    fill={isGlowing ? "#38BDF8" : "#16c0f1"}
                    opacity={isGlowing ? 1.0 : 0.32}
                    className="transition-all duration-500 ease-in-out"
                    style={
                      isGlowing
                        ? {
                            filter: "drop-shadow(0 0 8px rgba(0, 181, 226, 0.9))",
                          }
                        : undefined
                    }
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Loading Progress Percentage Number (shifted right to optically center with logo) */}
        <div className="mt-4 flex items-baseline gap-1 text-xs sm:text-sm font-semibold tracking-wider translate-x-1.5 sm:translate-x-2">
          <span className="font-mono text-sm sm:text-base text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.3)]">
            {Math.floor(displayProgress)}
          </span>
          <span className="text-[10px] text-cyan-300/60 font-mono">%</span>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
