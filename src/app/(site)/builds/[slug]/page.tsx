import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SpecTable } from "@/components/rifles/SpecTable";
import { categoryLabels } from "@/data/rifles";
import { getAllRifles, getRifleBySlug } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const rifles = await getAllRifles();
  return rifles.map((rifle) => ({ slug: rifle.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rifle = await getRifleBySlug(slug);
  if (!rifle) return { title: "Build Not Found" };
  return {
    title: rifle.title,
    description: rifle.description,
  };
}

export default async function BuildDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rifle = await getRifleBySlug(slug);

  if (!rifle) notFound();

  return (
    <article>
      <section className="relative flex min-h-[50vh] items-end">
        <Image
          src={rifle.heroImage.url}
          alt={rifle.heroImage.alt}
          fill
          priority
          className="object-contain bg-black-light"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-12 pt-24">
          <Link
            href="/builds"
            className="text-xs uppercase tracking-widest text-white-muted transition hover:text-red"
          >
            ← All builds
          </Link>
          <span className="mt-6 block text-xs uppercase tracking-widest text-red">
            {categoryLabels[rifle.category]}
          </span>
          <h1 className="mt-2 text-5xl text-white md:text-6xl">
            {rifle.title}
          </h1>
          <p className="mt-4 text-lg text-white-muted">{rifle.tagline}</p>
          {rifle.startingAt && (
            <p className="mt-4 text-sm uppercase tracking-widest text-white-muted">
              Similar builds from{" "}
              <span className="text-white">{rifle.startingAt}</span>
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="text-xs uppercase tracking-widest text-red">Overview</h2>
            <p className="mt-4 text-white-muted leading-relaxed">{rifle.description}</p>

            <h2 className="mt-12 text-xs uppercase tracking-widest text-red">
              Build highlights
            </h2>
            <ul className="mt-4 space-y-3">
              {rifle.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-red" />
                  {item}
                </li>
              ))}
            </ul>

            {rifle.gallery.length > 0 && (
              <>
                <h2 className="mt-12 text-xs uppercase tracking-widest text-red">
                  Gallery
                </h2>
                <div className="mt-6 space-y-6">
                  {rifle.gallery.map((image, index) => (
                    <figure
                      key={`${image.url}-${index}`}
                      className="overflow-hidden border border-white/10"
                    >
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-contain bg-black-light"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      </div>
                      {image.caption && (
                        <figcaption className="bg-black-muted px-4 py-3 text-sm text-white-muted">
                          {image.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div>
                <h2 className="text-xs uppercase tracking-widest text-red">
                  Specifications
                </h2>
                <div className="mt-4">
                  <SpecTable specs={rifle.specs} />
                </div>
              </div>

              <Link
                href="/configure"
                className="block w-full border border-red bg-red py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
              >
                Configure Similar Build
              </Link>
              <Link
                href="/contact"
                className="block w-full border border-white/20 py-4 text-center text-xs uppercase tracking-widest text-white-muted transition hover:border-red hover:text-red"
              >
                Ask About This Build
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
