import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import type { ContactInquiryMode } from "@/components/contact/ContactForm";
import { getAllCourses, getBrandContent } from "@/lib/content";
import { merchItems } from "@/data/merch";
import { brand as siteBrand } from "@/lib/brand";
import { cleanDocxCopy } from "@/lib/copy-utils";
import { sourceData } from "@/lib/source-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a consultation or ask questions about a custom rifle build.",
};

interface ContactPageProps {
  searchParams: Promise<{ course?: string; merch?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { course: courseSlug, merch: merchSlug } = await searchParams;
  const [courses, brand] = await Promise.all([getAllCourses(), getBrandContent()]);
  const contactCopy = sourceData.docxCopy.contactPage;

  let initialMode: ContactInquiryMode = "platform";
  if (courseSlug) initialMode = "university";
  else if (merchSlug) initialMode = "merch";

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
      courses={courses.map((course) => ({ slug: course.slug, title: course.title }))}
      merchItems={merchItems.map((item) => ({ slug: item.slug, title: item.title }))}
      initialMode={initialMode}
      initialCourseSlug={courseSlug}
      initialMerchSlug={merchSlug}
    />
  );
}
