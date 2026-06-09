import { BASECAMP_NONE_OPTION } from "@/lib/configurator/basecamp-items";
import { sourceData } from "@/lib/source-data";
import type { ConfigOption, ConfigStep } from "@/lib/types";
import {
  basecampPackageImage,
  configuratorPlaceholder,
  platformImages,
  ringsImage,
  scopeImageForMagnification,
  stockPaintImages,
} from "@/lib/images";

const { configurator: cfg, website } = sourceData;

function opticLabel(o: (typeof website.optics)[0]) {
  return `Nightforce ${o.model} ${o.magnification} ${o.reticle}`;
}

export const configuratorSteps: ConfigStep[] = [
  {
    id: "platform",
    title: "Platform",
    subtitle: website.rifles.length
      ? `${website.rifles.length} purpose-built BADWRX platforms — all built to order`
      : "Select your BADWRX platform",
    options: website.rifles.map((r) => {
      const defaults = cfg.platformDefaults[r.slug];
      return {
        id: r.slug,
        label: r.shortName,
        description: `${r.tagline} ${r.primaryUse}.`,
        specs: {
          action: r.action,
          barrel: r.barrel,
          platform: r.platform,
          use: r.primaryUse,
          ...(defaults?.muzzleBrake ? { muzzleBrake: defaults.muzzleBrake } : {}),
          trigger: defaults?.trigger,
        },
        image: {
          url: platformImages[r.slug] ?? configuratorPlaceholder,
          alt: `${r.title} platform`,
        },
      };
    }),
  },
  {
    id: "caliber",
    title: "Caliber",
    subtitle: "Chambered and proofed for your platform — see caliber matrix in source data",
    options: website.caliberMatrix.map((c) => ({
        id: c.id,
        label: c.caliber,
        description:
          c.notes ||
          "Available on select platforms — contact us for custom chamberings.",
        specs: { caliber: c.caliber },
      })),
  },
  {
    id: "stockPaint",
    title: "Finish / Color",
    subtitle:
      "Available on all platforms · Custom Cerakote and paint · stock, action, and barrel as a complete system",
    options: website.stockColors.map((c) => ({
      id: c.id,
      label: c.label,
      description: `${c.description}. Best for ${c.bestFor}.`,
      specs: { stockPaint: c.label },
      image: {
        url: stockPaintImages[c.id] ?? configuratorPlaceholder,
        alt: `${c.label} finish`,
      },
    })),
  },
  {
    id: "scope",
    title: "Optics Package",
    subtitle: [
      website.copyBlocks["OPTICS PACKAGE — Headline"],
      website.copyBlocks["OPTICS PACKAGE — Body"],
    ]
      .filter(Boolean)
      .join(" — ") ||
      "NightForce optics — mounted, leveled, and bore-sighted in-house",
    options: [
      ...website.optics.map((o) => ({
        id: o.id,
        label: opticLabel(o),
        description: `${o.focalPlane} · ${o.tube} tube · ${o.msrp} MSRP${o.notes ? ` · ${o.notes}` : ""}`,
        specs: {
          scope: opticLabel(o),
          magnification: o.magnification,
          reticle: o.reticle,
        },
        image: {
          url: scopeImageForMagnification(o.magnification, o.id),
          alt: opticLabel(o),
        },
      })),
      {
        id: "scope-consult",
        label: "Discuss optics with the BADWRX team",
        description:
          "Contact us to discuss your specific optic configuration. We will match the right glass to your platform, your caliber, and your intended use.",
        specs: { scope: "BADWRX optics consult" },
      },
      {
        id: "scope-none",
        label: "No optics package",
        description: "Picatinny prepared; customer-supplied optic.",
        specs: { scope: "None (optics ready)" },
      },
    ],
  },
  {
    id: "rings",
    title: "Rings",
    subtitle: "Included with all Optics Package configurations",
    options: [
      {
        id: cfg.rings.id,
        label: cfg.rings.label,
        description: cfg.rings.description,
        specs: { rings: cfg.rings.label, tube: "30mm" },
        image: {
          url: ringsImage,
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
    id: "basecampPackage",
    title: "Basecamp Package",
    subtitle: cfg.basecamp.description,
    options: [
      {
        id: cfg.basecamp.id,
        label: cfg.basecamp.label,
        description: cfg.basecamp.description,
        specs: { basecampPackage: cfg.basecamp.label },
        image: {
          url: basecampPackageImage,
          alt: cfg.basecamp.label,
        },
      },
      BASECAMP_NONE_OPTION,
    ],
  },
  {
    id: "ballisticPackage",
    title: "Ballistic Package",
    subtitle: cfg.ballistic.description,
    options: [
      {
        id: cfg.ballistic.id,
        label: cfg.ballistic.label,
        description: [
          cfg.ballistic.headline,
          cfg.ballistic.howItWorks,
          ...cfg.ballistic.deliverables.map((item) => `• ${item}`),
        ]
          .filter(Boolean)
          .join("\n"),
        specs: { ballisticPackage: cfg.ballistic.label },
      },
      {
        id: "ballistic-none",
        label: "No Ballistic Package",
        description: "Standard zero and function verification only.",
        specs: { ballisticPackage: "None" },
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
  "basecampPackage",
  "ballisticPackage",
] as const;

export type StepKey = (typeof stepKeys)[number];

export function getPlatformOption(slug: string): ConfigOption | undefined {
  return configuratorSteps[0].options.find((option) => option.id === slug);
}

export function configureHref(platformSlug?: string): string {
  return platformSlug
    ? `/configure?platform=${encodeURIComponent(platformSlug)}`
    : "/configure";
}
