import { brand } from "@/lib/brand";
import { getSiteSettings } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { isSearchIndexingAllowed } from "@/lib/site-indexing";

export async function OrganizationJsonLd() {
  const settings = await getSiteSettings();
  if (!isSearchIndexingAllowed(settings)) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    alternateName: brand.short,
    url: getSiteUrl(),
    email: brand.email,
    description: brand.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Diamondhead",
      addressRegion: "MS",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
