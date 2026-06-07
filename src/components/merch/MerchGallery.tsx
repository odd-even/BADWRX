"use client";

import { useMemo, useState } from "react";
import { merchCategoryLabels } from "@/data/merch";
import { MerchCard } from "@/components/merch/MerchCartUI";
import type { MerchCategory, MerchItem } from "@/lib/types";

type FilterKey = MerchCategory | "all";

interface MerchGalleryProps {
  items: MerchItem[];
}

const filters: { id: FilterKey; label: string }[] = [
  { id: "all", label: "All" },
  ...(
    Object.entries(merchCategoryLabels) as [MerchCategory, string][]
  ).map(([id, label]) => ({ id, label })),
];

export function MerchGallery({ items }: MerchGalleryProps) {
  const [active, setActive] = useState<FilterKey>("all");

  const visible = useMemo(
    () =>
      active === "all" ? items : items.filter((item) => item.category === active),
    [active, items],
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

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <MerchCard key={item.id} item={item} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-sm text-white-muted">
          No items in this category yet.
        </p>
      )}
    </>
  );
}
