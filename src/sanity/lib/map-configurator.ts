import { buildBasecampItemOptions } from "@/lib/configurator/basecamp-items";
import {
  basecampPackageImage,
  configuratorPlaceholder,
  platformImages,
  ringsImage,
  scopeImageForMagnification,
  stockPaintImages,
} from "@/lib/images";
import type { ConfigOption, ConfigStep } from "@/lib/types";
import type { ConfiguratorData } from "@/lib/configurator/types";
import { buildConfiguratorDataFromSource } from "@/lib/configurator/build-from-source";
import { imageUrl, type ImageWidthPreset } from "./image";
import { sanityPriceToCents } from "./price";

interface SanityImageField {
  asset?: { url?: string };
  alt?: string;
}

interface SanityRifleForConfigurator {
  slug: string;
  title: string;
  tagline: string;
  showInConfigurator?: boolean;
  primaryUse?: string;
  chassis?: string;
  actionName?: string;
  barrelSummary?: string;
  configuratorPrice?: number;
  configuratorPriceCents?: number;
  specs?: {
    action?: string;
    barrel?: string;
    stock?: string;
    trigger?: string;
    muzzleBrake?: string;
  };
  heroImage?: SanityImageField;
  configuratorImage?: SanityImageField;
}

interface SanityConfiguratorSettings {
  baseBuildPrice?: number;
  baseBuildCents?: number;
  platformDefaults?: {
    platformSlug: string;
    trigger: string;
    muzzleBrake?: string;
  }[];
  stepCopy?: {
    platform?: string;
    caliber?: string;
    stockPaint?: string;
    scope?: string;
    rings?: string;
    basecampPackage?: string;
    ballisticPackage?: string;
  };
  calibers?: {
    optionId?: { current?: string };
    label: string;
    notes?: string;
    price?: number;
    priceCents?: number;
    platformSlugs?: string[];
  }[];
  finishes?: {
    optionId?: { current?: string };
    label: string;
    code?: string;
    description?: string;
    bestFor?: string;
    price?: number;
    priceCents?: number;
    image?: SanityImageField;
  }[];
  optics?: {
    optionId?: { current?: string };
    brand?: string;
    model: string;
    magnification?: string;
    focalPlane?: string;
    reticle?: string;
    tube?: string;
    msrp?: string;
    notes?: string;
    price?: number;
    priceCents?: number;
    image?: SanityImageField;
  }[];
  opticsConsult?: { label?: string; description?: string };
  opticsNone?: { label?: string; description?: string };
  rings?: {
    optionId?: string;
    label?: string;
    description?: string;
    price?: number;
    priceCents?: number;
    image?: SanityImageField;
  };
  basecamp?: {
    optionId?: string;
    label?: string;
    headline?: string;
    description?: string;
    items?: string[];
    price?: number;
    priceCents?: number;
    image?: SanityImageField;
    noneLabel?: string;
    noneDescription?: string;
  };
  ballistic?: {
    optionId?: string;
    label?: string;
    headline?: string;
    description?: string;
    howItWorks?: string;
    deliverables?: string[];
    price?: number;
    priceCents?: number;
    noneLabel?: string;
    noneDescription?: string;
  };
}

function slugValue(value?: { current?: string } | string): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.current ?? "";
}

function mapImageOption(
  image: SanityImageField | undefined,
  fallbackUrl: string,
  alt: string,
  width: ImageWidthPreset = "configuratorOption",
): { url: string; alt: string } {
  const url = imageUrl(image, width) ?? image?.asset?.url ?? fallbackUrl;
  return { url, alt: image?.alt ?? alt };
}

function opticLabel(optic: NonNullable<SanityConfiguratorSettings["optics"]>[0]) {
  return `Nightforce ${optic.model} ${optic.magnification ?? ""} ${optic.reticle ?? ""}`.trim();
}

export function mapConfiguratorData(
  settings: SanityConfiguratorSettings | null,
  rifles: SanityRifleForConfigurator[],
): ConfiguratorData {
  const fallback = buildConfiguratorDataFromSource();
  if (
    !settings?.calibers?.length &&
    !settings?.finishes?.length &&
    !settings?.optics?.length
  ) {
    return fallback;
  }

  const optionPriceCents: Record<string, number> = {
    "scope-none": 0,
    "scope-consult": 0,
    "rings-none": 0,
    "case-none": 0,
    "ballistic-none": 0,
  };

  const platformDefaults: ConfiguratorData["platformDefaults"] = {};
  for (const entry of settings.platformDefaults ?? []) {
    platformDefaults[entry.platformSlug] = {
      trigger: entry.trigger,
      ...(entry.muzzleBrake ? { muzzleBrake: entry.muzzleBrake } : {}),
    };
  }

  const platformOptions: ConfigOption[] = rifles
    .filter((rifle) => rifle.showInConfigurator !== false)
    .map((rifle) => {
      const defaults = platformDefaults[rifle.slug];
      const priceCents = sanityPriceToCents(
        rifle.configuratorPrice,
        rifle.configuratorPriceCents,
      );
      optionPriceCents[rifle.slug] = priceCents;

      const action = rifle.actionName ?? rifle.specs?.action ?? "";
      const barrel = rifle.barrelSummary ?? rifle.specs?.barrel ?? "";
      const chassis = rifle.chassis ?? rifle.specs?.stock ?? "";
      const primaryUse = rifle.primaryUse ?? "";

      return {
        id: rifle.slug,
        label: rifle.title,
        description: `${rifle.tagline} ${primaryUse}.`.trim(),
        specs: {
          action,
          barrel,
          platform: chassis,
          use: primaryUse,
          ...(defaults?.muzzleBrake ? { muzzleBrake: defaults.muzzleBrake } : {}),
          trigger: defaults?.trigger ?? rifle.specs?.trigger ?? "",
        },
        image: mapImageOption(
          rifle.configuratorImage ?? rifle.heroImage,
          platformImages[rifle.slug] ?? configuratorPlaceholder,
          `${rifle.title} platform`,
          "configurator",
        ),
      };
    });

  const caliberOptions: ConfigOption[] = (settings.calibers ?? []).map((caliber) => {
    const id = slugValue(caliber.optionId);
    optionPriceCents[id] = sanityPriceToCents(caliber.price, caliber.priceCents);
    return {
      id,
      label: caliber.label,
      description:
        caliber.notes ||
        "Available on select platforms — contact us for custom chamberings.",
      specs: { caliber: caliber.label },
    };
  });

  const finishOptions: ConfigOption[] = (settings.finishes ?? []).map((finish) => {
    const id = slugValue(finish.optionId);
    optionPriceCents[id] = sanityPriceToCents(finish.price, finish.priceCents);
    return {
      id,
      label: finish.label,
      description: `${finish.description ?? ""}. Best for ${finish.bestFor ?? "any build"}.`.trim(),
      specs: { stockPaint: finish.label },
      image: mapImageOption(
        finish.image,
        stockPaintImages[id] ?? configuratorPlaceholder,
        `${finish.label} finish`,
        "swatch",
      ),
    };
  });

  const scopeOptions: ConfigOption[] = [
    ...(settings.optics ?? []).map((optic) => {
      const id = slugValue(optic.optionId);
      const label = opticLabel(optic);
      optionPriceCents[id] = sanityPriceToCents(optic.price, optic.priceCents);
      return {
        id,
        label,
        description: `${optic.focalPlane ?? ""} · ${optic.tube ?? ""} tube · ${optic.msrp ?? ""} MSRP${optic.notes ? ` · ${optic.notes}` : ""}`.trim(),
        specs: {
          scope: label,
          magnification: optic.magnification ?? "",
          reticle: optic.reticle ?? "",
        },
        image: mapImageOption(
          optic.image,
          scopeImageForMagnification(optic.magnification ?? "", id),
          label,
          "configurator",
        ),
      };
    }),
    {
      id: "scope-consult",
      label:
        settings.opticsConsult?.label ??
        "Discuss optics with the BADWRX team",
      description:
        settings.opticsConsult?.description ??
        "Contact us to discuss your specific optic configuration.",
      specs: { scope: "BADWRX optics consult" },
    },
    {
      id: "scope-none",
      label: settings.opticsNone?.label ?? "No optics package",
      description:
        settings.opticsNone?.description ??
        "Picatinny prepared; customer-supplied optic.",
      specs: { scope: "None (optics ready)" },
    },
  ];

  const rings = settings.rings ?? {};
  const ringsId = rings.optionId ?? fallback.rings.id;
  optionPriceCents[ringsId] = sanityPriceToCents(rings.price, rings.priceCents);
  const ringsOptions: ConfigOption[] = [
    {
      id: ringsId,
      label: rings.label ?? fallback.rings.label,
      description: rings.description ?? fallback.rings.description,
      specs: { rings: rings.label ?? fallback.rings.label, tube: "30mm" },
      image: mapImageOption(
        rings.image,
        ringsImage,
        "Hawkins precision rings",
        "configuratorFeature",
      ),
    },
    {
      id: "rings-none",
      label: "No rings — mount supplied separately",
      specs: { rings: "None" },
    },
  ];

  const basecamp = settings.basecamp ?? {};
  const basecampId = basecamp.optionId ?? fallback.basecampDetails.optionId;
  optionPriceCents[basecampId] = sanityPriceToCents(
    basecamp.price,
    basecamp.priceCents,
  );
  for (const [itemId, cents] of Object.entries(
    fallback.pricing.optionPriceCents,
  )) {
    if (itemId.startsWith("basecamp-") && itemId !== "basecamp-package") {
      optionPriceCents[itemId] = cents;
    }
  }
  const basecampOptions: ConfigOption[] = [
    {
      id: basecampId,
      label: basecamp.label ?? fallback.basecampDetails.label,
      description: [
        basecamp.headline ?? fallback.basecampDetails.headline,
        ...(basecamp.items ?? fallback.basecampDetails.items).map((item) => `• ${item}`),
      ].join("\n"),
      specs: { basecampPackage: basecamp.label ?? fallback.basecampDetails.label },
      image: mapImageOption(
        basecamp.image,
        basecampPackageImage,
        basecamp.label ?? fallback.basecampDetails.label,
        "configuratorFeature",
      ),
    },
    {
      id: "case-none",
      label: basecamp.noneLabel ?? "No Basecamp Package",
      description: basecamp.noneDescription ?? "Rifle ships in protective wrap only.",
      specs: { basecampPackage: "None" },
    },
  ];

  const ballistic = settings.ballistic ?? {};
  const ballisticId = ballistic.optionId ?? fallback.ballisticDetails.optionId;
  optionPriceCents[ballisticId] = sanityPriceToCents(
    ballistic.price,
    ballistic.priceCents,
  );
  const ballisticOptions: ConfigOption[] = [
    {
      id: ballisticId,
      label: ballistic.label ?? fallback.ballisticDetails.label,
      description: [
        ballistic.headline ?? fallback.ballisticDetails.headline,
        ballistic.howItWorks ?? fallback.ballisticDetails.howItWorks,
        ...(ballistic.deliverables ?? fallback.ballisticDetails.items).map(
          (item) => `• ${item}`,
        ),
      ]
        .filter(Boolean)
        .join("\n"),
      specs: { ballisticPackage: ballistic.label ?? fallback.ballisticDetails.label },
    },
    {
      id: "ballistic-none",
      label: ballistic.noneLabel ?? "No Ballistic Package",
      description:
        ballistic.noneDescription ??
        "Standard zero and function verification only.",
      specs: { ballisticPackage: "None" },
    },
  ];

  const copy = settings.stepCopy ?? {};
  const platformCount = platformOptions.length;
  const steps: ConfigStep[] = [
    {
      id: "platform",
      title: "Platform",
      subtitle:
        copy.platform ??
        (platformCount
          ? `${platformCount} purpose-built BADWRX platforms — all built to order`
          : "Select your BADWRX platform"),
      options: platformOptions,
    },
    {
      id: "caliber",
      title: "Caliber",
      subtitle:
        copy.caliber ??
        "Chambered and proofed for your platform — see caliber matrix in source data",
      options: caliberOptions,
    },
    {
      id: "stockPaint",
      title: "Finish / Color",
      subtitle:
        copy.stockPaint ??
        "Available on all platforms · Custom Cerakote and paint · stock, action, and barrel as a complete system",
      options: finishOptions,
    },
    {
      id: "scope",
      title: "Optics Package",
      subtitle:
        copy.scope ??
        "NightForce optics — mounted, leveled, and bore-sighted in-house",
      options: scopeOptions,
    },
    {
      id: "rings",
      title: "Rings",
      subtitle: copy.rings ?? "Included with all Optics Package configurations",
      options: ringsOptions,
    },
    {
      id: "basecampPackage",
      title: "Basecamp Package",
      subtitle: copy.basecampPackage ?? fallback.basecampDetails.description,
      options: basecampOptions,
    },
    {
      id: "ballisticPackage",
      title: "Ballistic Package",
      subtitle: copy.ballisticPackage ?? fallback.ballisticDetails.description,
      options: ballisticOptions,
    },
  ];

  return {
    steps,
    pricing: {
      baseBuildCents:
        settings.baseBuildPrice != null || settings.baseBuildCents != null
          ? sanityPriceToCents(settings.baseBuildPrice, settings.baseBuildCents)
          : fallback.pricing.baseBuildCents,
      optionPriceCents,
    },
    platformDefaults:
      Object.keys(platformDefaults).length > 0
        ? platformDefaults
        : fallback.platformDefaults,
    caliberAvailability: Object.fromEntries(
      (settings.calibers ?? []).map((caliber) => [
        slugValue(caliber.optionId),
        caliber.platformSlugs ?? [],
      ]),
    ),
    rings: {
      id: ringsId,
      label: rings.label ?? fallback.rings.label,
      description: rings.description ?? fallback.rings.description,
    },
    basecampDetails: {
      optionId: basecampId,
      label: basecamp.label ?? fallback.basecampDetails.label,
      headline: basecamp.headline ?? fallback.basecampDetails.headline,
      description: basecamp.description ?? fallback.basecampDetails.description,
      items: basecamp.items ?? fallback.basecampDetails.items,
      itemOptions: buildBasecampItemOptions(
        basecamp.items ?? fallback.basecampDetails.items,
      ),
    },
    ballisticDetails: {
      optionId: ballisticId,
      label: ballistic.label ?? fallback.ballisticDetails.label,
      headline: ballistic.headline ?? fallback.ballisticDetails.headline,
      description: ballistic.description ?? fallback.ballisticDetails.description,
      howItWorks: ballistic.howItWorks ?? fallback.ballisticDetails.howItWorks,
      items: ballistic.deliverables ?? fallback.ballisticDetails.items,
    },
  };
}

export function getPlatformOptionFromSteps(
  steps: ConfigStep[],
  slug: string,
) {
  return steps[0]?.options.find((option) => option.id === slug);
}
