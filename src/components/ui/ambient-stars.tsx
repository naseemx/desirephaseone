"use client";

import React, { useEffect, useRef } from "react";

interface Star3D {
  x: number; // Normalized -1 to 1 space
  y: number; // Normalized -1 to 1 space
  z: number; // Depth: 0.05 (near) to 1.0 (far)
  baseSpeed: number;
  baseSize: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hasHalo: boolean;
}

export interface AmbientStarsProps {
  count?: number;
  className?: string;
}

/**
 * AmbientStars
 * High-performance 3D Starfield optimized for mid-range and mobile devices.
 *
 * Performance Optimizations:
 * - Cancels RAF loop completely when off-screen via IntersectionObserver (0% idle CPU).
 * - Caps mobile DPR to 1.0 and mobile star count to 45 (75% GPU fillrate reduction).
 * - Pre-rendered offscreen sprite cache for star halos (zero dynamic gradient allocations).
 * - Replaced heavy CSS `filter: blur(140px+)` with zero-cost CSS radial gradients.
 * - Clamped delta time to prevent frame spikes.
 */
export function AmbientStars({
  count = 180,
  className = "",
}: AmbientStarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isVisible = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const isMobile = window.innerWidth < 768;
    const effectiveCount = isMobile ? Math.min(count, 45) : count;

    // ─────────────────────────────────────────────────────────────────────────
    // PRE-RENDERED GLOW SPRITE CACHE (Zero per-frame allocations)
    // ─────────────────────────────────────────────────────────────────────────
    const spriteSize = 48;
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = spriteSize;
    glowCanvas.height = spriteSize;
    const gCtx = glowCanvas.getContext("2d");
    if (gCtx) {
      const grad = gCtx.createRadialGradient(
        spriteSize / 2,
        spriteSize / 2,
        0,
        spriteSize / 2,
        spriteSize / 2,
        spriteSize / 2
      );
      grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      grad.addColorStop(0.2, "rgba(0, 181, 226, 0.7)");
      grad.addColorStop(0.55, "rgba(0, 181, 226, 0.15)");
      grad.addColorStop(1, "rgba(0, 181, 226, 0)");
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, spriteSize, spriteSize);
    }

    // Star data
    let scrollBoost = 1.0;
    let targetBoost = 1.0;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const createStar = (initialZ?: number): Star3D => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 0.95;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = initialZ !== undefined ? initialZ : Math.random() * 0.94 + 0.06;

      return {
        x,
        y,
        z,
        baseSpeed: Math.random() * 0.05 + 0.025,
        baseSize: Math.random() * 1.0 + 0.5,
        twinkleSpeed: Math.random() * 1.5 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        hasHalo: Math.random() < 0.15,
      };
    };

    const stars: Star3D[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      stars.push(createStar(Math.random() * 0.94 + 0.06));
    }

    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      dpr = mobileCheck ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(render);

      const rawDt = (now - lastTime) / 1000;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.04);
      lastTime = now;

      // Smooth scroll velocity tracking
      const lenis = (window as unknown as { lenis?: { velocity: number; direction: number } }).lenis;
      let speed = 0;
      let dir = 0;

      if (lenis && typeof lenis.velocity === "number") {
        speed = Math.abs(lenis.velocity);
        dir = lenis.direction;
      } else {
        const currentScrollY = window.scrollY;
        const delta = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;
        speed = delta * 0.04;
        dir = delta > 0 ? 1 : 0;
      }

      if (dir === 1 && speed > 0.15) {
        targetBoost = Math.min(1.0 + speed * 0.35, 3.5);
      } else if (dir === -1 && speed > 0.15) {
        targetBoost = 0.4;
      } else {
        targetBoost = 1.0;
      }

      scrollBoost += (targetBoost - scrollBoost) * (1 - Math.exp(-4.5 * dt));

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = Math.max(width, height) * 0.72;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.z -= star.baseSpeed * scrollBoost * dt;

        const screenX = centerX + (star.x / star.z) * fov;
        const screenY = centerY + (star.y / star.z) * fov;

        const isOffScreen =
          screenX < -30 ||
          screenX > width + 30 ||
          screenY < -30 ||
          screenY > height + 30;

        if (star.z <= 0.04 || isOffScreen) {
          const fresh = createStar(1.0);
          star.x = fresh.x;
          star.y = fresh.y;
          star.z = fresh.z;
          star.baseSpeed = fresh.baseSpeed;
          star.baseSize = fresh.baseSize;
          star.hasHalo = fresh.hasHalo;
          star.twinklePhase = fresh.twinklePhase;
          continue;
        }

        const depth = 1 - star.z;
        const size = (star.baseSize / star.z) * 0.16;
        const radius = Math.max(0.6, Math.min(size, 2.8));

        const sinVal = Math.sin(now * 0.001 * star.twinkleSpeed + star.twinklePhase);
        const alpha = Math.max(0.12, Math.min(0.9, 0.3 + depth * 0.5 + sinVal * 0.18));

        // Draw Soft Halo for prominent stars
        if (star.hasHalo && depth > 0.45 && alpha > 0.35 && !isMobile) {
          const haloSize = radius * 8;
          ctx.globalAlpha = alpha * 0.45;
          ctx.drawImage(
            glowCanvas,
            screenX - haloSize / 2,
            screenY - haloSize / 2,
            haloSize,
            haloSize
          );
          ctx.globalAlpha = 1.0;
        }

        // Draw Core Star Point
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        ctx.fill();
      }
    };

    // Pause animation completely when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          lastTime = performance.now();
          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        }
      },
      { threshold: 0.02, rootMargin: "100px 0px" }
    );
    observer.observe(container);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* 3D Warp Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Atmospheric Brand Glow Accents - Pure CSS Radial Gradients (Zero GPU blur filter overhead) */}
      <div
        className="absolute top-[25%] left-[20%] w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full pointer-events-none opacity-70 sm:opacity-100"
        style={{
          background: "radial-gradient(circle, rgba(0, 181, 226, 0.08) 0%, rgba(0, 181, 226, 0) 68%)",
        }}
      />
      <div
        className="absolute bottom-[30%] right-[15%] w-[420px] sm:w-[520px] h-[420px] sm:h-[520px] rounded-full pointer-events-none opacity-60 sm:opacity-100"
        style={{
          background: "radial-gradient(circle, rgba(0, 181, 226, 0.06) 0%, rgba(0, 181, 226, 0) 68%)",
        }}
      />
    </div>
  );
}

export default AmbientStars;
