import { defineArrayMember, defineField, defineType } from "sanity";
import { cmsImageField, navFadeOpacityFields, pageToggleField, pillarFields, sectionFields } from "./shared";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "sharing", title: "Sharing & icons" },
    { name: "seo", title: "SEO" },
    { name: "layout", title: "Layout" },
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
      name: "pageSeo",
      title: "Page SEO descriptions",
      type: "object",
      group: "seo",
      description:
        "Meta descriptions for search results and link previews. Aim for about 150 characters.",
      fields: [
        defineField({
          name: "home",
          title: "Home",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "about",
          title: "About",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "builds",
          title: "Builds",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "configure",
          title: "Configure",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "contact",
          title: "Contact",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "merch",
          title: "Merch",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "university",
          title: "University",
          type: "text",
          rows: 2,
        }),
      ],
    }),

    defineField({
      name: "allowSearchIndexing",
      title: "Allow search engine indexing",
      type: "boolean",
      group: "sharing",
      initialValue: false,
      description:
        "When off, the site sends noindex to search engines (preview/staging). Turn on at public launch. Requires NEXT_PUBLIC_SITE_PUBLIC=true on the deployment as well.",
    }),

    defineField({
      name: "brandAssets",
      title: "Sharing & browser icons",
      type: "object",
      group: "sharing",
      description:
        "Images used when the site is shared (iMessage, Slack, social) and in the browser tab.",
      fields: [
        cmsImageField(
          "shareImage",
          "Link preview image",
          "Cover image for link previews (iMessage, Facebook, X, Slack). Recommended 1200×630 px, JPG or PNG.",
        ),
        cmsImageField(
          "favicon",
          "Favicon",
          "Browser tab icon. Square PNG or SVG; at least 32×32 px (512×512 works well for all sizes).",
        ),
      ],
    }),

    defineField({
      name: "navImageFade",
      title: "Nav fade over hero images",
      type: "object",
      group: "layout",
      description:
        "Dark gradient under the navigation on photo heroes. Lower numbers = lighter fade, more photo visible.",
      fields: [
        defineField({
          name: "home",
          title: "Home page",
          type: "object",
          fields: navFadeOpacityFields(),
          initialValue: { topOpacity: 100, midOpacityMobile: 60, midOpacityDesktop: 75 },
        }),
        defineField({
          name: "university",
          title: "University pages",
          type: "object",
          fields: navFadeOpacityFields(),
          initialValue: { topOpacity: 100, midOpacityMobile: 60, midOpacityDesktop: 75 },
        }),
        defineField({
          name: "default",
          title: "Other hero pages",
          type: "object",
          description: "About, build detail, and similar inner pages with a top banner.",
          fields: navFadeOpacityFields(),
          initialValue: { topOpacity: 100, midOpacityMobile: 50, midOpacityDesktop: 75 },
        }),
      ],
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
      name: "fieldGallerySection",
      title: "Photo gallery (legacy)",
      type: "object",
      group: "home",
      hidden: true,
      fields: sectionFields(),
    }),
    defineField({
      name: "fieldGallery",
      title: "Photo gallery images (legacy)",
      type: "array",
      group: "home",
      hidden: true,
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "unrelenting",
      title: "Ballistic package section",
      type: "object",
      group: "home",
      fields: sectionFields(),
    }),
    defineField({
      name: "testimonialSection",
      title: "Testimonials section",
      type: "object",
      group: "home",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Section label",
          type: "string",
          description: "Red uppercase label above the testimonial carousel.",
        }),
      ],
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
