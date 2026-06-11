"use client";

import Image from "next/image";
import type { ConfigOption } from "@/lib/types";
import type { ConfiguratorPricing, PackageDetails } from "@/lib/configurator/types";
import { splitBasecampItem } from "@/lib/configurator/basecamp-items";
import { formatPriceDelta, getOptionPrice } from "@/lib/pricing";

interface BasecampPackageStepProps {
  details: PackageDetails;
  pricing: ConfiguratorPricing;
  packageOption: ConfigOption;
  noneOption: ConfigOption;
  itemOptions: ConfigOption[];
  selectedIds: string[];
  noneSelected: boolean;
  onToggleItem: (option: ConfigOption) => void;
  onSelectNone: () => void;
}

export function BasecampPackageStep({
  details,
  pricing,
  packageOption,
  noneOption,
  itemOptions,
  selectedIds,
  noneSelected,
  onToggleItem,
  onSelectNone,
}: BasecampPackageStepProps) {
  const items = itemOptions.map((option, index) => {
    const parsed = splitBasecampItem(details.items[index] ?? option.label);
    return {
      option,
      title: parsed.title || option.label,
      detail: parsed.detail || option.description || "",
      priceLabel: formatPriceDelta(
        getOptionPrice(option.id, pricing),
        "basecampPackage",
      ),
    };
  });

  return (
    <div className="mt-8 space-y-6">
      <div className="group overflow-hidden border border-white/10 bg-black-muted">
        {packageOption.image && (
          <div className="relative aspect-[16/9] w-full bg-black-light hover-zoom">
            <Image
              src={packageOption.image.url}
              alt={packageOption.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 60vw, 768px"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-red">
            {details.label}
          </p>
          <h3 className="mt-1 text-2xl text-white sm:text-3xl">
            {details.headline}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-white-muted">
            {details.description}
          </p>

          <p className="mt-8 text-xs uppercase tracking-widest text-red">
            Add one or more
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {items.map((item, index) => {
              const selected = selectedIds.includes(item.option.id);
              return (
                <button
                  key={item.option.id}
                  type="button"
                  onClick={() => onToggleItem(item.option)}
                  className={`radius-ui flex h-full flex-col border p-5 text-left transition ${
                    selected
                      ? "red-tint-panel border-red"
                      : "border-white/10 bg-black-light hover:border-white/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-red">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`mt-0.5 h-4 w-4 shrink-0 border ${
                        selected ? "border-red bg-red" : "border-white/30"
                      }`}
                    />
                  </div>
                  <p className="mt-3 font-medium leading-snug text-white">
                    {item.title}
                  </p>
                  {item.detail && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white-muted">
                      {item.detail}
                    </p>
                  )}
                  {item.priceLabel && (
                    <p className="mt-4 text-xs uppercase tracking-widest text-red">
                      {item.priceLabel}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-xs uppercase tracking-widest text-white-muted/70">
            This is not a bundle. It&apos;s a system — add what you need.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelectNone}
        className={`radius-ui flex w-full items-center justify-between gap-4 border p-5 text-left transition ${
          noneSelected
            ? "red-tint-panel border-red"
            : "border-white/10 bg-black-muted hover:border-white/30"
        }`}
      >
        <div>
          <p className="font-medium text-white">{noneOption.label}</p>
          {noneOption.description && (
            <p className="mt-1 text-sm text-white-muted">
              {noneOption.description}
            </p>
          )}
        </div>
        <span
          className={`mt-1 h-4 w-4 shrink-0 border ${
            noneSelected ? "border-red bg-red" : "border-white/30"
          }`}
        />
      </button>
    </div>
  );
}
