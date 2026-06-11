import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PreviewGate } from "@/components/layout/PreviewGate";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { CMS_PAGE_REVALIDATE_SECONDS } from "@/lib/cms-cache";
import { rootSiteMetadata } from "@/lib/metadata";
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

export const revalidate = CMS_PAGE_REVALIDATE_SECONDS;

export async function generateMetadata() {
  return rootSiteMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${neulisBold.variable}`}>
      <body className="min-h-screen antialiased">
        <OrganizationJsonLd />
        <PreviewGate>{children}</PreviewGate>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
