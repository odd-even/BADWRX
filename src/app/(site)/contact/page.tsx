import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import type { ContactInquiryMode } from "@/components/contact/ContactForm";
import { getAllMerch, getBrandContent } from "@/lib/content";
import { brand as siteBrand } from "@/lib/brand";
import { cleanDocxCopy } from "@/lib/copy-utils";
import { buildPageMetadata } from "@/lib/page-seo";
import { sourceData } from "@/lib/source-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "contact",
    title: "Contact",
    canonical: "/contact",
  });
}

interface ContactPageProps {
  searchParams: Promise<{ course?: string; merch?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { course: courseSlug, merch: merchSlug } = await searchParams;

  if (courseSlug) {
    redirect("/university?register=1");
  }

  const [brand, merch] = await Promise.all([getBrandContent(), getAllMerch()]);
  const contactCopy = sourceData.docxCopy.contactPage;

  let initialMode: ContactInquiryMode = "platform";
  if (merchSlug) initialMode = "merch";

  return (
    <ContactPageContent
      brandEmail={brand.email}
      location={siteBrand.location}
      contactCopy={{
        headline: contactCopy.headline,
        intro: cleanDocxCopy(contactCopy.intro),
        expectations: cleanDocxCopy(contactCopy.expectations),
      }}
      buildFields={sourceData.contactFormFields}
      merchItems={merch.map((item) => ({ slug: item.slug, title: item.title }))}
      initialMode={initialMode}
      initialMerchSlug={merchSlug}
    />
  );
}
