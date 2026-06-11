import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { isSearchIndexingAllowed } from "@/lib/site-indexing";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  if (!isSearchIndexingAllowed(settings)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/studio/",
        "/api/",
        "/site-login",
        "/merch/cart",
        "/merch/checkout",
        "/merch/order/success",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
