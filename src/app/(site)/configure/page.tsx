import type { Metadata } from "next";
import { ConfigurePageClient } from "@/components/configurator/ConfigurePageClient";
import { configurePageTitle } from "@/lib/configurator/constants";
import { getConfiguratorData } from "@/lib/content";
import { buildPageMetadata } from "@/lib/page-seo";

interface ConfigurePageProps {
  searchParams: Promise<{ platform?: string }>;
}

export async function generateMetadata({
  searchParams,
}: ConfigurePageProps): Promise<Metadata> {
  const { platform: platformSlug } = await searchParams;
  const configuratorData = await getConfiguratorData();
  const platformOption = configuratorData.steps[0]?.options.find(
    (option) => option.id === platformSlug,
  );
  const title = configurePageTitle(platformOption?.label);

  const metadata = await buildPageMetadata({
    page: "configure",
    title,
    canonical: "/configure",
  });

  return metadata;
}

export default async function ConfigurePage({ searchParams }: ConfigurePageProps) {
  const { platform: platformSlug } = await searchParams;
  const configuratorData = await getConfiguratorData();
  const platformOption = configuratorData.steps[0]?.options.find(
    (option) => option.id === platformSlug,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <ConfigurePageClient
        data={configuratorData}
        initialPlatformLabel={platformOption?.label ?? null}
      />
    </div>
  );
}
