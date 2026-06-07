import type { MerchCartLine, MerchShippingMethod } from "@/lib/types";

export const FREE_SHIPPING_THRESHOLD_CENTS = 100_00;

export const shippingOptions: {
  id: MerchShippingMethod;
  label: string;
  detail: string;
  cents: number;
}[] = [
  {
    id: "standard",
    label: "Standard",
    detail: "5–7 business days",
    cents: 895,
  },
  {
    id: "express",
    label: "Express",
    detail: "2–3 business days",
    cents: 1495,
  },
];

export function cartSubtotalCents(items: MerchCartLine[]): number {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

export function shippingCentsForOrder(
  subtotalCents: number,
  method: MerchShippingMethod,
): number {
  if (method === "standard" && subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) {
    return 0;
  }
  const option = shippingOptions.find((entry) => entry.id === method);
  return option?.cents ?? shippingOptions[0].cents;
}

export function orderTotalCents(
  items: MerchCartLine[],
  method: MerchShippingMethod,
): { subtotalCents: number; shippingCents: number; totalCents: number } {
  const subtotalCents = cartSubtotalCents(items);
  const shippingCents = shippingCentsForOrder(subtotalCents, method);
  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

export function cartItemCount(items: MerchCartLine[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
