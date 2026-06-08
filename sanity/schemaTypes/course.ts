import { defineArrayMember, defineField, defineType } from "sanity";

export const course = defineType({
  name: "course",
  title: "University Course",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "details", title: "Details" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "overview",
      description: "Short hook shown under the title on the course page",
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      group: "overview",
      description: 'e.g. "2 days · Full-day range sessions"',
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      group: "overview",
      description: 'e.g. "Small class · Max 6 shooters"',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured on university page",
      type: "boolean",
      group: "overview",
      initialValue: false,
    }),
    defineField({
      name: "topics",
      title: "Core focus topics",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "outcomes",
      title: "What students walk away with",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "curriculum",
      title: "Curriculum",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "curriculumItem",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "detail",
              title: "Detail",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        }),
      ],
    }),
    defineField({
      name: "audience",
      title: "Built for (audience)",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "includes",
      title: "Included in the class",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "level", media: "heroImage" },
  },
});
