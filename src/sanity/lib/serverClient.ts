import { createClient, type SanityClient } from "next-sanity";
import { sanityApiVersion, sanityDataset, sanityProjectId } from "../env";

/**
 * Server-only Sanity client with a write token.
 * Requires SANITY_API_TOKEN (Editor permissions) — never exposed to the browser.
 */
export function isSanityWriteConfigured(): boolean {
  return Boolean(sanityProjectId && process.env.SANITY_API_TOKEN?.trim());
}

export function getSanityWriteClient(): SanityClient {
  const token = process.env.SANITY_API_TOKEN?.trim();

  if (!sanityProjectId || !token) {
    throw new Error(
      "Sanity write client is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.",
    );
  }

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    token,
    useCdn: false,
  });
}
