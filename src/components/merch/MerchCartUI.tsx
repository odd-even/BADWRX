"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMerchCart } from "@/components/merch/CartProvider";
import { formSelectClassName } from "@/lib/form-styles";
import type { MerchItem } from "@/lib/types";

interface MerchAddToCartProps {
  item: MerchItem;
}

export function MerchAddToCart({ item }: MerchAddToCartProps) {
  const { addItem } = useMerchCart();
  const [size, setSize] = useState(item.sizes[0] ?? "One Size");
  const [color, setColor] = useState(item.colors?.[0] ?? "");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(item, {
      size,
      color: color || undefined,
      quantity: 1,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-4 space-y-3">
      <label className="block">
        <span className="text-[10px] uppercase tracking-widest text-white-muted">Size</span>
        <select
          value={size}
          onChange={(event) => setSize(event.target.value)}
          className={formSelectClassName}
        >
          {item.sizes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {item.colors && item.colors.length > 0 ? (
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-white-muted">Color</span>
          <select
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className={formSelectClassName}
          >
            {item.colors.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full border border-red bg-red py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}

interface MerchCardProps {
  item: MerchItem;
}

function MerchCardNavArrow({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/75 text-white opacity-0 backdrop-blur-sm transition hover:border-red hover:text-red group-hover/image:opacity-100 ${
        direction === "prev" ? "left-2" : "right-2"
      }`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "prev" ? (
          <path d="m15 6-6 6 6 6" />
        ) : (
          <path d="m9 6 6 6-6 6" />
        )}
      </svg>
    </button>
  );
}

export function MerchCard({ item }: MerchCardProps) {
  const images = item.images.length > 0 ? item.images : [item.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];
  const hasGallery = images.length > 1;

  function stepImage(delta: number, event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((current) => (current + delta + images.length) % images.length);
  }

  return (
    <Link
      href={`/merch/${item.slug}`}
      className="group flex flex-col overflow-hidden border border-white/10 bg-black-muted transition hover:border-red/50"
    >
      <div className="group/image relative aspect-square overflow-hidden bg-black-light hover-zoom">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {hasGallery ? (
          <>
            <MerchCardNavArrow
              direction="prev"
              label={`Previous image for ${item.title}`}
              onClick={(event) => stepImage(-1, event)}
            />
            <MerchCardNavArrow
              direction="next"
              label={`Next image for ${item.title}`}
              onClick={(event) => stepImage(1, event)}
            />
          </>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] uppercase tracking-widest text-red">{item.price}</p>
        <h2 className="mt-2 text-xl text-white transition group-hover:text-red">
          {item.title}
        </h2>
        <p className="mt-2 flex-1 line-clamp-2 text-sm text-white-muted">
          {item.description}
        </p>
        <span className="mt-4 text-xs uppercase tracking-widest text-red transition group-hover:text-white">
          View product →
        </span>
      </div>
    </Link>
  );
}

export function MerchCartLineRow({
  line,
  onUpdateQuantity,
  onRemove,
}: {
  line: import("@/lib/types").MerchCartLine;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}) {
  return (
    <div className="flex gap-4 border-b border-white/10 py-6">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-black-light hover-zoom">
        <Image
          src={line.imageUrl}
          alt={line.title}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium text-white">{line.title}</h3>
            <p className="mt-1 text-sm text-white-muted">
              {line.size}
              {line.color ? ` · ${line.color}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(line.lineId)}
            className="text-xs uppercase tracking-widest text-white-muted transition hover:text-red"
          >
            Remove
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-white/10">
            <button
              type="button"
              onClick={() => onUpdateQuantity(line.lineId, line.quantity - 1)}
              className="px-3 py-2 text-white-muted transition hover:text-white"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm text-white">{line.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(line.lineId, line.quantity + 1)}
              className="px-3 py-2 text-white-muted transition hover:text-white"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="text-sm text-white">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format((line.priceCents * line.quantity) / 100)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MerchOrderSummary({
  subtotalCents,
  shippingCents,
  totalCents,
  shippingLabel,
}: {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingLabel?: string;
}) {
  const format = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(cents / 100);

  return (
    <div className="border border-white/10 bg-black-muted p-6">
      <p className="text-xs uppercase tracking-widest text-red">Order summary</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-white-muted">Subtotal</dt>
          <dd className="text-white">{format(subtotalCents)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-white-muted">
            Shipping{shippingLabel ? ` · ${shippingLabel}` : ""}
          </dt>
          <dd className="text-white">
            {shippingCents === 0 ? "Free" : format(shippingCents)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base">
          <dt className="font-medium text-white">Total</dt>
          <dd className="font-semibold text-white">{format(totalCents)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function MerchEmptyCart() {
  return (
    <div className="border border-white/10 bg-black-muted p-10 text-center">
      <p className="text-white">Your merch cart is empty.</p>
      <p className="mx-auto mt-3 max-w-sm text-sm text-white-muted">
        Configuring a rifle? Your build stays on the configure page — it is not
        added to this cart.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/configure"
          className="inline-block border border-red bg-red px-8 py-4 text-xs uppercase tracking-widest text-white transition hover:bg-red-dark"
        >
          Continue building
        </Link>
        <Link
          href="/merch"
          className="inline-block border border-white/20 px-8 py-4 text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
        >
          Shop merch
        </Link>
      </div>
    </div>
  );
}
