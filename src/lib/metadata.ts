import type { Metadata } from "next";
import { brand, siteTitle } from "@/lib/brand";
import { defaultBrandAssets } from "@/data/site-settings";
import { getSiteSettings } from "@/lib/content";
import { getPageSeoDescription } from "@/lib/page-seo";
import { defaultSiteDescription, getSiteUrl } from "@/lib/site";
import { isSearchIndexingAllowed } from "@/lib/site-indexing";
import { brandAssetDimensions } from "@/sanity/lib/image";
import type { BrandAssets, SiteSettings } from "@/lib/types";

function absoluteAssetUrl(url: string, siteUrl: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return new URL(url, siteUrl).href;
}

export function buildSiteMetadata(
  brandAssets: BrandAssets = defaultBrandAssets,
  settings?: Pick<SiteSettings, "allowSearchIndexing" | "pageSeo"> | null,
): Metadata {
  const siteUrl = getSiteUrl();
  const description = settings
    ? getPageSeoDescription(settings, "home")
    : defaultSiteDescription;
  const shareUrl = absoluteAssetUrl(brandAssets.shareImage.url, siteUrl);
  const faviconUrl = absoluteAssetUrl(brandAssets.favicon.url, siteUrl);
  const shareAlt = brandAssets.shareImage.alt || `${brand.short} badge`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteTitle,
      template: `%s | ${brand.short}`,
    },
    description,
    robots: isSearchIndexingAllowed(settings)
      ? { index: true, follow: true }
      : {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: brand.short,
      title: siteTitle,
      description,
      images: [
        {
          url: shareUrl,
          width: brandAssetDimensions.og.width,
          height: brandAssetDimensions.og.height,
          alt: shareAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description,
      images: [shareUrl],
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

/** Root layout metadata — pulls share image and favicon from Sanity when configured. */
export async function rootSiteMetadata(): Promise<Metadata> {
  try {
    const site = await getSiteSettings();
    return buildSiteMetadata(site.brandAssets, site);
  } catch {
    return buildSiteMetadata(undefined, null);
  }
}

export const noindexMetadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Page-level OG image override (e.g. rifle detail pages). */
export function pageOpenGraphImage(
  image: SiteSettings["brandAssets"]["shareImage"],
  siteUrl = getSiteUrl(),
): NonNullable<Metadata["openGraph"]>["images"] {
  return [
    {
      url: absoluteAssetUrl(image.url, siteUrl),
      alt: image.alt || `${brand.short}`,
    },
  ];
}
