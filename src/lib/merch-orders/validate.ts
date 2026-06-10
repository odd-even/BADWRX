import {
  validateMerchContact,
  validateMerchShippingAddress,
} from "@/lib/contact-validation";
import { orderTotalCents } from "@/lib/merch/shipping";
import type { MerchCartLine, MerchItem, MerchOrderPayload, MerchShippingAddress, MerchShippingMethod } from "@/lib/types";

interface ContactInput {
  name: string;
  email: string;
  phone?: string;
}

interface CheckoutBody {
  items: MerchCartLine[];
  contact: ContactInput;
  shipping: MerchShippingAddress;
  shippingMethod: MerchShippingMethod;
  notes?: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateCartLine(
  raw: unknown,
  productsBySlug: Map<string, MerchItem>,
): MerchCartLine | null {
  if (!raw || typeof raw !== "object") return null;
  const line = raw as MerchCartLine;
  const product = productsBySlug.get(line.slug);
  if (!product) return null;
  if (!isNonEmptyString(line.lineId) || !isNonEmptyString(line.size)) return null;
  if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 10) {
    return null;
  }
  if (!product.sizes.includes(line.size)) return null;
  if (line.color && product.colors && !product.colors.includes(line.color)) return null;

  return {
    lineId: line.lineId,
    slug: product.slug,
    title: product.title,
    size: line.size,
    color: line.color,
    quantity: line.quantity,
    priceCents: product.priceCents,
    imageUrl: product.image.url,
  };
}

export function validateMerchCheckoutBody(
  body: unknown,
  products: MerchItem[],
):
  | { ok: true; data: MerchOrderPayload & { notes?: string } }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }

  const input = body as CheckoutBody;

  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { ok: false, error: "Cart is empty" };
  }

  const productsBySlug = new Map(products.map((product) => [product.slug, product]));

  const items = input.items
    .map((line) => validateCartLine(line, productsBySlug))
    .filter((line): line is MerchCartLine => line !== null);

  if (items.length !== input.items.length) {
    return { ok: false, error: "One or more cart items are invalid" };
  }

  const contactResult = validateMerchContact(input.contact ?? {});
  if (contactResult.error) {
    return { ok: false, error: contactResult.error };
  }

  const shippingResult = validateMerchShippingAddress(input.shipping ?? {});
  if (shippingResult.error) {
    return { ok: false, error: shippingResult.error };
  }

  if (input.shippingMethod !== "standard" && input.shippingMethod !== "express") {
    return { ok: false, error: "Select a shipping method" };
  }

  const shipping = input.shipping;
  const totals = orderTotalCents(items, input.shippingMethod);
  const orderId = crypto.randomUUID();

  return {
    ok: true,
    data: {
      orderId,
      submittedAt: new Date().toISOString(),
      contact: {
        name: input.contact.name.trim(),
        email: input.contact.email.trim(),
        phone: input.contact.phone?.trim(),
      },
      shipping: {
        line1: shipping.line1.trim(),
        line2: shipping.line2?.trim(),
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        postalCode: shipping.postalCode.trim(),
        country: shipping.country.trim(),
      },
      shippingMethod: input.shippingMethod,
      items,
      ...totals,
      notes: input.notes?.trim(),
    },
  };
}
