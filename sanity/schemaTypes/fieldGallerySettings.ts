import { ImagesIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { FieldGalleryInput } from "../components/FieldGalleryInput";
import { sectionFields } from "./shared";

export const fieldGallerySettings = defineType({
  name: "fieldGallerySettings",
  title: "From the Field Gallery",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "section",
      title: "Section copy",
      type: "object",
      description: "Headline and intro above the home page photo gallery.",
      fields: sectionFields(),
      initialValue: {
        eyebrow: "Photo gallery",
        title: "From the Field",
        body: "The rifles we make and the country they see.",
      },
    }),
    defineField({
      name: "images",
      title: "Gallery photos",
      type: "array",
      description:
        "Home page masonry gallery. Use bulk upload below — photos are auto-converted to WebP and served at responsive sizes from Sanity CDN.",
      validation: (rule) => rule.max(100),
      options: { layout: "grid" },
      components: {
        input: FieldGalleryInput,
      },
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
  ],
  preview: {
    prepare() {
      return { title: "From the Field Gallery" };
    },
  },
});

export const FIELD_GALLERY_SETTINGS_DOCUMENT_ID = "fieldGallerySettings";
