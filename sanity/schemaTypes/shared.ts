import { defineField } from "sanity";

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
