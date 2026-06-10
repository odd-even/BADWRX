"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMerchCart } from "@/components/merch/CartProvider";
import {
  MerchEmptyCart,
  MerchOrderSummary,
} from "@/components/merch/MerchCartUI";
import {
  orderTotalCents,
  shippingOptions,
} from "@/lib/merch/shipping";
import type { MerchShippingAddress, MerchShippingMethod } from "@/lib/types";
import { formInputClassName as inputClassName } from "@/lib/form-styles";

export default function MerchCheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useMerchCart();
  const [shippingMethod, setShippingMethod] =
    useState<MerchShippingMethod>("standard");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [shipping, setShipping] = useState<MerchShippingAddress>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const [notes, setNotes] = useState("");

  const totals = useMemo(
    () => orderTotalCents(items, shippingMethod),
    [items, shippingMethod],
  );

  const selectedShipping = shippingOptions.find(
    (option) => option.id === shippingMethod,
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-red">Checkout</p>
        <h1 className="mt-2 text-5xl text-white">Checkout</h1>
        <div className="mt-10">
          <MerchEmptyCart />
        </div>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/merch-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          contact,
          shipping,
          shippingMethod,
          notes,
        }),
      });

      const data = (await response.json()) as {
        orderId?: string;
        error?: string;
        totalCents?: number;
        paymentUrl?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not place order");
      }

      const orderPayload = {
        orderId: data.orderId!,
        submittedAt: new Date().toISOString(),
        contact: {
          name: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim() || undefined,
        },
        shipping: {
          line1: shipping.line1.trim(),
          line2: shipping.line2?.trim(),
          city: shipping.city.trim(),
          state: shipping.state.trim(),
          postalCode: shipping.postalCode.trim(),
          country: shipping.country.trim(),
        },
        shippingMethod,
        items,
        paymentUrl: data.paymentUrl,
        ...totals,
      };

      sessionStorage.setItem(
        "badwrx-last-merch-order",
        JSON.stringify(orderPayload),
      );
      clearCart();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      router.push("/merch/order/success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not place order",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Checkout</p>
      <h1 className="mt-2 text-5xl text-white">Shipping & payment</h1>
      <p className="mt-4 max-w-2xl text-white-muted">
        Enter your shipping details. After you place your order, you&apos;ll be
        redirected to Square to pay securely. We ship once payment clears.
      </p>

      <form onSubmit={handleSubmit} autoComplete="on" className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-8">
          <section className="border border-white/10 bg-black-muted p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-red">
              Contact
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Name
                </span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={contact.name}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, name: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, email: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Phone
                </span>
                <input
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={contact.phone}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, phone: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <section className="border border-white/10 bg-black-muted p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-red">
              Shipping address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Address
                </span>
                <input
                  required
                  name="address-line1"
                  autoComplete="shipping address-line1"
                  value={shipping.line1}
                  onChange={(event) =>
                    setShipping((current) => ({ ...current, line1: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Apartment, suite, etc.
                </span>
                <input
                  name="address-line2"
                  autoComplete="shipping address-line2"
                  value={shipping.line2 ?? ""}
                  onChange={(event) =>
                    setShipping((current) => ({ ...current, line2: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  City
                </span>
                <input
                  required
                  name="city"
                  autoComplete="shipping address-level2"
                  value={shipping.city}
                  onChange={(event) =>
                    setShipping((current) => ({ ...current, city: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  State
                </span>
                <input
                  required
                  name="state"
                  autoComplete="shipping address-level1"
                  value={shipping.state}
                  onChange={(event) =>
                    setShipping((current) => ({ ...current, state: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  ZIP code
                </span>
                <input
                  required
                  name="postal-code"
                  autoComplete="shipping postal-code"
                  inputMode="numeric"
                  value={shipping.postalCode}
                  onChange={(event) =>
                    setShipping((current) => ({
                      ...current,
                      postalCode: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Country
                </span>
                <input
                  required
                  name="country"
                  autoComplete="shipping country"
                  value={shipping.country}
                  onChange={(event) =>
                    setShipping((current) => ({ ...current, country: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <section className="border border-white/10 bg-black-muted p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-red">
              Shipping method
            </h2>
            <div className="mt-4 space-y-3">
              {shippingOptions.map((option) => {
                const selected = shippingMethod === option.id;
                const optionTotal = orderTotalCents(items, option.id);
                const shippingAmount = optionTotal.shippingCents;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start justify-between gap-4 border p-4 transition ${
                      selected
                        ? "border-red bg-red/5"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={option.id}
                        checked={selected}
                        onChange={() => setShippingMethod(option.id)}
                        className="mt-1"
                      />
                      <span>
                        <span className="block text-sm text-white">{option.label}</span>
                        <span className="mt-1 block text-xs text-white-muted">
                          {option.detail}
                        </span>
                      </span>
                    </span>
                    <span className="text-sm text-white">
                      {shippingAmount === 0
                        ? "Free"
                        : new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(shippingAmount / 100)}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="border border-white/10 bg-black-muted p-6">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-white-muted">
                Order notes
              </span>
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Gift message, delivery instructions, etc."
                className={inputClassName}
              />
            </label>
          </section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-28">
          <MerchOrderSummary
            subtotalCents={totals.subtotalCents}
            shippingCents={totals.shippingCents}
            totalCents={totals.totalCents}
            shippingLabel={selectedShipping?.label}
          />

          <ul className="space-y-3 border border-white/10 bg-black-muted p-6 text-sm">
            {items.map((line) => (
              <li key={line.lineId} className="flex justify-between gap-4 text-white-muted">
                <span>
                  {line.title} × {line.quantity}
                </span>
                <span className="text-white">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format((line.priceCents * line.quantity) / 100)}
                </span>
              </li>
            ))}
          </ul>

          {error ? <p className="text-sm text-red">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark disabled:opacity-60"
          >
            {submitting ? "Creating payment link…" : "Place order & pay"}
          </button>

          <Link
            href="/merch/cart"
            className="block text-center text-xs uppercase tracking-widest text-white-muted transition hover:text-white"
          >
            Back to cart
          </Link>
        </div>
      </form>
    </div>
  );
}
