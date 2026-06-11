import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SanityResponsiveImage } from "@/components/ui/SanityResponsiveImage";
import { buildPageMetadata } from "@/lib/page-seo";
import { getSiteSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "about",
    title: "About",
    canonical: "/about",
  });
}

export default async function AboutPage() {
  const site = await getSiteSettings();
  const banner = site.siteImages.aboutHeroBanner;
  const closingLine = "We build that rifle.";
  const body = site.aboutPage.body;
  const closingIndex = body.lastIndexOf(closingLine);
  const storyBody =
    closingIndex === -1 ? body : body.slice(0, closingIndex).trimEnd();
  const hasClosingLine = closingIndex !== -1;

  return (
    <>
      <section className="group relative -mt-[72px] flex min-h-[calc(85vh+72px)] items-end overflow-hidden bg-black pt-[72px]">
        <div className="hover-zoom absolute inset-0">
          <SanityResponsiveImage image={banner} priority />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:pb-16">
          <p className="text-xs uppercase tracking-widest text-red">Our story</p>
          <h1 className="mt-2 max-w-4xl text-4xl text-white md:text-6xl">
            {site.aboutPage.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white-muted md:text-xl">
            {site.tagline}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="space-y-6">
              <p className="text-white-muted leading-relaxed">
                {storyBody}
                {hasClosingLine && (
                  <>
                    {storyBody && " "}
                    <span className="text-white">{closingLine}</span>
                  </>
                )}
              </p>
              {site.aboutPage.signature && (
                <div className="text-xs leading-relaxed text-white/70">
                  <p>— {site.aboutPage.signature.name}</p>
                  <p className="mt-1 pl-3">{site.aboutPage.signature.location}</p>
                </div>
              )}
            </div>

            <div className="mt-12 grid gap-4">
              {site.aboutPage.pillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="flex h-full flex-col border border-white/10 bg-black-muted p-5"
                >
                  <span className="text-xs font-semibold text-red">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-medium leading-snug text-white">
                    {pillar.title}
                  </p>
                  {pillar.body && (
                    <p className="mt-2 text-sm leading-relaxed text-white-muted">
                      {pillar.body}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 border border-white/10 bg-black-muted">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="text-xs uppercase tracking-widest text-red">
                  Partners &amp; standards
                </p>
              </div>
              <dl className="divide-y divide-white/10">
                {[
                  { label: "Barrels", value: site.partnerBarrels },
                  { label: "Optics", value: site.partnerOptics },
                  { label: "Accuracy standard", value: "½ MOA" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-2 px-6 py-5 sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-8"
                  >
                    <dt className="text-xs uppercase tracking-widest text-white-muted">
                      {item.label}
                    </dt>
                    <dd className="text-base font-medium leading-snug text-white sm:text-lg">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-black-light hover-zoom">
              <Image
                src={site.siteImages.aboutStory.url}
                alt={site.siteImages.aboutStory.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 640px"
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
              <h2 className="mt-2 text-3xl text-white">
                Built to order, tested before it ships
              </h2>
              <p className="mt-6 text-white-muted leading-relaxed">{site.buildPromise}</p>
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
    </>
  );
}
