import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
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
              <p
                key={paragraph.slice(0, 32)}
                className="text-white-muted leading-relaxed"
              >
                {paragraph}
              </p>
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
            <blockquote className="mt-4 text-xl leading-relaxed text-white">
              &ldquo;{site.aboutPage.philosophyQuote}&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-white-muted">— {site.name}</p>
          </div>
        </div>
      </div>

      <section className="mt-24 border-t border-white/10 pt-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="border border-white/10 bg-black-muted p-8 md:p-10">
            <p className="text-xs uppercase tracking-widest text-red">Our standard</p>
            <h2 className="mt-2 text-3xl text-white">Built to order. Tested before it ships.</h2>
            <p className="mt-6 text-white-muted leading-relaxed">{brand.buildPromise}</p>
          </div>
          <div className="border border-white/10 bg-black-light p-8 md:p-10">
            <p className="text-xs uppercase tracking-widest text-red">Ballistic package</p>
            <h2 className="mt-2 text-3xl text-white">{site.unrelenting.title}</h2>
            <p className="mt-6 text-white-muted leading-relaxed">{site.deliveryPackage}</p>
            <Link
              href="/contact"
              className="mt-8 inline-block text-xs uppercase tracking-widest text-red transition hover:text-white"
            >
              Ask about the Ballistic Package →
            </Link>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-white-muted/70">
          Not a retail dealer. All builds by consultation and quote only.
        </p>
      </section>
    </div>
  );
}
