import { defineField, defineType } from "sanity";
import { usdPriceField } from "./shared";

export const merchItem = defineType({
  name: "merchItem",
  title: "Merch Product",
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Caps", value: "caps" },
          { title: "T-Shirts", value: "t-shirts" },
          { title: "Sweaters", value: "sweaters" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    usdPriceField("price", "Price", { required: true }),
    defineField({
      name: "priceCents",
      title: "Price (legacy cents)",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      description: "Shown on the merch listing grid.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "longDescription",
      title: "Full description",
      type: "text",
      rows: 8,
      description: "Shown on the product detail page. Falls back to the short description if empty.",
    }),
    defineField({
      name: "images",
      title: "Product images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        },
      ],
      description: "Gallery on the product detail page. First image is used on the listing grid.",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "image",
      title: "Listing thumbnail (legacy)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
      description: "Optional — first product image is used when this is empty.",
      hidden: ({ document }) => Boolean(document?.images?.length),
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [{ type: "string" }],
      description: 'e.g. S, M, L, XL, 2XL — or "One Size" for caps',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      of: [{ type: "string" }],
      description: "Optional color options shown at checkout",
    }),
    defineField({
      name: "active",
      title: "Available for sale",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Category, then title",
      name: "categoryTitle",
      by: [
        { field: "category", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      price: "price",
      media: "images.0",
    },
    prepare({ title, subtitle, price, media }) {
      const priceLabel =
        typeof price === "number"
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(price)
          : undefined;
      return {
        title,
        subtitle: [subtitle, priceLabel].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
