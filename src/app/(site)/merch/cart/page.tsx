"use client";

import Link from "next/link";
import {
  MerchCartLineRow,
  MerchEmptyCart,
  MerchOrderSummary,
} from "@/components/merch/MerchCartUI";
import { useMerchCart } from "@/components/merch/CartProvider";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  orderTotalCents,
  shippingOptions,
} from "@/lib/merch/shipping";

export default function MerchCartPage() {
  const { items, subtotalCents, updateQuantity, removeItem } = useMerchCart();
  const preview = orderTotalCents(items, "standard");
  const standardOption = shippingOptions[0];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-red">Merch cart</p>
        <h1 className="mt-2 text-5xl text-white">Merch cart</h1>
        <div className="mt-10">
          <MerchEmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Merch cart</p>
      <h1 className="mt-2 text-5xl text-white">Merch cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="border border-white/10 bg-black-muted px-6">
          {items.map((line) => (
            <MerchCartLineRow
              key={line.lineId}
              line={line}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="space-y-6">
          <MerchOrderSummary
            subtotalCents={preview.subtotalCents}
            shippingCents={preview.shippingCents}
            totalCents={preview.totalCents}
            shippingLabel={standardOption.label}
          />
          {subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS ? (
            <p className="text-xs text-white-muted">
              Free standard shipping on orders over $
              {FREE_SHIPPING_THRESHOLD_CENTS / 100}.
            </p>
          ) : (
            <p className="text-xs text-white-muted">
              You qualify for free standard shipping.
            </p>
          )}
          <Link
            href="/merch/checkout"
            className="block border border-red bg-red py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
          >
            Checkout
          </Link>
          <Link
            href="/merch"
            className="block text-center text-xs uppercase tracking-widest text-white-muted transition hover:text-white"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
