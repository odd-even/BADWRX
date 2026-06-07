import { defineField, defineType } from "sanity";

export const rifle = defineType({
  name: "rifle",
  title: "Rifle Build",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Hunting", value: "hunting" },
          { title: "Long Range", value: "long-range" },
          { title: "Safari / Dangerous Game", value: "safari" },
          { title: "Precision", value: "precision" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured on home page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "startingAt",
      title: "Starting price",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "object",
      fields: [
        defineField({ name: "action", title: "Action", type: "string" }),
        defineField({ name: "caliber", title: "Caliber", type: "string" }),
        defineField({ name: "barrel", title: "Barrel", type: "string" }),
        defineField({ name: "barrelLength", title: "Barrel length", type: "string" }),
        defineField({ name: "twistRate", title: "Twist rate", type: "string" }),
        defineField({ name: "stock", title: "Stock / chassis", type: "string" }),
        defineField({ name: "trigger", title: "Trigger", type: "string" }),
        defineField({ name: "finish", title: "Finish", type: "string" }),
        defineField({ name: "weight", title: "Weight", type: "string" }),
        defineField({ name: "overallLength", title: "Overall length", type: "string" }),
        defineField({ name: "accuracy", title: "Accuracy guarantee", type: "string" }),
        defineField({ name: "magazine", title: "Magazine", type: "string" }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "Build highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "heroImage" },
  },
});
