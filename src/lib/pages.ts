import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/content";
import type {
  PageKey,
  PageVisibility,
  PageVisibilitySetting,
} from "@/lib/types";

export const DEFAULT_PAGE_REDIRECT = "/";

export const PAGE_PATH_PREFIXES: Record<PageKey, string[]> = {
  builds: ["/builds"],
  configure: ["/configure"],
  merch: ["/merch"],
  university: ["/university"],
  about: ["/about"],
  contact: ["/contact"],
};

const PAGE_KEYS: PageKey[] = [
  "builds",
  "configure",
  "merch",
  "university",
  "about",
  "contact",
];

export const DEFAULT_PAGE_VISIBILITY: PageVisibility = {
  builds: { enabled: true },
  configure: { enabled: true },
  merch: { enabled: true },
  university: { enabled: true },
  about: { enabled: true },
  contact: { enabled: true },
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

type LegacyOrCurrentVisibility = Partial<
  Record<
    PageKey,
    boolean | Partial<PageVisibilitySetting> | PageVisibilitySetting | null
  >
> | null;

function normalizePageSetting(
  raw: boolean | Partial<PageVisibilitySetting> | null | undefined,
  fallback: PageVisibilitySetting = { enabled: true },
): PageVisibilitySetting {
  if (typeof raw === "boolean") {
    return raw
      ? { enabled: true }
      : { enabled: false, redirectTo: DEFAULT_PAGE_REDIRECT };
  }

  if (raw && typeof raw === "object") {
    const enabled = raw.enabled !== false;
    const redirectTo = raw.redirectTo?.trim();

    if (enabled) {
      return { enabled: true };
    }

    return {
      enabled: false,
      redirectTo: redirectTo || DEFAULT_PAGE_REDIRECT,
    };
  }

  return fallback;
}

export function normalizePageVisibility(
  visibility?: LegacyOrCurrentVisibility,
): PageVisibility {
  return PAGE_KEYS.reduce((acc, key) => {
    acc[key] = normalizePageSetting(
      visibility?.[key],
      DEFAULT_PAGE_VISIBILITY[key],
    );
    return acc;
  }, {} as PageVisibility);
}

export function getPageSetting(
  page: PageKey,
  visibility?: LegacyOrCurrentVisibility,
): PageVisibilitySetting {
  return normalizePageVisibility(visibility)[page];
}

export function isPageEnabled(
  page: PageKey,
  visibility?: LegacyOrCurrentVisibility,
): boolean {
  return getPageSetting(page, visibility).enabled;
}

export function getPageRedirect(
  page: PageKey,
  visibility?: LegacyOrCurrentVisibility,
): string | null {
  const setting = getPageSetting(page, visibility);
  if (setting.enabled) return null;
  return setting.redirectTo?.trim() || DEFAULT_PAGE_REDIRECT;
}

export function headerNavLinks(
  visibility?: LegacyOrCurrentVisibility,
): NavLink[] {
  return SITE_PAGES.filter((page) => isPageEnabled(page.key, visibility)).map(
    (page) => ({
      href: page.href,
      label: page.headerLabel,
    }),
  );
}

export function footerNavLinks(
  visibility?: LegacyOrCurrentVisibility,
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
  const redirectTo = getPageRedirect(page, settings.pageVisibility);
  if (redirectTo) {
    redirect(redirectTo);
  }
}

/** Migrate legacy boolean page toggles to redirect-aware objects for Sanity. */
export function pageVisibilityForSanity(
  visibility?: LegacyOrCurrentVisibility,
): PageVisibility {
  return normalizePageVisibility(visibility);
}

export function pageVisibilityNeedsMigration(
  visibility?: LegacyOrCurrentVisibility,
): boolean {
  if (!visibility) return false;
  return PAGE_KEYS.some((key) => typeof visibility[key] === "boolean");
}
