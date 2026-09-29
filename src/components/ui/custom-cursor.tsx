"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * Global Custom Cursor System
 * Re-engineered from inspiring.nk.studio (module 19033) with Brand Cyan (#00b5e2)
 *
 * Architecture & Features:
 * - Full-window fixed canvas at z-[9997] with DPR synchronization
 * - Fluid comet ribbon tail using spring physics (0.7 momentum, 0.1 spring constant)
 * - Brand cyan (#00b5e2) rounded equilateral triangle cursor shape leading the trail
 * - Active globally across all sections of the site
 * - Media query (pointer: fine) safeguard for desktop / trackpad devices
 */
export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Positions and physics
  const mousePosRef = useRef({ x: -100, y: -100 });
  const springPosRef = useRef({ x: -100, y: -100 });
  const springVelRef = useRef({ x: 0, y: 0 });
  const trailHistoryRef = useRef<{ x: number; y: number }[]>([]);

  const isInsideRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  // Synchronize canvas buffer dimensions with devicePixelRatio and window size
  // Matching inspiring.nk.studio function m(e)
  const syncCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  // Callback ref to guarantee canvas is sized the instant it mounts into DOM
  const setCanvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      canvasRef.current = canvas;
      if (canvas) {
        syncCanvas(canvas);
      }
    },
    [syncCanvas]
  );

  // Fine pointer device detection (desktops / laptops)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updatePointerType = () => {
      const matches = mediaQuery.matches;
      setIsEnabled(matches);
      if (matches) {
        document.body.classList.add("custom-cursor-active");
      } else {
        document.body.classList.remove("custom-cursor-active");
      }
    };

    updatePointerType();
    mediaQuery.addEventListener("change", updatePointerType);

    const onResize = () => {
      syncCanvas(canvasRef.current);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mediaQuery.removeEventListener("change", updatePointerType);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [syncCanvas]);

  // Ensure canvas is synced whenever isEnabled toggles to true
  useEffect(() => {
    if (isEnabled && canvasRef.current) {
      syncCanvas(canvasRef.current);
    }
  }, [isEnabled, syncCanvas]);

  // Main 60fps/120fps physics and canvas render loop
  // Directly adapted from inspiring.nk.studio module 19033
  useEffect(() => {
    if (!isEnabled) return;

    let animId: number;

    const tick = () => {
      const targetX = mousePosRef.current.x;
      const targetY = mousePosRef.current.y;

      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext("2d") : null;

      // Defensive auto-resync: if canvas dimensions ever mismatch window * dpr, sync immediately
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const expectedW = Math.round(window.innerWidth * dpr);
        const expectedH = Math.round(window.innerHeight * dpr);
        if (canvas.width !== expectedW || canvas.height !== expectedH) {
          syncCanvas(canvas);
        }
      }

      if (isInsideRef.current) {
        // 1. Spring Physics for Trail Head & Dot (inspiring.nk.studio module 19033)
        // Spring acceleration towards mouse
        const ex = (targetX - springPosRef.current.x) * 0.1;
        const ey = (targetY - springPosRef.current.y) * 0.1;

        // Damped momentum (0.7 friction/inertia + spring delta)
        springVelRef.current.x = 0.7 * springVelRef.current.x + ex;
        springVelRef.current.y = 0.7 * springVelRef.current.y + ey;

        springPosRef.current.x += springVelRef.current.x;
        springPosRef.current.y += springVelRef.current.y;

        // 2. Position Glowing Dot at Spring Head
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${springPosRef.current.x}px, ${springPosRef.current.y}px, 0px)`;
        }

        // 3. Update Trail History (only records points when actively moving)
        const lastP =
          trailHistoryRef.current[trailHistoryRef.current.length - 1];
        const moveDist = lastP
          ? Math.hypot(
              springPosRef.current.x - lastP.x,
              springPosRef.current.y - lastP.y
            )
          : 999;

        if (moveDist > 2.5) {
          trailHistoryRef.current.push({
            x: springPosRef.current.x,
            y: springPosRef.current.y,
          });
          if (trailHistoryRef.current.length > 18) {
            trailHistoryRef.current.shift();
          }
        } else if (trailHistoryRef.current.length > 0) {
          // Dissolve trail when stationary so no trail or dot lingers
          trailHistoryRef.current.shift();
        }

        // 4. Render Fluid Comet Ribbon Trail on Canvas
        // Keeps the interior of the triangle cursor completely hollow with zero center dot
        if (ctx) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

          const history = trailHistoryRef.current;
          const len = history.length;
          const cx = springPosRef.current.x;
          const cy = springPosRef.current.y;
          const minRadius = 9; // Bounding radius of smaller triangle cursor to keep interior 100% empty

          if (len > 1) {
            for (let i = 0; i < len - 1; i++) {
              let p1 = history[i];
              let p2 = history[i + 1];

              const d1 = Math.hypot(p1.x - cx, p1.y - cy);
              const d2 = Math.hypot(p2.x - cx, p2.y - cy);

              // Skip segments fully inside the triangle cursor
              if (d1 <= minRadius && d2 <= minRadius) {
                continue;
              }

              // Clip segment if it penetrates into the triangle
              if (d2 < minRadius) {
                const angle = Math.atan2(p2.y - cy, p2.x - cx);
                p2 = {
                  x: cx + Math.cos(angle) * minRadius,
                  y: cy + Math.sin(angle) * minRadius,
                };
              } else if (d1 < minRadius) {
                const angle = Math.atan2(p1.y - cy, p1.x - cx);
                p1 = {
                  x: cx + Math.cos(angle) * minRadius,
                  y: cy + Math.sin(angle) * minRadius,
                };
              }

              const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
              if (segLen < 1.5) continue;

              const frac = (i + 1) / len;

              // Luminous Electric Tech Cyan #00b5e2 with smooth tapering opacity & width
              ctx.strokeStyle = `rgba(0, 181, 226, ${(frac * 0.45).toFixed(3)})`;
              ctx.lineWidth = Math.max(0.5, frac * 2.4);
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      } else {
        // Clear canvas when cursor is outside the browser viewport
        if (ctx) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
        trailHistoryRef.current = [];
        springVelRef.current = { x: 0, y: 0 };
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isEnabled, syncCanvas]);

  // Global Pointer Event Listeners
  useEffect(() => {
    if (!isEnabled) return;

    const onPointerMove = (e: PointerEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      if (!isInsideRef.current) {
        isInsideRef.current = true;
        springPosRef.current = { x: e.clientX, y: e.clientY };
        springVelRef.current = { x: 0, y: 0 };
        trailHistoryRef.current = [];

        if (dotRef.current) dotRef.current.style.opacity = "1";
      }
    };

    const onPointerDown = () => setIsPointerDown(true);
    const onPointerUp = () => setIsPointerDown(false);

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [role='button'], [data-cursor='card'], .cursor-pointer, input, select, textarea"
      );
      setIsHovering(Boolean(interactive));
    };

    const onMouseLeave = () => {
      isInsideRef.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
      }
      trailHistoryRef.current = [];
      springVelRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      {/* 1. Global Comet Ribbon Trail Canvas (inspiring.nk.studio trailCanvas) */}
      <canvas
        ref={setCanvasRef}
        className="pointer-events-none fixed inset-0 z-[9997]"
        aria-hidden="true"
      />

      {/* 2. Brand Cyan Rounded Triangle Custom Cursor (Attached Image Shape) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] opacity-0 transition-opacity duration-300 will-change-transform"
        aria-hidden="true"
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out select-none ${
            isHovering
              ? "scale-125"
              : isPointerDown
              ? "scale-90"
              : "scale-100"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`w-[15px] h-[15px] transition-all duration-200 text-[#00b5e2] ${
              isHovering
                ? "drop-shadow-[0_0_10px_rgba(0,181,226,0.95)] drop-shadow-[0_0_16px_rgba(0,181,226,0.5)] fill-transparent"
                : isPointerDown
                ? "drop-shadow-[0_0_5px_rgba(0,181,226,0.8)] fill-transparent"
                : "drop-shadow-[0_0_7px_rgba(0,181,226,0.7)] fill-transparent"
            }`}
          >
            <path
              d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
