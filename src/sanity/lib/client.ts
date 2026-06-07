import { createClient } from "next-sanity";
import { sanityApiVersion, sanityDataset, sanityProjectId } from "../env";

export const client = createClient({
  projectId: sanityProjectId ?? "placeholder",
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: process.env.NODE_ENV === "production",
});
