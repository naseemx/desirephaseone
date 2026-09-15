"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { AmbientStars } from "@/components/ui/ambient-stars";
import { SERVICES, ServiceItem } from "@/data/service";
import { X, MoveHorizontal } from "lucide-react";

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
export function ServiceHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Viewport Intersection State: pause all calculations when section is off-screen
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
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
  }, []);

  // Layout parameters based on container / window dimensions
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || window.innerWidth,
          height: containerRef.current.clientHeight || 780,
        });
      } else {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
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

    // Desktop (2 rows): cards sized 200-236px width
    if (!isMobile) {
      const cardWidth = Math.min(236, Math.max(200, 200 + ((w - 768) / 600) * 26));
      const cardHeight = Math.round(cardWidth * 1.16);
      const gap = 36;
      const pitch = cardWidth + gap;
      const rowGap = 40;
      const p = w >= 1280 ? 1 : Math.pow((w - 768) / 512, 2);

      return {
        isMobile: false,
        cardWidth,
        cardHeight,
        gap,
        pitch,
        rowGap,
        viewportHalfWidth: Math.max(w, 1) / 2,
        curveAmount: 10 + 54 * p,
        curveMaxTiltRad: 0.11 + 0.25 * p,
        curveRotationMul: 0.62 + 0.38 * p,
      };
    }

    // Mobile (2 rows): dynamically size cards based on BOTH width and height
    // to guarantee two rows never overlap on any screen size.
    const widthBasedCardW = Math.max(130, Math.min(170, Math.round(w * 0.40)));

    // The viewport ribbon area on mobile has a usable height.
    // We need: 2 * cardHeight + rowGap to fit inside the ribbon viewport.
    // Ribbon viewport on mobile = ~420px (leaving space for header + section padding).
    // Use the actual viewport height to compute the budget.
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
  // Row 1 (top): 8 primary services
  // Row 2 (bottom): 8 exhibition, branding & fabrication services
  const { topRowCards, bottomRowCards } = useMemo(() => {
    return {
      topRowCards: CARDS.slice(0, 8),
      bottomRowCards: CARDS.slice(8, 16),
    };
  }, []);

  const topCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Physics & Animation State
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isVerticalScrollRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const isHoveredRef = useRef(false);

  const [selectedCard, setSelectedCard] = useState<ServiceItem | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Auto-scroll speed configuration
  const autoSpeed = useMemo(() => {
    const base = layout.isMobile ? 0.28 : 0.42;
    return base;
  }, [layout.isMobile]);

  // Main 60fps/120fps physics and 3D positioning animation loop
  useEffect(() => {
    if (!isInView) return;

    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now * 0.001;

      // ─────────────────────────────────────────────────────────────────────────
      // 1. CAROUSEL SCROLL PHYSICS & LOOPING CALCULATIONS
      // ─────────────────────────────────────────────────────────────────────────
      if (!isDraggingRef.current) {
        if (!isHoveredRef.current || layout.isMobile) {
          offsetRef.current += autoSpeed;
        }

        // Inertia damping
        if (Math.abs(velocityRef.current) > 0.01) {
          offsetRef.current += velocityRef.current;
          velocityRef.current *= 0.94;
        } else {
          velocityRef.current = 0;
        }
      }

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

      const topPeriod = topRowCards.length * pitch;
      const bottomPeriod = bottomRowCards.length > 0 ? bottomRowCards.length * pitch : 1;
      const currentOffset = offsetRef.current;

      const Z = viewportHalfWidth;
      const visibleThreshold = viewportHalfWidth + cardWidth + 50;

      // Position Top Row (or Single Row on mobile)
      topRowCards.forEach((_, idx) => {
        const el = topCardRefs.current[idx];
        if (!el) return;

        const baseX = (idx - topRowCards.length / 2) * pitch;
        const rawX = baseX - currentOffset;
        const wrappedX =
          (((rawX + topPeriod / 2) % topPeriod) + topPeriod) % topPeriod -
          topPeriod / 2;

        // Frustum culling: skip offscreen cards
        if (Math.abs(wrappedX) > visibleThreshold) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          return;
        }
        el.style.pointerEvents = "auto";

        const normX = Math.max(-1.5, Math.min(1.5, wrappedX / Math.max(Z, 1)));
        const curveY = curveAmount * normX * normX;
        const tangentAngle =
          Math.atan((-2 * curveAmount * wrappedX) / (Z * Z)) * curveRotationMul;
        const tiltRad = Math.max(
          -curveMaxTiltRad,
          Math.min(curveMaxTiltRad, tangentAngle)
        );
        const floatY = 6.5 * Math.sin(t * 1.35 + idx * 0.85);

        const x = wrappedX;
        const y = -cardHeight * 0.5 - rowGap * 0.5 - curveY + (isMobile ? 0 : floatY);
        const rotZ = isMobile ? 0 : tiltRad * (180 / Math.PI);
        const rotY = isMobile ? normX * 4 : normX * 12;
        const scale = 1 - Math.abs(normX) * (isMobile ? 0.04 : 0.08);

        const absNormX = Math.abs(normX);
        const cardOpacity =
          absNormX > 0.82 ? Math.max(0.18, 1 - (absNormX - 0.82) * 1.4) : 1;

        el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(${scale})`;
        el.style.opacity = cardOpacity.toFixed(3);
      });

      // Position Bottom Row (Rendered on both mobile & desktop)
      if (bottomRowCards.length > 0) {
        bottomRowCards.forEach((_, idx) => {
          const el = bottomCardRefs.current[idx];
          if (!el) return;

          const baseX = (idx - bottomRowCards.length / 2) * pitch + (isMobile ? pitch * 0.5 : 100);
          const rawX = baseX - currentOffset;
          const wrappedX =
            (((rawX + bottomPeriod / 2) % bottomPeriod) + bottomPeriod) %
              bottomPeriod -
            bottomPeriod / 2;

          if (Math.abs(wrappedX) > visibleThreshold) {
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
            return;
          }
          el.style.pointerEvents = "auto";

          const normX = Math.max(-1.5, Math.min(1.5, wrappedX / Math.max(Z, 1)));
          const curveY = curveAmount * normX * normX;
          const tangentAngle =
            Math.atan((-2 * curveAmount * wrappedX) / (Z * Z)) * curveRotationMul;
          const tiltRad = Math.max(
            -curveMaxTiltRad,
            Math.min(curveMaxTiltRad, tangentAngle)
          );
          const floatY = 6.5 * Math.sin(t * 1.25 + (idx + 10) * 0.72);

          const x = wrappedX;
          const y = cardHeight * 0.5 + rowGap * 0.5 - curveY + (isMobile ? 0 : floatY);
          const rotZ = isMobile ? 0 : tiltRad * (180 / Math.PI);
          const rotY = isMobile ? normX * 4 : normX * 12;
          const scale = 1 - Math.abs(normX) * (isMobile ? 0.04 : 0.08);

          const absNormX = Math.abs(normX);
          const cardOpacity =
            absNormX > 0.82 ? Math.max(0.18, 1 - (absNormX - 0.82) * 1.4) : 1;

          el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(${scale})`;
          el.style.opacity = cardOpacity.toFixed(3);
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isInView, layout, topRowCards, bottomRowCards, autoSpeed]);

  // Touch & Pointer Drag Interactions
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;

    isDraggingRef.current = true;
    isVerticalScrollRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;

    if (e.pointerType !== "touch") {
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastPointerXRef.current;
    const dy = e.clientY - dragStartYRef.current;
    const totalDx = e.clientX - dragStartXRef.current;

    // Disambiguate vertical page scrolling from horizontal carousel drag
    if (e.pointerType === "touch" && !isVerticalScrollRef.current) {
      if (Math.abs(dy) > Math.abs(totalDx) && Math.abs(dy) > 10) {
        isVerticalScrollRef.current = true;
        isDraggingRef.current = false;
        return;
      }
    }

    if (isVerticalScrollRef.current) return;

    offsetRef.current -= dx;

    const now = performance.now();
    const dt = now - lastPointerTimeRef.current;
    if (dt > 8) {
      velocityRef.current = -dx * (16 / dt) * 0.65;
      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    isVerticalScrollRef.current = false;
    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture?.(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {}
  }, []);

  const handlePointerCancel = useCallback(() => {
    isDraggingRef.current = false;
    isVerticalScrollRef.current = false;
  }, []);

  // Wheel Horizontal Scrubbing
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      offsetRef.current += e.deltaX * 0.85;
    } else if (e.shiftKey) {
      offsetRef.current += e.deltaY * 0.85;
    }
  }, []);

  const handleCardClick = (card: ServiceItem) => {
    if (Math.abs(velocityRef.current) > 2) return;
    setSelectedCard(card);
  };

  return (
    <section
      ref={containerRef}
      id="servicehome"
      onWheel={handleWheel}
      className="relative w-full min-h-[520px] sm:min-h-screen pt-10 pb-12 sm:py-20 md:py-24 lg:py-28 overflow-hidden select-none bg-[#09090b] text-zinc-100 flex flex-col items-center justify-between"
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

      {/* Header Info Bar matching brand cyan */}
      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left mb-4 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b5e2] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#00b5e2]" />
          </span>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-zinc-300">
            <span className="text-[#00b5e2] font-semibold">Our Services</span> — Specialized LED Display Solutions
          </p>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-[11px] sm:text-xs md:text-sm bg-black/40 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/10 shadow-sm">
          <MoveHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00b5e2] shrink-0" />
          <span className="hidden sm:inline">Drag or scroll horizontally to explore services</span>
          <span className="sm:hidden">Swipe to explore services</span>
        </div>
      </div>

      {/* Left Edge Vignette Mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-12 sm:w-24 md:w-48 lg:w-[clamp(6rem,24vw,32rem)] sm:backdrop-blur-[12px] transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, rgba(9, 9, 11, 0.98) 0%, rgba(9, 9, 11, 0.75) 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.8) 35%, rgba(0, 0, 0, 0.35) 65%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.8) 35%, rgba(0, 0, 0, 0.35) 65%, transparent 100%)",
        }}
      />

      {/* Right Edge Vignette Mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 right-0 z-20 w-12 sm:w-24 md:w-48 lg:w-[clamp(6rem,24vw,32rem)] sm:backdrop-blur-[12px] transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(270deg, rgba(9, 9, 11, 0.98) 0%, rgba(9, 9, 11, 0.75) 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(270deg, #000 0%, rgba(0, 0, 0, 0.8) 35%, rgba(0, 0, 0, 0.35) 65%, transparent 100%)",
          maskImage:
            "linear-gradient(270deg, #000 0%, rgba(0, 0, 0, 0.8) 35%, rgba(0, 0, 0, 0.35) 65%, transparent 100%)",
        }}
      />

      {/* Center 3D Curved Ribbon Viewport (Holds Dual Ribbon Rows) */}
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative w-full h-[420px] sm:h-[540px] md:h-[620px] lg:h-[680px] flex items-center justify-center overflow-visible z-10 touch-pan-y"
        style={{
          perspective: layout.isMobile ? "1000px" : "1400px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          className="relative w-0 h-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* TOP ROW CARDS (Line 1: 8 Primary Services) */}
          {topRowCards.map((card, idx) => (
            <div
              key={`top-${card.id}-${idx}`}
              data-cursor="card"
              ref={(el) => {
                topCardRefs.current[idx] = el;
              }}
              className="absolute pointer-events-auto will-change-transform touch-manipulation"
              style={{
                width: `${layout.cardWidth}px`,
                height: `${layout.cardHeight}px`,
                left: `${-layout.cardWidth / 2}px`,
                top: `${-layout.cardHeight / 2}px`,
                transformStyle: "preserve-3d",
              }}
              onClick={() => handleCardClick(card)}
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
              data-cursor="card"
              ref={(el) => {
                bottomCardRefs.current[idx] = el;
              }}
              className="absolute pointer-events-auto will-change-transform touch-manipulation"
              style={{
                width: `${layout.cardWidth}px`,
                height: `${layout.cardHeight}px`,
                left: `${-layout.cardWidth / 2}px`,
                top: `${-layout.cardHeight / 2}px`,
                transformStyle: "preserve-3d",
              }}
              onClick={() => handleCardClick(card)}
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

      {/* SERVICE DETAIL MODAL (Responsive on both desktop and mobile) */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-[14px] sm:rounded-[16px] border border-[#00b5e2]/30 bg-[#0a1218] text-zinc-100 p-5 sm:p-8 shadow-2xl transition-all transform animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Tags / Category */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 pr-8">
              {selectedCard.category && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] tracking-wider uppercase bg-[#00b5e2]/15 text-[#00b5e2] border border-[#00b5e2]/30 font-semibold">
                  {selectedCard.category}
                </span>
              )}
              {selectedCard.tag?.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase bg-white/5 text-zinc-300 border border-white/10 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Title in Project Font */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold leading-snug mb-4 sm:mb-6">
              {selectedCard.title}
            </h2>

            {/* Image */}
            {selectedCard.image && (
              <div className="relative aspect-[16/10] w-full rounded-[10px] overflow-hidden mb-5 sm:mb-6 bg-black/40 border border-white/10">
                <img
                  src={selectedCard.image}
                  alt={selectedCard.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* Description in Project Font */}
            {selectedCard.description && (
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                {selectedCard.description}
              </p>
            )}

            {/* Features / Capabilities in Project Font */}
            {selectedCard.features && selectedCard.features.length > 0 && (
              <div className="p-4 sm:p-5 rounded-[10px] bg-white/[0.03] border border-white/10 mb-6">
                <h4 className="text-[11px] sm:text-xs uppercase tracking-widest text-[#00b5e2] font-semibold mb-3">
                  Key Capabilities & Specifications
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-zinc-300">
                  {selectedCard.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#00b5e2] text-xs mt-0.5">✦</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-400 tracking-wider font-semibold">
                DESIRE DIGITAL
              </span>
              <a
                href="#footer"
                onClick={() => setSelectedCard(null)}
                className="px-5 py-2.5 rounded-full bg-[#00b5e2] hover:bg-[#00b5e2]/90 text-black font-medium text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(0,181,226,0.4)]"
              >
                Inquire about this service
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
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
      className={`group relative w-full h-full rounded-[12px] border border-white/10 bg-[#0b1319]/95 p-2.5 sm:p-3.5 flex flex-col justify-between overflow-hidden select-none transition-[transform,box-shadow,border-color] duration-500 ease-out text-left touch-manipulation ${
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
        className="pointer-events-none absolute -inset-[1px] rounded-[12px] transition-opacity duration-500"
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
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ease-out rounded-[12px]"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(circle 160px at ${localMouse.pxX}px ${localMouse.pxY}px, rgba(0, 181, 226, 0.2) 0%, rgba(0, 181, 226, 0.04) 50%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Media Frame (Image) */}
      <div className="relative z-10 w-full aspect-[16/10] max-h-[90px] sm:max-h-none rounded-[6px] sm:rounded-[8px] overflow-hidden bg-black/40 shrink-0 border border-white/5">
        {hasImage ? (
          <img
            src={card.image}
            alt={card.title}
            className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
              isHovered
                ? "grayscale-0 scale-[1.04]"
                : "grayscale-0 sm:grayscale sm:group-hover:grayscale-0"
            }`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900/60 text-zinc-600 text-xs font-medium">
            SERVICE
          </div>
        )}
      </div>

      {/* Service Title & Category Container in Project Font */}
      <div className="relative z-10 flex flex-col justify-end mt-1 sm:mt-3 flex-1 min-h-0 overflow-hidden">
        {card.category && (
          <span className="text-[8px] sm:text-[10px] tracking-wider uppercase text-[#00b5e2]/80 font-semibold mb-0.5 sm:mb-1 truncate">
            {card.category}
          </span>
        )}
        <h3 className="text-[11.5px] sm:text-[16px] font-bold leading-tight sm:leading-snug tracking-normal text-white line-clamp-2 group-hover:text-cyan-100 transition-colors duration-300">
          {card.title}
        </h3>
      </div>
    </div>
  );
}

export default ServiceHome;
