"use client";

import React, { useEffect, useState } from "react";
import logoData from "./logo-data.json";

interface PreloaderProps {
  progress?: number; // 0 to 100
  onComplete?: () => void;
}

export function Preloader({ progress = 0, onComplete }: PreloaderProps) {
  // State for which circles in R2C2 (second row, second column) are currently glowing
  const [glowingIndices, setGlowingIndices] = useState<Set<number>>(new Set());
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

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

  // Slow, smooth, gentle glowing loop for the 49 circles in R2C2 (second row, second column)
  useEffect(() => {
    if (isFinished) return;

    const r2c2Count = logoData.r2c2.length; // 49
    // Slower interval (650ms) for calm, smooth breathing transitions
    const glowInterval = setInterval(() => {
      setGlowingIndices((prev) => {
        const next = new Set(prev);

        // Gently release 1 to 2 glowing circles
        const currentArr = Array.from(next);
        if (currentArr.length > 0) {
          const numToTurnOff = Math.min(currentArr.length, Math.floor(Math.random() * 2) + 1);
          for (let i = 0; i < numToTurnOff; i++) {
            const randomIdx = Math.floor(Math.random() * currentArr.length);
            next.delete(currentArr[randomIdx]);
            currentArr.splice(randomIdx, 1);
          }
        }

        // Gently activate 1 to 2 new random circles
        const numToTurnOn = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numToTurnOn; i++) {
          const randomCircleIdx = Math.floor(Math.random() * r2c2Count);
          next.add(randomCircleIdx);
        }

        return next;
      });
    }, 650);

    return () => clearInterval(glowInterval);
  }, [isFinished]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07070b] transition-all duration-1000 ease-out select-none ${
        isFinished
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100 pointer-events-auto"
      }`}
    >
      {/* Subtle ambient background glow */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,181,226,0.08),transparent_70%)] blur-3xl" />

      {/* Main Logo Preloader Container */}
      <div className="relative flex flex-col items-center">
        {/* SVG Logo Graphic (25% smaller) */}
        <div className="relative h-32 w-24 sm:h-44 sm:w-32 md:h-48 md:w-36">
          <svg
            viewBox="0 0 929 1426"
            className="h-full w-full overflow-visible"
          >
            {/* Static Background Clusters (R1C2, R2C1, R3C1, R3C2) */}
            <g>
              {/* Row 1, Col 2 (Top Right) */}
              {logoData.r1c2.map((c, i) => (
                <circle
                  key={`r1c2-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#00B5E2"
                  opacity={0.14}
                />
              ))}

              {/* Row 2, Col 1 (Middle Left) */}
              {logoData.r2c1.map((c, i) => (
                <circle
                  key={`r2c1-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#00B5E2"
                  opacity={0.14}
                />
              ))}

              {/* Row 3, Col 1 (Bottom Left) */}
              {logoData.r3c1.map((c, i) => (
                <circle
                  key={`r3c1-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#00B5E2"
                  opacity={0.14}
                />
              ))}

              {/* Row 3, Col 2 (Bottom Right) */}
              {logoData.r3c2.map((c, i) => (
                <circle
                  key={`r3c2-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#00B5E2"
                  opacity={0.14}
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
                    fill={isGlowing ? "#38BDF8" : "#00B5E2"}
                    opacity={isGlowing ? 0.85 : 0.22}
                    className="transition-all duration-700 ease-in-out"
                    style={
                      isGlowing
                        ? {
                            filter: "drop-shadow(0 0 6px rgba(0, 181, 226, 0.6))",
                          }
                        : undefined
                    }
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Loading Progress Information */}
        <div className="mt-6 flex flex-col items-center gap-2">
          {/* Percentage Number */}
          <div className="flex items-baseline gap-1 text-sm font-semibold tracking-wider text-white">
            <span className="font-mono text-base text-[var(--brand-cyan)]">
              {Math.floor(displayProgress)}
            </span>
            <span className="text-xs text-zinc-500">%</span>
          </div>

          {/* Minimal hairline progress bar */}
          <div className="h-[2px] w-28 sm:w-36 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--brand-cyan)] to-cyan-300 transition-all duration-200 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
