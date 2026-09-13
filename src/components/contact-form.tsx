"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";

export function ContactForm() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ledCanvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // ── Ambient LED pixel-wall moving grid canvas background (matching Preloader) ─────
  useEffect(() => {
    const canvas = ledCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let cols = 0;
    let rows = 0;
    let cell = 18;
    let gap = 2;
    let cellsState: { v: number; target: number; speed: number; isPurple?: boolean }[] = [];
    let animId: number;
    let triggerTimeout: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;

    const resize = () => {
      const parent = canvas.parentElement;
      W = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      H = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      const isMobile = W < 768;
      cell = isMobile ? 10 : 18;
      gap = isMobile ? 1.5 : 2;
      cols = Math.ceil(W / cell) + 1;
      rows = Math.ceil(H / cell) + 1;
      cellsState = new Array(cols * rows).fill(0).map(() => ({
        v: Math.random() * 0.14,
        target: Math.random() * 0.14,
        speed: 0.01 + Math.random() * 0.02,
        isPurple: Math.random() < 0.12,
      }));
    };

    window.addEventListener("resize", resize);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && sectionRef.current) {
      ro = new ResizeObserver(resize);
      ro.observe(sectionRef.current);
    }
    resize();

    // Occasionally trigger a bright glowing pixel (matching preloader)
    const trigger = () => {
      if (!isMounted) return;
      const idx = Math.floor(Math.random() * cellsState.length);
      if (cellsState[idx]) {
        cellsState[idx].target = 0.55 + Math.random() * 0.45;
      }
      if (Math.random() < 0.92) {
        triggerTimeout = setTimeout(trigger, 35 + Math.random() * 80);
      } else {
        triggerTimeout = setTimeout(trigger, 100);
      }
    };
    trigger();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const s = cellsState[i];
          if (!s) continue;
          s.v += (s.target - s.v) * s.speed;
          if (Math.abs(s.target - s.v) < 0.01 && s.target > 0.2) {
            s.target = Math.random() * 0.14;
          }
          const alpha = s.v;
          if (alpha > 0.02) {
            if (s.isPurple && alpha < 0.35) {
              ctx.fillStyle = `rgba(104, 14, 166, ${alpha.toFixed(3)})`;
            } else {
              const cyan = alpha > 0.38;
              ctx.fillStyle = cyan
                ? `rgba(51, 224, 255, ${alpha.toFixed(3)})`
                : `rgba(47, 107, 255, ${alpha.toFixed(3)})`;
            }
            ctx.fillRect(c * cell + gap, r * cell + gap, cell - gap * 2, cell - gap * 2);
          }
        }
      }
      if (isMounted) {
        animId = requestAnimationFrame(draw);
      }
    };
    draw();

    return () => {
      isMounted = false;
      window.removeEventListener("resize", resize);
      ro?.disconnect();
      cancelAnimationFrame(animId);
      if (triggerTimeout) clearTimeout(triggerTimeout);
    };
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setResult("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Web3Forms configuration
    formData.append("access_key", "82d9e6a4-f488-48a4-97de-3952ac7e7361");
    formData.append("subject", "New Display Inquiry from Desire Website");
    formData.append("from_name", "Desire Digital Website");

    // Ensure message key is populated from remark for Web3Forms email delivery
    const remarkValue = formData.get("remark") as string;
    if (remarkValue && !formData.has("message")) {
      formData.append("message", remarkValue);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setResult("Thank you! Your message has been sent successfully. Our team will get back to you shortly.");
        form.reset();
      } else {
        setStatus("error");
        setResult(data.message || "Something went wrong. Please check your details and try again.");
      }
    } catch {
      setStatus("error");
      setResult("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#060a13] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-white select-none"
    >
      {/* ── Moving Ambient LED Pixel-Wall Canvas (Same as Preloader) ────── */}
      <canvas
        ref={ledCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-65"
      />

      {/* ── Vignette Overlay for Contrast & Depth ────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(6, 10, 19, 0.45) 0%, rgba(6, 10, 19, 0.78) 55%, rgba(6, 10, 19, 0.98) 100%)",
        }}
      />

      {/* ── Form Card Container ───────────────────────────────────────── */}
      <div className="relative z-[2] mx-auto max-w-2xl w-full">
        <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0c12]/85 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Inner hairline cyan glow line */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-cyan)]/35 to-transparent" />

          <div className="mb-6 sm:mb-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-cyan)]/30 bg-[var(--brand-cyan)]/10 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--brand-cyan)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
              Contact Us
            </div>
            <h3 className="mt-3 text-xl sm:text-3xl font-bold tracking-tight text-white">
              Send us an inquiry
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Fill out the details below and our team will get in touch with you.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
            {/* 2-Column Responsive Inputs on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Name Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="name"
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  <User className="h-3 w-3 text-[var(--brand-cyan)]" />
                  Name <span className="text-[var(--brand-cyan)]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Your name or company"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:border-[var(--brand-cyan)] focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="phone"
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  <Phone className="h-3 w-3 text-[var(--brand-cyan)]" />
                  Phone <span className="text-[var(--brand-cyan)]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  placeholder="+971 50 123 4567"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:border-[var(--brand-cyan)] focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="email"
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-300"
              >
                <Mail className="h-3 w-3 text-[var(--brand-cyan)]" />
                Email <span className="text-[var(--brand-cyan)]">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="name@company.com"
                disabled={status === "loading"}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:border-[var(--brand-cyan)] focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60"
              />
            </div>

            {/* Remark Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="remark"
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-300"
              >
                <MessageSquare className="h-3 w-3 text-[var(--brand-cyan)]" />
                Remark <span className="text-[var(--brand-cyan)]">*</span>
              </label>
              <textarea
                name="remark"
                id="remark"
                required
                rows={4}
                placeholder="Write your remark or requirements here..."
                disabled={status === "loading"}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:border-[var(--brand-cyan)] focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all resize-none disabled:opacity-60"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[var(--brand-cyan)] px-8 py-3.5 text-sm font-semibold text-black tracking-wide transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(0,181,226,0.35)] cursor-pointer"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            {/* Result Feedback Banner */}
            {result && (
              <div
                className={`mt-4 flex items-start gap-3 rounded-xl p-4 text-xs sm:text-sm transition-all ${
                  status === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                )}
                <p className="leading-relaxed">{result}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
