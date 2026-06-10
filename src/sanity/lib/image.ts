import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

/** Max CDN widths tuned to how each image is displayed on the site. */
export const imageWidths = {
  /** Full-bleed heroes — home banner, university, rifle detail */
  hero: 2560,
  /** Large section backgrounds — ballistic band on home */
  section: 1920,
  /** Half-page content — field proven, rifle gallery */
  content: 1280,
  /** Sidebar / portrait — about page photo */
  portrait: 960,
  /** Product / rifle cards — builds grid, merch */
  card: 800,
  /** Configurator step previews — basecamp, rings */
  configurator: 720,
  /** Configurator option tiles — platforms, scopes */
  configuratorOption: 480,
  /** Finish / camo swatches */
  swatch: 320,
  /** Decorative overlays — reticle */
  overlay: 1600,
  /** Open Graph / iMessage / social link previews (1200×630) */
  og: 1200,
  /** Favicon and Apple touch icon source */
  icon: 512,
  /** Default when no specific context applies */
  default: 1280,
} as const;

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
