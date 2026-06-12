import { brand } from "@/lib/brand";
import { cleanDocxCopy } from "@/lib/copy-utils";
import { getCopy, sourceData } from "@/lib/source-data";
import { buildFieldGalleryFileList } from "@/data/field-gallery";
import { images, riflePlaceholderAlt } from "@/lib/images";
import { defaultNavImageFade } from "@/lib/nav-image-fade";
import { defaultSiteAccess } from "@/lib/site-access";
import { defaultPageSeo } from "@/data/page-seo";
import type { BrandAssets, NavImageFadeSettings, SiteImages, SiteSettings } from "@/lib/types";

const { docxCopy } = sourceData;

function pillarParts(key: "weight" | "accuracy" | "durability") {
  const line = docxCopy.pillars[key];
  if (!line) return { title: key, body: "" };
  const dash = line.indexOf("—");
  if (dash === -1) return { title: key, body: line };
  return {
    title: line.slice(0, dash).trim(),
    body: line.slice(dash + 1).trim(),
  };
}

function parseAboutSignature(text: string) {
  const match = text.match(/^BADWRX\.?\s+(.+?)\.?$/);
  if (!match) return undefined;
  return {
    name: "BADWRX",
    location: match[1].replace(/\.$/, "").trim(),
  };
}

function aboutPageCopy() {
  const full = getCopy("ABOUT — Body", brand.buildPromise);
  const match = full.match(
    /^(.*?We build that rifle\.)\s+(BADWRX\.\s+Diamondhead,\s+Mississippi\.?)\s*$/,
  );
  if (!match) return { body: full, signature: undefined };
  return {
    body: match[1].trim(),
    signature: parseAboutSignature(match[2].trim()),
  };
}

function aboutPillarFromCopy(key: string, fallback: string) {
  const text = getCopy(key, fallback);
  const split = text.indexOf(". ");
  if (split === -1) return { title: text.replace(/\.$/, "").trim(), body: "" };
  return {
    title: text.slice(0, split).trim(),
    body: text.slice(split + 2),
  };
}

export const defaultSiteImages: SiteImages = {
  reticleOverlay: {
    url: images.rifle.reticleOverlay,
    alt: "",
  },
  homeHeroBanner: {
    url: images.rifle.homeCover,
    alt: "Custom precision rifle on a mountain ridgeline",
  },
  homeFieldTested: {
    url: images.rifle.hunt,
    alt: "Hunter in Alaska mountain country",
  },
  homeBallisticSection: {
    url: images.rifle.studioCropped,
    alt: riflePlaceholderAlt,
  },
  aboutHeroBanner: {
    url: images.rifle.field,
    alt: "Precision rifle in mountain country",
  },
  aboutStory: {
    url: images.about.story,
    alt: "BADWRX craftsmanship in the build shop",
  },
};

export const defaultBrandAssets: BrandAssets = {
  shareImage: {
    url: images.rifle.homeCover,
    alt: `${brand.short} — precision rifles built to order`,
  },
  favicon: {
    url: "/images/logos/Gunworks_badge.svg",
    alt: brand.short,
  },
};

/** Local `_assets/photos` filenames for seeding Sanity site image fields */
export const defaultSiteImageFiles: Record<keyof SiteImages, string> = {
  reticleOverlay: "FC-DMx_MOA__16268 copy.webp",
  homeHeroBanner: "IMG_5613cover.webp",
  homeFieldTested: "IMG_1125bighorn.jpg",
  homeBallisticSection: "IMG_0058-cropped.jpg",
  aboutHeroBanner: "IMG_5613.jpeg",
  aboutStory: "IMG_1192 copy.webp",
};

export {
  buildFieldGalleryFileList,
  FIELD_GALLERY_ALT,
  FIELD_GALLERY_SOURCE_FILES,
  FIELD_GALLERY_TARGET_COUNT,
} from "@/data/field-gallery";

const defaultFieldGalleryFiles = buildFieldGalleryFileList();

export const defaultFieldGallery = defaultFieldGalleryFiles.map(
  ({ url, srcSet, lightboxUrl, alt }) => ({
    url,
    srcSet,
    lightboxUrl,
    alt,
  }),
);

export const defaultSiteSettings: SiteSettings = {
  name: brand.name,
  short: brand.short,
  tagline: brand.tagline,
  email: brand.email,
  partnerBarrels: "Proof Research / Carbon Six",
  partnerOptics: "NightForce",
  buildPromise:
    docxCopy.brandStatement ||
    "Every BADWRX rifle is built to order, assembled by hand, and tested before it leaves.",
  deliveryPackage:
    getCopy("BALLISTIC PACKAGE — Body") ||
    brand.deliveryPackage,
  trustMarqueeItems: [
    "NightForce Optics",
    "Carbon Six Barrels",
    "Hand Test-Fired",
    "½ MOA Guarantee",
    "Built to Order",
  ],
  siteImages: defaultSiteImages,
  brandAssets: defaultBrandAssets,
  navImageFade: defaultNavImageFade,
  siteAccess: defaultSiteAccess,
  homeHero: {
    eyebrow: "Unrelenting performance",
    headlinePrefix: "",
    headlines: [
      ["Crafted", "Without", "Compromise"],
      ["Engineered for", "Unrelenting", "Performance"],
      ["Built for", "the hard", "country"],
    ],
    subheadline: docxCopy.homeHero.subheadline
      .replace(/\s*Every rifle guaranteed\.?\s*$/i, "")
      .trim(),
  },
  homePlatforms: {
    eyebrow: "Our platforms",
    title: cleanDocxCopy(docxCopy.rifleLineupPreview) || docxCopy.buildsPage.headline,
    body: docxCopy.buildsPage.subcopy,
  },
  packageCta: cleanDocxCopy(docxCopy.packageCta),
  homeIntro: {
    eyebrow: "Who we build for",
    body: docxCopy.brandStatement,
  },
  homePillars: [
    pillarParts("weight"),
    pillarParts("accuracy"),
    pillarParts("durability"),
  ],
  fieldTested: {
    eyebrow: "Field proven",
    title: "Built for hard country",
    body: pillarParts("durability").body,
  },
  fieldGallerySection: {
    eyebrow: "Photo gallery",
    title: "From the Field",
    body: "The rifles we make and the country they see.",
  },
  fieldGallery: defaultFieldGallery,
  unrelenting: {
    eyebrow: "Ballistic package",
    title: getCopy(
      "BALLISTIC PACKAGE — Headline",
      "Your rifle ships zeroed. Most builders stop there. We don't.",
    ),
    body:
      getCopy("BALLISTIC PACKAGE — Body") ||
      "The BADWRX Ballistic Package takes your rifle to 1,000 meters with real data and laser-engraved turrets.",
  },
  testimonialSection: {
    eyebrow: "BADWRX client reviews",
  },
  testimonial: {
    quote:
      "Most 'custom' rifles still need work. This one didn't. Zeroed quick, tracked true, and the first round in the field ended the hunt. When your rifle does exactly what it's supposed to, everything gets simpler.",
    author: "Tj",
  },
  testimonials: [
    {
      quote:
        "Most 'custom' rifles still need work. This one didn't. Zeroed quick, tracked true, and the first round in the field ended the hunt. When your rifle does exactly what it's supposed to, everything gets simpler.",
      author: "Tj",
    },
    {
      quote:
        "The ballistic package wasn't marketing. I dialed first round at 780 yards opening morning — no calculator, no second-guessing. The rifle showed up ready for where I actually hunt.",
      author: "Marcus K., Idaho elk hunter",
    },
    {
      quote:
        "I've owned three custom builds. This is the first that showed up ready to shoot steel at 1,000. The shop time went into the rifle, not into fixing someone else's shortcuts.",
      author: "Ryan V., PRS competitor",
    },
    {
      quote:
        "Small-shop attention, professional results. The engraved turrets matched my load and the conditions we talked about before the build. Wind calls got simpler because the data was right.",
      author: "Dana L., backcountry mule deer",
    },
  ],
  contactSection: {
    title: "Request a build quote",
    body: cleanDocxCopy(docxCopy.customQuoteCta),
  },
  allowSearchIndexing: false,
  pageSeo: defaultPageSeo,
  pageVisibility: {
    builds: { enabled: true },
    configure: { enabled: true },
    merch: { enabled: true },
    university: { enabled: true },
    about: { enabled: true },
    contact: { enabled: true },
  },
  aboutPage: (() => {
    const copy = aboutPageCopy();
    return {
    title: getCopy("ABOUT — Headline", "Built Different. On Purpose.")
      .replace(/\.\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    body: copy.body,
    signature: copy.signature,
    pillars: [
      aboutPillarFromCopy(
        "ABOUT — Pillar 1: PRECISION",
        "We build to tolerances that matter. Every action, barrel, and component in a BADWRX rifle is selected and fitted to perform as a system, not as a collection of parts.",
      ),
      aboutPillarFromCopy(
        "ABOUT — Pillar 2: WEIGHT",
        "Ultralight is not a marketing term. It is an engineering discipline. We build the lightest rifle that can do the job — and we do not build rifles that cannot.",
      ),
      aboutPillarFromCopy(
        "ABOUT — Pillar 3: RELIABILITY",
        "A precision rifle that fails in the field is worse than useless. Every BADWRX build is tested, verified, and guaranteed before it ships.",
      ),
    ],
    philosophyQuote: getCopy(
      "ABOUT — Headline",
      "Built Different. On Purpose.",
    ),
    };
  })(),
};
