import { brand } from "@/lib/brand";

/** Canonical site URL for metadata, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    "https://badwrx.vercel.app";
  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

/** When true, the preview password gate is off. Indexing also requires Sanity allowSearchIndexing. */
export function isSitePublic(): boolean {
  return process.env.NEXT_PUBLIC_SITE_PUBLIC === "true";
}

export const defaultSiteDescription = `Precision rifles built to order by ${brand.name} (${brand.short}). Hand test-fired before delivery with a ballistics table and rifle-specific ammunition data.`;
