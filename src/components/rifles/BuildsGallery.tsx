"use client";

import { useMemo, useState } from "react";
import { RifleCard } from "@/components/rifles/RifleCard";
import { categoryLabels } from "@/lib/rifle-labels";
import type { Rifle, RifleCategory } from "@/lib/types";

type FilterKey = RifleCategory | "all";

interface BuildsGalleryProps {
  rifles: Rifle[];
  showConfigure?: boolean;
}

const filters: { id: FilterKey; label: string }[] = [
  { id: "all", label: "All platforms" },
  ...(
    Object.entries(categoryLabels) as [RifleCategory, string][]
  ).map(([id, label]) => ({ id, label })),
];

export function BuildsGallery({
  rifles,
  showConfigure = true,
}: BuildsGalleryProps) {
  const [active, setActive] = useState<FilterKey>("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? rifles
        : rifles.filter((rifle) => rifle.category === active),
    [active, rifles],
  );

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        {filters.map((filter) => {
          const selected = active === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActive(filter.id)}
              className={`border px-4 py-2 text-xs uppercase tracking-widest transition ${
                selected
                  ? "border-red bg-red/10 text-white"
                  : "border-white/10 text-white-muted hover:border-white/30 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((rifle) => (
          <RifleCard
            key={rifle.id}
            rifle={rifle}
            showConfigure={showConfigure}
            titleAs="h2"
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-sm text-white-muted">
          No platforms in this category yet.
        </p>
      )}
    </>
  );
}
