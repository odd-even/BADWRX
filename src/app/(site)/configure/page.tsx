import type { Metadata } from "next";
import { Suspense } from "react";
import { Configurator } from "@/components/configurator/Configurator";
import { getConfiguratorData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Configure Your Rifle",
  description:
    "Configure a BADWRX platform, caliber, finish, optics, and packages. Submit your build for a quote.",
};

export default async function ConfigurePage() {
  const configuratorData = await getConfiguratorData();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Customization options</p>
      <h1 className="mt-2 text-5xl text-white">
        Configure Your Rifle
      </h1>

      <div className="mt-12">
        <Suspense
          fallback={
            <p className="text-sm text-white-muted">Loading configurator…</p>
          }
        >
          <Configurator data={configuratorData} />
        </Suspense>
      </div>
    </div>
  );
}
