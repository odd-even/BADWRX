/** Nav gradient fade over hero imagery (top bar readability). */
export interface NavImageFadeOpacity {
  /** Darkness at the top edge (0 = transparent, 100 = solid black). */
  topOpacity: number;
  /** Mid gradient stop on phone / tablet. */
  midOpacityMobile: number;
  /** Mid gradient stop on desktop. */
  midOpacityDesktop: number;
}

export interface NavImageFadeSettings {
  /** Home page hero */
  home: NavImageFadeOpacity;
  /** University pages */
  university: NavImageFadeOpacity;
  /** About, build detail, and other inner hero pages */
  default: NavImageFadeOpacity;
}

export const defaultNavImageFade: NavImageFadeSettings = {
  home: { topOpacity: 100, midOpacityMobile: 60, midOpacityDesktop: 75 },
  university: { topOpacity: 100, midOpacityMobile: 60, midOpacityDesktop: 75 },
  default: { topOpacity: 100, midOpacityMobile: 50, midOpacityDesktop: 75 },
};

function clampOpacity(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(100, Math.max(0, value));
}

export function normalizeNavImageFadeOpacity(
  raw: Partial<NavImageFadeOpacity> | undefined,
  fallback: NavImageFadeOpacity,
): NavImageFadeOpacity {
  return {
    topOpacity: clampOpacity(raw?.topOpacity, fallback.topOpacity),
    midOpacityMobile: clampOpacity(raw?.midOpacityMobile, fallback.midOpacityMobile),
    midOpacityDesktop: clampOpacity(raw?.midOpacityDesktop, fallback.midOpacityDesktop),
  };
}

export function normalizeNavImageFade(
  raw: Partial<NavImageFadeSettings> | undefined,
): NavImageFadeSettings {
  if (!raw) return defaultNavImageFade;
  return {
    home: normalizeNavImageFadeOpacity(raw.home, defaultNavImageFade.home),
    university: normalizeNavImageFadeOpacity(
      raw.university,
      defaultNavImageFade.university,
    ),
    default: normalizeNavImageFadeOpacity(raw.default, defaultNavImageFade.default),
  };
}

export function resolveNavImageFade(
  pathname: string | null,
  settings: NavImageFadeSettings = defaultNavImageFade,
): NavImageFadeOpacity {
  if (pathname === "/") return settings.home;
  if (pathname?.startsWith("/university")) return settings.university;
  return settings.default;
}

export function navFadeUsesLargePanel(pathname: string | null): boolean {
  return pathname === "/" || (pathname?.startsWith("/university") ?? false);
}

export const navFadePanelHeights = {
  large: {
    mobile: { vh: 16, maxPx: 112 },
    desktop: { vh: 40, maxPx: 280 },
  },
  standard: {
    mobile: { vh: 8, maxPx: 56 },
    desktop: { vh: 20, maxPx: 140 },
  },
} as const;

export function navFadePanelHeight(compact: boolean, large: boolean): string {
  const size = large ? navFadePanelHeights.large : navFadePanelHeights.standard;
  const { vh, maxPx } = compact ? size.mobile : size.desktop;
  return `min(${vh}vh, ${maxPx}px)`;
}

export function navFadeGradient(
  opacity: NavImageFadeOpacity,
  midOpacity: number,
): string {
  const top = clampOpacity(opacity.topOpacity, 100) / 100;
  const mid = clampOpacity(midOpacity, 75) / 100;
  return `linear-gradient(to bottom, rgba(0,0,0,${top}) 0%, rgba(0,0,0,${mid}) 45%, transparent 100%)`;
}
