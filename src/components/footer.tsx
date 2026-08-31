"use client";

import { useState } from "react";
import {
  Monitor,
  ShieldCheck,
  ArrowUp,
  ArrowRight,
  Mail,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Radio,
  Cpu,
  Layers,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

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
    <footer className="relative border-t border-zinc-800/80 bg-[#09090b] text-[var(--brand-grey-20)] overflow-hidden">
      {/* Ambient gradient glow using Brand Cyan */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(0,181,226,0.15),rgba(208,210,211,0.04),transparent_70%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-72 w-72 rounded-full bg-[var(--brand-cyan)]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-[var(--brand-cyan)]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12 lg:px-8">
        {/* Top Feature Banner / CTA Callout */}
        <div className="relative mb-20 overflow-hidden rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-zinc-950/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-cyan)]/35 bg-[var(--brand-cyan)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--brand-cyan)] mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Display Architecture</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--brand-grey-10)] sm:text-3xl lg:text-4xl">
                Ready to engineer your next high-impact visual experience?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[var(--brand-grey-20)] max-w-2xl leading-relaxed">
                From XR virtual production stages to ultra-fine pitch command centers,
                our engineering team delivers calibrated, zero-latency LED hardware worldwide.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs text-[var(--brand-grey-20)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-cyan)]" />
                  <span>3840Hz – 7680Hz Refresh</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-cyan)]" />
                  <span>Brompton & NovaStar Calibrated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-cyan)]" />
                  <span>IP68 Weatherproof Outdoor</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-md">
                <h3 className="text-base font-semibold text-[var(--brand-grey-10)]">
                  Request Specifications & Whitepapers
                </h3>
                <p className="mt-1 text-xs text-[var(--brand-grey-20)]/80">
                  Receive comprehensive architectural diagrams, CAD files, and photometric test logs.
                </p>

                {subscribed ? (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--brand-cyan)]/35 bg-[var(--brand-cyan)]/10 p-3.5 text-xs text-[var(--brand-cyan)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--brand-cyan)] shrink-0" />
                    <span>Inquiry logged. Our systems engineering team will be in touch shortly.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineering@company.com"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 transition-all focus:border-[var(--brand-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-cyan)] px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-[var(--brand-cyan)]/25 transition-all hover:brightness-110 active:scale-[0.99]"
                    >
                      <span>Download Engineering Brief</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 pb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--brand-cyan)]/40 bg-[var(--brand-cyan)]/15 text-[var(--brand-cyan)] shadow-inner">
                <Monitor className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight text-[var(--brand-grey-10)]">LED SCREEN STUDIO</span>
                <span className="text-[10px] font-mono tracking-widest text-[var(--brand-cyan)] uppercase">
                  Precision Visuals
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[var(--brand-grey-20)] max-w-sm">
              Pioneering next-generation LED wall engineering, modular display mechanics,
              and real-time camera-calibrated in-camera VFX environments for tier-1 productions.
            </p>

            {/* Quick telemetry indicators */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fabrication & Rigging Active</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[11px] font-mono text-[var(--brand-grey-20)]">
                <Radio className="h-3 w-3 text-[var(--brand-cyan)]" />
                <span>24/7 Deployment</span>
              </div>
            </div>
          </div>

          {/* Column 1: Display Solutions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-grey-10)]">
              Display Solutions
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--brand-grey-20)]">
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--brand-cyan)]/60" />
                  Ultra-Fine Pitch (P0.9 - P1.5)
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--brand-cyan)]/60" />
                  XR Virtual Production Stages
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--brand-cyan)]/60" />
                  Concert Touring & Festival Rigs
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--brand-cyan)]/60" />
                  Curved & Architectural Façades
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--brand-cyan)]/60" />
                  Transparent Mesh Facades
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Technology */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-grey-10)]">
              Hardware & Tech
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--brand-grey-20)]">
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <Cpu className="h-3 w-3 text-zinc-500" />
                  HDR10+ Calibration Tools
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-zinc-500" />
                  Brompton SX40 Processors
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-zinc-500" />
                  Modular Magnetic Latches
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-zinc-500" />
                  IP68 Dust & Water Ingress
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)] flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-zinc-500" />
                  Genlock & Frame Sync
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate & Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-grey-10)]">
              Global Support
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--brand-grey-20)]">
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)]">
                  Worldwide Tour Rigging
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)]">
                  On-Site Field Engineering
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)]">
                  CAD & Rigging Blueprints
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)]">
                  LED Calibration Services
                </a>
              </li>
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--brand-cyan)]">
                  Safety & Structural Certs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/80 pt-8 mt-2" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs sm:flex-row text-[var(--brand-grey-20)]/70">
          <div className="flex flex-wrap items-center gap-4">
            <span>
              © {new Date().getFullYear()} LED Screen Studio. All rights reserved.
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <div className="flex items-center gap-3">
              <a href="#hero" className="hover:text-[var(--brand-grey-10)] transition-colors">Privacy Policy</a>
              <a href="#hero" className="hover:text-[var(--brand-grey-10)] transition-colors">Terms of Service</a>
              <a href="#hero" className="hover:text-[var(--brand-grey-10)] transition-colors">Compliance (CE/UL)</a>
            </div>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-[var(--brand-grey-20)] transition-all hover:border-[var(--brand-cyan)]/50 hover:bg-zinc-800 hover:text-white active:scale-95"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 text-[var(--brand-cyan)]" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
