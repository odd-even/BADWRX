import { sourceData } from "@/lib/source-data";
import type { ConfigStep } from "@/lib/types";
import { placeholderImage } from "@/lib/images";

function opticLabel(o: (typeof sourceData.website.optics)[0]) {
  return `Nightforce ${o.model} ${o.magnification} ${o.reticle}`;
}

export const configuratorSteps: ConfigStep[] = [
  {
    id: "platform",
    title: "Platform",
    subtitle: "Six purpose-built BADWRX platforms — all built to order",
    options: sourceData.website.rifles.map((r) => ({
      id: r.slug,
      label: r.shortName,
      description: `${r.tagline} ${r.primaryUse}.`,
      specs: {
        action: r.action,
        barrel: r.barrel,
        platform: r.platform,
        use: r.primaryUse,
      },
      image: {
        url: placeholderImage("actions", "shadow-action-products.webp"),
        alt: `${r.title} platform`,
      },
    })),
  },
  {
    id: "caliber",
    title: "Caliber",
    subtitle: "Chambered and proofed for your intended game and range",
    options: sourceData.website.caliberMatrix
      .filter((c) => c.caliber !== "Other / Custom")
      .map((c) => ({
        id: c.id,
        label: c.caliber,
        description: c.notes || "Available on select platforms — contact us for custom chamberings.",
        specs: { caliber: c.caliber },
      })),
  },
  {
    id: "stockPaint",
    title: "Finish / Color",
    subtitle: "Custom Cerakote and paint — stock, action, and barrel as a complete system",
    options: sourceData.website.stockColors.map((c) => ({
      id: c.id,
      label: c.label,
      description: `${c.description}. Best for ${c.bestFor}.`,
      specs: { stockPaint: c.label, code: c.code },
      image: {
        url: placeholderImage("camo", "bondcambrushcam550x50swatch.jpg"),
        alt: `${c.label} finish`,
      },
    })),
  },
  {
    id: "scope",
    title: "Scope",
    subtitle: sourceData.website.copyBlocks["OPTICS PACKAGE — Body"]?.slice(0, 120) + "…" ||
      "NightForce optics — mounted, leveled, and bore-sighted in-house",
    options: [
      ...sourceData.website.optics.map((o) => ({
        id: o.id,
        label: opticLabel(o),
        description: `${o.focalPlane} · ${o.tube} tube · ${o.msrp} MSRP${o.notes ? ` · ${o.notes}` : ""}`,
        specs: {
          scope: opticLabel(o),
          magnification: o.magnification,
          reticle: o.reticle,
        },
        image: {
          url: placeholderImage("scopes", "nightforce-scope.webp"),
          alt: opticLabel(o),
        },
      })),
      {
        id: "scope-none",
        label: "No scope — optics ready",
        description: "Picatinny prepared; customer-supplied optic.",
        specs: { scope: "None (optics ready)" },
      },
    ],
  },
  {
    id: "rings",
    title: "Rings",
    subtitle: "Hawkins Precision rings included with Optics Package builds",
    options: [
      {
        id: "hawkins-ult-rings",
        label: "Hawkins ULT Rings — 30mm",
        description:
          sourceData.website.copyBlocks["HAWKINS RINGS — Description"] ||
          "Hawkins Precision Ultra Light Tactical Rings — 30mm with offset level cap.",
        specs: { rings: "Hawkins ULT 30mm", tube: "30mm" },
        image: {
          url: placeholderImage("rings", "mount-rings.jpg"),
          alt: "Hawkins precision rings",
        },
      },
      {
        id: "rings-none",
        label: "No rings — mount supplied separately",
        specs: { rings: "None" },
      },
    ],
  },
  {
    id: "muzzleBrake",
    title: "Muzzle Brake",
    subtitle: "SRS titanium brakes — threaded and timed in-house",
    options: [
      {
        id: "srs-ti-pro-2",
        label: 'SRS "TI PRO 2" Muzzle Brake',
        description: "Titanium SRS brake — standard on most BADWRX builds.",
        specs: { muzzleBrake: 'SRS "TI PRO 2"' },
        image: {
          url: placeholderImage("muzzle-brakes", "muzzle-brake.jpg"),
          alt: "SRS TI PRO 2 muzzle brake",
        },
      },
      {
        id: "srs-the-chub",
        label: 'SRS "The Chub" Muzzle Brake',
        description: "Self-timing SRS brake for hunting calibers.",
        specs: { muzzleBrake: 'SRS "The Chub"' },
        image: {
          url: placeholderImage("muzzle-brakes", "muzzle-brake.jpg"),
          alt: "SRS The Chub muzzle brake",
        },
      },
      {
        id: "muzzle-none",
        label: "None — thread protector only",
        specs: { muzzleBrake: "Thread protector only" },
      },
    ],
  },
  {
    id: "suppressor",
    title: "Suppressor",
    subtitle: "NFA items — we coordinate transfer and pin-and-weld if required",
    options: [
      {
        id: "srs-cb-banish-brake",
        label: "SRS CB Banish Suppressor Brake",
        description: "Suppressor-ready muzzle device for CB Banish systems.",
        specs: { suppressor: "SRS CB Banish mount" },
        image: {
          url: placeholderImage("suppressors", "suppressor.jpg"),
          alt: "SRS CB Banish suppressor brake",
        },
      },
      {
        id: "suppressor-none",
        label: "None",
        description: "No suppressor. Muzzle device only.",
        specs: { suppressor: "None" },
      },
    ],
  },
  {
    id: "rifleCase",
    title: "Case / Package",
    subtitle: "Ship and travel protection — Basecamp Package available on all platforms",
    options: [
      {
        id: "basecamp-package",
        label: "BADWRX Basecamp Package",
        description:
          sourceData.website.copyBlocks["BASECAMP PACKAGE — Body"]?.slice(0, 160) + "…" ||
          "Hard case, Garmin Xero Chronograph, and Fix It Sticks field kit.",
        specs: { rifleCase: "Basecamp Package" },
        image: {
          url: placeholderImage("cases", "rifle-case.webp"),
          alt: "BADWRX Basecamp Package",
        },
      },
      {
        id: "pelican-v800",
        label: "Pelican V800 Long Case",
        description: "Full-length hard case with custom foam.",
        specs: { rifleCase: "Pelican V800" },
        image: {
          url: placeholderImage("cases", "rifle-case.webp"),
          alt: "Pelican V800 rifle case",
        },
      },
      {
        id: "case-none",
        label: "No case",
        description: "Rifle ships in protective wrap only.",
        specs: { rifleCase: "None" },
      },
    ],
  },
];

export const stepKeys = [
  "platform",
  "caliber",
  "stockPaint",
  "scope",
  "rings",
  "muzzleBrake",
  "suppressor",
  "rifleCase",
] as const;

export type StepKey = (typeof stepKeys)[number];
