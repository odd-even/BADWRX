import type { Course, Rifle, RifleImage, SiteSettings } from "@/lib/types";
import { riflePlaceholder, riflePlaceholderAlt } from "@/lib/images";
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
  description: string;
  topics?: string[];
  featured?: boolean;
}

function mapImage(
  image: SanityImageField | undefined,
  fallbackAlt = riflePlaceholderAlt,
): RifleImage {
  const url =
    imageUrl(image) ??
    image?.asset?.url ??
    riflePlaceholder;

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
    heroImage: mapImage(doc.heroImage),
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
    description: doc.description,
    topics: doc.topics ?? [],
    featured: doc.featured,
  };
}

export function mapSiteSettings(doc: Partial<SiteSettings> | null): SiteSettings | null {
  if (!doc?.name) return null;
  return doc as SiteSettings;
}
