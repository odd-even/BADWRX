import { rifles as localRifles, getRifleBySlug as localGetRifleBySlug, getFeaturedRifles as localGetFeaturedRifles } from "@/data/rifles";
import { courses as localCourses, getCourseBySlug as localGetCourseBySlug } from "@/data/courses";
import { defaultSiteSettings } from "@/data/site-settings";
import type { Course, Rifle, SiteSettings } from "@/lib/types";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { mapCourse, mapRifle, mapSiteSettings } from "@/sanity/lib/map";
import {
  courseBySlugQuery,
  coursesQuery,
  rifleBySlugQuery,
  riflesQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";

export async function getAllRifles(): Promise<Rifle[]> {
  if (!isSanityConfigured()) return localRifles;
  try {
    const docs = await client.fetch(riflesQuery);
    return docs?.length ? docs.map(mapRifle) : localRifles;
  } catch {
    return localRifles;
  }
}

export async function getFeaturedRifles(): Promise<Rifle[]> {
  const rifles = await getAllRifles();
  return rifles.filter((r) => r.featured);
}

export async function getRifleBySlug(slug: string): Promise<Rifle | undefined> {
  if (!isSanityConfigured()) return localGetRifleBySlug(slug);
  try {
    const doc = await client.fetch(rifleBySlugQuery, { slug });
    return doc ? mapRifle(doc) : localGetRifleBySlug(slug);
  } catch {
    return localGetRifleBySlug(slug);
  }
}

export async function getAllCourses(): Promise<Course[]> {
  if (!isSanityConfigured()) return localCourses;
  try {
    const docs = await client.fetch(coursesQuery);
    return docs?.length ? docs.map(mapCourse) : localCourses;
  } catch {
    return localCourses;
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  if (!isSanityConfigured()) return localGetCourseBySlug(slug);
  try {
    const doc = await client.fetch(courseBySlugQuery, { slug });
    return doc ? mapCourse(doc) : localGetCourseBySlug(slug);
  } catch {
    return localGetCourseBySlug(slug);
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured()) return defaultSiteSettings;
  try {
    const doc = await client.fetch(siteSettingsQuery);
    const settings = mapSiteSettings(doc) ?? defaultSiteSettings;
    const hero = settings.homeHero as SiteSettings["homeHero"] & { headline?: string };
    if (!hero.headlines?.length) {
      const legacy = hero.headline?.replace(/^Engineered\s+/i, "") ?? "";
      return {
        ...settings,
        homeHero: {
          ...hero,
          headlinePrefix: hero.headlinePrefix ?? defaultSiteSettings.homeHero.headlinePrefix,
          headlines: legacy
            ? [legacy]
            : defaultSiteSettings.homeHero.headlines,
        },
      };
    }
    if (!hero.headlinePrefix) {
      return {
        ...settings,
        homeHero: {
          ...hero,
          headlinePrefix: defaultSiteSettings.homeHero.headlinePrefix,
        },
      };
    }
    return settings;
  } catch {
    return defaultSiteSettings;
  }
}

/** Brand-like view for components that need partners + messaging */
export async function getBrandContent() {
  const settings = await getSiteSettings();
  return {
    name: settings.name,
    short: settings.short,
    tagline: settings.tagline,
    email: settings.email,
    partners: {
      barrels: settings.partnerBarrels,
      optics: settings.partnerOptics,
    },
    buildPromise: settings.buildPromise,
    deliveryPackage: settings.deliveryPackage,
  };
}
