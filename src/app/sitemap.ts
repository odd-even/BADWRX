import type { MetadataRoute } from "next";
import { getAllMerch, getAllRifles, getSiteSettings } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { isSearchIndexingAllowed } from "@/lib/site-indexing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  if (!isSearchIndexingAllowed(settings)) return [];

  const base = getSiteUrl();
  const now = new Date();
  const [rifles, merch] = await Promise.all([getAllRifles(), getAllMerch()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/builds`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/configure`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/merch`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/university`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const rifleRoutes: MetadataRoute.Sitemap = rifles.map((rifle) => ({
    url: `${base}/builds/${rifle.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const merchRoutes: MetadataRoute.Sitemap = merch.map((item) => ({
    url: `${base}/merch/${item.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...rifleRoutes, ...merchRoutes];
}
