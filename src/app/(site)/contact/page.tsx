import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { getCourseBySlug, getBrandContent } from "@/lib/content";
import { getMerchBySlug } from "@/data/merch";
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
  const [course, merch, brand] = await Promise.all([
    courseSlug ? getCourseBySlug(courseSlug) : Promise.resolve(undefined),
    merchSlug ? Promise.resolve(getMerchBySlug(merchSlug)) : Promise.resolve(undefined),
    getBrandContent(),
  ]);
  const isRegistration = Boolean(course);
  const isMerchInquiry = Boolean(merch);
  const isBuildRequest = !isRegistration && !isMerchInquiry;
  const contactCopy = sourceData.docxCopy.contactPage;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-red">Get in touch</p>
          <h1 className="mt-2 text-5xl text-white">
            {isRegistration
              ? "Register for class"
              : isMerchInquiry
                ? "Merch inquiry"
                : contactCopy.headline}
          </h1>
          <p className="mt-6 text-white-muted leading-relaxed">
            {isRegistration
              ? "Complete the form and our team will follow up with availability, class details, and next steps. No payment required to register your interest."
              : isMerchInquiry
                ? "Tell us what you want — size, color, and quantity — and we'll confirm availability and shipping."
                : cleanDocxCopy(contactCopy.intro)}
          </p>
          {isBuildRequest && (
            <p className="mt-6 text-sm text-white-muted/80 leading-relaxed">
              {cleanDocxCopy(contactCopy.expectations)}
            </p>
          )}

          <div className="mt-10 space-y-6 border-t border-white/10 pt-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-red">Email</p>
              <a
                href={`mailto:${brand.email}`}
                className="mt-2 block text-white transition hover:text-red"
              >
                {brand.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-red">Shop</p>
              <p className="mt-2 text-white-muted">
                {siteBrand.location}
                <br />
                By appointment only
              </p>
            </div>
            <p className="text-sm text-white-muted/80 leading-relaxed">
              Not a retail dealer. Every BADWRX rifle is built to order by
              consultation and quote only.
            </p>
          </div>
        </div>

        <div className="border border-white/10 bg-black-muted p-8">
          <ContactForm
            courseTitle={course?.title}
            merchTitle={merch?.title}
            buildFields={isBuildRequest ? sourceData.contactFormFields : undefined}
            submitLabel={
              isRegistration ? "Register Now" : isMerchInquiry ? "Send Inquiry" : "Send Message"
            }
          />
        </div>
      </div>
    </div>
  );
}
