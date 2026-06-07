import type { Metadata } from "next";
import { Configurator } from "@/components/configurator/Configurator";

export const metadata: Metadata = {
  title: "Configure Your Rifle",
  description:
    "Step through platform, caliber, barrel, stock, trigger, and finish options. Submit your build for a consultation.",
};

export default function ConfigurePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Build configurator</p>
      <h1 className="mt-2 text-5xl text-white">
        Configure Your Rifle
      </h1>
      <p className="mt-4 max-w-2xl text-white-muted">
        Walk through platform, caliber, barrel, stock, trigger, and finish.
        Every rifle is hand test-fired before it leaves the shop and delivered
        with a ballistics table and rifle-specific ammunition recommendation.
        Submit your spec for a consultation — no payment required.
      </p>

      <div className="mt-12">
        <Configurator />
      </div>
    </div>
  );
}
