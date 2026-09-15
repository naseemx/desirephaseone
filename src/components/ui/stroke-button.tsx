"use client";

import React, { forwardRef, useEffect, useRef } from "react";

export interface StrokeButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  href?: string;
  rectRef?: React.RefObject<SVGRectElement | null>;
  textRef?: React.RefObject<HTMLSpanElement | null>;
}

/**
 * StrokeButton
 * High-performance animated CTA button with dynamic SVG perimeter stroke border.
 * Features:
 * - Normalized pathLength for reliable stroke dash animations across any screen size.
 * - ResizeObserver and font loading synchronization for 100% pixel-perfect boundary matching.
 * - Masked text wrapper for line slide-up editorial reveal.
 */
export const StrokeButton = forwardRef<HTMLAnchorElement, StrokeButtonProps>(
  (
    {
      text,
      href = "#",
      className = "",
      rectRef,
      textRef,
      ...props
    },
    ref
  ) => {
    const internalAnchorRef = useRef<HTMLAnchorElement | null>(null);
    const internalRectRef = useRef<SVGRectElement | null>(null);

    const activeAnchorRef =
      (ref as React.RefObject<HTMLAnchorElement | null>) || internalAnchorRef;
    const activeRectRef = rectRef || internalRectRef;

    const updateRectBounds = () => {
      const el = activeAnchorRef.current;
      const rectEl = activeRectRef.current;
      if (!el || !rectEl) return;

      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w <= 0 || h <= 0) return;

      const r = (h - 1) / 2;
      rectEl.setAttribute("x", "0.5");
      rectEl.setAttribute("y", "0.5");
      rectEl.setAttribute("width", String(w - 1));
      rectEl.setAttribute("height", String(h - 1));
      rectEl.setAttribute("rx", String(r));
      rectEl.setAttribute("ry", String(r));
    };

    useEffect(() => {
      updateRectBounds();

      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(updateRectBounds);
      }

      if (typeof window !== "undefined" && "ResizeObserver" in window) {
        const ro = new ResizeObserver(updateRectBounds);
        if (activeAnchorRef.current) ro.observe(activeAnchorRef.current);
        return () => ro.disconnect();
      }
    }, [activeAnchorRef]);

    return (
      <a
        ref={activeAnchorRef}
        href={href}
        className={`group relative inline-flex items-center justify-center rounded-full px-7 py-3 text-xs sm:text-sm font-medium text-white transition-[transform,box-shadow,background-color] duration-300 bg-white/[0.03] hover:bg-white/[0.08] cursor-pointer hover:shadow-[0_0_24px_rgba(0,181,226,0.35)] active:scale-95 ${className}`}
        {...props}
      >
        {/* Dynamic SVG Perimeter Highlight Border */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          fill="none"
          aria-hidden="true"
        >
          <rect
            ref={activeRectRef}
            x="0.5"
            y="0.5"
            width="100%"
            height="100%"
            rx="999"
            ry="999"
            pathLength={100}
            className="stroke-[var(--brand-cyan)] transition-colors duration-300"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
            fill="none"
            style={{
              filter: "drop-shadow(0 0 4px rgba(0, 181, 226, 0.45))",
            }}
          />
        </svg>

        {/* Button text container - ample clearance, no clipping */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          <span
            ref={textRef}
            className="relative inline-block tracking-wide leading-normal select-none py-0.5"
            style={{
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            {text}
          </span>
        </div>
      </a>
    );
  }
);

StrokeButton.displayName = "StrokeButton";
