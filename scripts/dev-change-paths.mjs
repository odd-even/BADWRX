/** Paths that commonly require a dev server restart (not just HMR). */
export const MAJOR_DEV_CHANGE_PATTERNS = [
  /^src\/data\//,
  /^src\/lib\/source-data\//,
  /^src\/lib\/images\.ts$/,
  /^src\/data\/configurator-options\.ts$/,
  /^src\/data\/rifles\.ts$/,
  /^src\/data\/site-settings\.ts$/,
  /^src\/data\/merch\.ts$/,
  /^scripts\/sync-/,
  /^_assets\//,
  /^public\/images\//,
  /next\.config\./,
  /^package\.json$/,
  /^package-lock\.json$/,
];

export function normalizeDevPath(filePath) {
  return String(filePath).replace(/\\/g, "/");
}

export function isMajorDevChange(filePath) {
  const normalized = normalizeDevPath(filePath);
  return MAJOR_DEV_CHANGE_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function pathsFromHookInput(input) {
  const paths = new Set();

  function walk(value) {
    if (typeof value === "string") {
      if (value.includes("/") || value.includes("\\")) paths.add(value);
      return;
    }
    if (!value || typeof value !== "object") return;
    for (const entry of Object.values(value)) walk(entry);
  }

  walk(input);
  return [...paths];
}

export function hookInputNeedsDevRestart(input) {
  return pathsFromHookInput(input).some(isMajorDevChange);
}
