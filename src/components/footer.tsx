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
    <footer id="footer" className="relative border-t border-white/10 bg-[#09090b] text-zinc-400 select-none">
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

          {/* Social Links */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-[var(--brand-cyan)]/50 hover:bg-[var(--brand-cyan)]/10 hover:text-white hover:shadow-[0_0_12px_rgba(0,181,226,0.3)]"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-[var(--brand-cyan)]/50 hover:bg-[var(--brand-cyan)]/10 hover:text-white hover:shadow-[0_0_12px_rgba(0,181,226,0.3)]"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-[var(--brand-cyan)]/50 hover:bg-[var(--brand-cyan)]/10 hover:text-white hover:shadow-[0_0_12px_rgba(0,181,226,0.3)]"
              aria-label="X"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-[var(--brand-cyan)]/50 hover:bg-[var(--brand-cyan)]/10 hover:text-white hover:shadow-[0_0_12px_rgba(0,181,226,0.3)]"
              aria-label="YouTube"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
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
