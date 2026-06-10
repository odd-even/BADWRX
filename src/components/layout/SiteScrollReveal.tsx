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

    let cleanup = initSiteScrollReveals(main, pathname);

    const frame = requestAnimationFrame(() => {
      cleanup();
      cleanup = initSiteScrollReveals(main, pathname);
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [pathname]);

  return null;
}
