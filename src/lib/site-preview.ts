export const SITE_PREVIEW_STORAGE_KEY = "badwrx-preview-unlocked";

export function isPreviewExcludedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  );
}
