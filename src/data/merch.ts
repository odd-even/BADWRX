import type { MerchCategory, MerchItem, RifleImage } from "@/lib/types";
import { merchImage } from "@/lib/images";

export const apparelSizes = ["S", "M", "L", "XL", "2XL"] as const;
export const capSizes = ["One Size"] as const;
export const defaultColors = ["Black", "Heather Gray"] as const;

export const merchCategoryLabels: Record<MerchCategory, string> = {
  caps: "Caps",
  "t-shirts": "T-Shirts",
  sweaters: "Sweaters",
};

/** Local asset paths used when seeding Sanity merch images */
export const merchImageSources: Record<
  string,
  { folder: string; filenames: string[] }
> = {
  "field-cap": {
    folder: "caps",
    filenames: [
      "A13mbtEaGjL._AC_UY1000_.jpg",
      "8184u-T+wvL._AC_UY1000_.jpg",
    ],
  },
  "trucker-hat": {
    folder: "caps",
    filenames: ["21612114.webp", "A13mbtEaGjL._AC_UY1000_.jpg"],
  },
  "logo-tee": {
    folder: "tshirt",
    filenames: ["21614210.webp", "vortex-125-06-BLK-hero-002__92367.jpg"],
  },
  "engineered-tee": {
    folder: "tshirt",
    filenames: [
      "vortex-125-06-BLK-hero-002__92367.jpg",
      "21614210.webp",
    ],
  },
  hoodie: {
    folder: "hoodie",
    filenames: ["MHF-94600.jpg.webp", "81A9WL-EilL._AC_UY1000_.jpg"],
  },
  crewneck: {
    folder: "hoodie",
    filenames: ["81A9WL-EilL._AC_UY1000_.jpg", "MHF-94600.jpg.webp"],
  },
};

function merchImages(
  folder: string,
  filenames: string[],
  altBase: string,
): RifleImage[] {
  return filenames.map((filename, index) => ({
    url: merchImage(folder, filename),
    alt:
      index === 0
        ? altBase
        : `${altBase.replace(/ product photo$/, "")} — alternate view`,
  }));
}

export const merchItems: MerchItem[] = [
  {
    id: "1",
    slug: "field-cap",
    title: "BADWRX Field Cap",
    category: "caps",
    price: "$32",
    priceCents: 3200,
    description:
      "Structured cotton cap with embroidered BADWRX mark. Low profile, curved brim.",
    longDescription:
      "A structured cotton field cap built for long days on the range and in the field. Low-profile crown, curved brim, and an embroidered BADWRX mark that stays understated up close and readable at distance. Adjustable closure fits most head sizes. Pair it with a hoodie or tee when you want brand without billboard energy.",
    sizes: [...capSizes],
    colors: ["Black", "OD Green"],
    image: {
      url: merchImage("caps", "A13mbtEaGjL._AC_UY1000_.jpg"),
      alt: "BADWRX field cap product photo",
    },
    images: merchImages("caps", merchImageSources["field-cap"].filenames, "BADWRX field cap product photo"),
  },
  {
    id: "2",
    slug: "trucker-hat",
    title: "BADWRX Trucker Hat",
    category: "caps",
    price: "$34",
    priceCents: 3400,
    description:
      "Mesh-back trucker with front panel logo. Built for range days and backcountry miles.",
    longDescription:
      "Mesh-back trucker with a structured front panel and BADWRX logo embroidery. Breathable for hot range days and long drives to camp. The contrast panel layout reads classic American truck stop — in the best way — without feeling like promo gear. One size with adjustable snap closure.",
    sizes: [...capSizes],
    colors: ["Black/Charcoal", "Khaki"],
    image: {
      url: merchImage("caps", "21612114.webp"),
      alt: "BADWRX trucker hat product photo",
    },
    images: merchImages("caps", merchImageSources["trucker-hat"].filenames, "BADWRX trucker hat product photo"),
  },
  {
    id: "3",
    slug: "logo-tee",
    title: "BADWRX Logo Tee",
    category: "t-shirts",
    price: "$38",
    priceCents: 3800,
    description: "Heavyweight cotton tee with chest stack logo. Black or heather gray.",
    longDescription:
      "Heavyweight cotton tee with a chest stack BADWRX logo. Soft hand, durable construction, and a fit that works under a plate carrier or on its own at the shop. Available in black and heather gray. Pre-shrunk cotton holds its shape through wash cycles — the kind of shirt you reach for when you are not trying to dress up.",
    sizes: [...apparelSizes],
    colors: [...defaultColors],
    image: {
      url: merchImage("tshirt", "21614210.webp"),
      alt: "BADWRX logo tee product photo",
    },
    images: merchImages("tshirt", merchImageSources["logo-tee"].filenames, "BADWRX logo tee product photo"),
  },
  {
    id: "4",
    slug: "engineered-tee",
    title: "Engineered Without Compromise Tee",
    category: "t-shirts",
    price: "$38",
    priceCents: 3800,
    description: "Front tagline print on soft-washed cotton. Unisex fit.",
    longDescription:
      "Front tagline print on soft-washed cotton — the line we build rifles around, on a shirt you will actually wear. Unisex fit with a slightly relaxed drape. Black and charcoal colorways. Minimal branding, maximum intent: precision rifles, engineered without compromise.",
    sizes: [...apparelSizes],
    colors: ["Black", "Charcoal"],
    image: {
      url: merchImage("tshirt", "vortex-125-06-BLK-hero-002__92367.jpg"),
      alt: "Engineered Without Compromise tee product photo",
    },
    images: merchImages(
      "tshirt",
      merchImageSources["engineered-tee"].filenames,
      "Engineered Without Compromise tee product photo",
    ),
  },
  {
    id: "5",
    slug: "hoodie",
    title: "BADWRX Hoodie",
    category: "sweaters",
    price: "$68",
    priceCents: 6800,
    description:
      "Midweight fleece hoodie with kangaroo pocket and embroidered stack logo.",
    longDescription:
      "Midweight fleece hoodie with kangaroo pocket and embroidered BADWRX stack logo. Warm enough for predawn zeroing, light enough to layer under a shell. Ribbed cuffs and hem keep draft out. Black and charcoal. Built for shop days, range mornings, and everything in between.",
    sizes: [...apparelSizes],
    colors: ["Black", "Charcoal"],
    image: {
      url: merchImage("hoodie", "MHF-94600.jpg.webp"),
      alt: "BADWRX hoodie product photo",
    },
    images: merchImages("hoodie", merchImageSources.hoodie.filenames, "BADWRX hoodie product photo"),
  },
  {
    id: "6",
    slug: "crewneck",
    title: "Badger Crewneck",
    category: "sweaters",
    price: "$62",
    priceCents: 6200,
    description: "French terry crew with tonal badger mark. Raglan sleeves, relaxed fit.",
    longDescription:
      "French terry crewneck with a tonal badger mark and raglan sleeves for easy movement. Relaxed fit that layers over a tee without bulk. Heather gray and black. Softer profile than the hoodie — same BADWRX DNA, less hood.",
    sizes: [...apparelSizes],
    colors: ["Black", "Heather Gray"],
    image: {
      url: merchImage("hoodie", "81A9WL-EilL._AC_UY1000_.jpg"),
      alt: "Badger crewneck product photo",
    },
    images: merchImages("hoodie", merchImageSources.crewneck.filenames, "Badger crewneck product photo"),
  },
];

export function getMerchBySlug(slug: string): MerchItem | undefined {
  return merchItems.find((item) => item.slug === slug);
}
