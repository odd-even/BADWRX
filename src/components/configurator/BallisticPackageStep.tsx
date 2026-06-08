"use client";

import Image from "next/image";
import type { ConfigOption } from "@/lib/types";
import { images } from "@/lib/images";
import { sourceData } from "@/lib/source-data";
import { formatPriceDelta, getOptionPrice } from "@/lib/pricing";

interface BallisticPackageStepProps {
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
  packageOption,
  noneOption,
  selectedId,
  onSelect,
}: BallisticPackageStepProps) {
  const ballistic = sourceData.configurator.ballistic;
  const deliverables = ballistic.deliverables.map(splitItem);
  const priceLabel = formatPriceDelta(
    getOptionPrice(packageOption.id),
    "ballisticPackage",
  );
  const packageSelected = selectedId === packageOption.id;
  const noneSelected = selectedId === noneOption.id;

  return (
    <div className="mt-8 space-y-6">
      <div className="overflow-hidden border border-white/10 bg-black-muted">
        <div className="relative aspect-[16/9] w-full bg-black-light">
          <Image
            src={images.rifle.studioCropped}
            alt={packageOption.image?.alt ?? ballistic.label}
            fill
            className="object-cover object-[center_26%]"
            sizes="(max-width: 1024px) 100vw, 640px"
          />
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 from-0% to-transparent to-[30%]" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-red">
              {ballistic.label}
            </p>
            <h3 className="mt-1 text-3xl text-white sm:text-4xl">
              {ballistic.headline}
            </h3>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-white-muted">
            {ballistic.description}
          </p>

          {ballistic.howItWorks && (
            <p className="mt-6 text-sm leading-relaxed text-white-muted">
              {ballistic.howItWorks}
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
          className={`flex w-full items-center justify-between gap-4 border p-5 text-left transition ${
            packageSelected
              ? "border-red bg-red/5"
              : "border-white/10 bg-black-muted hover:border-white/30"
          }`}
        >
          <div>
            <p className="font-medium text-white">
              Add the {ballistic.label}
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
          className={`flex w-full items-center justify-between gap-4 border p-5 text-left transition ${
            noneSelected
              ? "border-red bg-red/5"
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
