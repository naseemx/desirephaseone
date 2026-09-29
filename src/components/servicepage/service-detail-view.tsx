"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ServiceItem, getAdjacentServices } from "@/data/service";
import { AmbientStars } from "@/components/ui/ambient-stars";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface ServiceDetailViewProps {
  service: ServiceItem;
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const { prev, next } = getAdjacentServices(service.id);

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
      {/* GLOBAL NAVBAR (Matching Home Page)                                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT                                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-4 sm:mb-6">
          <Link
            href="/"
            className="text-[11px] sm:text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Home
          </Link>
          <span className="text-zinc-600 text-xs">/</span>
          <Link
            href="/#servicehome"
            className="text-[11px] sm:text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Services
          </Link>
          <span className="text-zinc-600 text-xs">/</span>
          <span className="text-[11px] sm:text-xs text-[#00b5e2] font-medium">
            {service.category || "Solution"}
          </span>
        </div>

        {/* Master Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.15] mb-8 sm:mb-12 lg:mb-14 max-w-4xl">
          {service.title}
        </h1>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* SHOWCASE IMAGE FRAME                                              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="relative mb-8 sm:mb-12 lg:mb-16">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-xl sm:rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.05] to-black/60 shadow-[0_0_60px_rgba(0,181,226,0.12)]">
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
          <div className="max-w-4xl mb-10 sm:mb-16 lg:mb-24">
            <div className="p-4 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-[#00b5e2] font-semibold mb-3 sm:mb-4">
                <span>✦</span> Overview
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-zinc-200 leading-relaxed font-normal">
                {service.description}
              </p>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* COMMERCIAL SPECIFICATION TABLE                                    */}
        {/* Desktop: Full 3-column table | Mobile: Cards as in reference image*/}
        {/* ───────────────────────────────────────────────────────────────── */}
        {service.specTable && (() => {
          const table = service.specTable;
          return (
            <div className="mb-10 sm:mb-16 lg:mb-24">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white mb-6 sm:mb-8">
                {table.heading}
              </h2>

              {/* A. MOBILE SPECIFICATION CARDS (Exact match to reference image) */}
              <div className="md:hidden space-y-4">
                {table.rows.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    className="rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] shadow-lg backdrop-blur-sm"
                  >
                    {/* Card Header (Navy dark block) */}
                    <div className="bg-[#10131c] px-4 sm:px-5 py-3.5 border-b border-white/10">
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        {row.specification}
                      </h3>
                    </div>

                    {/* Commercial Range Row */}
                    <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-white/[0.07] flex items-center justify-between gap-4 bg-white/[0.01]">
                      <span className="text-xs sm:text-sm font-medium text-zinc-400 shrink-0">
                        {table.columns?.[1] || "Commercial Range"}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white text-right">
                        {row.range}
                      </span>
                    </div>

                    {/* Notes Row */}
                    <div className="px-4 sm:px-5 py-3 sm:py-3.5 flex items-start justify-between gap-4 bg-white/[0.01]">
                      <span className="text-xs sm:text-sm font-medium text-zinc-400 shrink-0 pt-0.5">
                        {table.columns?.[2] || "Notes"}
                      </span>
                      <span className="text-xs sm:text-sm font-normal text-zinc-300 text-right leading-relaxed max-w-[70%]">
                        {row.notes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* B. DESKTOP SPECIFICATION TABLE (Full table for md: screens and above) */}
              <div className="hidden md:block overflow-hidden rounded-2xl lg:rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#10131c] border-b border-white/10">
                        <th className="py-4 px-6 lg:px-8 text-xs sm:text-sm font-semibold tracking-wide text-white w-1/4">
                          {table.columns?.[0] || "Specification"}
                        </th>
                        <th className="py-4 px-6 lg:px-8 text-xs sm:text-sm font-semibold tracking-wide text-white w-1/4">
                          {table.columns?.[1] || "Commercial Range"}
                        </th>
                        <th className="py-4 px-6 lg:px-8 text-xs sm:text-sm font-semibold tracking-wide text-white w-1/2">
                          {table.columns?.[2] || "Notes"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="py-4 px-6 lg:px-8 text-sm font-semibold text-white whitespace-nowrap">
                            {row.specification}
                          </td>
                          <td className="py-4 px-6 lg:px-8 text-sm font-normal text-zinc-200 whitespace-nowrap">
                            {row.range}
                          </td>
                          <td className="py-4 px-6 lg:px-8 text-sm font-normal text-zinc-400 leading-relaxed">
                            {row.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* KEY CAPABILITIES: HEADING & 3 BOXES (Desktop: 1 row of 3 boxes)   */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {service.features && service.features.length > 0 && (
          <div className="mb-10 sm:mb-16 lg:mb-24">
            {/* Heading above the boxes */}
            <div className="max-w-3xl mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
                {service.featuresHeading || "Core Engineering Capabilities"}
              </h2>
            </div>

            {/* Desktop: exactly 3 boxes in a row (grid-cols-1 md:grid-cols-3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
              {service.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-[#00b5e2]/40 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-sm group hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,181,226,0.12)] overflow-hidden h-full"
                >
                  {/* Subtle top edge glass hairline highlight */}
                  <div className="pointer-events-none absolute inset-x-5 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-[#00b5e2]/50 transition-colors duration-300" />

                  <div className="flex flex-col flex-1">
                    {/* Box Title in Quicksand SemiBold */}
                    <h3 className="text-sm sm:text-base lg:text-[19px] font-semibold text-white tracking-tight leading-snug mb-3.5 sm:mb-5 pb-2.5 sm:pb-3 border-b border-white/10 group-hover:text-cyan-100 transition-colors">
                      {feature.title}
                    </h3>

                    {/* Content: List items or description */}
                    {feature.items && feature.items.length > 0 ? (
                      <div className="flex flex-col flex-1">
                        {feature.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-start gap-2.5 sm:gap-3.5 py-2.5 sm:py-3 border-b border-white/[0.07] last:border-b-0"
                          >
                            {feature.type === "numbered" ? (
                              <span className="w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full bg-[#00b5e2] text-black font-semibold text-[11px] sm:text-xs flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,181,226,0.35)] mt-0.5">
                                {itemIdx + 1}
                              </span>
                            ) : (
                              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#00b5e2]/15 border border-[#00b5e2]/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00b5e2]" strokeWidth={2.5} />
                              </div>
                            )}
                            <span className="text-xs sm:text-[13.5px] text-zinc-200 font-normal leading-relaxed pt-0.5">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : feature.description ? (
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* SECOND OVERVIEW SECTION                                          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {service.secondaryOverview && (
          <div className="max-w-4xl mb-10 sm:mb-16 lg:mb-24">
            <div className="p-4 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm relative overflow-hidden">
              {/* Subtle top edge hairline highlight */}
              <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00b5e2]/30 to-transparent" />

              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-[#00b5e2] font-semibold mb-3 sm:mb-4">
                <span>✦</span> {service.secondaryOverviewTitle || "Overview"}
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-zinc-200 leading-relaxed font-normal">
                {service.secondaryOverview}
              </p>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* FIVE SQUARE PITCH BOXES (Desktop: all 5 in the exact same row)   */}
        {/* Mobile: 2-column square grid, 5th box spanning nicely             */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {service.pitchBoxes && service.pitchBoxes.length > 0 && (
          <div className="mb-10 sm:mb-16 lg:mb-24">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 items-stretch">
              {service.pitchBoxes.map((box, bIdx) => {
                const isFifthOnMobile = bIdx === 4;
                const isStandard = bIdx === 2;

                return (
                  <div
                    key={bIdx}
                    className={`relative rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white/[0.02] border transition-all duration-300 backdrop-blur-sm group hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,181,226,0.14)] overflow-hidden flex flex-col justify-between ${
                      isStandard
                        ? "border-[#00b5e2]/40 shadow-[0_0_20px_rgba(0,181,226,0.1)]"
                        : "border-white/[0.08] hover:border-[#00b5e2]/50"
                    } ${
                      isFifthOnMobile
                        ? "col-span-2 sm:col-span-1 p-4 sm:p-5 lg:p-6"
                        : "col-span-1 p-3.5 sm:p-5 lg:p-6"
                    }`}
                  >
                    {/* Top cyan accent line as seen in screenshot */}
                    <div
                      className={`absolute inset-x-0 top-0 h-[2px] transition-all duration-300 ${
                        isStandard
                          ? "bg-[#00b5e2] shadow-[0_0_10px_rgba(0,181,226,0.6)]"
                          : "bg-[#00b5e2]/50 group-hover:bg-[#00b5e2] group-hover:shadow-[0_0_10px_rgba(0,181,226,0.6)]"
                      }`}
                    />

                    <div className="flex flex-col flex-1">
                      {/* Pitch Title in Brand Cyan SemiBold */}
                      <div className="text-base sm:text-xl lg:text-2xl font-semibold text-[#00b5e2] tracking-tight mb-0.5 sm:mb-1">
                        {box.pitch}
                      </div>

                      {/* Viewing Distance */}
                      <div className="text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-2 sm:mb-3 lg:mb-4">
                        {box.distance}
                      </div>

                      {/* Category Title in SemiBold */}
                      <div className="text-xs sm:text-[13px] lg:text-[14px] font-semibold text-white tracking-tight leading-snug mb-1.5 sm:mb-2 group-hover:text-cyan-100 transition-colors">
                        {box.category}
                      </div>

                      {/* Description in Regular */}
                      <p className="text-[10.5px] sm:text-[11.5px] lg:text-xs text-zinc-400 leading-relaxed font-normal">
                        {box.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* PREVIOUS & NEXT SERVICE NAVIGATOR RIBBON                          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 pt-8 sm:pt-14">
          <div className="text-center text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-5 sm:mb-6">
            Explore Other Solutions
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {/* Previous Service */}
            <Link
              href={`/servicepage/${prev.id}`}
              className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-[#00b5e2]/40 transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] group-hover:bg-[#00b5e2]/20 border border-white/10 group-hover:border-[#00b5e2]/40 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-[#00b5e2] transition-colors" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                    Previous Service
                  </div>
                  <div className="text-xs sm:text-base font-semibold text-white group-hover:text-[#00b5e2] transition-colors line-clamp-1">
                    {prev.title}
                  </div>
                </div>
              </div>
            </Link>

            {/* Next Service */}
            <Link
              href={`/servicepage/${next.id}`}
              className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-[#00b5e2]/40 transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4"
            >
              <div className="text-left sm:text-right flex-1">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                  Next Service
                </div>
                <div className="text-xs sm:text-base font-semibold text-white group-hover:text-[#00b5e2] transition-colors line-clamp-1">
                  {next.title}
                </div>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] group-hover:bg-[#00b5e2]/20 border border-white/10 group-hover:border-[#00b5e2]/40 flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-[#00b5e2] transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* GLOBAL FOOTER                                                      */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

export default ServiceDetailView;
