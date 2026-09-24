"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { AmbientStars } from "@/components/ui/ambient-stars";
import { SERVICES, ServiceItem } from "@/data/service";
import { MoveHorizontal, ArrowRight } from "lucide-react";
import { ServiceDrawer } from "@/components/service-drawer";
import { EdgeGlassCard } from "@/components/ui/edge-glass-card";

export type { ServiceItem };

const CARDS: ServiceItem[] = SERVICES;

/**
 * ServiceHome
 * Reverse-Engineered from https://inspiring.nk.studio/
 * 
 * Features:
 * - Rendered directly from src/data/service.ts (only image and title on cards)
 * - 3D Concave ribbon curvature with drag & scroll inertia
 * - Proximity border lighting & dynamic cursor spotlight in Brand Cyan (#00b5e2)
 * - Mobile responsive single-row ribbon with zero-lag touch physics
 * - Modal detail view displaying service capabilities and specifications
 */
export interface ServiceHomeProps {
  isStageMode?: boolean;
  scrollProgressRef?: React.RefObject<number>;
}

export function ServiceHome({
  isStageMode = false,
  scrollProgressRef,
}: ServiceHomeProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Viewport Intersection State: pause all calculations when section is off-screen
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (isStageMode) {
      setIsInView(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "150px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isStageMode]);

  // Layout parameters based on container / window dimensions
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: typeof window !== "undefined" ? window.innerWidth : 1200,
        height: typeof window !== "undefined" ? window.innerHeight : 800,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute carousel dimensions matching decompiled nk.studio computeCarouselLayout
  const layout = useMemo(() => {
    const w = dimensions.width;
    const h = dimensions.height;
    const isMobile = w < 768;

    // Desktop (2 rows):
    if (!isMobile) {
      // Differentiate MacBook / standard laptops (w <= 1600) from large widescreen monitors (w > 1600, e.g. 1920x1080)
      const isLargeWidescreen = w > 1600;

      // On MacBook and laptops (w <= 1600): EXACT previous sizing from previous version
      // On large widescreen monitors (w > 1600, e.g. 1920x1080): size pitch to w / 4.35 so precisely 4 cards fit at a moment
      const cardWidth = isLargeWidescreen
        ? Math.round(w / 4.35) - 38
        : Math.min(290, Math.max(230, Math.round(230 + ((w - 768) / 672) * 50)));

      const gap = isLargeWidescreen
        ? 38
        : Math.max(28, Math.min(38, Math.round(cardWidth * 0.13)));

      const pitch = cardWidth + gap;

      // Vertical budgeting: ensure 2 rows + rowGap fit comfortably inside available viewport height
      const verticalReserved = 160;
      const availableRibbonH = Math.max(440, h - verticalReserved);

      const baseRowGap = Math.max(58, Math.min(76, Math.round(availableRibbonH * 0.11)));
      const maxCardHeightFromH = Math.floor((availableRibbonH - baseRowGap) / 2);

      // Card height: MacBook keeps exact 1.16 ratio; widescreen monitors use proportional ~0.84 ratio to prevent vertical collision
      const idealCardHeight = Math.round(cardWidth * (isLargeWidescreen ? 0.84 : 1.16));
      const cardHeight = Math.min(idealCardHeight, maxCardHeightFromH);

      // Recalculate rowGap with remaining vertical space, maintaining generous breathing room
      const remainingH = availableRibbonH - cardHeight * 2;
      const rowGap = Math.max(58, Math.min(76, remainingH));

      const p = w >= 1280 ? 1 : Math.pow((w - 768) / 512, 2);

      return {
        isMobile: false,
        cardWidth,
        cardHeight,
        gap,
        pitch,
        rowGap,
        viewportHalfWidth: Math.max(w, 1) / 2,
        curveAmount: 6 + 18 * p,
        curveMaxTiltRad: 0.06 + 0.08 * p, // gentle tilt (max ~8 deg) so card corners do not protrude into adjacent row
        curveRotationMul: 0.40 + 0.20 * p,
      };
    }

    // Mobile (2 rows): dynamically size cards based on BOTH width and height
    // to guarantee two rows never overlap on any screen size.
    const widthBasedCardW = Math.max(130, Math.min(170, Math.round(w * 0.40)));

    // The viewport ribbon area on mobile has a usable height.
    // We need: 2 * cardHeight + rowGap to fit inside the ribbon viewport.
    const ribbonBudget = Math.min(420, Math.round(h * 0.52));
    const mobileRowGap = 24;
    const maxCardHeight = Math.floor((ribbonBudget - mobileRowGap) / 2);

    // Card height from width would be widthBasedCardW * 1.1
    const idealCardHeight = Math.round(widthBasedCardW * 1.1);
    // Cap the card height to what the viewport can fit
    const cardHeight = Math.min(idealCardHeight, maxCardHeight);
    // Derive final card width from the (possibly capped) height
    const cardWidth = cardHeight < idealCardHeight
      ? Math.round(cardHeight / 1.1)
      : widthBasedCardW;

    const gap = 12;
    const pitch = cardWidth + gap;

    return {
      isMobile: true,
      cardWidth,
      cardHeight,
      gap,
      pitch,
      rowGap: mobileRowGap,
      viewportHalfWidth: Math.max(w, 1) / 2,
      // Zero curve on mobile to prevent vertical displacement that causes overlap
      curveAmount: 0,
      curveMaxTiltRad: 0,
      curveRotationMul: 0,
    };
  }, [dimensions.width, dimensions.height]);

  // Card distribution: 2 rows across all screen sizes (mobile & desktop)
  // Dynamically driven by line: 1 (top row) vs line: 2 (bottom row) in src/data/service.ts
  const { topRowCards, bottomRowCards } = useMemo(() => {
    const line1 = CARDS.filter((c) => (c.line ?? c.row ?? 1) === 1);
    const line2 = CARDS.filter((c) => (c.line ?? c.row) === 2);
    return {
      topRowCards: line1.length > 0 ? line1 : CARDS.slice(0, 8),
      bottomRowCards: line2.length > 0 ? line2 : CARDS.slice(8, 16),
    };
  }, []);

  const topCardRefs = useRef<(HTMLElement | null)[]>([]);
  const bottomCardRefs = useRef<(HTMLElement | null)[]>([]);
  const isHoveredRef = useRef(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Main 60fps/120fps physics and 3D positioning animation loop (Desktop only)
  useEffect(() => {
    if (!isInView || layout.isMobile) return;

    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now * 0.001;

      const {
        cardWidth,
        cardHeight,
        pitch,
        rowGap,
        curveAmount,
        curveMaxTiltRad,
        curveRotationMul,
        viewportHalfWidth,
        isMobile,
      } = layout;

      // Starting positions: comfortably away from the left edge so Card 0 is completely visible
      const totalWidth = viewportHalfWidth * 2;
      const horizontalMargin = Math.max(48, Math.min(84, Math.round(totalWidth * 0.045)));
      const cardLeftEdge = -viewportHalfWidth + horizontalMargin;
      const startX = cardLeftEdge + cardWidth * 0.5;
      const bottomStartX = startX + (totalWidth > 1600 ? Math.round(pitch * 0.10) : 36);

      // Calculate the exact travel distance so the carousel stops with the final cards (Image 1 reference)
      // cleanly framed across the screen, with the last card stopping at the right margin.
      // This prevents the carousel from over-scrolling into empty space (Image 2 bug).
      const lastTopIdx = Math.max(0, topRowCards.length - 1);
      const lastBottomIdx = Math.max(0, bottomRowCards.length - 1);
      const initialRight_top = startX + lastTopIdx * pitch + cardWidth * 0.5;
      const initialRight_bottom =
        bottomRowCards.length > 0
          ? bottomStartX + lastBottomIdx * pitch + cardWidth * 0.5
          : initialRight_top;

      // Target right boundary: symmetric with left margin
      const targetRightEdge = viewportHalfWidth - horizontalMargin;
      const maxLastCardRightEdge = Math.max(initialRight_top, initialRight_bottom);
      const totalScrollTravel = Math.max(0, maxLastCardRightEdge - targetRightEdge);

      const scrollProgress = Math.max(0, Math.min(1, scrollProgressRef?.current ?? 0));
      const scrollDrivenOffset = scrollProgress * totalScrollTravel;

      // Subtle ambient breathing float when idle (pauses on card hover)
      const idleDrift = isHoveredRef.current ? 0 : Math.sin(t * 0.7) * 12;
      const currentOffset = scrollDrivenOffset + idleDrift;

      const Z = viewportHalfWidth;
      const visibleThreshold = viewportHalfWidth + cardWidth + 50;

      // Position Top Row (Finite track - 8 cards shown once, no repetition)
      topRowCards.forEach((_, idx) => {
        const el = topCardRefs.current[idx];
        if (!el) return;

        const x = startX + idx * pitch - currentOffset;

        // Frustum culling: skip offscreen cards
        if (Math.abs(x) > visibleThreshold) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          return;
        }
        el.style.pointerEvents = "auto";

        const normX = Math.max(-1.5, Math.min(1.5, x / Math.max(Z, 1)));
        const curveY = curveAmount * normX * normX;
        const tangentAngle =
          Math.atan((-2 * curveAmount * x) / (Z * Z)) * curveRotationMul;
        const tiltRad = Math.max(
          -curveMaxTiltRad,
          Math.min(curveMaxTiltRad, tangentAngle)
        );
        const floatY = 3.5 * Math.sin(t * 1.25 + idx * 0.85);

        // Dynamically compute safe half-row clearance accounting for 3D tilt corner projection
        const cornerTiltExpansion = Math.abs(Math.sin(tiltRad)) * (cardWidth * 0.5);
        const safeHalfRowGap = rowGap * 0.5 + cornerTiltExpansion * 1.1;

        const y = -cardHeight * 0.5 - safeHalfRowGap - curveY + (isMobile ? 0 : floatY);
        const rotZ = isMobile ? 0 : tiltRad * (180 / Math.PI);
        const rotY = isMobile ? normX * 3.5 : normX * 10;
        const scale = 1.02 - Math.abs(normX) * (isMobile ? 0.04 : 0.06);

        const absNormX = Math.abs(normX);
        const cardOpacity =
          absNormX > 0.94 ? Math.max(0.2, 1 - (absNormX - 0.94) * 2.0) : 1;

        el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(${scale})`;
        el.style.opacity = cardOpacity.toFixed(3);
      });

      // Position Bottom Row (Finite track - 8 cards shown once, no repetition)
      if (bottomRowCards.length > 0) {
        bottomRowCards.forEach((_, idx) => {
          const el = bottomCardRefs.current[idx];
          if (!el) return;

          const x = bottomStartX + idx * pitch - currentOffset;

          if (Math.abs(x) > visibleThreshold) {
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
            return;
          }
          el.style.pointerEvents = "auto";

          const normX = Math.max(-1.5, Math.min(1.5, x / Math.max(Z, 1)));
          const curveY = curveAmount * normX * normX;
          const tangentAngle =
            Math.atan((-2 * curveAmount * x) / (Z * Z)) * curveRotationMul;
          const tiltRad = Math.max(
            -curveMaxTiltRad,
            Math.min(curveMaxTiltRad, tangentAngle)
          );
          const floatY = 3.5 * Math.sin(t * 1.15 + (idx + 10) * 0.72);

          // Dynamically compute safe half-row clearance accounting for 3D tilt corner projection
          const cornerTiltExpansion = Math.abs(Math.sin(tiltRad)) * (cardWidth * 0.5);
          const safeHalfRowGap = rowGap * 0.5 + cornerTiltExpansion * 1.1;

          const xPos = x;
          const y = cardHeight * 0.5 + safeHalfRowGap - curveY + (isMobile ? 0 : floatY);
          const rotZ = isMobile ? 0 : tiltRad * (180 / Math.PI);
          const rotY = isMobile ? normX * 3.5 : normX * 10;
          const scale = 1.02 - Math.abs(normX) * (isMobile ? 0.04 : 0.06);

          const absNormX = Math.abs(normX);
          const cardOpacity =
            absNormX > 0.94 ? Math.max(0.2, 1 - (absNormX - 0.94) * 2.0) : 1;

          el.style.transform = `translate3d(${xPos}px, ${y}px, 0px) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(${scale})`;
          el.style.opacity = cardOpacity.toFixed(3);
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isInView, layout, topRowCards, bottomRowCards]);

  const handleCardClick = (card: ServiceItem) => {
    setSelectedService(card);
  };

  return (
    <section
      ref={containerRef}
      id="servicehome"
      className={`relative w-full overflow-hidden select-none bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center md:justify-between ${
        isStageMode
          ? "h-full min-h-screen py-2 sm:py-4 md:pt-20 md:pb-5"
          : "min-h-[520px] sm:min-h-screen justify-between pt-8 pb-10 md:pt-20 md:pb-5"
      }`}
      style={{
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 85% 60% at 50% 40%, rgba(0, 181, 226, 0.08) 0%, rgba(9, 9, 11, 0.7) 55%, #09090b 100%)",
        contain: "paint",
      }}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setHoveredCardId(null);
      }}
    >
      {/* Top & Bottom seamless gradient blending */}
      <div className="absolute top-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-20" />

      {/* Atmospheric Starfield Particles */}
      <AmbientStars count={layout.isMobile ? 40 : 160} />

      {/* Desktop Header Info Bar */}
      <div className="hidden md:flex relative z-30 mx-auto max-w-7xl px-4 sm:px-6 w-full flex-row items-center justify-between gap-3 text-left mb-2 sm:mb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b5e2] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00b5e2]" />
          </span>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-zinc-300">
            <span className="text-[#00b5e2] font-semibold">Our Services</span> — Specialized LED Display Solutions
          </p>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-xs md:text-sm bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
          <MoveHorizontal className="w-4 h-4 text-[#00b5e2] shrink-0" />
          <span>Scroll down to explore services</span>
        </div>
      </div>

      {/* Mobile Header: Matches process-section.tsx mobile narrative design */}
      <div className="flex md:hidden relative z-30 flex-shrink-0 flex-col items-start text-left w-full max-w-lg mx-auto px-9 sm:px-10 mb-4">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-300 font-semibold">
            Our Services
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-bold leading-[1.12] text-zinc-100 tracking-tight">
          Specialized LED display solutions.
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed mt-1.5 max-w-sm">
          Architectural engineering and bespoke visual technology built for impact.
        </p>
      </div>

      {/* DESKTOP VIEWPORT (hidden md:flex): 3D Curved Ribbon */}
      <div
        ref={viewportRef}
        className="hidden md:flex relative w-full flex-1 items-center justify-center overflow-visible z-10 my-auto min-h-[420px]"
        style={{
          perspective: "1300px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Left Edge Vignette Mask (z-10): Fades the 3D ribbon cards behind EdgeGlassCard */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 sm:w-16 md:w-20 lg:w-28 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.4) 50%, transparent 100%)",
          }}
        />

        {/* Right Edge Vignette Mask (z-10): Fades the 3D ribbon cards on right boundary */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 right-0 z-10 w-8 sm:w-16 md:w-20 lg:w-28 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(270deg, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.4) 50%, transparent 100%)",
          }}
        />

        {/* Desktop Left-Edge Glassmorphic Cards (z-30): Positioned OVER the left vignette shadow effect */}
        <EdgeGlassCard
          rowNumber={1}
          label="Specialized led solution display"
          category="LED Solutions"
          className="hidden md:flex z-30"
          style={{
            top: `calc(50% - max(125px, ${(layout.cardHeight + layout.rowGap) / 2}px))`,
          }}
          onClick={() => topRowCards[0] && handleCardClick(topRowCards[0])}
        />
        <EdgeGlassCard
          rowNumber={2}
          label="Specialized led solution display"
          category="Display Solutions"
          className="hidden md:flex z-30"
          style={{
            top: `calc(50% + max(125px, ${(layout.cardHeight + layout.rowGap) / 2}px))`,
          }}
          onClick={() => bottomRowCards[0] && handleCardClick(bottomRowCards[0])}
        />

        <div
          className="relative w-0 h-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* TOP ROW CARDS (Line 1: 8 Primary Services) */}
          {topRowCards.map((card, idx) => (
            <div
              key={`top-${card.id}-${idx}`}
              role="button"
              tabIndex={0}
              data-cursor="card"
              ref={(el) => {
                topCardRefs.current[idx] = el;
              }}
              className="absolute pointer-events-auto will-change-transform touch-manipulation cursor-pointer block select-none text-left"
              style={{
                width: `${layout.cardWidth}px`,
                height: `${layout.cardHeight}px`,
                left: `${-layout.cardWidth / 2}px`,
                top: `${-layout.cardHeight / 2}px`,
                transformStyle: "preserve-3d",
              }}
              onClick={() => handleCardClick(card)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(card);
                }
              }}
              onPointerEnter={() => setHoveredCardId(card.id)}
              onPointerLeave={() => {
                setHoveredCardId((current) =>
                  current === card.id ? null : current
                );
              }}
            >
              <CardContent
                card={card}
                isHovered={hoveredCardId === card.id}
              />
            </div>
          ))}

          {/* BOTTOM ROW CARDS (Line 2: 8 Exhibition, Branding & Fabrication Services) */}
          {bottomRowCards.map((card, idx) => (
            <div
              key={`bottom-${card.id}-${idx}`}
              role="button"
              tabIndex={0}
              data-cursor="card"
              ref={(el) => {
                bottomCardRefs.current[idx] = el;
              }}
              className="absolute pointer-events-auto will-change-transform touch-manipulation cursor-pointer block select-none text-left"
              style={{
                width: `${layout.cardWidth}px`,
                height: `${layout.cardHeight}px`,
                left: `${-layout.cardWidth / 2}px`,
                top: `${-layout.cardHeight / 2}px`,
                transformStyle: "preserve-3d",
              }}
              onClick={() => handleCardClick(card)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(card);
                }
              }}
              onPointerEnter={() => setHoveredCardId(card.id)}
              onPointerLeave={() => {
                setHoveredCardId((current) =>
                  current === card.id ? null : current
                );
              }}
            >
              <CardContent
                card={card}
                isHovered={hoveredCardId === card.id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE VIEWPORT (flex md:hidden): Dedicated Scroll-Driven Horizontal Track */}
      <div className="flex md:hidden relative w-full flex-col justify-center items-center overflow-hidden z-10 py-1">
        {/* Moving cards track container */}
        <div className="relative w-full overflow-hidden">
          {/* Mobile Left-Edge Glassmorphic Cards (Attached to leftmost edge for Line 1 & Line 2, z-30 over shadows) */}
          <EdgeGlassCard
            rowNumber={1}
            label="Specialized led solution display"
            category="LED Solutions"
            className="flex md:hidden top-[110px] sm:top-[118px] z-30"
            onClick={() => topRowCards[0] && handleCardClick(topRowCards[0])}
          />
          <EdgeGlassCard
            rowNumber={2}
            label="Specialized led solution display"
            category="Display Solutions"
            className="flex md:hidden top-[336px] sm:top-[360px] z-30"
            onClick={() => bottomRowCards[0] && handleCardClick(bottomRowCards[0])}
          />

          <div className="mobile-service-cards-track flex flex-col gap-3.5 w-max will-change-transform py-1">
            {/* Row 1: 8 Primary LED & Interactive Solutions */}
            <div className="flex gap-3.5 items-center flex-nowrap">
              {topRowCards.map((card, idx) => (
                <MobileServiceCard
                  key={`m-top-${card.id}-${idx}`}
                  card={card}
                  index={idx}
                  isTop
                  onSelect={handleCardClick}
                />
              ))}
            </div>
            {/* Row 2: 8 Exhibition, Branding & Fabrication Solutions (aligned directly with Row 1) */}
            <div className="flex gap-3.5 items-center flex-nowrap">
              {bottomRowCards.map((card, idx) => (
                <MobileServiceCard
                  key={`m-bottom-${card.id}-${idx}`}
                  card={card}
                  index={idx}
                  isTop={false}
                  onSelect={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIDE DRAWER FOR SERVICE DETAILS */}
      <ServiceDrawer
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSelectService={(card) => setSelectedService(card)}
      />
    </section>
  );
}

/**
 * MobileServiceCard
 * High-performance card optimized for mobile scroll-driven track with grayscale-to-color focus
 */
function MobileServiceCard({
  card,
  index,
  isTop,
  onSelect,
}: {
  card: ServiceItem;
  index: number;
  isTop: boolean;
  onSelect: (card: ServiceItem) => void;
}) {
  const hasImage = Boolean(card.image);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(card)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(card);
        }
      }}
      className={`mobile-service-card ${
        isTop ? "mobile-card-top" : "mobile-card-bottom"
      } ${
        index === 0 ? "is-active" : ""
      } group relative w-[270px] sm:w-[290px] h-[212px] sm:h-[228px] rounded-[14px] border border-white/10 bg-[#0b1319]/95 p-3 flex flex-col justify-between overflow-hidden shrink-0 select-none shadow-[0_8px_24px_rgba(0,0,0,0.6)] active:scale-[0.98] cursor-pointer text-left`}
    >
      {/* Subtle brand glow on active */}
      <div className="pointer-events-none absolute -inset-[1px] rounded-[14px] opacity-0 group-[.is-active]:opacity-100 transition-opacity duration-400 bg-gradient-to-br from-[#00b5e2]/30 via-transparent to-transparent" />

      {/* Media Frame (Image) */}
      <div className="relative z-10 w-full aspect-[16/9] max-h-[102px] sm:max-h-[112px] rounded-[8px] overflow-hidden bg-black/50 shrink-0 border border-white/5 pointer-events-none">
        {hasImage ? (
          <img
            src={card.image}
            alt={card.title}
            draggable={false}
            className="mobile-card-img w-full h-full object-cover object-center pointer-events-none"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900/60 text-zinc-600 text-[10px] font-medium pointer-events-none">
            SERVICE
          </div>
        )}
      </div>

      {/* Service Title, Category & Read More Container */}
      <div className="relative z-10 flex flex-col justify-between mt-1 flex-1 min-h-0 overflow-hidden pointer-events-none">
        <div>
          {card.category && (
            <span className="mobile-card-cat text-[9px] sm:text-[9.5px] tracking-wider uppercase font-semibold mb-0.5 block truncate pointer-events-none">
              {card.category}
            </span>
          )}
          <h3 className="mobile-card-title text-[12.5px] sm:text-[13.5px] font-bold leading-tight tracking-normal line-clamp-1 pointer-events-none">
            {card.title}
          </h3>
        </div>

        <div className="mobile-card-readmore flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-zinc-400 group-[.is-active]:text-[#00b5e2] transition-colors duration-300 pt-1 pointer-events-none">
          <span>Read more</span>
          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 group-[.is-active]:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}

/**
 * CardContent
 * Styled with Brand Cyan (#00b5e2) and proximity lighting
 * Clean service card displaying ONLY image and title
 */
function CardContent({
  card,
  isHovered,
}: {
  card: ServiceItem;
  isHovered: boolean;
}) {
  const hasImage = Boolean(card.image);
  const cardRef = useRef<HTMLDivElement>(null);
  const [localMouse, setLocalMouse] = useState({ xPct: 50, yPct: 50, pxX: 120, pxY: 150 });
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // On coarse pointers (touch mobile screens), skip calculating 3D mouse tilt
    if (typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches) return;

    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    const xPct = Math.max(0, Math.min(100, (pxX / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (pxY / rect.height) * 100));

    setLocalMouse({ xPct, yPct, pxX, pxY });

    // Magnetic 3D tilt towards mouse position
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const tiltX = -((pxY - midY) / midY) * 7.5;
    const tiltY = ((pxX - midX) / midX) * 7.5;
    setTiltStyle({ rotateX: tiltX, rotateY: tiltY });
  };

  const handlePointerLeave = () => {
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative w-full h-full rounded-[14px] border border-white/10 bg-[#0b1319]/95 p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none transition-[transform,box-shadow,border-color] duration-500 ease-out text-left touch-manipulation ${
        isHovered ? "scale-[1.02] z-30 shadow-[0_12px_36px_rgba(0,0,0,0.7)] border-[#00b5e2]/40" : ""
      }`}
      style={{
        transform: `perspective(700px) rotateX(${tiltStyle.rotateX.toFixed(
          2
        )}deg) rotateY(${tiltStyle.rotateY.toFixed(2)}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Radial Border Glow Layer (Brand Cyan #00b5e2) */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[14px] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          padding: "1.5px",
          background: `radial-gradient(180px circle at ${localMouse.xPct}% ${localMouse.yPct}%, rgba(0, 181, 226, 0.85) 0%, rgba(0, 181, 226, 0.2) 50%, transparent 80%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        aria-hidden="true"
      />

      {/* Surface Spotlight Overlay (Brand Cyan) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ease-out rounded-[14px]"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(circle 180px at ${localMouse.pxX}px ${localMouse.pxY}px, rgba(0, 181, 226, 0.2) 0%, rgba(0, 181, 226, 0.04) 50%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Media Frame (Image) */}
      <div className="relative z-10 w-full aspect-[16/10] max-h-[90px] sm:max-h-none rounded-[8px] sm:rounded-[10px] overflow-hidden bg-black/40 shrink-0 border border-white/5 pointer-events-none">
        {hasImage ? (
          <img
            src={card.image}
            alt={card.title}
            draggable={false}
            className={`w-full h-full object-cover object-center pointer-events-none transition-all duration-500 ease-out ${
              isHovered
                ? "grayscale-0 scale-[1.04]"
                : "grayscale-0 sm:grayscale sm:group-hover:grayscale-0"
            }`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900/60 text-zinc-600 text-xs font-medium pointer-events-none">
            SERVICE
          </div>
        )}
      </div>

      {/* Service Title, Category & Read More Container in Project Font */}
      <div className="relative z-10 flex flex-col justify-between mt-1.5 sm:mt-2.5 flex-1 min-h-0 overflow-hidden pointer-events-none">
        <div>
          {card.category && (
            <span className="text-[9px] sm:text-[10.5px] tracking-wider uppercase text-[#00b5e2]/80 font-semibold mb-0.5 sm:mb-1 block truncate pointer-events-none">
              {card.category}
            </span>
          )}
          <h3 className="text-[13px] sm:text-[15.5px] font-bold leading-tight sm:leading-snug tracking-normal text-white line-clamp-2 group-hover:text-cyan-100 transition-colors duration-300 pointer-events-none">
            {card.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-medium text-zinc-400 group-hover:text-[#00b5e2] transition-colors duration-300 pt-1 pointer-events-none">
          <span>Read more</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}

export default ServiceHome;
