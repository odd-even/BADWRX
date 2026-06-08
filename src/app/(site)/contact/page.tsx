import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import type { ContactInquiryMode } from "@/components/contact/ContactForm";
import { getAllCourses, getAllMerch, getBrandContent } from "@/lib/content";
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
  const [courses, brand, merch] = await Promise.all([
    getAllCourses(),
    getBrandContent(),
    getAllMerch(),
  ]);
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
      merchItems={merch.map((item) => ({ slug: item.slug, title: item.title }))}
      initialMode={initialMode}
      initialCourseSlug={courseSlug}
      initialMerchSlug={merchSlug}
    />
  );
}
