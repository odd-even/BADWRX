"use client";

import dynamic from "next/dynamic";
import { StudioSetup } from "@/components/studio/StudioSetup";
import { isSanityConfigured } from "@/sanity/env";

const NextStudioClient = dynamic(() => import("./NextStudioClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center text-white-muted">
      Loading studio…
    </div>
  ),
});

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return <StudioSetup />;
  }

  return <NextStudioClient />;
}
