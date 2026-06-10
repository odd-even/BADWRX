"use client";

import { SitePasswordOverlay } from "@/components/layout/SitePasswordOverlay";

const isSitePublic = process.env.NEXT_PUBLIC_SITE_PUBLIC === "true";

export function PreviewGate({ children }: { children: React.ReactNode }) {
  if (isSitePublic) return <>{children}</>;

  return (
    <>
      {children}
      <SitePasswordOverlay />
    </>
  );
}
