import Image from "next/image";
import Link from "next/link";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { TrustMarquee } from "@/components/layout/TrustMarquee";
import { ReticleMouseFollow } from "@/components/ui/ReticleMouseFollow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { HomePillarsGrid } from "@/components/home/HomePillarsGrid";
import { RifleScroller } from "@/components/rifles/RifleScroller";
import { getAllRifles, getSiteSettings } from "@/lib/content";
import { isPageEnabled } from "@/lib/pages";

export default async function HomePage() {
  const [rifles, site] = await Promise.all([
    getAllRifles(),
    getSiteSettings(),
  ]);
  const pages = site.pageVisibility;
  const showBuilds = isPageEnabled("builds", pages);
  const showConfigure = isPageEnabled("configure", pages);
  const showContact = isPageEnabled("contact", pages);
  const photos = site.siteImages;

  return (
    <>
      <section className="group relative -mt-[72px] flex min-h-[calc(85vh+72px)] items-end overflow-hidden bg-black pt-[72px]">
        <div className="hover-zoom absolute inset-0">
          <Image
            src={photos.homeHeroBanner.url}
            alt={photos.homeHeroBanner.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <ReticleMouseFollow
          src={photos.reticleOverlay.url}
          alt={photos.reticleOverlay.alt}
          className="top-[16%] left-[68%] aspect-square w-[80vw] min-w-[80vw] opacity-90 mix-blend-screen"
        />
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-[2] mx-auto w-full max-w-7xl px-6 pb-20 pt-32">
          <TypewriterText
            as="h1"
            prefix={site.homeHero.headlinePrefix || undefined}
            phrases={site.homeHero.headlines}
            highlights={["Without", "Unrelenting", "Hard"]}
            className="home-hero-headline max-w-3xl text-4xl text-white sm:text-5xl md:text-7xl"
          />
          <p className="mt-6 max-w-xl text-lg text-white-muted">
            {site.homeHero.subheadline}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {showConfigure ? (
              <Link
                href="/configure"
                className="w-full border border-red bg-red px-8 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark sm:w-auto"
              >
                Configure Rifle
              </Link>
            ) : null}
            {showBuilds ? (
              <Link
                href="/builds"
                className="w-full border border-white/30 px-8 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white sm:w-auto"
              >
                View Our Rifles
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <TrustMarquee items={site.trustMarqueeItems} />

      {showBuilds ? (
        <section className="overflow-x-clip pt-24 pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-6" data-rifle-scroller-align>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <ScrollReveal>
                  <p className="text-xs uppercase tracking-widest text-red">
                    {site.homePlatforms.eyebrow}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={70}>
                  <h2 className="mt-2 text-4xl text-white">
                    {site.homePlatforms.title}
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={140}>
                  <p className="mt-4 text-white-muted leading-relaxed">
                    {site.homePlatforms.body}
                  </p>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={100}>
                <Link
                  href="/builds"
                  className="shrink-0 text-xs uppercase tracking-widest text-white-muted transition hover:text-red"
                >
                  View all platforms →
                </Link>
              </ScrollReveal>
            </div>

            <RifleScroller
              rifles={rifles}
              showConfigure={showConfigure}
              showPricing={false}
            />
          </div>

          <div className="relative z-0 mx-auto max-w-7xl px-6 pt-12 md:pt-16">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-widest text-red">
                {site.homeIntro.eyebrow}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <p className="mt-4 max-w-3xl text-xl text-white leading-snug md:text-2xl">
                {site.homeIntro.body}
              </p>
            </ScrollReveal>

            <HomePillarsGrid pillars={site.homePillars} />
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 pt-24 pb-12 md:pb-16">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-red">
              {site.homeIntro.eyebrow}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p className="mt-4 max-w-3xl text-xl text-white leading-snug md:text-2xl">
              {site.homeIntro.body}
            </p>
          </ScrollReveal>

          <HomePillarsGrid pillars={site.homePillars} />
        </section>
      )}

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2">
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10 hover-zoom">
              <Image
                src={photos.homeFieldTested.url}
                alt={photos.homeFieldTested.alt}
                fill
                className="object-cover object-left"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal className="flex flex-col justify-center" delay={100}>
            <p className="text-xs uppercase tracking-widest text-red">
              {site.fieldTested.eyebrow}
            </p>
            <h2 className="mt-2 text-4xl text-white">{site.fieldTested.title}</h2>
            <p className="mt-6 text-white-muted leading-relaxed">
              {site.fieldTested.body}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="group relative min-h-[70vh] overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0">
          <div className="hover-zoom absolute inset-0">
            <Image
              src={photos.homeBallisticSection.url}
              alt={photos.homeBallisticSection.alt}
              fill
              className="object-cover object-[center_26%]"
              sizes="100vw"
            />
          </div>
          <ReticleMouseFollow
            src={photos.reticleOverlay.url}
            alt={photos.reticleOverlay.alt}
            className="top-[16%] left-[68%] aspect-square w-[70vw] min-w-[70vw] opacity-50 mix-blend-screen"
            sizes="70vw"
          />
          <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.4)_32%,rgba(0,0,0,0.85)_52%,var(--color-black)_100%)]" />
        </div>

        <div className="relative z-[3] mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col justify-end px-6 pb-20 pt-32">
          <div className="max-w-2xl">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-widest text-red">
                {site.unrelenting.eyebrow}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={70}>
              <h2 className="mt-2 text-4xl text-white md:text-5xl">
                {site.unrelenting.title}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <p className="mt-6 text-white-muted leading-relaxed">
                {site.unrelenting.body}
              </p>
            </ScrollReveal>
            {showContact ? (
              <ScrollReveal delay={210}>
                <Link
                  href="/contact"
                  className="mt-8 inline-block text-xs uppercase tracking-widest text-red transition hover:text-white"
                >
                  Ask about the Ballistic Package →
                </Link>
              </ScrollReveal>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black-light">
        <ScrollReveal>
          <TestimonialCarousel
            items={
              site.testimonials?.length
                ? site.testimonials
                : [site.testimonial]
            }
          />
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <ScrollReveal>
          <div className="grid gap-12 border border-white/10 bg-black-muted p-8 md:grid-cols-2 md:items-center md:p-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-red">Get in touch</p>
              <h2 className="mt-2 text-4xl text-white">{site.contactSection.title}</h2>
              <p className="mt-6 text-white-muted leading-relaxed">
                {site.contactSection.body}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-block text-lg text-white transition hover:text-red"
              >
                {site.email}
              </a>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row">
              {showContact ? (
                <Link
                  href="/contact"
                  className="flex-1 border border-red bg-red py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
                >
                  Contact Us
                </Link>
              ) : null}
              {showConfigure ? (
                <Link
                  href="/configure"
                  className="flex-1 border border-white/20 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:border-red hover:text-red"
                >
                  Configure a Rifle
                </Link>
              ) : null}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
