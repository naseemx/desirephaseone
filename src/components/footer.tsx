"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Mail, Phone } from "lucide-react";
import { SERVICES } from "@/data/service";

export interface FooterProps {
  isStageMode?: boolean;
}

export function Footer({ isStageMode = false }: FooterProps = {}) {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Group all 16 services into 4 columns of 4 services each
  const serviceColumns = [
    SERVICES.slice(0, 4),
    SERVICES.slice(4, 8),
    SERVICES.slice(8, 12),
    SERVICES.slice(12, 16),
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://x.com",
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/971569905842?text=Hello%20Desire%20Digital%20team,%20I%20would%20like%20to%20inquire%20about%20your%20services.",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.17 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      id="footer"
      className="relative w-full bg-transparent text-zinc-400 select-none overflow-hidden"
    >
      {/* ── Minimal Optical Laser Gradient Line (Tapered ends with middle thickness & smooth slow blinking) ── */}
      <div className="relative w-full flex items-center justify-center pointer-events-none pt-1 pb-2 sm:pb-3 overflow-visible">
        <svg
          viewBox="0 0 1200 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[90%] max-w-4xl lg:max-w-5xl h-3 sm:h-3.5 overflow-visible pointer-events-none animate-beam-blink-smooth"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Core Linear Gradient: Transparent -> Electric Cyan -> Pure White Hotspot -> Electric Cyan -> Transparent */}
            <linearGradient id="opticalFlareCore" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
              <stop offset="25%" stopColor="#00e5ff" stopOpacity="0.4" />
              <stop offset="47%" stopColor="#00f0ff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="53%" stopColor="#00f0ff" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#00e5ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>

            {/* Aura Gradient for outer glow */}
            <linearGradient id="opticalFlareAura" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00b5e2" stopOpacity="0" />
              <stop offset="30%" stopColor="#00e5ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#00e5ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00b5e2" stopOpacity="0" />
            </linearGradient>

            <filter id="opticalGlowFilter" x="-10%" y="-100%" width="120%" height="300%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1: Ambient Outer Aura (softly glowing tapered lens spindle) */}
          <path
            d="M 0 10 Q 600 4.5, 1200 10 Q 600 15.5, 0 10 Z"
            fill="url(#opticalFlareAura)"
            filter="url(#opticalGlowFilter)"
            opacity="0.75"
          />

          {/* Layer 2: Core Flare Body (razor-sharp ends at 0 & 1200, small elegant thickness at 600) */}
          <path
            d="M 10 10 Q 600 7.8, 1190 10 Q 600 12.2, 10 10 Z"
            fill="url(#opticalFlareCore)"
          />

          {/* Layer 3: Ultra-fine central filament for piercing laser brilliance */}
          <line
            x1="100"
            y1="10"
            x2="1100"
            y2="10"
            stroke="url(#opticalFlareCore)"
            strokeWidth="0.8"
            opacity="0.9"
          />
        </svg>
      </div>

      <div
        className={
          isStageMode
            ? "mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-3.5"
            : "mx-auto max-w-7xl px-6 py-10 sm:py-14 lg:px-10"
        }
      >
        {/* Main 3-Section Layout: Brand & Col 1 Services | Our Services (Cols 2-4) | Quick Contact & Social Media */}
        <div
          className={
            isStageMode
              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-3 sm:pb-4"
              : "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-8"
          }
        >
          {/* Col 1: Logo & First Column of Services (on desktop) */}
          <div
            className={`sm:col-span-1 lg:col-span-3 order-1 flex flex-col items-start ${
              isStageMode ? "space-y-2.5" : "space-y-3.5"
            }`}
          >
            <a
              href="#hero"
              className="flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 active:scale-[0.98]"
              aria-label="Home"
            >
              <div
                className={`relative shrink-0 ${
                  isStageMode
                    ? "h-[24px] sm:h-[26px] w-[62px] sm:w-[68px]"
                    : "h-[26px] sm:h-[30px] w-[66px] sm:w-[76px]"
                }`}
              >
                <Image
                  src="/companylogo.png"
                  alt="Desire Advertising"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="h-3.5 sm:h-4 w-[1px] bg-white/20 shrink-0" />

              <div
                className={`relative shrink-0 ${
                  isStageMode
                    ? "h-[15px] sm:h-[16px] w-[85px] sm:w-[92px]"
                    : "h-[16px] sm:h-[18px] w-[90px] sm:w-[102px]"
                }`}
              >
                <Image
                  src="/brandlogo.png"
                  alt="Dzyr Digital"
                  fill
                  className="object-contain"
                />
              </div>
            </a>

            {/* Desktop: First column of services placed directly under the logo */}
            <div className="hidden lg:flex flex-col space-y-2 text-xs sm:text-[12.5px] pt-0.5">
              {serviceColumns[0].map((service) => (
                <Link
                  key={service.id}
                  href={`/servicepage/${service.id}`}
                  className="text-zinc-400 hover:text-white transition-colors leading-snug"
                >
                  {service.navbarTitle || service.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2: Services (Remaining 3 columns on desktop, all 4 on mobile/tablet) */}
          <div
            className={`sm:col-span-2 lg:col-span-6 order-2 sm:order-3 lg:order-2 flex flex-col ${
              isStageMode ? "space-y-2.5 lg:pt-[36px]" : "space-y-3.5 lg:pt-[44px]"
            }`}
          >
            {/* Mobile / Tablet (< lg): Display all 4 columns */}
            <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 sm:gap-y-2 text-xs sm:text-[12.5px]">
              {serviceColumns.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col space-y-2">
                  {col.map((service) => (
                    <Link
                      key={service.id}
                      href={`/servicepage/${service.id}`}
                      className="text-zinc-400 hover:text-white transition-colors leading-snug"
                    >
                      {service.navbarTitle || service.title}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Desktop (lg+): Display the remaining 3 columns */}
            <div className="hidden lg:grid grid-cols-3 gap-x-6 gap-y-2 text-xs sm:text-[12.5px]">
              {serviceColumns.slice(1).map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col space-y-2">
                  {col.map((service) => (
                    <Link
                      key={service.id}
                      href={`/servicepage/${service.id}`}
                      className="text-zinc-400 hover:text-white transition-colors leading-snug"
                    >
                      {service.navbarTitle || service.title}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Contact with Social Media on top of Desire Advertising LLC in a single line (3 cols on desktop) */}
          <div
            className={`sm:col-span-1 lg:col-span-3 order-3 sm:order-2 lg:order-3 flex flex-col ${
              isStageMode ? "space-y-2.5" : "space-y-3.5"
            }`}
          >
            {/* Social Media icons in a single line on top of Desire Advertising LLC */}
            <div className="flex items-center flex-nowrap gap-2 pt-0.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={social.name}
                  title={social.name}
                  className={`rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 flex items-center justify-center shrink-0 transition-all duration-300 hover:bg-[#00b5e2] hover:text-black hover:border-[#00b5e2] hover:shadow-[0_0_15px_rgba(0,181,226,0.45)] hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                    isStageMode ? "w-7.5 h-7.5" : "w-8 h-8"
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div
              className={`flex flex-col text-zinc-400 ${
                isStageMode ? "space-y-1.5 text-xs sm:text-[12.5px]" : "space-y-2 text-xs sm:text-[13px]"
              }`}
            >
              <div>
                <p className="text-white font-medium">Desire Advertising LLC</p>
                <p className="text-zinc-400 text-[11.5px] sm:text-xs">Dubai, UAE</p>
              </div>

              {/* Contact links with inline icons */}
              <div className="pt-0.5 flex flex-col space-y-1.5">
                <a
                  href="mailto:digital@desire.ae"
                  className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-[#00b5e2] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#00b5e2] shrink-0" />
                  <span>digital@desire.ae</span>
                </a>

                <a
                  href="tel:+971559944475"
                  className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-[#00b5e2] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00b5e2] shrink-0" />
                  <span>+971 55 994 4475</span>
                </a>

                <a
                  href="https://wa.me/971569905842"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-[#00b5e2] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-[#00b5e2] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.17 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29" />
                  </svg>
                  <span>+971 56 990 5842</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 ${
            isStageMode ? "pt-3.5 sm:pt-4 text-xs" : "pt-6 text-xs"
          }`}
        >
          <p>© {new Date().getFullYear()} Desire Advertising LLC &amp; Dzyr Digital. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className={`group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-[#00b5e2]/50 hover:bg-white/[0.06] hover:text-white active:scale-95 cursor-pointer ${
              isStageMode ? "px-3 py-1 text-xs" : "px-4 py-2 text-xs"
            }`}
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3 text-[#00b5e2] transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
