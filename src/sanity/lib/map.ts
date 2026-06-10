import { normalizeNavImageFade } from "@/lib/nav-image-fade";
import type { BrandAssets, Course, Rifle, RifleImage, SiteImages, SiteSettings } from "@/lib/types";
import { defaultBrandAssets, defaultSiteImages } from "@/data/site-settings";
import { images } from "@/lib/images";
import { configuratorPlaceholder, riflePlaceholderAlt } from "@/lib/images";
import { imageUrl, brandAssetImageUrl, type ImageWidthPreset } from "./image";

interface SanityImageField {
  asset?: { url?: string };
  alt?: string;
  caption?: string;
}

interface SanityRifle {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  category: Rifle["category"];
  featured: boolean;
  startingAt?: string;
  description: string;
  heroImage?: SanityImageField;
  configuratorImage?: SanityImageField;
  gallery?: SanityImageField[];
  specs?: Rifle["specs"];
  highlights?: string[];
}

interface SanityCourse {
  _id: string;
  slug: string;
  title: string;
  level: string;
  price: string;
  tagline?: string;
  duration?: string;
  format?: string;
  description: string;
  topics?: string[];
  outcomes?: string[];
  curriculum?: { title: string; detail: string }[];
  audience?: string[];
  includes?: string[];
  heroImage?: SanityImageField;
  featured?: boolean;
}

function mapImage(
  image: SanityImageField | undefined,
  fallbackAlt = riflePlaceholderAlt,
  fallbackUrl: string = configuratorPlaceholder,
  width: ImageWidthPreset = "default",
): RifleImage {
  const url =
    imageUrl(image, width) ??
    image?.asset?.url ??
    fallbackUrl;

  return {
    url,
    alt: image?.alt ?? fallbackAlt,
    ...(image?.caption ? { caption: image.caption } : {}),
  };
}

export function mapRifle(doc: SanityRifle): Rifle {
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    tagline: doc.tagline,
    category: doc.category,
    featured: Boolean(doc.featured),
    startingAt: doc.startingAt,
    description: doc.description,
    heroImage: mapImage(doc.configuratorImage ?? doc.heroImage, riflePlaceholderAlt, configuratorPlaceholder, "hero"),
    gallery: (doc.gallery ?? []).map((item) => mapImage(item, riflePlaceholderAlt, configuratorPlaceholder, "content")),
    specs: doc.specs ?? {},
    highlights: doc.highlights ?? [],
  };
}

export function mapCourse(doc: SanityCourse): Course {
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    level: doc.level,
    price: doc.price,
    tagline: doc.tagline,
    duration: doc.duration,
    format: doc.format,
    description: doc.description,
    topics: doc.topics ?? [],
    outcomes: doc.outcomes,
    curriculum: doc.curriculum,
    audience: doc.audience,
    includes: doc.includes,
    heroImage: doc.heroImage
      ? mapImage(
          doc.heroImage,
          "Long range shooter behind a precision rifle on a carbon fiber tripod",
          images.rifle.universityHero,
          "hero",
        )
      : undefined,
    featured: doc.featured,
  };
}

const siteImageWidths = {
  reticleOverlay: "overlay",
  homeHeroBanner: "hero",
  homeFieldTested: "content",
  homeBallisticSection: "section",
  aboutHeroBanner: "hero",
  aboutStory: "portrait",
} as const satisfies Record<keyof SiteImages, ImageWidthPreset>;

function mapSiteImageField(
  image: SanityImageField | undefined,
  fallback: RifleImage,
  width: ImageWidthPreset,
): RifleImage {
  if (!image?.asset && !imageUrl(image, width)) return fallback;
  return mapImage(image, fallback.alt, fallback.url, width);
}

export function mapSiteImages(
  raw: Partial<Record<keyof SiteImages, SanityImageField>> | undefined,
  defaults: SiteImages = defaultSiteImages,
): SiteImages {
  if (!raw) return defaults;

  return {
    reticleOverlay: mapSiteImageField(
      raw.reticleOverlay,
      defaults.reticleOverlay,
      siteImageWidths.reticleOverlay,
    ),
    homeHeroBanner: mapSiteImageField(
      raw.homeHeroBanner,
      defaults.homeHeroBanner,
      siteImageWidths.homeHeroBanner,
    ),
    homeFieldTested: mapSiteImageField(
      raw.homeFieldTested,
      defaults.homeFieldTested,
      siteImageWidths.homeFieldTested,
    ),
    homeBallisticSection: mapSiteImageField(
      raw.homeBallisticSection,
      defaults.homeBallisticSection,
      siteImageWidths.homeBallisticSection,
    ),
    aboutHeroBanner: mapSiteImageField(
      raw.aboutHeroBanner,
      defaults.aboutHeroBanner,
      siteImageWidths.aboutHeroBanner,
    ),
    aboutStory: mapSiteImageField(
      raw.aboutStory,
      defaults.aboutStory,
      siteImageWidths.aboutStory,
    ),
  };
}

export function mapBrandAssets(
  raw: Partial<Record<keyof BrandAssets, SanityImageField>> | undefined,
  defaults: BrandAssets = defaultBrandAssets,
): BrandAssets {
  if (!raw) return defaults;

  return {
    shareImage: mapBrandAssetImage(raw.shareImage, defaults.shareImage, "og"),
    favicon: mapBrandAssetImage(raw.favicon, defaults.favicon, "icon"),
  };
}

function mapBrandAssetImage(
  image: SanityImageField | undefined,
  fallback: RifleImage,
  preset: "og" | "icon",
): RifleImage {
  const url =
    brandAssetImageUrl(image, preset) ??
    image?.asset?.url ??
    fallback.url;
  return {
    url,
    alt: image?.alt ?? fallback.alt,
  };
}

interface SanitySiteSettingsDoc extends Omit<Partial<SiteSettings>, "siteImages" | "brandAssets" | "navImageFade"> {
  siteImages?: Partial<Record<keyof SiteImages, SanityImageField>>;
  brandAssets?: Partial<Record<keyof BrandAssets, SanityImageField>>;
  navImageFade?: Partial<SiteSettings["navImageFade"]>;
}

export function mapSiteSettings(doc: SanitySiteSettingsDoc | null): SiteSettings | null {
  if (!doc?.name) return null;
  const { siteImages: rawImages, brandAssets: rawBrandAssets, navImageFade, ...rest } = doc;
  return {
    ...rest,
    siteImages: mapSiteImages(rawImages),
    brandAssets: mapBrandAssets(rawBrandAssets),
    navImageFade: normalizeNavImageFade(navImageFade),
  } as SiteSettings;
}

function compactHeroPhraseLines(lines: string[]): string[] {
  const joined = lines.map((line) => line.trim()).join(" ");
  if (/^engineered\s+for\s+unrelenting\s+performance$/i.test(joined)) {
    return ["Engineered for", "Unrelenting", "Performance"];
  }
  return lines;
}

/** Normalize Sanity headline phrase objects → string[] for the typewriter */
export function normalizeHeadlines(
  headlines: SiteSettings["homeHero"]["headlines"] | undefined,
): (string | string[])[] {
  if (!headlines?.length) return [];

  return headlines.map((entry) => {
    let lines: string[];
    if (Array.isArray(entry)) lines = entry;
    else if (typeof entry === "string") lines = [entry];
    else if (entry && typeof entry === "object" && "lines" in entry) {
      const raw = (entry as { lines?: string[] }).lines;
      lines = raw?.length ? raw : [];
    } else {
      return [];
    }
    return compactHeroPhraseLines(lines);
  });
}
