import type { Metadata } from "next";
import { RifleCard } from "@/components/rifles/RifleCard";
import { getAllRifles } from "@/lib/content";
import { categoryLabels } from "@/data/rifles";
import { sourceData } from "@/lib/source-data";

export const metadata: Metadata = {
  title: "Rifle Builds",
  description: sourceData.docxCopy.buildsPage.subcopy,
};

export default async function BuildsPage() {
  const rifles = await getAllRifles();
  const categories = Object.keys(categoryLabels) as (keyof typeof categoryLabels)[];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Platforms</p>
      <h1 className="mt-2 text-5xl text-white">
        {sourceData.docxCopy.buildsPage.headline}
      </h1>
      <p className="mt-4 max-w-2xl text-white-muted">
        {sourceData.docxCopy.buildsPage.subcopy}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <span
            key={cat}
            className="border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-white-muted"
          >
            {categoryLabels[cat]}
          </span>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rifles.map((rifle) => (
          <RifleCard key={rifle.id} rifle={rifle} />
        ))}
      </div>
    </div>
  );
}
