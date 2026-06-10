"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initSiteScrollReveals } from "@/lib/scroll-reveal";

/**
 * Applies the shared scroll-reveal animation to major page blocks site-wide.
 * Skips the homepage (manual reveals) and configurator routes.
 */
export function SiteScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    let cleanup = () => {};

    // Wait one frame so route content is painted before collecting targets.
    const frame = requestAnimationFrame(() => {
      cleanup = initSiteScrollReveals(main, pathname);
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [pathname]);

  return null;
}
