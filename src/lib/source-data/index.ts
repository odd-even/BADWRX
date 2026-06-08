import raw from "@/data/generated/source-data.json";

export interface SourceRifle {
  id: string;
  slug: string;
  title: string;
  shortName: string;
  tagline: string;
  action: string;
  barrel: string;
  platform: string;
  caliberFamily: string;
  primaryUse: string;
  pageSlug: string;
  notes: string;
}

export interface SourceData {
  meta: { syncedAt: string; sources: string[]; checksum: string };
  docxCopy: {
    homeHero: { headline: string; subheadline: string; cta: string };
    brandStatement: string;
    pillars: { weight: string; accuracy: string; durability: string };
    buildsPage: { headline: string; subcopy: string };
    customQuoteCta: string;
    packageCta: string;
    rifleLineupPreview: string;
    contactPage: {
      headline: string;
      intro: string;
      expectations: string;
    };
  };
  contactFormFields: {
    id: string;
    label: string;
    type: string;
    required: boolean;
    options: string[];
  }[];
  website: {
    rifles: SourceRifle[];
    rifleSpecs: Record<
      string,
      {
        tagline?: string;
        description?: string;
        calibers?: string;
        specs: Record<string, string>;
      }
    >;
    stockColors: {
      id: string;
      code: string;
      label: string;
      description: string;
      bestFor: string;
    }[];
    optics: {
      id: string;
      brand: string;
      model: string;
      magnification: string;
      focalPlane: string;
      reticle: string;
      tube: string;
      msrp: string;
      msrpCents: number | null;
      notes: string;
    }[];
    caliberMatrix: {
      caliber: string;
      id: string;
      platforms: Record<string, boolean>;
      notes: string;
    }[];
    copyBlocks: Record<string, string>;
  };
  configurator: {
    platformDefaults: Record<
      string,
      { muzzleBrake?: string; trigger: string }
    >;
    rings: { id: string; label: string; description: string };
    basecamp: {
      id: string;
      label: string;
      headline: string;
      description: string;
      items: string[];
    };
    ballistic: {
      id: string;
      label: string;
      headline: string;
      description: string;
      howItWorks: string;
      deliverables: string[];
    };
  };
  retailPrices: Record<string, number>;
  pricing: {
    baseBuildCents: number;
    optionPriceCents: Record<string, number>;
  };
}

export const sourceData = raw as unknown as SourceData;

export function getCopy(key: string, fallback = ""): string {
  return sourceData.website.copyBlocks[key] ?? fallback;
}
