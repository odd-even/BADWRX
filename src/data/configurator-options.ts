import type { ConfigStep } from "@/lib/types";
import { placeholderImage } from "@/lib/images";

export const configuratorSteps: ConfigStep[] = [
  {
    id: "platform",
    title: "Action",
    subtitle: "BADWRX action architecture — builder-matched to your hunt",
    options: [
      {
        id: "dominus-mk1",
        label: "Dominus MK1",
        description:
          "Long-range hunting action built to precision standards. The foundation of our western ridge-line builds.",
        specs: { action: "Dominus MK1", type: "Push-feed bolt" },
        image: {
          url: placeholderImage("actions", "shadow-action-products.webp"),
          alt: "Dominus MK1 action",
        },
      },
      {
        id: "invictus-x",
        label: "Invictus X",
        description:
          "Lightweight action for backcountry and mountain hunting — when ounces matter on a steep ridge.",
        specs: { action: "Invictus X", type: "Push-feed bolt" },
        image: {
          url: placeholderImage("actions", "action.png"),
          alt: "Invictus X action",
        },
      },
      {
        id: "primus-ul",
        label: "Primus UL",
        description:
          "Precision platform with AICS compatibility. Built for timberline elk and mule deer at distance.",
        specs: { action: "Primus UL", type: "Push-feed bolt" },
        image: {
          url: placeholderImage("actions", "primus-ul.png"),
          alt: "Primus UL action",
        },
      },
    ],
  },
  {
    id: "caliber",
    title: "Caliber",
    subtitle: "Chambered and proofed for your intended game and range",
    options: [
      {
        id: "7mm-prc",
        label: "7mm PRC",
        description: "Modern long-range elk cartridge with excellent BC and manageable recoil.",
        specs: { caliber: "7mm PRC" },
      },
      {
        id: "300-prc",
        label: ".300 PRC",
        description: "Purpose-built for precision hunting beyond 600 yards.",
        specs: { caliber: ".300 PRC" },
      },
      {
        id: "308-win",
        label: ".308 Winchester",
        description: "Versatile, widely available, proven on deer and antelope.",
        specs: { caliber: ".308 Winchester" },
      },
      {
        id: "375-hh",
        label: ".375 H&H Magnum",
        description: "Classic dangerous-game chambering for safari and brown bear.",
        specs: { caliber: ".375 H&H Magnum" },
      },
      {
        id: "6-5-prc",
        label: "6.5 PRC",
        description: "Flat trajectory and mild recoil for western ridge hunting.",
        specs: { caliber: "6.5 PRC" },
      },
    ],
  },
  {
    id: "barrel",
    title: "Barrel",
    subtitle: "Proof Research steel or carbon — cut, crowned, and fitted in-house",
    options: [
      {
        id: "proof-carbon-24",
        label: 'Proof Research Carbon — 24"',
        description: "CF-wrapped barrel. Saves weight without sacrificing accuracy.",
        specs: { barrel: "Proof Research Carbon", barrelLength: '24"' },
      },
      {
        id: "proof-carbon-22",
        label: 'Proof Research Carbon — 22"',
        description: "Short carbon contour for backcountry and mountain platforms.",
        specs: { barrel: "Proof Research Carbon", barrelLength: '22"' },
      },
      {
        id: "proof-steel-26",
        label: 'Proof Research Steel — 26" Sporter',
        description: "Match-grade stainless steel. Hand-fitted to action and stock.",
        specs: { barrel: "Proof Research Steel", barrelLength: '26"' },
      },
      {
        id: "proof-steel-22",
        label: 'Proof Research Steel — 22" Hunter',
        description: "Light contour for carry rifles. Sub-7.5 lb finished weight target.",
        specs: { barrel: "Proof Research Steel", barrelLength: '22"' },
      },
    ],
  },
  {
    id: "stock",
    title: "Stock / Chassis",
    subtitle: "Pillar and glass bedded to your specific action",
    options: [
      {
        id: "manners-prs",
        label: "Manners PRS-1 Hunter",
        description: "Composite stock with adjustable cheek piece. Proven competition geometry.",
        specs: { stock: "Manners PRS-1 Hunter" },
        image: {
          url: placeholderImage("stocks", "OXT3pIs.jpg"),
          alt: "Manners PRS-1 Hunter stock",
        },
      },
      {
        id: "sf-rifleman",
        label: "BADWRX Rifleman",
        description:
          "Proprietary carbon-fiber shell. Dedicated RH comb height for prone and field positions.",
        specs: { stock: "BADWRX Rifleman (Carbon)" },
        image: {
          url: placeholderImage(
            "stocks",
            "PSE_ETAC_Carbon_Rifle_Stock_b189e17b-8688-4a53-aa49-2845c83774da_1600x.jpg.webp",
          ),
          alt: "BADWRX Rifleman carbon stock",
        },
      },
      {
        id: "mcmillan-supergrade",
        label: "McMillan Supergrade",
        description: "Traditional fiberglass stock. Preferred for safari and classic builds.",
        specs: { stock: "McMillan Supergrade" },
        image: {
          url: placeholderImage(
            "stocks",
            "PSE_Evolution_Carbon_Stock_Rem_700_Long_Action_1600x.jpg.webp",
          ),
          alt: "McMillan Supergrade stock",
        },
      },
      {
        id: "chassis-mdt",
        label: "MDT ACC Elite Chassis",
        description: "Full aluminum chassis with AICS compatibility and tool-less adjustments.",
        specs: { stock: "MDT ACC Elite Chassis" },
        image: {
          url: placeholderImage("stocks", "OXT3pIs.jpg"),
          alt: "MDT ACC Elite chassis",
        },
      },
    ],
  },
  {
    id: "stockPaint",
    title: "Stock Paint",
    subtitle: "Cerakote or camo dip — applied to composite and chassis surfaces",
    options: [
      {
        id: "matte-black",
        label: "Matte Black",
        description: "Non-reflective black cerakote. Pairs with graphite metal finish.",
        specs: { stockPaint: "Cerakote Matte Black (H-109)" },
        image: {
          url: placeholderImage(
            "camo",
            "bondcambrushcam5monochromecontrasty50x50swatch.jpg.webp",
          ),
          alt: "Matte black stock finish",
        },
      },
      {
        id: "od-green",
        label: "OD Green",
        description: "Classic olive drab. Low profile in timber and sage country.",
        specs: { stockPaint: "Cerakote OD Green (H-232)" },
        image: {
          url: placeholderImage("camo", "camo-seamless-pattern-v0-7or2osuu8bxb1.jpg"),
          alt: "OD green stock finish",
        },
      },
      {
        id: "fde",
        label: "Flat Dark Earth",
        description: "Warm earth tone for western and high-desert hunts.",
        specs: { stockPaint: "Cerakote Flat Dark Earth (H-267)" },
        image: {
          url: placeholderImage("camo", "bondcambrushcam550x50swatch.jpg"),
          alt: "Flat dark earth stock finish",
        },
      },
      {
        id: "multicam",
        label: "Multicam Dip",
        description: "Hydro-dipped multicam pattern over composite or fiberglass.",
        specs: { stockPaint: "Multicam hydro dip" },
        image: {
          url: placeholderImage(
            "camo",
            "seamless-camo-patterns-v0-hvfuqglgfxac1.jpg.webp",
          ),
          alt: "Multicam stock finish",
        },
      },
      {
        id: "custom",
        label: "Custom Color",
        description: "Match to metal finish, brand colors, or a provided RAL/Cerakote code.",
        specs: { stockPaint: "Custom (consultation)" },
        image: {
          url: placeholderImage(
            "camo",
            "Camouflage-Seamless-Pattern-Background-Graphics-41997134-2-580x386.jpg",
          ),
          alt: "Custom stock paint finish",
        },
      },
    ],
  },
  {
    id: "trigger",
    title: "Trigger",
    subtitle: "Tuned and tested before delivery",
    options: [
      {
        id: "triggertech-special",
        label: "TriggerTech Special",
        description: "Zero-creep, zero-overtravel. Set to 1.0–1.5 lbs from factory.",
        specs: { trigger: "TriggerTech Special (1.0–1.5 lbs)" },
        image: {
          url: placeholderImage("triggers", "RA-101-Single-Stage-Trigger-Curved-700x700.jpg"),
          alt: "TriggerTech Special trigger",
        },
      },
      {
        id: "triggertech-diamond",
        label: "TriggerTech Diamond",
        description: "Flagship trigger for precision builds. User-adjustable 4–32 oz.",
        specs: { trigger: "TriggerTech Diamond" },
        image: {
          url: placeholderImage("triggers", "l_100024775_1.jpg.webp"),
          alt: "TriggerTech Diamond trigger",
        },
      },
      {
        id: "timney-calvinelite",
        label: "Timney Calvin Elite",
        description: "Two-stage option for hunters who prefer a deliberate wall.",
        specs: { trigger: "Timney Calvin Elite (2-stage)" },
        image: {
          url: placeholderImage("triggers", "images.jpeg"),
          alt: "Timney Calvin Elite trigger",
        },
      },
    ],
  },
  {
    id: "finish",
    title: "Metal Finish",
    subtitle: "Cerakote applied in-house — matte, satin, or high-gloss",
    options: [
      {
        id: "cerakote-black",
        label: "Cerakote — Graphite Black",
        description: "Standard matte black. Corrosion resistant, non-reflective.",
        specs: { finish: "Cerakote Graphite Black (H-146)" },
        image: {
          url: placeholderImage(
            "barrels",
            "dark-black-metal-background-texture_1040193-834.jpg.avif",
          ),
          alt: "Cerakote graphite black finish",
        },
      },
      {
        id: "cerakote-tungsten",
        label: "Cerakote — Tungsten Gray",
        description: "Subtle gray tone. Pairs well with carbon stocks.",
        specs: { finish: "Cerakote Tungsten (H-237)" },
        image: {
          url: placeholderImage("barrels", "circular-837510_1920.jpg"),
          alt: "Cerakote tungsten gray finish",
        },
      },
      {
        id: "cerakote-red",
        label: "Cerakote — BADWRX Red Accent",
        description: "Black base with bolt knob and accent ring in signature red.",
        specs: { finish: "Cerakote Black + BADWRX Red accents" },
        image: {
          url: placeholderImage(
            "barrels",
            "carbon-fiber-barrel-barlein-and-proof.jpg",
          ),
          alt: "Cerakote black with red accents",
        },
      },
      {
        id: "stainless-bead",
        label: "Stainless Bead Blast",
        description: "Natural stainless finish. No coating on barrel or action.",
        specs: { finish: "Stainless bead blast (uncoated)" },
        image: {
          url: placeholderImage(
            "barrels",
            "0091-black-shiny-brushed-inox-metal-texture-hr.jpg",
          ),
          alt: "Stainless bead blast metal finish",
        },
      },
    ],
  },
  {
    id: "scope",
    title: "Scope",
    subtitle: "NightForce optics — mounted, leveled, and bore-sighted in-house",
    options: [
      {
        id: "nf-nx8-4-32",
        label: "NightForce NX8 4-32×50 F1",
        description: "Compact long-range optic with first focal plane MOAR reticle.",
        specs: { scope: "NightForce NX8 4-32×50 F1", magnification: "4–32×" },
        image: {
          url: placeholderImage("scopes", "nightforce-scope.webp"),
          alt: "NightForce NX8 scope",
        },
      },
      {
        id: "nf-atacr-5-25",
        label: "NightForce ATACR 5-25×56 F1",
        description: "Precision hunting and competition glass with exceptional clarity.",
        specs: { scope: "NightForce ATACR 5-25×56 F1", magnification: "5–25×" },
        image: {
          url: placeholderImage("scopes", "nightforce-scope.webp"),
          alt: "NightForce ATACR scope",
        },
      },
      {
        id: "nf-shv-4-14",
        label: "NightForce SHV 4-14×50",
        description: "Versatile second focal plane scope for western ridge hunting.",
        specs: { scope: "NightForce SHV 4-14×50", magnification: "4–14×" },
        image: {
          url: placeholderImage("scopes", "nightforce-scope.webp"),
          alt: "NightForce SHV scope",
        },
      },
      {
        id: "scope-none",
        label: "No scope — optics ready",
        description: "Picatinny or integral mount prepared; customer-supplied optic.",
        specs: { scope: "None (optics ready)" },
      },
    ],
  },
  {
    id: "rings",
    title: "Rings",
    subtitle: "Scope rings matched to tube diameter and rail height",
    options: [
      {
        id: "nf-xtrm-30mm",
        label: "NightForce XTRM — 30mm Medium",
        description: "Steel rings for 30mm tube scopes on standard-height rails.",
        specs: { rings: "NightForce XTRM 30mm Medium", tube: "30mm" },
        image: {
          url: placeholderImage("rings", "mount-rings.jpg"),
          alt: "NightForce 30mm scope rings",
        },
      },
      {
        id: "nf-xtrm-34mm",
        label: "NightForce XTRM — 34mm Medium",
        description: "34mm rings for ATACR and large-tube precision optics.",
        specs: { rings: "NightForce XTRM 34mm Medium", tube: "34mm" },
        image: {
          url: placeholderImage("rings", "mount-rings.jpg"),
          alt: "NightForce 34mm scope rings",
        },
      },
      {
        id: "spuhr-30mm-cant",
        label: "Spuhr 30mm Cantilever Mount",
        description: "One-piece cantilever mount for 20 MOA rails and long scopes.",
        specs: { rings: "Spuhr 30mm Cantilever", tube: "30mm" },
        image: {
          url: placeholderImage("rings", "mount-rings.jpg"),
          alt: "Spuhr cantilever scope mount",
        },
      },
      {
        id: "rings-none",
        label: "No rings — mount supplied separately",
        description: "Customer provides mount or rings; rail prepared only.",
        specs: { rings: "None" },
      },
    ],
  },
  {
    id: "muzzleBrake",
    title: "Muzzle Brake",
    subtitle: "Threaded and timed — recoil management for long-range follow-up",
    options: [
      {
        id: "apa-little-bighorn",
        label: "APA Little Bighorn",
        description: "Self-timing brake tuned for hunting calibers and carbon barrels.",
        specs: { muzzleBrake: "APA Little Bighorn" },
        image: {
          url: placeholderImage("muzzle-brakes", "muzzle-brake.jpg"),
          alt: "APA Little Bighorn muzzle brake",
        },
      },
      {
        id: "badger-fte",
        label: "Badger Ordnance FTE",
        description: "Compact 3-port brake with minimal blast signature.",
        specs: { muzzleBrake: "Badger Ordnance FTE" },
        image: {
          url: placeholderImage("muzzle-brakes", "muzzle-brake.jpg"),
          alt: "Badger Ordnance FTE muzzle brake",
        },
      },
      {
        id: "benchmark-brake",
        label: "Benchmark Barrel Muzzle Brake",
        description: "Precision-machined brake matched to barrel contour.",
        specs: { muzzleBrake: "Benchmark Barrel Muzzle Brake" },
        image: {
          url: placeholderImage("muzzle-brakes", "muzzle-brake.jpg"),
          alt: "Benchmark Barrel muzzle brake",
        },
      },
      {
        id: "muzzle-none",
        label: "None — thread protector only",
        description: "5/8×24 or M18×1 thread with flush protector. No brake.",
        specs: { muzzleBrake: "Thread protector only" },
      },
    ],
  },
  {
    id: "suppressor",
    title: "Suppressor",
    subtitle: "NFA items — we coordinate transfer and pin-and-weld if required",
    options: [
      {
        id: "silencerco-omega-300",
        label: "SilencerCo Omega 300",
        description: "Modular .30 cal suppressor for hunting and range use.",
        specs: { suppressor: "SilencerCo Omega 300", caliber: ".30 cal" },
        image: {
          url: placeholderImage("suppressors", "suppressor.jpg"),
          alt: "SilencerCo Omega 300 suppressor",
        },
      },
      {
        id: "dead-air-sandman-s",
        label: "Dead Air Sandman-S",
        description: "Durable rifle suppressor with Stellite baffles.",
        specs: { suppressor: "Dead Air Sandman-S", caliber: ".30 cal" },
        image: {
          url: placeholderImage("suppressors", "suppressor.jpg"),
          alt: "Dead Air Sandman-S suppressor",
        },
      },
      {
        id: "tb-ultra-7",
        label: "Thunder Beast Ultra 7",
        description: "Precision suppressor favored for long-range hunting builds.",
        specs: { suppressor: "Thunder Beast Ultra 7", caliber: ".30 cal" },
        image: {
          url: placeholderImage("suppressors", "suppressor.jpg"),
          alt: "Thunder Beast Ultra 7 suppressor",
        },
      },
      {
        id: "suppressor-none",
        label: "None",
        description: "No suppressor. Muzzle device or thread protector only.",
        specs: { suppressor: "None" },
      },
    ],
  },
  {
    id: "rifleCase",
    title: "Case",
    subtitle: "Ship and travel protection — cut foam to your rifle profile",
    options: [
      {
        id: "pelican-1750",
        label: "Pelican 1750 Long Case",
        description: "Full-length hard case with custom foam for scoped rifle.",
        specs: { rifleCase: "Pelican 1750" },
        image: {
          url: placeholderImage("cases", "rifle-case.webp"),
          alt: "Pelican 1750 rifle case",
        },
      },
      {
        id: "pelican-1700",
        label: "Pelican 1700",
        description: "Mid-length hard case for shorter barrels and compact scopes.",
        specs: { rifleCase: "Pelican 1700" },
        image: {
          url: placeholderImage("cases", "rifle-case.webp"),
          alt: "Pelican 1700 rifle case",
        },
      },
      {
        id: "badger-field-pack",
        label: "Badger Field Pack — Soft Case",
        description: "Padded soft case for vehicle transport and backcountry travel.",
        specs: { rifleCase: "Badger Field Pack (soft)" },
        image: {
          url: placeholderImage("cases", "rifle-case.webp"),
          alt: "Badger field pack soft rifle case",
        },
      },
      {
        id: "case-none",
        label: "No case",
        description: "Rifle ships in protective wrap only.",
        specs: { rifleCase: "None" },
      },
    ],
  },
];

export const stepKeys = [
  "platform",
  "caliber",
  "barrel",
  "stock",
  "stockPaint",
  "trigger",
  "finish",
  "scope",
  "rings",
  "muzzleBrake",
  "suppressor",
  "rifleCase",
] as const;

export type StepKey = (typeof stepKeys)[number];
