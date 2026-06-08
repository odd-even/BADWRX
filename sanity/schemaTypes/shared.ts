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
