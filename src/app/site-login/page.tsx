import type { Metadata } from "next";
import { Suspense } from "react";
import { noindexMetadata } from "@/lib/metadata";
import { SiteLoginClient } from "./SiteLoginClient";

export const metadata: Metadata = {
  title: "Site Login",
  ...noindexMetadata,
};

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
