"use client";

import React from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";

export function Footer() {
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

  return (
    <footer className="relative border-t border-white/10 bg-[#09090b] text-zinc-400 select-none">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo Placeholder (Company & Brand Logos) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#hero"
              className="flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 active:scale-[0.98]"
              aria-label="Home"
            >
              {/* companylogo.png (Desire Advertising) */}
              <div className="relative h-[22px] sm:h-[26px] w-[57px] sm:w-[67px] shrink-0">
                <Image
                  src="/companylogo.png"
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Subtle vertical divider */}
              <div className="h-3.5 sm:h-4 w-[1px] bg-white/20 shrink-0" />

              {/* brandlogo.png (dzyr digital) */}
              <div className="relative h-[14px] sm:h-[16px] w-[80px] sm:w-[92px] shrink-0">
                <Image
                  src="/brandlogo.png"
                  alt="Brand Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          </div>



          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400 transition-all hover:border-[var(--brand-cyan)]/50 hover:bg-white/[0.06] hover:text-white active:scale-95"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 text-[var(--brand-cyan)] transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Minimal Copyright Bottom Note */}
        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Desire Advertising & dzyr digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
