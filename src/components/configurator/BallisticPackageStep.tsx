"use client";

import Image from "next/image";
import type { ConfigOption } from "@/lib/types";
import type { ConfiguratorPricing, PackageDetails } from "@/lib/configurator/types";
import { images } from "@/lib/images";
import { formatPriceDelta, getOptionPrice } from "@/lib/pricing";

interface BallisticPackageStepProps {
  details: PackageDetails;
  pricing: ConfiguratorPricing;
  packageOption: ConfigOption;
  noneOption: ConfigOption;
  selectedId: string | undefined;
  onSelect: (option: ConfigOption) => void;
}

function splitItem(item: string): { title: string; detail: string } {
  const [title, ...rest] = item.split(" — ");
  return { title: title.trim(), detail: rest.join(" — ").trim() };
}

export function BallisticPackageStep({
  details,
  pricing,
  packageOption,
  noneOption,
  selectedId,
  onSelect,
}: BallisticPackageStepProps) {
  const deliverables = details.items.map(splitItem);
  const priceLabel = formatPriceDelta(
    getOptionPrice(packageOption.id, pricing),
    "ballisticPackage",
  );
  const packageSelected = selectedId === packageOption.id;
  const noneSelected = selectedId === noneOption.id;

  return (
    <div className="mt-8 space-y-6">
      <div className="group overflow-hidden border border-white/10 bg-black-muted">
        <div className="relative aspect-[16/9] w-full bg-black-light">
          <div className="hover-zoom absolute inset-0">
            <Image
              src={images.rifle.studioCropped}
              alt={packageOption.image?.alt ?? details.label}
              fill
              className="object-cover object-[center_26%]"
              sizes="(max-width: 1024px) 100vw, 640px"
            />
          </div>
          <div
            className="absolute top-[16%] left-[68%] aspect-square w-[50%] min-w-[50%] -translate-x-1/2 -translate-y-1/2 opacity-50 mix-blend-screen"
            aria-hidden
          >
            <Image
              src={images.rifle.reticleOverlay}
              alt=""
              fill
              className="object-contain"
              sizes="320px"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent h-[min(42vh,300px)] sm:h-[min(48vh,340px)]"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-red">
              {details.label}
            </p>
            <h3 className="mt-1 text-3xl text-white sm:text-4xl">
              {details.headline}
            </h3>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-white-muted">
            {details.description}
          </p>

          {details.howItWorks && (
            <p className="mt-6 text-sm leading-relaxed text-white-muted">
              {details.howItWorks}
            </p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((item, index) => (
              <div
                key={item.title}
                className="flex h-full flex-col border border-white/10 bg-black-light p-5"
              >
                <span className="text-xs font-semibold text-red">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 font-medium leading-snug text-white">
                  {item.title}
                </p>
                {item.detail && (
                  <p className="mt-2 text-sm leading-relaxed text-white-muted">
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs uppercase tracking-widest text-white-muted/70">
            Not an app. Your rifle, your data, your turrets.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onSelect(packageOption)}
          className={`radius-ui flex w-full items-center justify-between gap-4 border p-5 text-left transition ${
            packageSelected
              ? "red-tint-panel border-red"
              : "border-white/10 bg-black-muted hover:border-white/30"
          }`}
        >
          <div>
            <p className="font-medium text-white">
              Add the {details.label}
            </p>
            {priceLabel && (
              <p className="mt-1 text-xs uppercase tracking-widest text-red">
                {priceLabel}
              </p>
            )}
          </div>
          <span
            className={`mt-1 h-4 w-4 shrink-0 border ${
              packageSelected ? "border-red bg-red" : "border-white/30"
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() => onSelect(noneOption)}
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
    </div>
  );
}
