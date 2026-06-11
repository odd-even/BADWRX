export interface RifleImage {
  url: string;
  alt: string;
  caption?: string;
  /** Sanity CDN srcSet — used for full-bleed heroes and section backgrounds */
  srcSet?: string;
}

export interface RifleSpecs {
  action?: string;
  caliber?: string;
  barrel?: string;
  barrelLength?: string;
  twistRate?: string;
  stock?: string;
  stockPaint?: string;
  trigger?: string;
  finish?: string;
  scope?: string;
  rings?: string;
  muzzleBrake?: string;
  bottomMetal?: string;
  suppressor?: string;
  rifleCase?: string;
  weight?: string;
  overallLength?: string;
  accuracy?: string;
  magazine?: string;
}

export type RifleCategory = "hunting" | "long-range" | "safari" | "precision";

export type PageKey =
  | "builds"
  | "configure"
  | "merch"
  | "university"
  | "about"
  | "contact";

export interface PageVisibilitySetting {
  enabled: boolean;
  redirectTo?: string;
}

export interface PageVisibility {
  builds: PageVisibilitySetting;
  configure: PageVisibilitySetting;
  merch: PageVisibilitySetting;
  university: PageVisibilitySetting;
  about: PageVisibilitySetting;
  contact: PageVisibilitySetting;
}

export interface Rifle {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: RifleCategory;
  featured: boolean;
  startingAt?: string;
  description: string;
  heroImage: RifleImage;
  gallery: RifleImage[];
  specs: RifleSpecs;
  highlights: string[];
}

export interface CourseCurriculumItem {
  title: string;
  detail: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  level: string;
  price: string;
  description: string;
  topics: string[];
  featured?: boolean;
  tagline?: string;
  duration?: string;
  format?: string;
  outcomes?: string[];
  curriculum?: CourseCurriculumItem[];
  audience?: string[];
  includes?: string[];
  heroImage?: RifleImage;
}

export type MerchCategory = "caps" | "t-shirts" | "sweaters";

export interface MerchItem {
  id: string;
  slug: string;
  title: string;
  category: MerchCategory;
  price: string;
  priceCents: number;
  description: string;
  longDescription: string;
  image: RifleImage;
  images: RifleImage[];
  sizes: string[];
  colors?: string[];
}

export type MerchShippingMethod = "standard" | "express";

export interface MerchCartLine {
  lineId: string;
  slug: string;
  title: string;
  size: string;
  color?: string;
  quantity: number;
  priceCents: number;
  imageUrl: string;
}

export interface MerchShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface MerchOrderPayload {
  orderId: string;
  submittedAt: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  shipping: MerchShippingAddress;
  shippingMethod: MerchShippingMethod;
  items: MerchCartLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface SiteImages {
  reticleOverlay: RifleImage;
  homeHeroBanner: RifleImage;
  homeFieldTested: RifleImage;
  homeBallisticSection: RifleImage;
  aboutHeroBanner: RifleImage;
  aboutStory: RifleImage;
}

/** Social / browser branding assets (OG cover, favicon). */
export interface BrandAssets {
  shareImage: RifleImage;
  favicon: RifleImage;
}

import type { NavImageFadeSettings } from "./nav-image-fade";

export type { NavImageFadeOpacity, NavImageFadeSettings } from "./nav-image-fade";

export interface SiteSettings {
  name: string;
  short: string;
  tagline: string;
  email: string;
  partnerBarrels: string;
  partnerOptics: string;
  buildPromise: string;
  deliveryPackage: string;
  trustMarqueeItems: string[];
  siteImages: SiteImages;
  brandAssets: BrandAssets;
  navImageFade: NavImageFadeSettings;
  homeHero: {
    eyebrow: string;
    headlinePrefix: string;
    headlines: (string | string[])[];
    subheadline: string;
  };
  homePlatforms: {
    eyebrow: string;
    title: string;
    body: string;
  };
  packageCta?: string;
  homeIntro: {
    eyebrow: string;
    body: string;
  };
  homePillars: {
    title: string;
    body: string;
  }[];
  fieldTested: {
    eyebrow: string;
    title: string;
    body: string;
  };
  unrelenting: {
    eyebrow: string;
    title: string;
    body: string;
  };
  testimonial: {
    quote: string;
    author: string;
  };
  testimonials?: {
    quote: string;
    author: string;
  }[];
  contactSection: {
    title: string;
    body: string;
  };
  pageVisibility?: PageVisibility;
  aboutPage: {
    title: string;
    body: string;
    signature?: {
      name: string;
      location: string;
    };
    pillars: {
      title: string;
      body: string;
    }[];
    philosophyQuote: string;
  };
}

export interface ConfigOption {
  id: string;
  label: string;
  description?: string;
  specs?: Record<string, string>;
  image?: {
    url: string;
    alt: string;
  };
}

export interface ConfigStep {
  id: string;
  title: string;
  subtitle: string;
  options: ConfigOption[];
}

export type ActionEject = "right" | "left";

export interface BuildConfiguration {
  platform: ConfigOption | null;
  actionEject: ActionEject | null;
  caliber: ConfigOption | null;
  stockPaint: ConfigOption | null;
  scope: ConfigOption | null;
  rings: ConfigOption | null;
  basecampPackage: ConfigOption | null;
  basecampItems: ConfigOption[];
  ballisticPackage: ConfigOption | null;
}
