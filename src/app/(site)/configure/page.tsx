import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getConfiguratorData } from "@/lib/content";

const Configurator = dynamic(
  () =>
    import("@/components/configurator/Configurator").then((mod) => ({
      default: mod.Configurator,
    })),
  {
    loading: () => (
      <p className="text-sm text-white-muted">Loading configurator…</p>
    ),
  },
);

export const metadata: Metadata = {
  title: "Configure Your Rifle",
  description:
    "Configure a BADWRX platform, caliber, finish, optics, and packages. Submit your build for a quote.",
  alternates: { canonical: "/configure" },
};

export default async function ConfigurePage() {
  const configuratorData = await getConfiguratorData();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Customization options</p>
      <h1 className="mt-2 text-5xl text-white">
        Configure Your Rifle
      </h1>

      <div className="mt-12" data-configurator data-no-reveal>
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
