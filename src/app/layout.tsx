import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PreviewGate } from "@/components/layout/PreviewGate";
import { brand, siteTitle } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const neulisBold = localFont({
  src: "../../_assets/fonts/neulis-neue-bold.otf",
  variable: "--font-display",
  display: "swap",
  weight: "700",
});

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${brand.short}`,
  },
  description: `Precision rifles built to order by ${brand.name} (${brand.short}). Hand test-fired before delivery with a ballistics table and rifle-specific ammunition data.`,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${neulisBold.variable}`}>
      <body className="min-h-screen antialiased">
        <PreviewGate>{children}</PreviewGate>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
