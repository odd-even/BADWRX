import { Suspense } from "react";
import { SiteLoginClient } from "./SiteLoginClient";

export default function SiteLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black px-6">
          <p className="text-sm text-white-muted">Loading…</p>
        </div>
      }
    >
      <SiteLoginClient />
    </Suspense>
  );
}
