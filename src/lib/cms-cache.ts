/** How often CMS-driven pages re-fetch published Sanity content. */
export const CMS_REVALIDATE_SECONDS = 60;

/** Next.js cache tag for all Sanity-backed fetches (use with /api/revalidate). */
export const SANITY_CACHE_TAG = "sanity";

export const sanityFetchOptions = {
  next: {
    revalidate: CMS_REVALIDATE_SECONDS,
    tags: [SANITY_CACHE_TAG] as string[],
  },
};
