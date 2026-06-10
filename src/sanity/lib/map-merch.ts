import type { MerchItem } from "@/lib/types";
import { merchImage } from "@/lib/images";
import { imageUrl } from "./image";
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
  image?: SanityImageField;
  sizes?: string[];
  colors?: string[];
  active?: boolean;
}

const fallbackImages: Record<string, { folder: string; filename: string; alt: string }> = {
  "field-cap": {
    folder: "caps",
    filename: "A13mbtEaGjL._AC_UY1000_.jpg",
    alt: "BADWRX field cap product photo",
  },
  "trucker-hat": {
    folder: "caps",
    filename: "21612114.webp",
    alt: "BADWRX trucker hat product photo",
  },
  "logo-tee": {
    folder: "tshirt",
    filename: "21614210.webp",
    alt: "BADWRX logo tee product photo",
  },
  "engineered-tee": {
    folder: "tshirt",
    filename: "vortex-125-06-BLK-hero-002__92367.jpg",
    alt: "Engineered Without Compromise tee product photo",
  },
  hoodie: {
    folder: "hoodie",
    filename: "MHF-94600.jpg.webp",
    alt: "BADWRX hoodie product photo",
  },
  crewneck: {
    folder: "hoodie",
    filename: "81A9WL-EilL._AC_UY1000_.jpg",
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

export function mapMerchItem(doc: SanityMerchItem): MerchItem {
  const priceCents = sanityPriceToCents(doc.price, doc.priceCents);
  const fallback = fallbackImages[doc.slug];
  const fallbackUrl = fallback
    ? merchImage(fallback.folder, fallback.filename)
    : merchImage("caps", "A13mbtEaGjL._AC_UY1000_.jpg");

  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    price: formatPrice(priceCents),
    priceCents,
    description: doc.description,
    sizes: doc.sizes ?? ["One Size"],
    ...(doc.colors?.length ? { colors: doc.colors } : {}),
    image: {
      url: imageUrl(doc.image, "card") ?? doc.image?.asset?.url ?? fallbackUrl,
      alt: doc.image?.alt ?? fallback?.alt ?? doc.title,
    },
  };
}
