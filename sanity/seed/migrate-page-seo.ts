/**
 * Push default page SEO descriptions into Sanity Site Settings.
 *
 * Run: npm run seed:sanity:page-seo
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { defaultPageSeo } from "../../src/data/page-seo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "\nMissing env vars. Create .env.local with:\n" +
      "  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id\n" +
      "  NEXT_PUBLIC_SANITY_DATASET=production\n" +
      "  SANITY_API_TOKEN=your_editor_token\n",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  const doc = await client.fetch<{ _id?: string } | null>(
    `*[_id == "siteSettings"][0]{ _id }`,
  );

  if (!doc?._id) {
    console.error(
      "siteSettings document not found. Run npm run seed:sanity first to create it.",
    );
    process.exit(1);
  }

  await client.patch("siteSettings").set({ pageSeo: defaultPageSeo }).commit();

  console.log("✓ Updated page SEO descriptions in Sanity:\n");
  for (const [page, description] of Object.entries(defaultPageSeo)) {
    console.log(`  ${page} (${description.length} chars)`);
    console.log(`    ${description}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
