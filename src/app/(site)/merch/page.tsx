import type { Metadata } from "next";
import Link from "next/link";
import { MerchGallery } from "@/components/merch/MerchGallery";
import { merchItems } from "@/data/merch";

export const metadata: Metadata = {
  title: "Merch",
  description:
    "BADWRX caps, t-shirts, and sweaters. Rep the brand on the range and in the field.",
};

export default function MerchPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Shop</p>
      <h1 className="mt-2 text-5xl text-white">Merch</h1>
      <p className="mt-4 max-w-2xl text-white-muted">
        Caps, t-shirts, and sweaters — add to cart, choose shipping, and check
        out. Free standard shipping on orders over $100.
      </p>

      <MerchGallery items={merchItems} />

      <section className="mt-16 border border-white/10 bg-black-muted p-8 md:p-10">
        <p className="text-xs uppercase tracking-widest text-red">Shipping</p>
        <h2 className="mt-2 text-3xl text-white">Standard or express delivery</h2>
        <p className="mt-4 max-w-xl text-white-muted">
          Standard shipping is 5–7 business days. Express is 2–3 business days.
          Orders over $100 ship free via standard delivery.
        </p>
        <Link
          href="/merch/cart"
          className="mt-8 inline-block border border-white/20 px-8 py-4 text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
        >
          View cart
        </Link>
      </section>
    </div>
  );
}
