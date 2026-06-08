/** Local images from `_assets/photos` (served via public/images/assets symlink) */

const assetBase = "/images/assets";
const logoBase = "/images/logos";

export const images = {
  rifle: {
    studio: `${assetBase}/IMG_0058.jpg`,
    studioCropped: `${assetBase}/IMG_0058-cropped.jpg`,
    field: `${assetBase}/IMG_5613.jpeg`,
    homeCover: `${assetBase}/IMG_5613cover.webp`,
    universityHero: `${assetBase}/Kyle_Lamb_MDT_CRBN_Tripod.jpg.webp`,
    hunt: `${assetBase}/IMG_1125bighorn.jpg`,
    reticleOverlay: `${assetBase}/FC-DMx_MOA__16268%20copy.webp`,
  },
  landscape: {
    mountains: `${assetBase}/mountain-panorama-just-after-the-storm-2025-01-15-14-24-51-utc.jpg`,
    peaks: `${assetBase}/cadini-di-misurina-in-darkness-illuminated-by-sunl-2025-01-10-03-08-57-utc.jpeg`,
  },
  logos: {
    fullName: `${logoBase}/full-name_left_white.svg`,
    stack: `${logoBase}/BADWRX-stack_white-red.svg`,
    badge: `${logoBase}/CPR_Badge_Black_1.svg`,
  },
  about: {
    story: `${assetBase}/IMG_1192%20copy.webp`,
  },
} as const;

/** Default rifle image for build cards, heroes, and galleries */
export const riflePlaceholder = images.rifle.studio;

export const riflePlaceholderAlt =
  "Custom precision bolt-action rifle with NightForce scope on black background";

const configuratorBase = "/images/configurator";

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
export const platformImage = `${configuratorBase}/platform/IMG_0058 copy.webp`;

/** Platform hero images in `_assets/configurator/platform/` */
export const platformImages: Record<string, string> = {
  specter: platformImage,
  reaper: platformImage,
  imperium: platformImage,
  invictus: platformImage,
  sentinel: platformImage,
  goat: platformImage,
};

/** Finish swatches in `_assets/configurator/camo/` */
export const stockPaintImages: Record<string, string> = {
  "vias-multicam-black": placeholderImage("camo", "bondcambrushcam550x50swatch.jpg"),
  "alpine-ghost": placeholderImage(
    "camo",
    "bondcambrushcam5monochromecontrasty50x50swatch.jpg.webp",
  ),
  "ridgeline-bronze": placeholderImage(
    "camo",
    "Camouflage-Seamless-Pattern-Background-Graphics-41997134-2-580x386.jpg",
  ),
  "midnight-operator": placeholderImage("camo", "camo-seamless-pattern-v0-7or2osuu8bxb1.jpg"),
  "tungsten-mountain": placeholderImage(
    "camo",
    "seamless-camo-patterns-v0-hvfuqglgfxac1.jpg.webp",
  ),
  "od-backcountry": placeholderImage(
    "camo",
    "seamless-camo-patterns-v0-hvfuqglgfxac1.jpg.webp",
  ),
  custom: placeholderImage("camo", "bondcambrushcam550x50swatch.jpg"),
};

const scopeImages = {
  lp: placeholderImage(
    "scopes",
    "ATACR_1-8x24_F1_C672_1_Edited__56363.1730990457.1280.1280__93511.png.webp",
  ),
  precision: placeholderImage(
    "scopes",
    "ATACR_7-35x56_F1_C613_1__92890.1730990339.1280.1280__96549.png.webp",
  ),
  precisionAlt: placeholderImage(
    "scopes",
    "ATACR_7-35x56_F1_C689_1__59276.1730990338.1280.1280__81359.png.webp",
  ),
} as const;

const merchBase = "/images/merch";

/** Merch product photos from `_assets/merch/{folder}/` */
export function merchImage(folder: string, filename: string): string {
  return `${merchBase}/${folder}/${encodeURIComponent(filename)}`;
}

/** Nightforce product photos in `_assets/configurator/scopes/` */
export function scopeImageForMagnification(
  magnification: string,
  opticId?: string,
): string {
  if (magnification.startsWith("1-") || magnification.startsWith("2-12")) {
    return scopeImages.lp;
  }
  if (opticId?.includes("dark-earth")) {
    return scopeImages.precisionAlt;
  }
  if (magnification.startsWith("6-") || magnification.startsWith("5-")) {
    return scopeImages.precisionAlt;
  }
  return scopeImages.precision;
}
