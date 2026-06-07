import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "_assets", "source data");
const outDir = join(root, "src", "data", "generated");
const copyPath = join(sourceDir, "BADWRX_Website_Copy_7.docx");
const pricingPath = join(sourceDir, "Pricing_List_BADWRX_Final_43.xlsx");

function slugify(value) {
  return String(value)
    .replace(/^BADWRX\s+/i, "")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function parseMoney(value) {
  if (value == null || value === "") return null;
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  return Math.round(parseFloat(cleaned) * 100);
}

function sheetRows(workbook, name) {
  const sheet = workbook.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
}

function extractDocxParagraphs() {
  if (!existsSync(copyPath)) return [];
  const pyScript = join(dirname(fileURLToPath(import.meta.url)), "extract-docx.py");
  try {
    const out = execSync(`python3 ${JSON.stringify(pyScript)} ${JSON.stringify(copyPath)}`, {
      encoding: "utf8",
    });
    return JSON.parse(out.trim());
  } catch {
    return [];
  }
}

function buildCopyFromDocx(paras) {
  const findAfter = (label) => {
    const idx = paras.findIndex((p) => p.trim() === label);
    return idx >= 0 ? (paras[idx + 1] ?? "") : "";
  };
  const findLine = (prefix) => paras.find((p) => p.startsWith(prefix)) ?? "";

  return {
    homeHero: {
      headline: findAfter("HERO — MAIN HEADLINE") || "Engineered Without Compromise.",
      subheadline:
        findAfter("HERO — SUB HEADLINE") ||
        "Ultralight precision rifles built for hard country and long shots.",
      cta: findAfter("HERO — CTA BUTTON") || "View Our Rifles",
    },
    brandStatement: findAfter("BRAND STATEMENT"),
    pillars: {
      weight: findLine("WEIGHT —"),
      accuracy: findLine("ACCURACY —"),
      durability: findLine("DURABILITY —"),
    },
    buildsPage: {
      headline: findAfter("PAGE HEADLINE") || "Six Platforms. One Standard.",
      subcopy: findAfter("PAGE SUB COPY"),
    },
    customQuoteCta: findAfter("CUSTOM QUOTE CTA"),
    packageCta: findAfter("PACKAGE CTA"),
  };
}

function parseWebsiteData(rows) {
  const rifles = [];
  const rifleSpecs = {};
  const stockColors = [];
  const optics = [];
  const caliberMatrix = [];
  const copyBlocks = {};
  let section = "";
  let currentSpecSlug = null;

  for (const row of rows) {
    const a = String(row[0] ?? "").trim();
    const b = String(row[1] ?? "").trim();

    if (a.startsWith("SECTION")) {
      section = a;
      currentSpecSlug = null;
      continue;
    }

    if (a && b && section.includes("SECTION 7")) {
      copyBlocks[a] = b;
    }

    if (section.includes("SECTION 1")) {
      if (a === "Rifle Model") continue;
      if (a.startsWith("BADWRX ")) {
        const slug = slugify(a.replace(/^BADWRX\s+/, ""));
        rifles.push({
          id: slug,
          slug,
          title: a.startsWith("BADWRX") ? a : `BADWRX ${a}`,
          shortName: a.replace(/^BADWRX\s+/, ""),
          tagline: b,
          action: String(row[2] ?? ""),
          barrel: String(row[3] ?? ""),
          platform: String(row[4] ?? ""),
          caliberFamily: String(row[5] ?? ""),
          primaryUse: String(row[6] ?? ""),
          pageSlug: String(row[7] ?? slug).replace(/^\//, ""),
          notes: String(row[8] ?? ""),
        });
      }
      continue;
    }

    if (section.includes("SECTION 2")) {
      const headerMatch = a.match(/^BADWRX\s+(.+?)\s+—\s+(.+)$/);
      if (headerMatch) {
        currentSpecSlug = slugify(headerMatch[1]);
        rifleSpecs[currentSpecSlug] = {
          tagline: headerMatch[2],
          specs: {},
          calibers: "",
        };
        continue;
      }
      if (!currentSpecSlug || !rifleSpecs[currentSpecSlug]) continue;
      if (a.startsWith("Available Calibers:")) {
        rifleSpecs[currentSpecSlug].calibers = a.replace("Available Calibers:", "").trim();
        continue;
      }
      if (a === "Component" || a === "Specification" || a === "Notes") continue;
      if (b) {
        rifleSpecs[currentSpecSlug].specs[a.toLowerCase().replace(/\s+/g, "_")] = b;
        if (row[2]) {
          rifleSpecs[currentSpecSlug].specs[`${a.toLowerCase().replace(/\s+/g, "_")}_notes`] =
            String(row[2]);
        }
      }
      continue;
    }

    if (section.includes("SECTION 3")) {
      if (
        a === "Color Code" ||
        a.startsWith("Color Availability") ||
        a === "Color" ||
        a.startsWith("BMCV —") ||
        a.startsWith("Option ")
      ) {
        if (a.startsWith("BMCV —") || (a.startsWith("Option ") && b === "✔")) {
          continue;
        }
      }
      if (a === "Color Code" || a.startsWith("Color Availability")) continue;
      if (a === "Color" && b === "Specter") continue;
      if (row[1] && (a.startsWith("Option") || a.startsWith("BMCV"))) {
        stockColors.push({
          id: slugify(b),
          code: a,
          label: b,
          description: String(row[2] ?? ""),
          bestFor: String(row[3] ?? ""),
        });
      }
      continue;
    }

    if (section.includes("SECTION 4")) {
      if (a === "Brand" && b === "Model") continue;
      if (a.startsWith("NX") && !b) continue;
      if (a === "Nightforce" && b) {
        optics.push({
          id: slugify(`${b}-${row[2]}-${row[4]}`),
          brand: a,
          model: b,
          magnification: String(row[2] ?? ""),
          focalPlane: String(row[3] ?? ""),
          reticle: String(row[4] ?? ""),
          tube: String(row[5] ?? ""),
          msrp: String(row[6] ?? ""),
          msrpCents: parseMoney(row[6]),
          notes: String(row[8] ?? ""),
        });
      }
      continue;
    }

    if (section.includes("SECTION 5")) {
      if (a === "Caliber") continue;
      if (a && row.length > 6) {
        caliberMatrix.push({
          caliber: a,
          id: slugify(a),
          platforms: {
            specter: row[1] === "✔",
            reaper: row[2] === "✔",
            imperium: row[3] === "✔",
            invictus: row[4] === "✔",
            sentinel: row[5] === "✔",
            goat: row[6] === "✔",
          },
          notes: String(row[7] ?? ""),
        });
      }
    }
  }

  for (const rifle of rifles) {
    const spec = rifleSpecs[rifle.slug];
    if (spec?.description) continue;
    const key = `BADWRX ${rifle.shortName}`;
    if (copyBlocks[key]) rifleSpecs[rifle.slug] = { ...spec, description: copyBlocks[key] };
  }

  return { rifles, rifleSpecs, stockColors, optics, caliberMatrix, copyBlocks };
}

function parseRetailPrices(rows) {
  const prices = {};
  for (const row of rows) {
    const a = String(row[0] ?? "").trim();
    const retail = parseMoney(row[1]);
    if (retail != null && a && !a.startsWith("↳")) {
      prices[a] = retail;
    }
  }
  return prices;
}

function main() {
  if (!existsSync(pricingPath)) {
    console.warn("Skipping source data sync: pricing workbook not found");
    return;
  }

  mkdirSync(outDir, { recursive: true });

  const workbook = XLSX.readFile(pricingPath);
  const websiteRows = sheetRows(workbook, "WEBSITE DATA");
  const priceRows = sheetRows(workbook, "MASTER DEALER PRICE LIST");

  const website = parseWebsiteData(websiteRows);
  const retailPrices = parseRetailPrices(priceRows);
  const docxCopy = buildCopyFromDocx(extractDocxParagraphs());

  const pricing = {
    baseBuildCents: 850_00,
    optionPriceCents: {
      "triggertech-special":
        retailPrices["Rem 700 Special (Single-Stage)"] ?? 229_99,
      "hawkins-ult-rings": 196_00,
      "srs-ti-pro-2": retailPrices['SRS "TI PRO 2" Muzzle Brake'] ?? 160_00,
      "srs-the-chub": retailPrices['SRS "The Chub" Muzzle Brake'] ?? 185_00,
      "srs-cb-banish-brake":
        retailPrices["SRS CB Banish Suppressor Brake"] ?? 155_00,
      "pelican-v800": retailPrices["Pelican V800"] ?? 425_00,
      "basecamp-package": 1_250_00,
      "ballistic-package": 2_500_00,
      "scope-none": 0,
      "rings-none": 0,
      "muzzle-none": 0,
      "suppressor-none": 0,
      "case-none": 0,
    },
  };

  for (const optic of website.optics) {
    if (optic.msrpCents) pricing.optionPriceCents[optic.id] = optic.msrpCents;
  }

  for (const color of website.stockColors) {
    pricing.optionPriceCents[color.id] =
      color.id === "custom" ? 450_00 : color.id.includes("bmcv") ? 0 : 175_00;
  }

  const platformBase = {
    specter: 8_500_00,
    reaper: 9_200_00,
    imperium: 8_800_00,
    invictus: 7_500_00,
    sentinel: 9_800_00,
    goat: 10_500_00,
  };
  for (const rifle of website.rifles) {
    pricing.optionPriceCents[rifle.slug] = platformBase[rifle.slug] ?? 8_000_00;
  }

  for (const cal of website.caliberMatrix) {
    pricing.optionPriceCents[cal.id] = cal.caliber.includes("375")
      ? 350_00
      : cal.caliber.includes("7mm Backcountry")
        ? 200_00
        : cal.caliber.includes("Other")
          ? 0
          : 0;
  }

  const payload = {
    meta: {
      syncedAt: new Date().toISOString(),
      sources: ["Pricing_List_BADWRX_Final_43.xlsx", "BADWRX_Website_Copy_7.docx"],
      checksum: createHash("sha256")
        .update(readFileSync(pricingPath))
        .digest("hex")
        .slice(0, 12),
    },
    docxCopy,
    website,
    retailPrices,
    pricing,
  };

  writeFileSync(join(outDir, "source-data.json"), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `Synced source-data.json — ${website.rifles.length} rifles, ${website.optics.length} optics, ${website.stockColors.length} colors`,
  );
}

main();
