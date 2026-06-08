import Image from "next/image";
import Link from "next/link";
import { TrustMarquee } from "@/components/layout/TrustMarquee";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { RifleScroller } from "@/components/rifles/RifleScroller";
import { getAllRifles, getSiteSettings } from "@/lib/content";
import { images, riflePlaceholderAlt } from "@/lib/images";

export default async function HomePage() {
  const [rifles, site] = await Promise.all([
    getAllRifles(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="relative -mt-[72px] flex min-h-[calc(85vh+72px)] items-end overflow-hidden pt-[72px]">
        <Image
          src={images.rifle.field}
          alt="Custom precision rifle on a mountain ridgeline"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[min(40vh,280px)] bg-gradient-to-b from-black via-black/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-32">
          <TypewriterText
            as="h1"
            prefix={site.homeHero.headlinePrefix}
            phrases={site.homeHero.headlines}
            className="max-w-3xl text-5xl leading-[0.92] text-white md:text-7xl"
          />
          <p className="mt-6 max-w-xl text-lg text-white-muted">
            {site.homeHero.subheadline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/configure"
              className="border border-red bg-red px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
            >
              Configure Your Rifle
            </Link>
            <Link
              href="/builds"
              className="border border-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white"
            >
              View Our Rifles
            </Link>
          </div>
        </div>
      </section>

      <TrustMarquee items={site.trustMarqueeItems} />

      <section className="pt-24 pb-12 md:pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-red">
                {site.homePlatforms.eyebrow}
              </p>
              <h2 className="mt-2 text-4xl text-white">
                {site.homePlatforms.title}
              </h2>
              <p className="mt-4 text-white-muted leading-relaxed">
                {site.homePlatforms.body}
              </p>
            </div>
            <Link
              href="/builds"
              className="shrink-0 text-xs uppercase tracking-widest text-white-muted transition hover:text-red"
            >
              View all platforms →
            </Link>
          </div>
        </div>

        <RifleScroller rifles={rifles} />
      </section>

      <section className="border-y border-white/10 bg-black-muted">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-xs uppercase tracking-widest text-red">
            {site.homeIntro.eyebrow}
          </p>
          <p className="mt-4 max-w-3xl text-xl text-white leading-snug md:text-2xl">
            {site.homeIntro.body}
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {site.homePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="border border-white/10 bg-black-light p-8"
              >
                <h3 className="text-sm font-semibold uppercase tracking-widest text-red">
                  {pillar.title}
                </h3>
                <p className="mt-4 text-sm text-white-muted leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden border border-white/10">
            <Image
              src={images.rifle.hunt}
              alt="Hunter in Alaska mountain country"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-red">
              {site.fieldTested.eyebrow}
            </p>
            <h2 className="mt-2 text-4xl text-white">{site.fieldTested.title}</h2>
            <p className="mt-6 text-white-muted leading-relaxed">
              {site.fieldTested.body}
            </p>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <Image
          src={images.rifle.studioCropped}
          alt={riflePlaceholderAlt}
          fill
          className="object-cover object-[center_26%]"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-0% via-black/50 via-[32%] via-black/90 via-[52%] to-black to-100%" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-32">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-red">
              {site.unrelenting.eyebrow}
            </p>
            <h2 className="mt-2 text-4xl text-white md:text-5xl">
              {site.unrelenting.title}
            </h2>
            <p className="mt-6 text-white-muted leading-relaxed">
              {site.unrelenting.body}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block text-xs uppercase tracking-widest text-red transition hover:text-white"
            >
              Ask about the Ballistic Package →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black-light">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-widest text-red">From the field</p>
          <blockquote className="mt-8 text-xl text-white md:text-2xl leading-relaxed">
            &ldquo;{site.testimonial.quote}&rdquo;
          </blockquote>
          <p className="mt-8 text-sm uppercase tracking-widest text-white-muted">
            — {site.testimonial.author}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
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
            <Link
              href="/contact"
              className="flex-1 border border-red bg-red py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
            >
              Contact Us
            </Link>
            <Link
              href="/configure"
              className="flex-1 border border-white/20 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:border-red hover:text-red"
            >
              Configure a Rifle
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
