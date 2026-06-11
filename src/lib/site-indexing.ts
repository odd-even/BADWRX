import { sanityFetchOptions } from "@/lib/cms-cache";
import type { SiteSettings } from "@/lib/types";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";

const allowSearchIndexingQuery = `*[_type == "siteSettings"][0].allowSearchIndexing`;

/** Deployment flag — preview builds stay gated regardless of Sanity. */
export function isDeploymentPublic(): boolean {
  return process.env.NEXT_PUBLIC_SITE_PUBLIC === "true";
}

/** Whether search engines may index the site (Sanity + env). */
export function isSearchIndexingAllowed(
  settings: Pick<SiteSettings, "allowSearchIndexing"> | null | undefined,
): boolean {
  if (!isDeploymentPublic()) return false;
  if (!isSanityConfigured()) return true;
  return settings?.allowSearchIndexing === true;
}

/** Lightweight fetch for middleware (no full site settings payload). */
export async function fetchAllowSearchIndexing(): Promise<boolean> {
  if (!isDeploymentPublic()) return false;
  if (!isSanityConfigured()) return true;
  try {
    const allow = await client.fetch<boolean | null>(
      allowSearchIndexingQuery,
      {},
      sanityFetchOptions,
    );
    return allow === true;
  } catch {
    return false;
  }
}
