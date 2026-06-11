import type { MerchItem, RifleImage } from "@/lib/types";
import { merchImage } from "@/lib/images";
import { resolveSanityImageUrl } from "./image";
import { sanityPriceToCents } from "./price";

interface SanityImageField {
  asset?: { url?: string };
  alt?: string;
}

interface SanityMerchItem {
  _id: string;
  slug: string;
  title: string;
  category: MerchItem["category"];
  price?: number;
  priceCents?: number;
  description: string;
  longDescription?: string;
  image?: SanityImageField;
  images?: SanityImageField[];
  sizes?: string[];
  colors?: string[];
  active?: boolean;
}

const fallbackImages: Record<string, { folder: string; filenames: string[]; alt: string }> = {
  "field-cap": {
    folder: "caps",
    filenames: ["A13mbtEaGjL._AC_UY1000_.jpg", "8184u-T+wvL._AC_UY1000_.jpg"],
    alt: "BADWRX field cap product photo",
  },
  "trucker-hat": {
    folder: "caps",
    filenames: ["21612114.webp", "A13mbtEaGjL._AC_UY1000_.jpg"],
    alt: "BADWRX trucker hat product photo",
  },
  "logo-tee": {
    folder: "tshirt",
    filenames: ["21614210.webp", "vortex-125-06-BLK-hero-002__92367.jpg"],
    alt: "BADWRX logo tee product photo",
  },
  "engineered-tee": {
    folder: "tshirt",
    filenames: [
      "vortex-125-06-BLK-hero-002__92367.jpg",
      "21614210.webp",
    ],
    alt: "Engineered Without Compromise tee product photo",
  },
  hoodie: {
    folder: "hoodie",
    filenames: ["MHF-94600.jpg.webp", "81A9WL-EilL._AC_UY1000_.jpg"],
    alt: "BADWRX hoodie product photo",
  },
  crewneck: {
    folder: "hoodie",
    filenames: ["81A9WL-EilL._AC_UY1000_.jpg", "MHF-94600.jpg.webp"],
    alt: "Badger crewneck product photo",
  },
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function mapSanityImage(
  field: SanityImageField | undefined,
  fallbackAlt: string,
  width: "card" | "content" = "card",
): RifleImage | null {
  if (!field) return null;
  const url = resolveSanityImageUrl(field, width);
  if (!url) return null;
  return { url, alt: field.alt ?? fallbackAlt };
}

function fallbackGallery(slug: string): RifleImage[] {
  const fallback = fallbackImages[slug];
  if (!fallback) {
    return [
      {
        url: merchImage("caps", "A13mbtEaGjL._AC_UY1000_.jpg"),
        alt: "BADWRX merch product photo",
      },
    ];
  }

  return fallback.filenames.map((filename, index) => ({
    url: merchImage(fallback.folder, filename),
    alt:
      index === 0
        ? fallback.alt
        : `${fallback.alt.replace(/ product photo$/, "")} — alternate view`,
  }));
}

function resolveMerchImages(doc: SanityMerchItem): RifleImage[] {
  const fallbackAlt = fallbackImages[doc.slug]?.alt ?? doc.title;

  if (doc.images?.length) {
    const mapped = doc.images
      .map((field, index) =>
        mapSanityImage(
          field,
          index === 0
            ? fallbackAlt
            : `${fallbackAlt.replace(/ product photo$/, "")} — alternate view`,
          index === 0 ? "card" : "content",
        ),
      )
      .filter((image): image is RifleImage => image !== null);
    if (mapped.length > 0) return mapped;
  }

  const primary = mapSanityImage(doc.image, fallbackAlt);
  if (primary) return [primary];

  return fallbackGallery(doc.slug);
}

export function mapMerchItem(doc: SanityMerchItem): MerchItem {
  const priceCents = sanityPriceToCents(doc.price, doc.priceCents);
  const images = resolveMerchImages(doc);

  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    price: formatPrice(priceCents),
    priceCents,
    description: doc.description,
    longDescription: doc.longDescription?.trim() || doc.description,
    sizes: doc.sizes ?? ["One Size"],
    ...(doc.colors?.length ? { colors: doc.colors } : {}),
    image: images[0],
    images,
  };
}
