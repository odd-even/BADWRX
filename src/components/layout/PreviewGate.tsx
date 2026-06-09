"use client";

import { SitePasswordOverlay } from "@/components/layout/SitePasswordOverlay";

export function PreviewGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SitePasswordOverlay />
    </>
  );
}
