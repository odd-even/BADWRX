import type { MerchCategory, MerchItem } from "@/lib/types";

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

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
      url: unsplash("photo-1588850561407-ed78c282e952"),
      alt: "Black baseball cap product photo",
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
      url: unsplash("photo-1575428652377-a96d6c318664"),
      alt: "Trucker hat product photo",
    },
  },
  {
    id: "3",
    slug: "snapback",
    title: "Precision Rifles Snapback",
    category: "caps",
    price: "$36",
    priceCents: 3600,
    description: "Flat-bill snapback with red-accent stack logo. One size fits most.",
    sizes: [...capSizes],
    colors: ["Black"],
    image: {
      url: unsplash("photo-1521369908759-475312072597"),
      alt: "Snapback cap product photo",
    },
  },
  {
    id: "4",
    slug: "logo-tee",
    title: "BADWRX Logo Tee",
    category: "t-shirts",
    price: "$38",
    priceCents: 3800,
    description: "Heavyweight cotton tee with chest stack logo. Black or heather gray.",
    sizes: [...apparelSizes],
    colors: [...defaultColors],
    image: {
      url: unsplash("photo-1521572163474-6864f9cf17ab"),
      alt: "White t-shirt product photo",
    },
  },
  {
    id: "5",
    slug: "engineered-tee",
    title: "Engineered Without Compromise Tee",
    category: "t-shirts",
    price: "$38",
    priceCents: 3800,
    description: "Front tagline print on soft-washed cotton. Unisex fit.",
    sizes: [...apparelSizes],
    colors: ["Black", "Charcoal"],
    image: {
      url: unsplash("photo-1583743814966-6aae8123257e"),
      alt: "Black t-shirt on hanger",
    },
  },
  {
    id: "6",
    slug: "patriot-tee",
    title: "American Patriot Tee",
    category: "t-shirts",
    price: "$38",
    priceCents: 3800,
    description: "Precision rifles for the American patriot — back print with front badge.",
    sizes: [...apparelSizes],
    colors: [...defaultColors],
    image: {
      url: unsplash("photo-1622445275463-0982c0fb879a"),
      alt: "Folded t-shirts product photo",
    },
  },
  {
    id: "7",
    slug: "hoodie",
    title: "BADWRX Hoodie",
    category: "sweaters",
    price: "$68",
    priceCents: 6800,
    description: "Midweight fleece hoodie with kangaroo pocket and embroidered stack logo.",
    sizes: [...apparelSizes],
    colors: ["Black", "Charcoal"],
    image: {
      url: unsplash("photo-1556821840-3a63f95609a7"),
      alt: "Gray hoodie product photo",
    },
  },
  {
    id: "8",
    slug: "crewneck",
    title: "Badger Crewneck",
    category: "sweaters",
    price: "$62",
    priceCents: 6200,
    description: "French terry crew with tonal badger mark. Raglan sleeves, relaxed fit.",
    sizes: [...apparelSizes],
    colors: ["Black", "Heather Gray"],
    image: {
      url: unsplash("photo-1578587018452-892bacefd3af"),
      alt: "Crewneck sweater product photo",
    },
  },
  {
    id: "9",
    slug: "range-pullover",
    title: "Range Day Pullover",
    category: "sweaters",
    price: "$72",
    priceCents: 7200,
    description: "Quarter-zip pullover in charcoal with red accent zipper and sleeve badge.",
    sizes: [...apparelSizes],
    colors: ["Charcoal", "Black"],
    image: {
      url: unsplash("photo-1620799140408-edc6dcb0886a"),
      alt: "Pullover hoodie product photo",
    },
  },
];

export function getMerchBySlug(slug: string): MerchItem | undefined {
  return merchItems.find((item) => item.slug === slug);
}
