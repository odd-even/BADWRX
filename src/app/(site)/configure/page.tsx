import type { Metadata } from "next";
import { Configurator } from "@/components/configurator/Configurator";

export const metadata: Metadata = {
  title: "Configure Your Rifle",
  description:
    "Configure a BADWRX platform, caliber, finish, optics, and packages. Submit your build for a quote.",
};

export default function ConfigurePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Build configurator</p>
      <h1 className="mt-2 text-5xl text-white">
        Configure Your Rifle
      </h1>
      <p className="mt-4 max-w-2xl text-white-muted">
        Walk through platform, caliber, finish, optics, rings, Basecamp Package,
        and Ballistic Package — matching the six BADWRX builds in our source
        spec. Muzzle device and trigger are set per platform. Submit your spec
        for a consultation — no payment required.
      </p>

      <div className="mt-12">
        <Configurator />
      </div>
    </div>
  );
}
