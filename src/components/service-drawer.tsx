"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ServiceItem, getAdjacentServices } from "@/data/service";
import { X, ArrowLeft, ArrowRight, MessageCircle, ExternalLink } from "lucide-react";

export interface ServiceDrawerProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectService: (service: ServiceItem) => void;
}

export function ServiceDrawer({
  service,
  onClose,
  onSelectService,
}: ServiceDrawerProps) {
  // Retain service data during exit animation so content doesn't abruptly disappear
  const [activeService, setActiveService] = useState<ServiceItem | null>(service);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize opening & closing transitions
  useEffect(() => {
    if (service) {
      setActiveService(service);
      setIsRendered(true);

      // Lock global Lenis & body scroll
      (window as unknown as { serviceDrawerOpen?: boolean }).serviceDrawerOpen = true;
      (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis?.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Double rAF ensures browser paints off-screen translate-x-full before animating in
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(r2);
      });

      // Cleanup: reset global scroll-lock state on unmount (e.g. navigating away via Link)
      return () => {
        cancelAnimationFrame(r1);
        (window as unknown as { serviceDrawerOpen?: boolean }).serviceDrawerOpen = false;
        (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis?.start();
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    } else {
      // Trigger slide-out & backdrop fade-out
      setIsVisible(false);

      // Restore Lenis & body scroll
      (window as unknown as { serviceDrawerOpen?: boolean }).serviceDrawerOpen = false;
      (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis?.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      // Delay unmount until exit transition completes
      const timer = setTimeout(() => {
        setIsRendered(false);
        setActiveService(null);
      }, 360);

      return () => clearTimeout(timer);
    }
  }, [service]);

  // When switching services inside open drawer (Next / Prev), smoothly reset scroll to top
  useEffect(() => {
    if (service && isVisible) {
      setActiveService(service);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [service, isVisible]);

  // Isolate wheel & touch scrolling so the background page / cards never scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !isRendered) return;

    const stopPropagation = (e: Event) => {
      e.stopPropagation();
    };

    el.addEventListener("wheel", stopPropagation, { passive: false });
    el.addEventListener("touchmove", stopPropagation, { passive: true });

    return () => {
      el.removeEventListener("wheel", stopPropagation);
      el.removeEventListener("touchmove", stopPropagation);
    };
  }, [isRendered]);

  // Escape key handler
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isRendered || !activeService) return null;

  const { prev, next } = getAdjacentServices(activeService.id);

  const whatsappMessage = encodeURIComponent(
    `Hello Desire Advertising team! I am interested in inquiring about your "${activeService.title}" service.`
  );

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className={`fixed inset-0 z-[100] transition-opacity duration-350 ease-out ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
      aria-label={activeService.title}
    >
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* BACKDROP OVERLAY                                                  */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div
        onClick={handleBackdropClick}
        className={`absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-350 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SIDE DRAWER PANEL (Matching Dedicated Page Content)              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <aside
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`absolute top-0 bottom-0 right-0 w-full sm:w-[500px] md:w-[540px] lg:w-[600px] bg-[#090d12]/98 border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.85)] flex flex-col will-change-transform transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(circle at 100% 0%, rgba(0, 181, 226, 0.4) 0%, transparent 70%)",
          }}
        />

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* STICKY HEADER                                                   */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <div className="relative z-20 flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-white/[0.08] bg-[#090d12]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b5e2] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00b5e2]" />
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#00b5e2]">
              {activeService.category || "Solution"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* SCROLLABLE DRAWER BODY                                          */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <div
          ref={scrollContainerRef}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7 py-6 sm:py-8 space-y-6 sm:space-y-7 custom-drawer-scrollbar touch-pan-y"
        >
          {/* Master Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug">
              {activeService.title}
            </h2>
          </div>

          {/* Showcase Image Frame */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.05] to-black/60 shadow-[0_0_40px_rgba(0,181,226,0.1)]">
            <Image
              src={activeService.image}
              alt={activeService.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 600px"
              priority
            />
            {/* Ambient vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Service Description & Overview */}
          {activeService.description && (
            <div className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#00b5e2] font-semibold mb-3">
                <span>✦</span> Overview
              </div>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
                {activeService.description}
              </p>
            </div>
          )}

          {/* Inquire Action Button */}
          <div className="pt-2 space-y-2.5">
            <a
              href={`https://wa.me/971501234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-black bg-[#00b5e2] hover:bg-[#00b5e2]/90 shadow-[0_0_24px_rgba(0,181,226,0.35)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Inquire Now</span>
            </a>

            <Link
              href={`/servicepage/${activeService.id}`}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#00b5e2]/40 transition-all duration-200"
            >
              <span>Open Dedicated Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>

          {/* Explore Other Solutions (Previous & Next Navigator) */}
          <div className="border-t border-white/10 pt-6 mt-4">
            <div className="text-center text-[11px] uppercase tracking-widest text-zinc-500 font-semibold mb-4">
              Explore Other Solutions
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Previous Service */}
              <button
                type="button"
                onClick={() => onSelectService(prev)}
                className="group p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-[#00b5e2]/40 transition-all duration-300 flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-white/[0.04] group-hover:bg-[#00b5e2]/20 border border-white/10 group-hover:border-[#00b5e2]/40 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#00b5e2] transition-colors" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                    Previous Service
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#00b5e2] transition-colors truncate">
                    {prev.title}
                  </div>
                </div>
              </button>

              {/* Next Service */}
              <button
                type="button"
                onClick={() => onSelectService(next)}
                className="group p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-[#00b5e2]/40 transition-all duration-300 flex items-center justify-between gap-3 text-right cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                    Next Service
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#00b5e2] transition-colors truncate">
                    {next.title}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/[0.04] group-hover:bg-[#00b5e2]/20 border border-white/10 group-hover:border-[#00b5e2]/40 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#00b5e2] transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
