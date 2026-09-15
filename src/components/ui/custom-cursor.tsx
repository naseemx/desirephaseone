"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * Global Custom Cursor System
 * Re-engineered from inspiring.nk.studio (module 19033) with Brand Cyan (#00b5e2)
 *
 * Architecture & Features:
 * - Full-window fixed canvas at z-[9997] with DPR synchronization
 * - Fluid comet ribbon tail using spring physics (0.7 momentum, 0.1 spring constant)
 * - 4px glowing cyan dot leading the trail at the spring head
 * - 36px idle frosted follower lens lagging smoothly (lerp = 0.06)
 * - Expands to 48px frosted lens on hover over interactive elements & service cards
 * - Compresses to 28px on pointer down
 * - Active globally across all sections of the site
 * - Media query (pointer: fine) safeguard for desktop / trackpad devices
 */
export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  // Positions and physics
  const mousePosRef = useRef({ x: -100, y: -100 });
  const springPosRef = useRef({ x: -100, y: -100 });
  const springVelRef = useRef({ x: 0, y: 0 });
  const lensPosRef = useRef({ x: -100, y: -100 });
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

        // 2. Position 4px Glowing Dot at Spring Head (trailDot in nk.studio)
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${springPosRef.current.x}px, ${springPosRef.current.y}px, 0px) translate(-50%, -50%)`;
        }

        // 3. Append to Trail History (stores up to 18 trailing points)
        trailHistoryRef.current.push({
          x: springPosRef.current.x,
          y: springPosRef.current.y,
        });
        if (trailHistoryRef.current.length > 18) {
          trailHistoryRef.current.shift();
        }

        // 4. Render Fluid Comet Ribbon Trail on Canvas
        if (ctx) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

          const history = trailHistoryRef.current;
          const len = history.length;
          if (len > 1) {
            for (let i = 0; i < len - 1; i++) {
              const p1 = history[i];
              const p2 = history[i + 1];
              const frac = (i + 1) / len;

              // Luminous Electric Tech Cyan #00b5e2 with smooth tapering opacity & width
              ctx.strokeStyle = `rgba(0, 181, 226, ${(frac * 0.45).toFixed(3)})`;
              ctx.lineWidth = Math.max(0.6, frac * 3.2);
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // 5. Outer Follower Lens with smooth lerp (lerp = 0.06)
        lensPosRef.current.x += (targetX - lensPosRef.current.x) * 0.06;
        lensPosRef.current.y += (targetY - lensPosRef.current.y) * 0.06;

        if (lensRef.current) {
          lensRef.current.style.transform = `translate3d(${lensPosRef.current.x}px, ${lensPosRef.current.y}px, 0px) translate(-50%, -50%)`;
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
        lensPosRef.current = { x: e.clientX, y: e.clientY };
        trailHistoryRef.current = [{ x: e.clientX, y: e.clientY }];

        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (lensRef.current) lensRef.current.style.opacity = "1";
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
      if (lensRef.current) lensRef.current.style.opacity = "0";
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

      {/* 2. Inner Glowing Brand Cyan Dot at Spring Head (inspiring.nk.studio trailDot) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-[#00b5e2] opacity-0 transition-opacity duration-300 will-change-transform"
        style={{
          width: "4px",
          height: "4px",
          boxShadow:
            "0 0 6px rgba(0, 181, 226, 0.95), 0 0 14px rgba(0, 181, 226, 0.5)",
        }}
        aria-hidden="true"
      />

      {/* 3. Outer Frosted Follower Lens (36px idle -> 48px on interactive/card hover) */}
      <div
        ref={lensRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9998] rounded-full flex items-center justify-center opacity-0 will-change-transform ${
          isHovering
            ? "w-12 h-12 bg-[#070b0a]/75 backdrop-blur-md border border-[#00b5e2]/40 shadow-[0_0_20px_rgba(0,181,226,0.25)]"
            : isPointerDown
            ? "w-7 h-7 bg-[#070b0a]/40 backdrop-blur-sm border border-white/10 scale-90"
            : "w-9 h-9 bg-[#070b0a]/25 backdrop-blur-[4px] border border-white/10"
        }`}
        style={{
          transition:
            "width 0.4s cubic-bezier(0.64, 0.1, 0, 1), height 0.4s cubic-bezier(0.64, 0.1, 0, 1), background-color 0.35s cubic-bezier(0.64, 0.1, 0, 1), border-color 0.35s cubic-bezier(0.64, 0.1, 0, 1), box-shadow 0.35s cubic-bezier(0.64, 0.1, 0, 1), transform 0.2s ease-out, opacity 0.3s ease-out",
        }}
        aria-hidden="true"
      />
    </>
  );
}
