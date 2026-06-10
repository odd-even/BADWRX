import { brand } from "@/lib/brand";
import { getSiteUrl, isSitePublic } from "@/lib/site";

export function OrganizationJsonLd() {
  if (!isSitePublic()) return null;

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
