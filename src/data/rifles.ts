import type { Rifle } from "@/lib/types";
import { images, riflePlaceholder, riflePlaceholderAlt } from "@/lib/images";

const deliveryHighlights = [
  "Hand test-fired before delivery",
  "Ballistics table included",
  "Rifle-specific ammo brand & grain",
] as const;

function rifleImage(caption?: string) {
  return {
    url: riflePlaceholder,
    alt: riflePlaceholderAlt,
    ...(caption ? { caption } : {}),
  };
}

const featuredHeroImage = {
  url: images.rifle.studioCropped,
  alt: riflePlaceholderAlt,
};

export const rifles: Rifle[] = [
  {
    id: "1",
    slug: "dominus-mk1",
    title: "Dominus MK1",
    tagline: "Proof Research steel barrel, NightForce glass",
    category: "long-range",
    featured: true,
    startingAt: "$6,399",
    description:
      "The Dominus MK1 is built to precision standards with components chosen by the builder for long-range hunting. Hand test-fired before it leaves the shop, with a ballistics table and rifle-specific ammunition data included at delivery.",
    heroImage: featuredHeroImage,
    gallery: [
      rifleImage("Built for western ridge lines and open-country elk"),
      rifleImage("7mm PRC chambering — flat trajectory to 700+ yards"),
      rifleImage("Proof Research barrel, recessed target crown"),
    ],
    specs: {
      action: "Dominus MK1",
      caliber: "7mm PRC",
      barrel: "Proof Research Steel (#4 Sporter)",
      barrelLength: '26"',
      twistRate: '1:8" RH',
      stock: "BADWRX Rifleman (Carbon)",
      trigger: "TriggerTech Special (1.2 lbs)",
      finish: "Cerakote Graphite Black",
      weight: "7.4 lbs (bare rifle)",
      overallLength: '46.5"',
      accuracy: '½" 3-shot @ 100 yds (factory ammo, guaranteed)',
      magazine: "Hinged floorplate",
    },
    highlights: [
      "Proof Research match-grade barrel",
      "NightForce precision optic",
      "Aluminum pillar & glass bedding",
      deliveryHighlights[1],
      deliveryHighlights[2],
    ],
  },
  {
    id: "2",
    slug: "invictus-x",
    title: "Invictus X",
    tagline: "Proof Research carbon — under 6.5 lbs ready to hunt",
    category: "hunting",
    featured: true,
    startingAt: "$7,850",
    description:
      "When ounces matter on a steep ridge, the Invictus X pairs a lightweight action with a Proof Research carbon-wrapped barrel and NightForce optic. Hand test-fired before delivery — you receive a ballistics table and the specific ammunition brand and grain weight tuned to your rifle.",
    heroImage: featuredHeroImage,
    gallery: [
      rifleImage("Designed for high-country sheep and goat hunts"),
      rifleImage("6.3 lbs finished — Proof carbon saves nearly a pound"),
      rifleImage("NightForce glass, fluted bolt"),
    ],
    specs: {
      action: "Invictus X",
      caliber: "6.5 PRC",
      barrel: "Proof Research Carbon (#3 contour)",
      barrelLength: '22"',
      twistRate: '1:7.5" RH',
      stock: "BADWRX Rifleman (Carbon)",
      trigger: "TriggerTech Special (1.0 lbs)",
      finish: "Cerakote Tungsten Gray",
      weight: "6.3 lbs (bare rifle)",
      overallLength: '42.25"',
      accuracy: '½" 3-shot @ 100 yds (factory ammo, guaranteed)',
      magazine: "3-round internal + hinged floorplate",
    },
    highlights: [
      "Proof Research carbon fiber barrel",
      "NightForce precision optic",
      "Builder-selected Invictus X action",
      deliveryHighlights[1],
      deliveryHighlights[2],
    ],
  },
  {
    id: "3",
    slug: "safari-dangerous-game",
    title: "Safari — Dangerous Game",
    tagline: "Controlled-round feed for the biggest game on earth",
    category: "safari",
    featured: false,
    startingAt: "$8,200",
    description:
      "A true dangerous-game rifle built on the Defiance Anti-X controlled-round feed action, chambered in .375 H&H Magnum. Glass bedded into a McMillan Supergrade stock with a reinforced recoil lug and 1\" Pachmayr Decelerator pad. Every safari build is function-tested for flawless feeding under stress.",
    heroImage: rifleImage(),
    gallery: [
      rifleImage(".375 H&H — the classic African chambering"),
      rifleImage("Controlled-round feed for reliable extraction"),
      rifleImage("Express iron sights + scope mount ready"),
    ],
    specs: {
      action: "Defiance Anti-X (CRF)",
      caliber: ".375 H&H Magnum",
      barrel: "Proof Research Steel (Safari contour)",
      barrelLength: '24"',
      twistRate: '1:12" RH',
      stock: "McMillan Supergrade (Classic)",
      trigger: "Timney Calvin Elite (2-stage)",
      finish: "Stainless bead blast (uncoated)",
      weight: "9.1 lbs (bare rifle)",
      overallLength: '44.5"',
      accuracy: '1" 3-shot @ 100 yds (guaranteed)',
      magazine: "3+1 hinged floorplate",
    },
    highlights: [
      "Controlled-round feed action",
      "Reinforced recoil lug",
      "Express iron sight dovetails",
      "Cites-compliant wood stock options",
    ],
  },
  {
    id: "4",
    slug: "primus-ul",
    title: "Primus UL",
    tagline: "Proof Research steel, NightForce glass — built for distance",
    category: "precision",
    featured: true,
    startingAt: "$5,950",
    description:
      "The Primus UL combines a Proof Research steel barrel with a Manners stock, NightForce optic, and AICS magazine compatibility. Hand test-fired before it leaves the shop — delivered with a ballistics table and rifle-specific ammunition recommendation.",
    heroImage: featuredHeroImage,
    gallery: [
      rifleImage("Built for timberline elk and mule deer"),
      rifleImage(".300 PRC — 230gr bullets at 2,800+ fps"),
      rifleImage("Proof Research barrel, hand-fitted action"),
    ],
    specs: {
      action: "Primus UL",
      caliber: ".300 PRC",
      barrel: "Proof Research Steel (#6 Heavy Varmint)",
      barrelLength: '26"',
      twistRate: '1:9" RH',
      stock: "Manners PRS-1 Hunter",
      trigger: "TriggerTech Diamond",
      finish: "Cerakote Graphite Black",
      weight: "10.2 lbs (bare rifle)",
      overallLength: '48"',
      accuracy: '½" 3-shot @ 100 yds (factory ammo, guaranteed)',
      magazine: "AICS 5-round detachable",
    },
    highlights: [
      "Proof Research match-grade barrel",
      "NightForce precision optic",
      "AICS magazine compatible",
      deliveryHighlights[1],
      deliveryHighlights[2],
    ],
  },
  {
    id: "5",
    slug: "whitetail-classic",
    title: "Whitetail Classic",
    tagline: "Traditional lines, modern accuracy",
    category: "hunting",
    featured: false,
    startingAt: "$4,850",
    description:
      "Not every hunt demands a carbon barrel or chassis stock. The Whitetail Classic is a refined sporting rifle — Proof Research steel barrel, classic composite stock, and the same pillar bedding and accuracy verification that defines every Badger Rifleworks build.",
    heroImage: rifleImage(),
    gallery: [
      rifleImage("Classic profile for tree-stand and still-hunting"),
      rifleImage(".308 Win — abundant factory ammunition"),
    ],
    specs: {
      action: "Defiance Renegade",
      caliber: ".308 Winchester",
      barrel: "Proof Research Steel (#2 Light Sporter)",
      barrelLength: '22"',
      twistRate: '1:10" RH',
      stock: "McMillan Game Hunter",
      trigger: "TriggerTech Special (1.5 lbs)",
      finish: "Cerakote Graphite Black",
      weight: "7.8 lbs (bare rifle)",
      overallLength: '42"',
      accuracy: '½" 3-shot @ 100 yds (factory ammo, guaranteed)',
      magazine: "4-round hinged floorplate",
    },
    highlights: [
      "Classic sporting profile",
      "Lightweight carry configuration",
      "Swivel studs & sling included",
      "Perfect first custom build",
    ],
  },
  {
    id: "6",
    slug: "tactical-field-308",
    title: "Tactical Field — .308",
    tagline: "Compact field rifle — Proof barrel, NightForce glass",
    category: "precision",
    featured: false,
    startingAt: "$5,400",
    description:
      "A field-ready .308 built to precision standards with a Proof Research steel barrel, NightForce optic, and Manners MCS-T stock. Compact enough for blind hunting, verified to ½ MOA before it ships.",
    heroImage: rifleImage(),
    gallery: [
      rifleImage('22" barrel — optimal velocity and handling'),
      rifleImage("Marinetex bedding, flush QD cups"),
    ],
    specs: {
      action: "Defiance Renegade",
      caliber: ".308 Winchester",
      barrel: "Proof Research Steel (22\" field contour)",
      barrelLength: '22"',
      twistRate: '1:11.25" 5R',
      stock: "Manners MCS-T (Embedded DBM)",
      trigger: "TriggerTech Special (1.2 lbs)",
      finish: "Mil-spec OD Cerakote",
      weight: "10.0 lbs (bare rifle)",
      overallLength: '42"',
      accuracy: '½" 3-shot @ 100 yds (factory ammo, guaranteed)',
      magazine: "AICS 10-round detachable",
    },
    highlights: [
      "Proof Research match-grade barrel",
      "NightForce precision optic",
      "Mil-spec Cerakote finish",
      "Marinetex recoil lug bedding",
    ],
  },
];

export function getRifleBySlug(slug: string): Rifle | undefined {
  return rifles.find((r) => r.slug === slug);
}

export function getFeaturedRifles(): Rifle[] {
  return rifles.filter((r) => r.featured);
}

export const categoryLabels: Record<Rifle["category"], string> = {
  hunting: "Hunting",
  "long-range": "Long Range",
  safari: "Safari / Dangerous Game",
  precision: "Precision",
};
