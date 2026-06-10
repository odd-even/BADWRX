"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/pricing";
import type { MerchOrderPayload } from "@/lib/types";
import { shippingOptions } from "@/lib/merch/shipping";

const STORAGE_KEY = "badwrx-last-merch-order";

type StoredMerchOrder = MerchOrderPayload & { paymentUrl?: string };

export default function MerchOrderSuccessPage() {
  const [order, setOrder] = useState<StoredMerchOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      setOrder(JSON.parse(raw) as StoredMerchOrder);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      setOrder(null);
    }
  }, []);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-red">Order</p>
        <h1 className="mt-2 text-5xl text-white">Order not found</h1>
        <p className="mt-4 text-white-muted">
          If you just placed an order, check your email for confirmation.
        </p>
        <Link
          href="/merch"
          className="mt-8 inline-block border border-white/20 px-8 py-4 text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
        >
          Shop merch
        </Link>
      </div>
    );
  }

  const shippingLabel =
    shippingOptions.find((option) => option.id === order.shippingMethod)?.label ??
    order.shippingMethod;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Order confirmed</p>
      <h1 className="mt-2 text-5xl text-white">Thank you</h1>
      <p className="mt-4 text-white-muted">
        Order <span className="text-white">{order.orderId.slice(0, 8).toUpperCase()}</span>{" "}
        is in.{" "}
        {order.paymentUrl ? (
          <>
            Complete payment to confirm your order — we also emailed{" "}
            <span className="text-white">{order.contact.email}</span> a link.
          </>
        ) : (
          <>
            We&apos;ll email{" "}
            <span className="text-white">{order.contact.email}</span> a payment
            link, then ship via {shippingLabel.toLowerCase()} once payment clears.
          </>
        )}
      </p>

      <div className="mt-10 border border-white/10 bg-black-muted p-6">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-white-muted">Total</dt>
            <dd className="text-white">{formatPrice(order.totalCents)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white-muted">Ship to</dt>
            <dd className="text-right text-white">
              {order.contact.name}
              <br />
              {order.shipping.line1}
              {order.shipping.line2 ? (
                <>
                  <br />
                  {order.shipping.line2}
                </>
              ) : null}
              <br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {order.paymentUrl ? (
          <a
            href={order.paymentUrl}
            className="border border-red bg-red px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
          >
            Pay now
          </a>
        ) : null}
        <Link
          href="/merch"
          className="border border-white/20 px-8 py-4 text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="px-8 py-4 text-xs uppercase tracking-widest text-white-muted transition hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
