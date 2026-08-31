"use client";

import React, { useState } from "react";
import Image from "next/image";

interface NavbarProps {
  visible?: boolean;
}

export function Navbar({ visible = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out select-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <nav className="flex h-16 sm:h-20 w-full items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* Left: Brand Logo & Company Logo */}
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
                priority
              />
            </div>

            {/* Subtle vertical divider */}
            <div className="h-3.5 sm:h-4 w-[1px] bg-white/25 shrink-0" />

            {/* brandlogo.png (dzyr digital) */}
            <div className="relative h-[14px] sm:h-[16px] w-[80px] sm:w-[92px] shrink-0">
              <Image
                src="/brandlogo.png"
                alt="Brand Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>
        </div>

        {/* Right: Hamburger Menu Icon */}
        <div className="flex items-center">
          {/* Minimal Hamburger Menu Button (2 clean horizontal lines matching design) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="group flex h-9 w-9 items-center justify-center cursor-pointer transition-transform active:scale-90"
          >
            <div className="flex flex-col justify-center gap-1.5 w-6">
              <span
                className={`block h-[1.5px] w-6 bg-white transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[4px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-white transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Expanded Menu Drawer matching exact screenshot design */}
      <div
        className={`absolute top-3 sm:top-4 right-4 sm:right-8 lg:right-10 transition-all duration-300 ease-out origin-top-right ${
          menuOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="relative w-44 sm:w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#06060c]/90 px-6 pt-5 pb-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          style={{
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Subtle top edge hairline glow */}
          <div className="pointer-events-none absolute inset-x-5 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Top header inside drawer: Two horizontal lines close button */}
          <div className="flex justify-end mb-5">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer flex flex-col justify-center gap-1.5 w-6 items-end group"
            >
              <span className="block h-[1.5px] w-6 bg-white transition-opacity group-hover:opacity-80" />
              <span className="block h-[1.5px] w-6 bg-white transition-opacity group-hover:opacity-80" />
            </button>
          </div>

          {/* Navigation Links Right-Aligned */}
          <nav className="flex flex-col items-end space-y-3.5 text-right">
            <a
              href="#hero"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-normal text-zinc-300 transition-colors hover:text-white"
            >
              Home
            </a>
            <a
              href="#hero"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-normal text-zinc-300 transition-colors hover:text-white"
            >
              About
            </a>

            {/* Active / Highlighted 'Work' link with underline accent */}
            <div className="flex flex-col items-end">
              <a
                href="#hero"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold text-white transition-colors"
              >
                Work
              </a>
              <div className="mt-1 flex gap-1">
                <span className="h-[2px] w-2 rounded-full bg-white" />
                <span className="h-[2px] w-2 rounded-full bg-white" />
              </div>
            </div>

            <a
              href="#footer"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-normal text-zinc-300 transition-colors hover:text-white"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
