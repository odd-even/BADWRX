import type { MetadataRoute } from "next";
import { getSiteUrl, isSitePublic } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isSitePublic()) {
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
