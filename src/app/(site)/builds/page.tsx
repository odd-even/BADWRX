import type { Metadata } from "next";
import { BuildsGallery } from "@/components/rifles/BuildsGallery";
import { getAllRifles, getSiteSettings } from "@/lib/content";
import { isPageEnabled } from "@/lib/pages";
import { sourceData } from "@/lib/source-data";

export const metadata: Metadata = {
  title: "Rifle Builds",
  description: sourceData.docxCopy.buildsPage.subcopy,
};

export default async function BuildsPage() {
  const [rifles, site] = await Promise.all([
    getAllRifles(),
    getSiteSettings(),
  ]);
  const showConfigure = isPageEnabled("configure", site.pageVisibility);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Platforms</p>
      <h1 className="mt-2 text-5xl text-white">
        {sourceData.docxCopy.buildsPage.headline}
      </h1>
      <p className="mt-4 max-w-2xl text-white-muted">
        {sourceData.docxCopy.buildsPage.subcopy}
      </p>

      <BuildsGallery rifles={rifles} showConfigure={showConfigure} />
    </div>
  );
}
