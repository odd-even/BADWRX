import { defineArrayMember, defineField, defineType } from "sanity";
import { cmsImageField, pageToggleField, pillarFields, sectionFields } from "./shared";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "photos", title: "Photos" },
    { name: "pages", title: "Pages" },
    { name: "home", title: "Home page" },
    { name: "about", title: "About page" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Business name",
      type: "string",
      group: "brand",
    }),
    defineField({
      name: "short",
      title: "Short name / acronym",
      type: "string",
      group: "brand",
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "brand" }),
    defineField({ name: "email", title: "Contact email", type: "string", group: "brand" }),
    defineField({
      name: "partnerBarrels",
      title: "Barrel partner",
      type: "string",
      group: "brand",
    }),
    defineField({
      name: "partnerOptics",
      title: "Optics partner",
      type: "string",
      group: "brand",
    }),
    defineField({
      name: "buildPromise",
      title: "Build promise",
      type: "text",
      rows: 3,
      group: "brand",
    }),
    defineField({
      name: "deliveryPackage",
      title: "Delivery package copy",
      type: "text",
      rows: 3,
      group: "brand",
    }),
    defineField({
      name: "trustMarqueeItems",
      title: "Trust bar items",
      type: "array",
      group: "brand",
      of: [{ type: "string" }],
      description: "Scrolling partner badges on the home page",
    }),

    defineField({
      name: "siteImages",
      title: "Site photos",
      type: "object",
      group: "photos",
      description:
        "Upload replacements for key site photos. Leave a field empty to keep the current built-in default.",
      fields: [
        cmsImageField(
          "reticleOverlay",
          "Reticle overlay",
          "Decorative scope reticle over hero sections on the home and university pages.",
        ),
        cmsImageField(
          "homeHeroBanner",
          "Home hero banner",
          "Full-bleed cover image at the top of the home page.",
        ),
        cmsImageField(
          "homeFieldTested",
          "Home field proven photo",
          "Photo beside the Field Proven section on the home page.",
        ),
        cmsImageField(
          "homeBallisticSection",
          "Home ballistic package photo",
          "Background for the Ballistic Package section on the home page.",
        ),
        cmsImageField(
          "aboutHeroBanner",
          "About hero banner",
          "Full-bleed cover image at the top of the about page.",
        ),
        cmsImageField(
          "aboutStory",
          "About page sidebar photo",
          "Portrait photo beside the story on the about page.",
        ),
      ],
    }),

    defineField({
      name: "pageVisibility",
      title: "Page visibility",
      type: "object",
      group: "pages",
      description:
        "Turn entire site sections on or off. Disabled pages are removed from navigation and redirect to the page you choose.",
      fields: [
        pageToggleField(
          "builds",
          "Builds",
          "/builds and individual rifle pages",
          ["/builds"],
        ),
        pageToggleField(
          "configure",
          "Configure",
          "/configure build configurator",
          ["/configure"],
        ),
        pageToggleField(
          "merch",
          "Merch",
          "/merch, cart, and checkout",
          ["/merch"],
        ),
        pageToggleField(
          "university",
          "University",
          "/university and course pages",
          ["/university"],
        ),
        pageToggleField("about", "About", "/about", ["/about"]),
        pageToggleField(
          "contact",
          "Contact",
          "/contact build quote form",
          ["/contact"],
        ),
      ],
      options: { columns: 2 },
    }),

    defineField({
      name: "homeHero",
      title: "Hero banner",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({
          name: "headlinePrefix",
          title: "Headline prefix (legacy)",
          type: "string",
          description: "Leave empty when using rotating phrases below",
        }),
        defineField({
          name: "headlines",
          title: "Rotating headline phrases",
          type: "array",
          description:
            "Each phrase rotates on the hero. Add one row per line (e.g. Crafted → Without → Compromise).",
          of: [
            defineArrayMember({
              type: "object",
              name: "headlinePhrase",
              fields: [
                defineField({
                  name: "lines",
                  title: "Lines",
                  type: "array",
                  of: [{ type: "string" }],
                  validation: (rule) => rule.min(1),
                }),
              ],
              preview: {
                select: { lines: "lines" },
                prepare({ lines }) {
                  const parts = Array.isArray(lines) ? lines : [];
                  return { title: parts.join(" / ") || "Headline phrase" };
                },
              },
            }),
          ],
        }),
        defineField({ name: "headline", title: "Headline (legacy)", type: "string" }),
        defineField({
          name: "subheadline",
          title: "Subheadline",
          type: "text",
          rows: 4,
        }),
      ],
    }),
    defineField({
      name: "homePlatforms",
      title: "Platforms section",
      type: "object",
      group: "home",
      fields: sectionFields(),
    }),
    defineField({
      name: "packageCta",
      title: "Basecamp package CTA blurb",
      type: "text",
      rows: 3,
      group: "home",
    }),
    defineField({
      name: "homeIntro",
      title: "Who we build for",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({
          name: "body",
          title: "Body",
          type: "text",
          rows: 4,
        }),
      ],
    }),
    defineField({
      name: "homePillars",
      title: "Weight / accuracy / durability pillars",
      type: "array",
      group: "home",
      of: [
        defineArrayMember({
          type: "object",
          fields: pillarFields(),
          preview: {
            select: { title: "title" },
          },
        }),
      ],
    }),
    defineField({
      name: "fieldTested",
      title: "Field proven section",
      type: "object",
      group: "home",
      fields: sectionFields(),
    }),
    defineField({
      name: "unrelenting",
      title: "Ballistic package section",
      type: "object",
      group: "home",
      fields: sectionFields(),
    }),
    defineField({
      name: "testimonial",
      title: "Featured testimonial (legacy)",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "quote", title: "Quote", type: "text", rows: 4 }),
        defineField({ name: "author", title: "Author", type: "string" }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonial carousel",
      type: "array",
      group: "home",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 4 }),
            defineField({ name: "author", title: "Author", type: "string" }),
          ],
          preview: {
            select: { title: "author", subtitle: "quote" },
          },
        }),
      ],
    }),
    defineField({
      name: "contactSection",
      title: "Contact / quote section",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
      ],
    }),

    defineField({
      name: "aboutPage",
      title: "About page",
      type: "object",
      group: "about",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "body",
          title: "Body",
          type: "text",
          rows: 6,
        }),
        defineField({
          name: "signature",
          title: "Signature",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "location", title: "Location", type: "string" }),
          ],
        }),
        defineField({
          name: "pillars",
          title: "Story pillars",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: pillarFields(),
              preview: { select: { title: "title" } },
            }),
          ],
        }),
        defineField({
          name: "philosophyQuote",
          title: "Philosophy quote",
          type: "text",
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
