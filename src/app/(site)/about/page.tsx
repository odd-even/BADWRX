import type { Metadata } from "next";
import Image from "next/image";
import { TruncatedText } from "@/components/ui/TruncatedText";
import { getSiteSettings } from "@/lib/content";
import { riflePlaceholder, riflePlaceholderAlt } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Badger Rifleworks (BADWRX) and our build philosophy.",
};

export default async function AboutPage() {
  const site = await getSiteSettings();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-xs uppercase tracking-widest text-red">Our story</p>
          <h1 className="mt-2 text-5xl text-white">{site.aboutPage.title}</h1>
          <div className="mt-8 space-y-6">
            {site.aboutPage.body.map((paragraph) => (
              <TruncatedText
                key={paragraph.slice(0, 32)}
                text={paragraph}
                title={site.aboutPage.title}
                maxLines={5}
                className="text-white-muted leading-relaxed"
              />
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { value: site.partnerBarrels, label: "Barrels" },
              { value: site.partnerOptics, label: "Optics" },
              { value: '½"', label: "MOA standard" },
            ].map((stat) => (
              <div key={stat.label} className="border border-white/10 p-6 text-center">
                <p className="text-2xl text-red md:text-3xl">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-white-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
            <Image
              src={riflePlaceholder}
              alt={riflePlaceholderAlt}
              fill
              className="object-contain bg-black-light p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="border border-white/10 bg-black-muted p-8">
            <p className="text-xs uppercase tracking-widest text-red">Philosophy</p>
            <TruncatedText
              text={`"${site.aboutPage.philosophyQuote}"`}
              title="Philosophy"
              maxLines={4}
              className="mt-4 text-xl leading-relaxed text-white"
            />
            <p className="mt-4 text-sm text-white-muted">— Founder, {site.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
