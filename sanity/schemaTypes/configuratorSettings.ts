import { defineArrayMember, defineField, defineType } from "sanity";
import { usdPriceField } from "./shared";

const optionImageFields = [
  defineField({ name: "alt", title: "Alt text", type: "string" }),
];

export const configuratorSettings = defineType({
  name: "configuratorSettings",
  title: "Build Configurator",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "calibers", title: "Calibers" },
    { name: "finishes", title: "Finishes / colors" },
    { name: "optics", title: "Optics" },
    { name: "rings", title: "Rings" },
    { name: "basecamp", title: "Basecamp package" },
    { name: "ballistic", title: "Ballistic package" },
  ],
  fields: [
    usdPriceField("baseBuildPrice", "Base build price", {
      group: "general",
      description:
        "Starting price before options. Use 0 if platform price is the base.",
      initialValue: 0,
    }),
    defineField({
      name: "baseBuildCents",
      title: "Base build price (legacy cents)",
      type: "number",
      group: "general",
      hidden: true,
    }),
    defineField({
      name: "platformDefaults",
      title: "Platform defaults",
      type: "array",
      group: "general",
      description: "Trigger and muzzle device shown per platform (not customer-selectable).",
      of: [
        defineArrayMember({
          type: "object",
          name: "platformDefault",
          fields: [
            defineField({
              name: "platformSlug",
              title: "Platform slug",
              type: "string",
              description: "Must match rifle slug (specter, reaper, etc.)",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "trigger",
              title: "Trigger",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "muzzleBrake",
              title: "Muzzle device",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "platformSlug", subtitle: "trigger" },
          },
        }),
      ],
    }),
    defineField({
      name: "stepCopy",
      title: "Step subtitles",
      type: "object",
      group: "general",
      fields: [
        defineField({ name: "platform", title: "Platform step", type: "text", rows: 2 }),
        defineField({ name: "caliber", title: "Caliber step", type: "text", rows: 2 }),
        defineField({ name: "stockPaint", title: "Finish / color step", type: "text", rows: 2 }),
        defineField({ name: "scope", title: "Optics step", type: "text", rows: 3 }),
        defineField({ name: "rings", title: "Rings step", type: "text", rows: 2 }),
        defineField({ name: "basecampPackage", title: "Basecamp step", type: "text", rows: 2 }),
        defineField({ name: "ballisticPackage", title: "Ballistic step", type: "text", rows: 2 }),
      ],
    }),

    defineField({
      name: "calibers",
      title: "Calibers",
      type: "array",
      group: "calibers",
      of: [
        defineArrayMember({
          type: "object",
          name: "caliberOption",
          fields: [
            defineField({
              name: "optionId",
              title: "ID",
              type: "slug",
              options: { source: "label", maxLength: 96 },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Caliber name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "notes", title: "Notes", type: "text", rows: 2 }),
            usdPriceField("price", "Price add-on", { initialValue: 0 }),
            defineField({
              name: "platformSlugs",
              title: "Available on platforms",
              type: "array",
              of: [{ type: "string" }],
              description: "Rifle slugs where this caliber is offered",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "notes" },
          },
        }),
      ],
    }),

    defineField({
      name: "finishes",
      title: "Finishes / colors",
      type: "array",
      group: "finishes",
      of: [
        defineArrayMember({
          type: "object",
          name: "finishOption",
          fields: [
            defineField({
              name: "optionId",
              title: "ID",
              type: "slug",
              options: { source: "label", maxLength: 96 },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "code", title: "Color code", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
            defineField({ name: "bestFor", title: "Best for", type: "string" }),
            usdPriceField("price", "Price add-on", { initialValue: 0 }),
            defineField({
              name: "image",
              title: "Swatch image",
              type: "image",
              options: { hotspot: true },
              fields: optionImageFields,
            }),
          ],
          preview: {
            select: { title: "label", media: "image" },
          },
        }),
      ],
    }),

    defineField({
      name: "optics",
      title: "Optics packages",
      type: "array",
      group: "optics",
      of: [
        defineArrayMember({
          type: "object",
          name: "opticOption",
          fields: [
            defineField({
              name: "optionId",
              title: "ID",
              type: "slug",
              options: { source: "model", maxLength: 96 },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "brand", title: "Brand", type: "string", initialValue: "Nightforce" }),
            defineField({ name: "model", title: "Model", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "magnification", title: "Magnification", type: "string" }),
            defineField({ name: "focalPlane", title: "Focal plane", type: "string" }),
            defineField({ name: "reticle", title: "Reticle", type: "string" }),
            defineField({ name: "tube", title: "Tube diameter", type: "string" }),
            defineField({ name: "msrp", title: "MSRP label", type: "string" }),
            defineField({ name: "notes", title: "Notes", type: "string" }),
            usdPriceField("price", "Package price", { required: true }),
            defineField({
              name: "image",
              title: "Product image",
              type: "image",
              options: { hotspot: true },
              fields: optionImageFields,
            }),
          ],
          preview: {
            select: {
              title: "model",
              subtitle: "magnification",
              media: "image",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "opticsConsult",
      title: "Optics consult option",
      type: "object",
      group: "optics",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "opticsNone",
      title: "No optics option",
      type: "object",
      group: "optics",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      ],
    }),

    defineField({
      name: "rings",
      title: "Default rings (with optics)",
      type: "object",
      group: "rings",
      fields: [
        defineField({ name: "optionId", title: "ID", type: "string" }),
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        usdPriceField("price", "Price", { initialValue: 0 }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: optionImageFields,
        }),
      ],
    }),

    defineField({
      name: "basecamp",
      title: "Basecamp package",
      type: "object",
      group: "basecamp",
      fields: [
        defineField({ name: "optionId", title: "ID", type: "string" }),
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 5 }),
        defineField({
          name: "items",
          title: "Included items",
          type: "array",
          of: [{ type: "string" }],
        }),
        usdPriceField("price", "Price"),
        defineField({
          name: "image",
          title: "Hero image",
          type: "image",
          options: { hotspot: true },
          fields: optionImageFields,
        }),
        defineField({
          name: "noneLabel",
          title: "Decline label",
          type: "string",
          initialValue: "No Basecamp Package",
        }),
        defineField({
          name: "noneDescription",
          title: "Decline description",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "ballistic",
      title: "Ballistic package",
      type: "object",
      group: "ballistic",
      fields: [
        defineField({ name: "optionId", title: "ID", type: "string" }),
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 5 }),
        defineField({ name: "howItWorks", title: "How it works", type: "text", rows: 4 }),
        defineField({
          name: "deliverables",
          title: "Deliverables",
          type: "array",
          of: [{ type: "string" }],
        }),
        usdPriceField("price", "Price"),
        defineField({
          name: "noneLabel",
          title: "Decline label",
          type: "string",
          initialValue: "No Ballistic Package",
        }),
        defineField({
          name: "noneDescription",
          title: "Decline description",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Build Configurator" }),
  },
});
