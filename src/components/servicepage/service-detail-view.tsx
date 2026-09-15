"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ServiceItem, getAdjacentServices } from "@/data/service";
import { AmbientStars } from "@/components/ui/ambient-stars";
import { Footer } from "@/components/footer";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

interface ServiceDetailViewProps {
  service: ServiceItem;
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const { prev, next } = getAdjacentServices(service.id);

  const whatsappMessage = encodeURIComponent(
    `Hello Desire Advertising team! I am interested in inquiring about your "${service.title}" service.`
  );

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-[var(--brand-cyan)] selection:text-black overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ATMOSPHERIC BACKGROUNDS                                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(0, 181, 226, 0.12) 0%, rgba(9, 9, 11, 0) 70%), radial-gradient(ellipse 60% 40% at 90% 45%, rgba(99, 102, 241, 0.05) 0%, rgba(9, 9, 11, 0) 70%)",
        }}
      />
      <AmbientStars count={75} />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* FLOATING ORGANIC HEADER NAVIGATION                                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/[0.08] transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand & Company Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 active:scale-[0.98]"
            aria-label="Home"
          >
            <div className="relative h-[26px] sm:h-[30px] w-[65px] sm:w-[76px] shrink-0">
              <Image
                src="/companylogo.png"
                alt="Desire Advertising"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-[16px] sm:h-[18px] w-[1px] bg-white/20 shrink-0" />
            <div className="relative h-[16px] sm:h-[18px] w-[90px] sm:w-[105px] shrink-0">
              <Image
                src="/brandlogo.png"
                alt="Dzyr Digital"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Action links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/#servicehome"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#00b5e2]/40 transition-all duration-300"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#00b5e2]" />
              <span className="hidden xs:inline">Back to</span> Services
            </Link>

            <a
              href={`https://wa.me/971501234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-black bg-[#00b5e2] hover:bg-[#00b5e2]/90 shadow-[0_0_18px_rgba(0,181,226,0.4)] transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Inquire Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT                                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16 pb-20 sm:pb-28">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Home
          </Link>
          <span className="text-zinc-600 text-xs">/</span>
          <Link
            href="/#servicehome"
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Services
          </Link>
          <span className="text-zinc-600 text-xs">/</span>
          <span className="text-xs text-[#00b5e2] font-medium">
            {service.category || "Solution"}
          </span>
        </div>


        {/* Master Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] mb-10 sm:mb-14 max-w-4xl">
          {service.title}
        </h1>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* SHOWCASE IMAGE FRAME                                              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="relative mb-12 sm:mb-16">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.05] to-black/60 shadow-[0_0_60px_rgba(0,181,226,0.12)]">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover object-center"
              priority
            />
            {/* Ambient vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* SERVICE DESCRIPTION & OVERVIEW                                    */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {service.description && (
          <div className="max-w-4xl mb-16 sm:mb-24">
            <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#00b5e2] font-semibold mb-4">
                <span>✦</span> Overview
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-zinc-200 leading-relaxed font-normal">
                {service.description}
              </p>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* PREVIOUS & NEXT SERVICE NAVIGATOR RIBBON                          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 pt-10 sm:pt-14">
          <div className="text-center text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">
            Explore Other Solutions
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Previous Service */}
            <Link
              href={`/servicepage/${prev.id}`}
              className="group p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-[#00b5e2]/40 transition-all duration-300 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.04] group-hover:bg-[#00b5e2]/20 border border-white/10 group-hover:border-[#00b5e2]/40 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-[#00b5e2] transition-colors" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                    Previous Service
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#00b5e2] transition-colors line-clamp-1">
                    {prev.title}
                  </div>
                </div>
              </div>
            </Link>

            {/* Next Service */}
            <Link
              href={`/servicepage/${next.id}`}
              className="group p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-[#00b5e2]/40 transition-all duration-300 flex items-center justify-between gap-4"
            >
              <div className="text-right flex-1">
                <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                  Next Service
                </div>
                <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#00b5e2] transition-colors line-clamp-1">
                  {next.title}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/[0.04] group-hover:bg-[#00b5e2]/20 border border-white/10 group-hover:border-[#00b5e2]/40 flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#00b5e2] transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* GLOBAL FOOTER                                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

export default ServiceDetailView;
