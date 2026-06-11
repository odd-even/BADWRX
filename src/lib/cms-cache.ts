/** How often CMS-driven pages re-fetch published Sanity content (production). */
export const CMS_REVALIDATE_SECONDS = 60;

/** Page segment revalidate — 0 in local dev for fresh Sanity on every request. */
export const CMS_PAGE_REVALIDATE_SECONDS =
  process.env.NODE_ENV === "development" ? 0 : CMS_REVALIDATE_SECONDS;

/** Next.js cache tag for all Sanity-backed fetches (use with /api/revalidate). */
export const SANITY_CACHE_TAG = "sanity";

const isDev = process.env.NODE_ENV === "development";

/** Sanity client.fetch options — no cache locally, tagged ISR in production. */
export const sanityFetchOptions = isDev
  ? ({ cache: "no-store" } as const)
  : {
      next: {
        revalidate: CMS_REVALIDATE_SECONDS,
        tags: [SANITY_CACHE_TAG] as string[],
      },
    };
