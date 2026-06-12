import { normalizeNavImageFade } from "@/lib/nav-image-fade";
import { normalizeSiteAccess } from "@/lib/site-access";
import type { BrandAssets, Course, Rifle, RifleImage, SiteImages, SiteSettings } from "@/lib/types";
import { defaultBrandAssets, defaultFieldGallery, defaultSiteImages, defaultSiteSettings } from "@/data/site-settings";
import { images } from "@/lib/images";
import { configuratorPlaceholder, riflePlaceholderAlt } from "@/lib/images";
import {
  aspectCropImageUrl,
  brandAssetImageUrl,
  imageSrcSetForPreset,
  imageUrl,
  resolveSanityImageUrl,
  sanityImageUrl,
  type ImageWidthPreset,
  type ResponsiveWidthPreset,
} from "./image";

interface SanityImageField {
  asset?: {
    url?: string;
    metadata?: { dimensions?: { width?: number; height?: number } };
  };
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

const widthToResponsive: Partial<Record<ImageWidthPreset, ResponsiveWidthPreset>> = {
  hero: "hero",
  section: "section",
};

function imageDimensions(image: SanityImageField | undefined) {
  const dimensions = image?.asset?.metadata?.dimensions;
  if (!dimensions?.width || !dimensions?.height) return {};
  return { width: dimensions.width, height: dimensions.height };
}

function mapGalleryImage(
  image: SanityImageField | undefined,
  fallbackAlt = riflePlaceholderAlt,
): RifleImage | null {
  if (!resolveSanityImageUrl(image, "content")) return null;
  return mapImage(image, fallbackAlt, configuratorPlaceholder, "content");
}

function mapCardImage(
  image: SanityImageField | undefined,
  preset: "rifleCard" | "rifleCardCompact",
  fallbackAlt: string,
  fallbackUrl: string,
): RifleImage {
  const url = aspectCropImageUrl(image, preset) ?? fallbackUrl;
  return {
    url,
    alt: image?.alt ?? fallbackAlt,
    ...imageDimensions(image),
  };
}

function mapImage(
  image: SanityImageField | undefined,
  fallbackAlt = riflePlaceholderAlt,
  fallbackUrl: string = configuratorPlaceholder,
  width: ImageWidthPreset = "default",
): RifleImage {
  const responsivePreset = widthToResponsive[width];
  const url = resolveSanityImageUrl(image, width) ?? fallbackUrl;

  const srcSet =
    responsivePreset && image
      ? imageSrcSetForPreset(image, responsivePreset)
      : undefined;

  return {
    url,
    alt: image?.alt ?? fallbackAlt,
    ...(srcSet ? { srcSet } : {}),
    ...(image?.caption ? { caption: image.caption } : {}),
    ...imageDimensions(image),
  };
}

export function mapRifle(doc: SanityRifle): Rifle {
  const imageSource = doc.heroImage ?? doc.configuratorImage;
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    tagline: doc.tagline,
    category: doc.category,
    featured: Boolean(doc.featured),
    startingAt: doc.startingAt,
    description: doc.description,
    heroImage: mapImage(imageSource, riflePlaceholderAlt, configuratorPlaceholder, "hero"),
    cardImage: mapCardImage(
      imageSource,
      "rifleCard",
      riflePlaceholderAlt,
      configuratorPlaceholder,
    ),
    compactCardImage: mapCardImage(
      imageSource,
      "rifleCardCompact",
      riflePlaceholderAlt,
      configuratorPlaceholder,
    ),
    gallery: (doc.gallery ?? [])
      .map((item) => mapGalleryImage(item, riflePlaceholderAlt))
      .filter((item): item is RifleImage => item !== null),
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
  if (!resolveSanityImageUrl(image, width)) return fallback;
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

interface SanityFieldGallerySettingsDoc {
  section?: SiteSettings["fieldGallerySection"];
  images?: SanityImageField[];
}

interface SanitySiteSettingsDoc extends Omit<
  Partial<SiteSettings>,
  "siteImages" | "brandAssets" | "navImageFade" | "fieldGallery"
> {
  siteImages?: Partial<Record<keyof SiteImages, SanityImageField>>;
  brandAssets?: Partial<Record<keyof BrandAssets, SanityImageField>>;
  navImageFade?: Partial<SiteSettings["navImageFade"]>;
  fieldGallery?: SanityImageField[];
}

function mapFieldGalleryImage(
  image: SanityImageField | undefined,
  fallbackAlt: string,
): RifleImage | null {
  if (!image || !resolveSanityImageUrl(image, "galleryThumb")) return null;

  const url =
    sanityImageUrl(image, "galleryThumb", { format: "webp", quality: 80 }) ??
    configuratorPlaceholder;
  const srcSet = imageSrcSetForPreset(image, "gallery", {
    format: "webp",
    quality: 80,
  });
  const lightboxUrl = sanityImageUrl(image, "galleryFull", {
    format: "webp",
    quality: 85,
  });

  return {
    url,
    alt: image.alt ?? fallbackAlt,
    ...(srcSet ? { srcSet } : {}),
    ...(lightboxUrl ? { lightboxUrl } : {}),
    ...(image.caption ? { caption: image.caption } : {}),
    ...imageDimensions(image),
  };
}

export function mapFieldGallery(
  raw: SanityImageField[] | undefined,
  defaults: RifleImage[] = defaultFieldGallery,
): RifleImage[] {
  if (!raw?.length) return defaults;
  const mapped = raw
    .map((item) => mapFieldGalleryImage(item, "BADWRX field photography"))
    .filter((item): item is RifleImage => item !== null);
  return mapped.length ? mapped : defaults;
}

function resolveFieldGalleryFromSanity(
  galleryDoc: SanityFieldGallerySettingsDoc | null | undefined,
  legacyDoc: Pick<SanitySiteSettingsDoc, "fieldGallery" | "fieldGallerySection"> | null | undefined,
): Pick<SiteSettings, "fieldGallery" | "fieldGallerySection"> {
  if (galleryDoc?.images?.length) {
    return {
      fieldGallery: mapFieldGallery(galleryDoc.images),
      fieldGallerySection:
        galleryDoc.section ?? defaultSiteSettings.fieldGallerySection,
    };
  }

  if (legacyDoc?.fieldGallery?.length) {
    return {
      fieldGallery: mapFieldGallery(legacyDoc.fieldGallery),
      fieldGallerySection:
        legacyDoc.fieldGallerySection ?? defaultSiteSettings.fieldGallerySection,
    };
  }

  return {
    fieldGallery: defaultFieldGallery,
    fieldGallerySection: defaultSiteSettings.fieldGallerySection,
  };
}

export function mapSiteSettings(
  doc: SanitySiteSettingsDoc | null,
  galleryDoc?: SanityFieldGallerySettingsDoc | null,
): SiteSettings | null {
  if (!doc?.name) return null;
  const {
    siteImages: rawImages,
    brandAssets: rawBrandAssets,
    navImageFade,
    fieldGallery: legacyFieldGallery,
    fieldGallerySection: legacyFieldGallerySection,
    ...rest
  } = doc;
  const fieldGalleryFields = resolveFieldGalleryFromSanity(galleryDoc, {
    fieldGallery: legacyFieldGallery,
    fieldGallerySection: legacyFieldGallerySection,
  });
  return {
    ...rest,
    siteImages: mapSiteImages(rawImages),
    brandAssets: mapBrandAssets(rawBrandAssets),
    navImageFade: normalizeNavImageFade(navImageFade),
    siteAccess: normalizeSiteAccess(rest.siteAccess),
    ...fieldGalleryFields,
    testimonialSection:
      rest.testimonialSection ?? defaultSiteSettings.testimonialSection,
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
