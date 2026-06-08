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

function normalizeHomeHero(
  hero: SiteSettings["homeHero"],
): SiteSettings["homeHero"] {
  if (
    hero.headlines?.some((item) => {
      if (Array.isArray(item)) {
        return /^(Crafted|Engineered|Built)$/i.test(item[0] ?? "");
      }
      return /^(Crafted|Engineered|Built)\s/i.test(item);
    })
  ) {
    return { ...hero, headlinePrefix: "" };
  }
  return hero;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured()) return defaultSiteSettings;
  try {
    const doc = await client.fetch(siteSettingsQuery);
    const settings = normalizeSiteSettings(mapSiteSettings(doc) ?? defaultSiteSettings);
    const hero = settings.homeHero as SiteSettings["homeHero"] & { headline?: string };
    if (!hero.headlines?.length) {
      const legacy = hero.headline?.replace(/^(Engineered|Crafted)\s+/i, "") ?? "";
      return normalizeSiteSettings({
        ...settings,
        homeHero: {
          ...hero,
          headlinePrefix: hero.headlinePrefix ?? defaultSiteSettings.homeHero.headlinePrefix,
          headlines: legacy
            ? [legacy]
            : defaultSiteSettings.homeHero.headlines,
        },
      });
    }
    if (!hero.headlinePrefix) {
      return normalizeSiteSettings({
        ...settings,
        homeHero: normalizeHomeHero({
          ...hero,
          headlinePrefix: defaultSiteSettings.homeHero.headlinePrefix,
        }),
      });
    }
    return normalizeSiteSettings({
      ...settings,
      homeHero: normalizeHomeHero(settings.homeHero),
    });
  } catch {
    return defaultSiteSettings;
  }
}

function normalizeSiteSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    aboutPage: mergeAboutPage(settings),
  };
}

function normalizeAboutSignature(
  signature: SiteSettings["aboutPage"]["signature"] | string | undefined,
  fallback: SiteSettings["aboutPage"]["signature"],
) {
  if (!signature) return fallback;
  if (typeof signature === "string") {
    return parseAboutSignature(signature) ?? fallback;
  }
  return signature;
}

function parseAboutSignature(text: string) {
  const match = text.match(/^BADWRX\.?\s+(.+?)\.?$/);
  if (!match) return undefined;
  return {
    name: "BADWRX",
    location: match[1].replace(/\.$/, "").trim(),
  };
}

function extractAboutSignature(body: string) {
  const match = body.match(
    /^(.*?We build that rifle\.)\s+(BADWRX\.\s+Diamondhead,\s+Mississippi\.?)\s*$/,
  );
  if (!match) return { body, signature: undefined };
  return {
    body: match[1].trim(),
    signature: parseAboutSignature(match[2].trim()),
  };
}

function stripHeadingPeriods(text: string) {
  return text.replace(/\.\s*/g, " ").replace(/\s+/g, " ").trim();
}

function mergeAboutPage(
  settings: SiteSettings,
): SiteSettings["aboutPage"] {
  const about = settings.aboutPage as SiteSettings["aboutPage"] & {
    body?: string | string[];
  };
  const fallback = defaultSiteSettings.aboutPage;

  if (typeof about.body === "string" && about.pillars?.length) {
    if (about.signature && typeof about.signature === "object") {
      return {
        ...about,
        title: stripHeadingPeriods(about.title ?? fallback.title),
        signature: about.signature,
      };
    }
    const extracted = extractAboutSignature(about.body);
    return {
      ...about,
      title: stripHeadingPeriods(about.title ?? fallback.title),
      body: extracted.body,
      signature: normalizeAboutSignature(
        about.signature,
        extracted.signature ?? fallback.signature,
      ),
    };
  }

  const legacyBody = Array.isArray(about.body) ? about.body : [about.body ?? ""];
  const intro = legacyBody[0] || fallback.body;
  const legacyPillars = legacyBody.slice(1).filter(Boolean);
  const signatureFromIntro = extractAboutSignature(intro);

  return {
    title: stripHeadingPeriods(about.title ?? fallback.title),
    body: signatureFromIntro.signature
      ? signatureFromIntro.body
      : intro || fallback.body,
    signature:
      normalizeAboutSignature(
        about.signature ?? signatureFromIntro.signature,
        fallback.signature,
      ),
    pillars:
      about.pillars?.length
        ? about.pillars
        : legacyPillars.length >= 3
          ? legacyPillars.map((text) => {
              const split = text.indexOf(". ");
              if (split === -1) {
                return { title: text.replace(/\.$/, "").trim(), body: "" };
              }
              return {
                title: text.slice(0, split).trim(),
                body: text.slice(split + 2),
              };
            })
          : fallback.pillars,
    philosophyQuote: about.philosophyQuote ?? fallback.philosophyQuote,
  };
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
