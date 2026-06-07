import type { Metadata } from "next";
import { BuildsGallery } from "@/components/rifles/BuildsGallery";
import { getAllRifles } from "@/lib/content";
import { sourceData } from "@/lib/source-data";

export const metadata: Metadata = {
  title: "Rifle Builds",
  description: sourceData.docxCopy.buildsPage.subcopy,
};

export default async function BuildsPage() {
  const rifles = await getAllRifles();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Platforms</p>
      <h1 className="mt-2 text-5xl text-white">
        {sourceData.docxCopy.buildsPage.headline}
      </h1>
      <p className="mt-4 max-w-2xl text-white-muted">
        {sourceData.docxCopy.buildsPage.subcopy}
      </p>

      <BuildsGallery rifles={rifles} />
    </div>
  );
}
