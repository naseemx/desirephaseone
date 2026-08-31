import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import "./globals.css";

const varelaRound = Varela_Round({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-varela-round",
});

export const metadata: Metadata = {
  title: "LED Screen Studio | High-Performance Visuals",
  description: "Modern web experience powered by Next.js, Lenis, GSAP, Framer Motion, and Lucide Icons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${varelaRound.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#09090b] text-[var(--brand-grey-20)] selection:bg-[var(--brand-cyan)] selection:text-black">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
