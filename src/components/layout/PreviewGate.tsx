"use client";

import { SitePasswordOverlay } from "@/components/layout/SitePasswordOverlay";
import { isSitePublic } from "@/lib/site";

interface PreviewGateProps {
  children: React.ReactNode;
  passwordProtectionEnabled?: boolean;
}

export function PreviewGate({
  children,
  passwordProtectionEnabled = true,
}: PreviewGateProps) {
  if (isSitePublic() || !passwordProtectionEnabled) return <>{children}</>;

  return (
    <>
      {children}
      <SitePasswordOverlay />
    </>
  );
}
