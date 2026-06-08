import type { Course, Rifle, RifleImage, SiteSettings } from "@/lib/types";
import { images } from "@/lib/images";
import { configuratorPlaceholder, riflePlaceholderAlt } from "@/lib/images";
import { imageUrl } from "./image";

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
): RifleImage {
  const url =
    imageUrl(image) ??
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
    heroImage: mapImage(doc.configuratorImage ?? doc.heroImage),
    gallery: (doc.gallery ?? []).map((item) => mapImage(item)),
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
        )
      : undefined,
    featured: doc.featured,
  };
}

export function mapSiteSettings(doc: Partial<SiteSettings> | null): SiteSettings | null {
  if (!doc?.name) return null;
  return doc as SiteSettings;
}

/** Normalize Sanity headline phrase objects → string[] for the typewriter */
export function normalizeHeadlines(
  headlines: SiteSettings["homeHero"]["headlines"] | undefined,
): (string | string[])[] {
  if (!headlines?.length) return [];

  return headlines.map((entry) => {
    if (Array.isArray(entry)) return entry;
    if (typeof entry === "string") return entry;
    if (entry && typeof entry === "object" && "lines" in entry) {
      const lines = (entry as { lines?: string[] }).lines;
      return lines?.length ? lines : [];
    }
    return [];
  });
}
