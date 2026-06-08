import type { MerchCategory, MerchItem } from "@/lib/types";
import { merchImage } from "@/lib/images";

export const apparelSizes = ["S", "M", "L", "XL", "2XL"] as const;
export const capSizes = ["One Size"] as const;
export const defaultColors = ["Black", "Heather Gray"] as const;

export const merchCategoryLabels: Record<MerchCategory, string> = {
  caps: "Caps",
  "t-shirts": "T-Shirts",
  sweaters: "Sweaters",
};

export const merchItems: MerchItem[] = [
  {
    id: "1",
    slug: "field-cap",
    title: "BADWRX Field Cap",
    category: "caps",
    price: "$32",
    priceCents: 3200,
    description: "Structured cotton cap with embroidered BADWRX mark. Low profile, curved brim.",
    sizes: [...capSizes],
    colors: ["Black", "OD Green"],
    image: {
      url: merchImage("caps", "A13mbtEaGjL._AC_UY1000_.jpg"),
      alt: "BADWRX field cap product photo",
    },
  },
  {
    id: "2",
    slug: "trucker-hat",
    title: "BADWRX Trucker Hat",
    category: "caps",
    price: "$34",
    priceCents: 3400,
    description: "Mesh-back trucker with front panel logo. Built for range days and backcountry miles.",
    sizes: [...capSizes],
    colors: ["Black/Charcoal", "Khaki"],
    image: {
      url: merchImage("caps", "21612114.webp"),
      alt: "BADWRX trucker hat product photo",
    },
  },
  {
    id: "3",
    slug: "logo-tee",
    title: "BADWRX Logo Tee",
    category: "t-shirts",
    price: "$38",
    priceCents: 3800,
    description: "Heavyweight cotton tee with chest stack logo. Black or heather gray.",
    sizes: [...apparelSizes],
    colors: [...defaultColors],
    image: {
      url: merchImage("tshirt", "21614210.webp"),
      alt: "BADWRX logo tee product photo",
    },
  },
  {
    id: "4",
    slug: "engineered-tee",
    title: "Engineered Without Compromise Tee",
    category: "t-shirts",
    price: "$38",
    priceCents: 3800,
    description: "Front tagline print on soft-washed cotton. Unisex fit.",
    sizes: [...apparelSizes],
    colors: ["Black", "Charcoal"],
    image: {
      url: merchImage("tshirt", "vortex-125-06-BLK-hero-002__92367.jpg"),
      alt: "Engineered Without Compromise tee product photo",
    },
  },
  {
    id: "5",
    slug: "hoodie",
    title: "BADWRX Hoodie",
    category: "sweaters",
    price: "$68",
    priceCents: 6800,
    description: "Midweight fleece hoodie with kangaroo pocket and embroidered stack logo.",
    sizes: [...apparelSizes],
    colors: ["Black", "Charcoal"],
    image: {
      url: merchImage("hoodie", "MHF-94600.jpg.webp"),
      alt: "BADWRX hoodie product photo",
    },
  },
  {
    id: "6",
    slug: "crewneck",
    title: "Badger Crewneck",
    category: "sweaters",
    price: "$62",
    priceCents: 6200,
    description: "French terry crew with tonal badger mark. Raglan sleeves, relaxed fit.",
    sizes: [...apparelSizes],
    colors: ["Black", "Heather Gray"],
    image: {
      url: merchImage("hoodie", "81A9WL-EilL._AC_UY1000_.jpg"),
      alt: "Badger crewneck product photo",
    },
  },
];

export function getMerchBySlug(slug: string): MerchItem | undefined {
  return merchItems.find((item) => item.slug === slug);
}
