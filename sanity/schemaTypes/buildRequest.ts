import { defineField, defineType } from "sanity";

export const buildRequest = defineType({
  name: "buildRequest",
  title: "Build Request",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "requestId",
      title: "Request ID",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending review", value: "pending_review" },
          { title: "Approved", value: "approved" },
          { title: "Invoiced", value: "invoiced" },
        ],
      },
      initialValue: "pending_review",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
    }),
    defineField({
      name: "customerName",
      title: "Customer name",
      type: "string",
    }),
    defineField({
      name: "customerFirstName",
      title: "First name",
      type: "string",
    }),
    defineField({
      name: "customerLastName",
      title: "Last name",
      type: "string",
    }),
    defineField({
      name: "customerEmail",
      title: "Customer email",
      type: "string",
    }),
    defineField({
      name: "customerPhone",
      title: "Customer phone",
      type: "string",
    }),
    defineField({
      name: "customerAddress",
      title: "Customer address (formatted)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "addressLine1",
      title: "Street address",
      type: "string",
    }),
    defineField({
      name: "addressLine2",
      title: "Address line 2",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "state",
      title: "State / region",
      type: "string",
    }),
    defineField({
      name: "postalCode",
      title: "ZIP / postal code",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment method",
      type: "string",
    }),
    defineField({
      name: "totalCents",
      title: "Estimated total (cents)",
      type: "number",
    }),
    defineField({
      name: "depositCents",
      title: "Deposit (cents)",
      type: "number",
    }),
    defineField({
      name: "totalFormatted",
      title: "Estimated total",
      type: "string",
    }),
    defineField({
      name: "selections",
      title: "Selections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "stepKey", title: "Step key", type: "string" }),
            defineField({ name: "stepTitle", title: "Step", type: "string" }),
            defineField({
              name: "optionLabel",
              title: "Option",
              type: "string",
            }),
            defineField({
              name: "priceCents",
              title: "Price (cents)",
              type: "number",
            }),
          ],
          preview: {
            select: { title: "optionLabel", subtitle: "stepTitle" },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "totalFormatted",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title ?? "Build request",
        subtitle: [status, subtitle].filter(Boolean).join(" · "),
      };
    },
  },
});
