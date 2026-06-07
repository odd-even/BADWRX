import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { getCourseBySlug, getBrandContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a consultation or ask questions about a custom rifle build.",
};

interface ContactPageProps {
  searchParams: Promise<{ course?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { course: courseSlug } = await searchParams;
  const [course, brand] = await Promise.all([
    courseSlug ? getCourseBySlug(courseSlug) : Promise.resolve(undefined),
    getBrandContent(),
  ]);
  const isRegistration = Boolean(course);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-red">Get in touch</p>
          <h1 className="mt-2 text-5xl text-white">
            {isRegistration ? "Register for class" : "Request a consultation"}
          </h1>
          <p className="mt-6 text-white-muted leading-relaxed">
            {isRegistration
              ? "Complete the form and our team will follow up with availability, class details, and next steps. No payment required to register your interest."
              : "Have questions about chambering, component selection, or lead times? Every build uses parts chosen by the builder to precision standards — Proof Research barrels and NightForce optics. Send a message — we respond within 2 business days."}
          </p>

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
              <p className="text-xs uppercase tracking-widest text-red">Phone</p>
              <p className="mt-2 text-white">(307) 555-0142</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-red">Shop</p>
              <p className="mt-2 text-white-muted">
                Jackson, Wyoming
                <br />
                By appointment only
              </p>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-black-muted p-8">
          <ContactForm
            courseTitle={course?.title}
            submitLabel={isRegistration ? "Register Now" : "Send Message"}
          />
        </div>
      </div>
    </div>
  );
}
