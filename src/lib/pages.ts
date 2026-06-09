import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/content";
import type { PageKey, PageVisibility } from "@/lib/types";

export const DEFAULT_PAGE_VISIBILITY: PageVisibility = {
  builds: true,
  configure: true,
  merch: true,
  university: true,
  about: true,
  contact: true,
};

export const SITE_PAGES = [
  {
    key: "builds" as const,
    href: "/builds",
    headerLabel: "Builds",
    footerLabel: "Our Rifles",
  },
  {
    key: "configure" as const,
    href: "/configure",
    headerLabel: "Configure",
    footerLabel: "Configure a Rifle",
  },
  {
    key: "merch" as const,
    href: "/merch",
    headerLabel: "Merch",
    footerLabel: "Merch",
  },
  {
    key: "university" as const,
    href: "/university",
    headerLabel: "University",
    footerLabel: "Long Range University",
  },
  {
    key: "about" as const,
    href: "/about",
    headerLabel: "About",
    footerLabel: "About BADWRX",
  },
  {
    key: "contact" as const,
    href: "/contact",
    headerLabel: "Contact",
    footerLabel: "Request a Consultation",
  },
] as const;

export type NavLink = { href: string; label: string };

export function normalizePageVisibility(
  visibility?: Partial<PageVisibility> | null,
): PageVisibility {
  return {
    ...DEFAULT_PAGE_VISIBILITY,
    ...visibility,
  };
}

export function isPageEnabled(
  page: PageKey,
  visibility?: Partial<PageVisibility> | null,
): boolean {
  const resolved = normalizePageVisibility(visibility);
  return resolved[page] !== false;
}

export function headerNavLinks(
  visibility?: Partial<PageVisibility> | null,
): NavLink[] {
  return SITE_PAGES.filter((page) => isPageEnabled(page.key, visibility)).map(
    (page) => ({
      href: page.href,
      label: page.headerLabel,
    }),
  );
}

export function footerNavLinks(
  visibility?: Partial<PageVisibility> | null,
): NavLink[] {
  return SITE_PAGES.filter((page) => isPageEnabled(page.key, visibility)).map(
    (page) => ({
      href: page.href,
      label: page.footerLabel,
    }),
  );
}

export function pageKeyForPath(pathname: string): PageKey | null {
  if (pathname.startsWith("/builds")) return "builds";
  if (pathname.startsWith("/configure")) return "configure";
  if (pathname.startsWith("/merch")) return "merch";
  if (pathname.startsWith("/university")) return "university";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return null;
}

export async function assertPageEnabled(page: PageKey): Promise<void> {
  const settings = await getSiteSettings();
  if (!isPageEnabled(page, settings.pageVisibility)) {
    notFound();
  }
}
