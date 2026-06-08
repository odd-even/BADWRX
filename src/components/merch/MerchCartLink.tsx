"use client";

import Link from "next/link";
import { useMerchCart } from "@/components/merch/CartProvider";

export function MerchCartLink() {
  const { itemCount } = useMerchCart();

  if (itemCount === 0) return null;

  return (
    <Link
      href="/merch/cart"
      className="relative flex h-9 w-9 items-center justify-center text-white-muted transition hover:text-white lg:h-10 lg:w-10"
      aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-red px-1 text-[10px] font-semibold text-white">
        {itemCount > 9 ? "9+" : itemCount}
      </span>
    </Link>
  );
}
