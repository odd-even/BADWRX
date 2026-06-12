import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PreviewGate } from "@/components/layout/PreviewGate";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { getSiteSettings } from "@/lib/content";
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

/** Must be a literal — Next.js does not allow imported segment config values. */
export const revalidate = 60;

export async function generateMetadata() {
  return rootSiteMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${inter.variable} ${neulisBold.variable}`}>
      <body className="min-h-screen antialiased">
        <OrganizationJsonLd />
        <PreviewGate
          passwordProtectionEnabled={settings.siteAccess.passwordProtectionEnabled}
        >
          {children}
        </PreviewGate>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
