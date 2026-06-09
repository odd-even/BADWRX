import type { ConfigOption } from "@/lib/types";

export const BASECAMP_ITEM_IDS = [
  "basecamp-case",
  "basecamp-chronograph",
  "basecamp-tools",
] as const;

export const BASECAMP_NONE_ID = "case-none";

export const BASECAMP_NONE_OPTION: ConfigOption = {
  id: BASECAMP_NONE_ID,
  label: "No Basecamp add-ons",
  description: "Rifle ships in protective wrap only.",
  specs: { basecampPackage: "None" },
};

export function splitBasecampItem(item: string): { title: string; detail: string } {
  const [title, ...rest] = item.split(" — ");
  return { title: title.trim(), detail: rest.join(" — ").trim() };
}

export function buildBasecampItemOptions(items: string[]): ConfigOption[] {
  return items.map((item, index) => {
    const { title, detail } = splitBasecampItem(item);
    const id = BASECAMP_ITEM_IDS[index] ?? `basecamp-item-${index}`;
    return {
      id,
      label: title,
      description: detail || undefined,
      specs: { basecampItem: title },
    };
  });
}

export function summarizeBasecampSelection(items: ConfigOption[]): ConfigOption {
  if (items.length === 0) return BASECAMP_NONE_OPTION;
  return {
    id: "basecamp-selected",
    label: items.map((item) => item.label).join(", "),
    specs: {
      basecampPackage: items.map((item) => item.label).join("; "),
    },
  };
}

export function isBasecampNoneOption(option: ConfigOption | null | undefined): boolean {
  return option?.id === BASECAMP_NONE_ID;
}
