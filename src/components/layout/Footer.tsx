import Image from "next/image";
import Link from "next/link";
import { getBrandContent } from "@/lib/content";
import { brand } from "@/lib/brand";
import { images } from "@/lib/images";

const navLinks = [
  { href: "/builds", label: "Our Rifles" },
  { href: "/configure", label: "Configure a Rifle" },
  { href: "/merch", label: "Merch" },
  { href: "/university", label: "Long Range University" },
  { href: "/about", label: "About BADWRX" },
  { href: "/contact", label: "Request a Consultation" },
];

export async function Footer() {
  const content = await getBrandContent();

  return (
    <footer className="border-t border-white/10 bg-black-light">
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-x-10">
          <Link
            href="/"
            className="inline-block opacity-90 transition hover:opacity-100"
          >
            <Image
              src={images.logos.badge}
              alt={`${content.short} — ${content.name}`}
              width={220}
              height={208}
              className="h-32 w-auto sm:h-40 md:h-44"
            />
          </Link>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red">
              Navigate
            </p>
            <ul className="space-y-1 text-sm text-white-muted">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-red">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-white-muted">
              <li>{brand.location}</li>
              <li>By appointment only</li>
              <li>
                <a
                  href={`mailto:${content.email}`}
                  className="transition hover:text-white"
                >
                  {content.email}
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-white-muted">
              Every rifle is built to order — no inventory, no walk-ins. Configure
              a platform online or email us to start a build quote.
            </p>
            <Link
              href="/configure"
              className="mt-4 inline-block text-xs uppercase tracking-widest text-red transition hover:text-white"
            >
              Configure a rifle →
            </Link>
            <p className="mt-6 text-xs text-white-muted/60">
              Not a retail dealer. All builds by consultation and quote only.
            </p>
            <p className="mt-4 text-xs text-white-muted/50">
              © {new Date().getFullYear()} {content.name} ({content.short}). All
              rights reserved.
            </p>
          </div>
        </div>
      </div>

      <p className="mx-auto max-w-7xl px-6 text-2xl font-bold uppercase leading-[0.95] tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
        <span className="text-red">Precision rifles</span>
        <span className="text-white/30"> for</span>
        <br />
        <span className="text-white/30">the American patriot</span>
      </p>
    </footer>
  );
}
