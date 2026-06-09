/** How often CMS-driven pages re-fetch published Sanity content. */
export const CMS_REVALIDATE_SECONDS = 60;

export const sanityFetchOptions = {
  next: { revalidate: CMS_REVALIDATE_SECONDS },
} as const;
