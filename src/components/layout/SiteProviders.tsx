"use client";

import { AgeVerification } from "@/components/layout/AgeVerification";
import { MerchCartProvider } from "@/components/merch/CartProvider";

interface SiteProvidersProps {
  children: React.ReactNode;
  ageVerificationEnabled?: boolean;
}

export function SiteProviders({
  children,
  ageVerificationEnabled = true,
}: SiteProvidersProps) {
  return (
    <MerchCartProvider>
      <AgeVerification enabled={ageVerificationEnabled} />
      {children}
    </MerchCartProvider>
  );
}
