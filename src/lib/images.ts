/** Local images from `_assets/photos` (served via public/images/assets symlink) */

const assetBase = "/images/assets";
const logoBase = "/images/logos";

export const images = {
  rifle: {
    studio: `${assetBase}/IMG_0058.jpg`,
    studioCropped: `${assetBase}/IMG_0058-cropped.jpg`,
    field: `${assetBase}/IMG_5613.jpeg`,
    hunt: `${assetBase}/IMG_1125bighorn.jpg`,
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
} as const;

/** Default rifle image for build cards, heroes, and galleries */
export const riflePlaceholder = images.rifle.studio;

export const riflePlaceholderAlt =
  "Custom precision bolt-action rifle with NightForce scope on black background";

const configuratorBase = "/images/placeholders";

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

/** Configurator option photos from `_assets/placeholder images/{category}/` */
export function placeholderImage(
  category: PlaceholderCategory,
  filename: string,
): string {
  return `${configuratorBase}/${category}/${filename}`;
}
