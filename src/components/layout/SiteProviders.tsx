"use client";

import { AgeVerification } from "@/components/layout/AgeVerification";
import { MerchCartProvider } from "@/components/merch/CartProvider";

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <MerchCartProvider>
      <AgeVerification />
      {children}
    </MerchCartProvider>
  );
}
