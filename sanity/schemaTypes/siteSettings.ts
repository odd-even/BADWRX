import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Business name", type: "string" }),
    defineField({ name: "short", title: "Short name / acronym", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "email", title: "Contact email", type: "string" }),
    defineField({ name: "partnerBarrels", title: "Barrel partner", type: "string" }),
    defineField({ name: "partnerOptics", title: "Optics partner", type: "string" }),
    defineField({
      name: "buildPromise",
      title: "Build promise",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "deliveryPackage",
      title: "Delivery package copy",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "trustMarqueeItems",
      title: "Trust bar items",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "homeHero",
      title: "Home — hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "subheadline", title: "Subheadline", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "fieldTested",
      title: "Home — field tested",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "unrelenting",
      title: "Home — unrelenting performance",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "testimonial",
      title: "Home — testimonial",
      type: "object",
      fields: [
        defineField({ name: "quote", title: "Quote", type: "text", rows: 4 }),
        defineField({ name: "author", title: "Author", type: "string" }),
      ],
    }),
    defineField({
      name: "contactSection",
      title: "Home — contact section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "aboutPage",
      title: "About page",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "body",
          title: "Body paragraphs",
          type: "array",
          of: [{ type: "text", rows: 4 }],
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
