import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "badwrx",
  title: "BADWRX Content Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool(), media()],
  schema: { types: schemaTypes },
});
