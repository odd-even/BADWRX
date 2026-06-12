"use client";

import Link from "next/link";
import { useState } from "react";
import { ContactForm, type ContactField, type ContactInquiryMode } from "@/components/contact/ContactForm";

const modeCopy: Record<
  Exclude<ContactInquiryMode, "platform">,
  { headline: string; intro: string }
> = {
  merch: {
    headline: "Merch inquiry",
    intro:
      "Tell us what you want — size, color, and quantity — and we'll confirm availability and shipping.",
  },
  university: {
    headline: "University inquiry",
    intro:
      "Questions about Long Range University — class format, dates, prerequisites, or whether a course is right for you? Send a note and we'll reply within 2 business days.",
  },
};

const toggleOptions: { id: ContactInquiryMode; label: string }[] = [
  { id: "platform", label: "Platform" },
  { id: "merch", label: "Merch" },
  { id: "university", label: "University" },
];

interface ContactPageContentProps {
  brandEmail: string;
  location: string;
  contactCopy: {
    headline: string;
    intro: string;
    expectations: string;
  };
  buildFields: ContactField[];
  merchItems: { slug: string; title: string }[];
  courseItems: { slug: string; title: string }[];
  initialMode?: ContactInquiryMode;
  initialMerchSlug?: string;
  initialCourseSlug?: string;
}

export function ContactPageContent({
  brandEmail,
  location,
  contactCopy,
  buildFields,
  merchItems,
  courseItems,
  initialMode = "platform",
  initialMerchSlug,
  initialCourseSlug,
}: ContactPageContentProps) {
  const [mode, setMode] = useState<ContactInquiryMode>(initialMode);

  const copy =
    mode === "platform"
      ? {
          headline: contactCopy.headline,
          intro: contactCopy.intro,
          showExpectations: true,
        }
      : { ...modeCopy[mode], showExpectations: false as const };

  const submitLabel =
    mode === "merch" || mode === "university" ? "Send Inquiry" : "Send";

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-red">Get in touch</p>
          <h1 className="mt-2 text-5xl text-white">{copy.headline}</h1>
          <p className="mt-6 text-white-muted leading-relaxed">{copy.intro}</p>
          {copy.showExpectations && (
            <p className="mt-6 text-sm text-white-muted/80 leading-relaxed">
              {contactCopy.expectations}
            </p>
          )}
          {mode === "university" && (
            <div className="mt-8 border border-white/10 bg-black-muted p-6">
              <p className="text-xs uppercase tracking-widest text-red">
                Long Range University
              </p>
              <p className="mt-3 text-sm text-white-muted leading-relaxed">
                Professional ballistics and long-range coaching in small classes
                with real field applications. Use this form for general questions
                only — class registration is handled separately on the university
                page.
              </p>
              <Link
                href="/university"
                className="mt-4 inline-block text-xs uppercase tracking-widest text-white transition hover:text-red"
              >
                View courses &amp; register →
              </Link>
            </div>
          )}

          <div className="mt-10 space-y-6 border-t border-white/10 pt-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-red">Email</p>
              <a
                href={`mailto:${brandEmail}`}
                className="mt-2 block text-white transition hover:text-red"
              >
                {brandEmail}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-red">Shop</p>
              <p className="mt-2 text-white-muted">
                {location}
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
          <fieldset className="mb-8">
            <legend className="sr-only">Inquiry type</legend>
            <div className="grid grid-cols-3 gap-2">
              {toggleOptions.map((option) => {
                const active = mode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setMode(option.id)}
                    className={`border px-3 py-3 text-[10px] font-semibold uppercase tracking-widest transition sm:text-xs ${
                      active
                        ? "border-red bg-red text-white"
                        : "border-white/20 text-white-muted hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <ContactForm
            key={mode}
            mode={mode}
            buildFields={buildFields}
            merchItems={merchItems}
            courseItems={courseItems}
            initialMerchSlug={initialMerchSlug}
            initialCourseSlug={initialCourseSlug}
            submitLabel={submitLabel}
          />
        </div>
      </div>
    </div>
  );
}
