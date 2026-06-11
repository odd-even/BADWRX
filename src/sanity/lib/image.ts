import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

/** Max CDN widths tuned to how each image is displayed on the site. */
export const imageWidths = {
  /** Full-bleed heroes — home banner, university, rifle detail */
  hero: 3840,
  /** Large section backgrounds — ballistic band on home */
  section: 2560,
  /** Half-page content — field proven, rifle gallery */
  content: 1280,
  /** Sidebar / portrait — about page photo */
  portrait: 960,
  /** Product / rifle cards — builds grid, merch */
  card: 800,
  /** Full-width configurator package heroes — basecamp, rings */
  configuratorFeature: 1920,
  /** Configurator option banners — platform, optics grid tiles */
  configurator: 1280,
  /** Configurator option tiles — platforms, scopes (legacy alias) */
  configuratorOption: 800,
  /** Finish / camo swatches */
  swatch: 480,
  /** Decorative overlays — reticle */
  overlay: 1600,
  /** Open Graph / iMessage / social link previews (1200×630) */
  og: 1200,
  /** Favicon and Apple touch icon source */
  icon: 512,
  /** Apple touch icon (home screen) */
  appleIcon: 180,
  /** Default when no specific context applies */
  default: 1280,
} as const;

/** Width steps for responsive srcSet — tuned to common viewports × DPR. */
export const responsiveWidths = {
  /** Full-bleed page heroes and banners */
  hero: [640, 750, 828, 1080, 1200, 1536, 1920, 2560, 3200, 3840],
  /** Full-width section backgrounds */
  section: [640, 828, 1080, 1280, 1536, 1920, 2560],
} as const;

export type ResponsiveWidthPreset = keyof typeof responsiveWidths;

/** Cropped output sizes for social / browser branding assets. */
export const brandAssetDimensions = {
  og: { width: imageWidths.og, height: 630 },
  icon: { width: imageWidths.icon, height: imageWidths.icon },
  appleIcon: { width: imageWidths.appleIcon, height: imageWidths.appleIcon },
} as const;

export type BrandAssetPreset = keyof typeof brandAssetDimensions;

export type ImageWidthPreset = keyof typeof imageWidths;

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function imageUrl(
  source: SanityImageSource | undefined,
  width: number | ImageWidthPreset = "default",
): string | undefined {
  if (!source) return undefined;
  const resolvedWidth = typeof width === "number" ? width : imageWidths[width];
  return urlFor(source).width(resolvedWidth).auto("format").quality(80).url();
}

/** CDN URL from Sanity image field — builder first, then dereferenced asset.url. */
export function resolveSanityImageUrl(
  source: SanityImageSource | undefined,
  width: number | ImageWidthPreset = "default",
): string | undefined {
  if (!source) return undefined;
  const directUrl =
    typeof source === "object" &&
    source !== null &&
    "asset" in source &&
    source.asset &&
    typeof source.asset === "object" &&
    "url" in source.asset &&
    typeof source.asset.url === "string"
      ? source.asset.url.trim()
      : undefined;
  return imageUrl(source, width) ?? (directUrl || undefined);
}

/** Width descriptors for responsive srcSet (Sanity CDN). */
export function imageSrcSet(
  source: SanityImageSource | undefined,
  widths: readonly number[],
): string | undefined {
  if (!source || widths.length === 0) return undefined;
  return widths
    .map((width) => {
      const url = urlFor(source).width(width).auto("format").quality(80).url();
      return `${url} ${width}w`;
    })
    .join(", ");
}

export function imageSrcSetForPreset(
  source: SanityImageSource | undefined,
  preset: ResponsiveWidthPreset,
): string | undefined {
  return imageSrcSet(source, responsiveWidths[preset]);
}

/** OG cover and favicon — crop to exact dimensions (respects Sanity hotspot). */
export function brandAssetImageUrl(
  source: SanityImageSource | undefined,
  preset: BrandAssetPreset,
): string | undefined {
  if (!source) return undefined;
  const { width, height } = brandAssetDimensions[preset];
  return urlFor(source)
    .width(width)
    .height(height)
    .fit("crop")
    .auto("format")
    .quality(preset === "og" ? 85 : 90)
    .url();
}
