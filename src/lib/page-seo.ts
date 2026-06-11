import type { Metadata } from "next";
import { defaultPageSeo } from "@/data/page-seo";
import { getSiteSettings } from "@/lib/content";
import type { PageSeoBlurbs, PageSeoKey, SiteSettings } from "@/lib/types";

export function getPageSeoDescription(
  settings: Pick<SiteSettings, "pageSeo"> | null | undefined,
  page: PageSeoKey,
): string {
  const fromCms = settings?.pageSeo?.[page]?.trim();
  return fromCms || defaultPageSeo[page];
}

export async function buildPageMetadata({
  page,
  title,
  canonical,
}: {
  page: PageSeoKey;
  title: string;
  canonical: string;
}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description = getPageSeoDescription(settings, page);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export function mergePageSeo(
  partial?: Partial<PageSeoBlurbs> | null,
): PageSeoBlurbs {
  return {
    home: partial?.home?.trim() || defaultPageSeo.home,
    about: partial?.about?.trim() || defaultPageSeo.about,
    builds: partial?.builds?.trim() || defaultPageSeo.builds,
    configure: partial?.configure?.trim() || defaultPageSeo.configure,
    contact: partial?.contact?.trim() || defaultPageSeo.contact,
    merch: partial?.merch?.trim() || defaultPageSeo.merch,
    university: partial?.university?.trim() || defaultPageSeo.university,
  };
}
