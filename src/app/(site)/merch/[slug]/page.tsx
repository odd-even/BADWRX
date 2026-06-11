import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MerchAddToCart } from "@/components/merch/MerchCartUI";
import { MerchImageGallery } from "@/components/merch/MerchImageGallery";
import { merchCategoryLabels } from "@/data/merch";
import { getAllMerch, getMerchBySlug } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getAllMerch();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMerchBySlug(slug);
  if (!item) return { title: "Product Not Found" };

  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/merch/${slug}` },
    openGraph: {
      title: item.title,
      description: item.description,
      url: `/merch/${slug}`,
      images: item.image?.url
        ? [{ url: item.image.url, alt: item.image.alt }]
        : undefined,
    },
  };
}

export default async function MerchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getMerchBySlug(slug);

  if (!item) notFound();

  return (
    <article className="mx-auto max-w-7xl px-6 py-16">
      <Link
        href="/merch"
        className="text-xs uppercase tracking-widest text-white-muted transition hover:text-red"
      >
        ← Merch
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-3">
          <MerchImageGallery images={item.images} title={item.title} />

          <div className="mt-12 lg:hidden">
            <p className="text-[10px] uppercase tracking-widest text-red">
              {merchCategoryLabels[item.category]}
            </p>
            <h1 className="mt-2 text-4xl text-white">{item.title}</h1>
            <p className="mt-3 text-2xl text-white">{item.price}</p>
            <MerchAddToCart item={item} />
          </div>

          <div className="mt-12">
            <h2 className="text-xs uppercase tracking-widest text-red">Details</h2>
            <p className="mt-4 whitespace-pre-line text-white-muted leading-relaxed">
              {item.longDescription}
            </p>
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div className="hidden border border-white/10 bg-black-muted p-6 lg:block">
              <p className="text-[10px] uppercase tracking-widest text-red">
                {merchCategoryLabels[item.category]}
              </p>
              <h1 className="mt-2 text-3xl text-white">{item.title}</h1>
              <p className="mt-3 text-2xl text-white">{item.price}</p>
              <MerchAddToCart item={item} />
            </div>

            <div className="border border-white/10 bg-black-muted p-6 text-sm text-white-muted">
              <p className="text-xs uppercase tracking-widest text-red">Shipping</p>
              <p className="mt-3 leading-relaxed">
                Free standard shipping on orders over $100. Standard delivery is
                5–7 business days; express is 2–3 business days.
              </p>
              <Link
                href="/merch/cart"
                className="mt-4 inline-block text-xs uppercase tracking-widest text-red transition hover:text-white"
              >
                View cart →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
