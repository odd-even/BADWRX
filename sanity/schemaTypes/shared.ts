import { defineField, type FieldDefinition } from "sanity";

/** USD price field for Sanity Studio (stored as dollars, not cents). */
export function usdPriceField(
  name: string,
  title: string,
  options?: {
    description?: string;
    initialValue?: number;
    required?: boolean;
    group?: string;
  },
): FieldDefinition {
  return defineField({
    name,
    title: `${title} ($)`,
    type: "number",
    group: options?.group,
    description: options?.description,
    initialValue: options?.initialValue,
    validation: (rule) => {
      let validation = rule.min(0);
      if (options?.required) validation = validation.required();
      return validation;
    },
  });
}

/** Percent field for nav fade opacity (0 = transparent, 100 = solid black). */
export function navFadeOpacityFields() {
  return [
    defineField({
      name: "topOpacity",
      title: "Top darkness",
      type: "number",
      description: "How dark the fade is at the very top, under the nav (0–100).",
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "midOpacityMobile",
      title: "Mid fade — mobile",
      type: "number",
      description: "Gradient strength on phones and small tablets (0–100).",
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "midOpacityDesktop",
      title: "Mid fade — desktop",
      type: "number",
      description: "Gradient strength on desktop (0–100).",
      validation: (rule) => rule.min(0).max(100),
    }),
  ];
}

/** Eyebrow + title + body block used across home sections */
export function sectionFields() {
  return [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
    }),
  ];
}

/** Build grid cards — RifleCard default */
export const RIFLE_CARD_ASPECT = 4 / 3;

/** Home page featured scroll — RifleCard compact */
export const RIFLE_CARD_COMPACT_ASPECT = 3 / 2;

/** Configurator platform picker tiles */
export const CONFIGURATOR_PLATFORM_ASPECT = 2 / 1;

type ImageHotspotOptions = {
  hotspot: {
    previews: { title: string; aspectRatio: number }[];
  };
};

/** Hotspot crop previews shown in Studio after upload (Sanity v3.86+). */
export function rifleCardHotspotOptions(): ImageHotspotOptions {
  return {
    hotspot: {
      previews: [
        { title: "Build card (4:3)", aspectRatio: RIFLE_CARD_ASPECT },
        { title: "Home scroll (3:2)", aspectRatio: RIFLE_CARD_COMPACT_ASPECT },
      ],
    },
  };
}

export function configuratorPlatformHotspotOptions(): ImageHotspotOptions {
  return {
    hotspot: {
      previews: [
        { title: "Build card (4:3)", aspectRatio: RIFLE_CARD_ASPECT },
        { title: "Configurator (2:1)", aspectRatio: CONFIGURATOR_PLATFORM_ASPECT },
      ],
    },
  };
}

const RIFLE_CROP_GUIDE =
  "After upload, open the crop tool (hotspot icon). Frame the full rifle with ~10% breathing room on every side so it is not clipped on cards. Check the aspect previews below before saving.";

/** Hero / card image field with crop guides for rifle builds */
export function riflePhotoField(
  name: string,
  title: string,
  description: string,
  hotspotOptions: ImageHotspotOptions,
): FieldDefinition {
  return defineField({
    name,
    title,
    type: "image",
    description: `${description} ${RIFLE_CROP_GUIDE}`,
    options: hotspotOptions,
    fields: [
      defineField({ name: "alt", title: "Alt text", type: "string" }),
    ],
  });
}

/** CMS image with optional alt text */
export function cmsImageField(
  name: string,
  title: string,
  description?: string,
): FieldDefinition {
  return defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({ name: "alt", title: "Alt text", type: "string" }),
    ],
  });
}

export function pillarFields() {
  return [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
    }),
  ];
}

const SITE_REDIRECT_OPTIONS = [
  { title: "Home", value: "/" },
  { title: "Builds", value: "/builds" },
  { title: "Configure", value: "/configure" },
  { title: "Merch", value: "/merch" },
  { title: "University", value: "/university" },
  { title: "About", value: "/about" },
  { title: "Contact", value: "/contact" },
] as const;

/** Page on/off toggle with required redirect when disabled. */
export function pageToggleField(
  name: string,
  title: string,
  description: string,
  disabledPathPrefixes: string[],
) {
  return defineField({
    name,
    title,
    type: "object",
    description,
    fields: [
      defineField({
        name: "enabled",
        title: "Page on",
        type: "boolean",
        initialValue: true,
      }),
      defineField({
        name: "redirectTo",
        title: "Redirect to",
        type: "string",
        description: "Required when the page is off — visitors are sent here instead of seeing a 404.",
        options: {
          list: [...SITE_REDIRECT_OPTIONS],
          layout: "dropdown",
        },
        hidden: ({ parent }) => parent?.enabled !== false,
        validation: (Rule) =>
          Rule.custom((value, context) => {
            const parent = context.parent as { enabled?: boolean };
            if (parent?.enabled !== false) return true;

            const redirectTo = typeof value === "string" ? value.trim() : "";
            if (!redirectTo) {
              return "Choose a redirect page when this section is off";
            }
            if (!redirectTo.startsWith("/")) {
              return "Use a site path starting with /";
            }

            for (const prefix of disabledPathPrefixes) {
              if (redirectTo === prefix || redirectTo.startsWith(`${prefix}/`)) {
                return "Redirect cannot point to the disabled page";
              }
            }

            return true;
          }),
      }),
    ],
  });
}
