/**
 * Populate Site Settings → Layout → Nav fade over hero images from repo defaults.
 *
 * Run: npm run seed:sanity:nav-fade
 */
import { createClient } from "@sanity/client";
import { defaultNavImageFade } from "../../src/lib/nav-image-fade";

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

  await client
    .patch("siteSettings")
    .set({ navImageFade: defaultNavImageFade })
    .commit();

  console.log("✓ Populated nav image fade opacity in Sanity:");
  console.log("  home:", defaultNavImageFade.home);
  console.log("  university:", defaultNavImageFade.university);
  console.log("  default (about, builds, etc.):", defaultNavImageFade.default);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
