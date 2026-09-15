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
  title: "Desire | Custom LED Displays, Digital Kiosks & Signage UAE",
  description:
    "The UAE's destination for custom indoor and outdoor LED displays, digital kiosks, AV integration, signage, exhibits, branding, and precision structural fabrication.",
  keywords: [
    "Desire",
    "Desire Advertising",
    "Desire Digital",
    "LED screens UAE",
    "LED display Dubai",
    "digital kiosks UAE",
    "custom exhibition booths Dubai",
    "outdoor LED screens",
    "indoor LED screens",
    "transparent mesh displays",
    "curved LED display",
    "audio-visual solutions UAE",
  ],
  authors: [{ name: "Desire Advertising LLC" }],
  creator: "Desire Advertising LLC",
  publisher: "Desire Advertising LLC",
  openGraph: {
    title: "Desire | Custom LED Displays, Digital Kiosks & Signage UAE",
    description:
      "The UAE's destination for custom indoor and outdoor LED displays, digital kiosks, AV integration, signage, and exhibits.",
    siteName: "Desire",
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desire | Custom LED Displays, Digital Kiosks & Signage UAE",
    description:
      "The UAE's destination for custom indoor and outdoor LED displays, digital kiosks, AV integration, signage, and exhibits.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
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
