"use client";

import { MerchCartProvider } from "@/components/merch/CartProvider";

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return <MerchCartProvider>{children}</MerchCartProvider>;
}
