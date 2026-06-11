"use client";

import { Suspense, useState } from "react";
import { Configurator } from "@/components/configurator/Configurator";
import { configurePageTitle } from "@/lib/configurator/constants";
import type { ConfiguratorData } from "@/lib/configurator/types";
import type { ConfigOption } from "@/lib/types";

interface ConfigurePageClientProps {
  data: ConfiguratorData;
  initialPlatformLabel?: string | null;
}

function ConfigurePageClientInner({
  data,
  initialPlatformLabel = null,
}: ConfigurePageClientProps) {
  const [platformLabel, setPlatformLabel] = useState(initialPlatformLabel);

  return (
    <>
      <p className="text-xs uppercase tracking-widest text-red">
        Customization options
      </p>
      <h1 className="mt-2 text-5xl text-white">
        {configurePageTitle(platformLabel)}
      </h1>

      <div className="mt-12" data-configurator data-no-reveal>
        <Configurator
          data={data}
          onPlatformChange={(platform: ConfigOption | null) => {
            setPlatformLabel(platform?.label ?? null);
          }}
        />
      </div>
    </>
  );
}

export function ConfigurePageClient(props: ConfigurePageClientProps) {
  return (
    <Suspense
      fallback={
        <>
          <p className="text-xs uppercase tracking-widest text-red">
            Customization options
          </p>
          <h1 className="mt-2 text-5xl text-white">
            {configurePageTitle(props.initialPlatformLabel)}
          </h1>
          <p className="mt-12 text-sm text-white-muted">Loading configurator…</p>
        </>
      }
    >
      <ConfigurePageClientInner {...props} />
    </Suspense>
  );
}
