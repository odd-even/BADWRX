import { createClient } from "next-sanity";
import { sanityApiVersion, sanityDataset, sanityProjectId } from "../env";

export const client = createClient({
  projectId: sanityProjectId ?? "placeholder",
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  // API (not CDN) so Studio uploads appear on the site without CDN lag.
  useCdn: false,
});
