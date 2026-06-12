/** Local images from `_assets/photos` (served via public/images/assets symlink) */

const assetBase = "/images/assets";
const galleryBase = "/images/gallery";
const logoBase = "/images/logos";

export const images = {
  gallery: galleryBase,
  rifle: {
    studio: `${assetBase}/IMG_0058.jpg`,
    studioCropped: `${assetBase}/IMG_0058-cropped.jpg`,
    field: `${assetBase}/IMG_5613.jpeg`,
    homeCover: `${assetBase}/IMG_5613cover.webp`,
    universityHero: `${assetBase}/Kyle_Lamb_MDT_CRBN_Tripod.jpg.webp`,
    hunt: `${assetBase}/IMG_1125bighorn.jpg`,
    reticleOverlay: `${assetBase}/FC-DMx_MOA__16268%20copy.webp`,
  },
  logos: {
    fullName: `${logoBase}/full-name_left_white.svg`,
    headerLogo: `${logoBase}/badgergunworks_white.svg`,
    stack: `${logoBase}/BADWRX-stack_white-red.svg`,
    badge: `${logoBase}/Gunworks_badge.svg`,
  },
  about: {
    story: `${assetBase}/IMG_1192%20copy.webp`,
  },
} as const;

export const riflePlaceholderAlt =
  "Custom precision bolt-action rifle with NightForce scope on black background";

const configuratorBase = "/images/configurator";

/** Trimmed rifle product shot — default for cards, builds gallery, and configurator options */
export const configuratorPlaceholder = `${configuratorBase}/platform/${encodeURIComponent("IMG_0058 copy.webp")}`;

/** Alias used by rifle cards, builds pages, and Sanity fallbacks */
export const riflePlaceholder = configuratorPlaceholder;

export type PlaceholderCategory =
  | "actions"
  | "stocks"
  | "triggers"
  | "camo"
  | "barrels"
  | "scopes"
  | "rings"
  | "muzzle-brakes"
  | "suppressors"
  | "cases";

/** Configurator option photos from `_assets/configurator/{category}/` */
export function placeholderImage(
  category: PlaceholderCategory,
  filename: string,
): string {
  return `${configuratorBase}/${category}/${filename}`;
}

/** Curated assets from `_assets/configurator/{subfolder}/` */
export function configuratorImage(subfolder: string, filename: string): string {
  return `${configuratorBase}/${subfolder}/${filename}`;
}

/** Platform hero in `_assets/configurator/platform/` */
export const platformImage = configuratorPlaceholder;

/** Platform hero images in `_assets/configurator/platform/` */
export const platformImages: Record<string, string> = {
  specter: platformImage,
  reaper: platformImage,
  imperium: platformImage,
  invictus: platformImage,
  sentinel: platformImage,
  goat: platformImage,
};

/** Camo swatch filenames in `_assets/configurator/camo/` keyed by finish option id */
export const stockPaintFilenames: Record<string, string> = {
  "vias-multicam-black": "bondcambrushcam550x50swatch.jpg",
  "alpine-ghost": "bondcambrushcam5monochromecontrasty50x50swatch.jpg.webp",
  "ridgeline-bronze":
    "Camouflage-Seamless-Pattern-Background-Graphics-41997134-2-580x386.jpg",
  "midnight-operator": "camo-seamless-pattern-v0-7or2osuu8bxb1.jpg",
  "tungsten-mountain": "seamless-camo-patterns-v0-hvfuqglgfxac1.jpg.webp",
  "od-backcountry": "seamless-camo-patterns-v0-hvfuqglgfxac1.jpg.webp",
  custom: "bondcambrushcam550x50swatch.jpg",
};

/** Finish swatch images for the configurator color step */
export const stockPaintImages: Record<string, string> = Object.fromEntries(
  Object.entries(stockPaintFilenames).map(([id, filename]) => [
    id,
    placeholderImage("camo", filename),
  ]),
);

const merchBase = "/images/merch";

/** Merch product photos from `_assets/merch/{folder}/` */
export function merchImage(folder: string, filename: string): string {
  return `${merchBase}/${folder}/${encodeURIComponent(filename)}`;
}

/** Hawkins precision rings — configurator rings step */
export const ringsImage = placeholderImage("rings", "348525-300147_main.avif");

/** Basecamp hard case mockup — configurator package step */
export const basecampPackageImage = placeholderImage("cases", "Mockup.png");

/** Nightforce scope product photos in `_assets/configurator/scopes/` */
export const scopeFilenames = {
  lp: "ATACR_1-8x24_F1_C672_1_Edited__56363.1730990457.1280.1280__93511.png.webp",
  precision:
    "ATACR_7-35x56_F1_C613_1__92890.1730990339.1280.1280__96549.png.webp",
  precisionAlt:
    "ATACR_7-35x56_F1_C689_1__59276.1730990338.1280.1280__81359.png.webp",
} as const;

export type ScopeImageKey = keyof typeof scopeFilenames;

export function scopeImageKeyForOptic(
  magnification: string,
  opticId?: string,
): ScopeImageKey {
  if (magnification.startsWith("1-") || magnification.startsWith("2-12")) {
    return "lp";
  }
  if (opticId?.includes("dark-earth")) {
    return "precisionAlt";
  }
  if (magnification.startsWith("6-") || magnification.startsWith("5-")) {
    return "precisionAlt";
  }
  return "precision";
}

/** Scope image for a configurator optics option */
export function scopeImageForMagnification(
  magnification: string,
  opticId?: string,
): string {
  const key = scopeImageKeyForOptic(magnification, opticId);
  return placeholderImage("scopes", scopeFilenames[key]);
}
