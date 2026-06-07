import Image from "next/image";
import Link from "next/link";
import { getBrandContent } from "@/lib/content";
import { images } from "@/lib/images";

export async function Footer() {
  const content = await getBrandContent();

  return (
    <footer className="border-t border-white/10 bg-black-light">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <Link href="/" className="inline-block transition opacity-90 hover:opacity-100">
            <Image
              src={images.logos.badge}
              alt={`${content.short} — ${content.name}`}
              width={220}
              height={208}
              className="h-36 w-auto sm:h-44 md:h-52"
            />
          </Link>
          <p className="mt-6 text-xl text-white">{content.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-red">
            {content.short}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white-muted">
            {content.buildPromise} {content.deliveryPackage}
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-red">
            Navigate
          </p>
          <ul className="space-y-2 text-sm text-white-muted">
            <li>
              <Link href="/builds" className="transition hover:text-white">
                Past Builds
              </Link>
            </li>
            <li>
              <Link href="/configure" className="transition hover:text-white">
                Configure a Rifle
              </Link>
            </li>
            <li>
              <Link href="/university" className="transition hover:text-white">
                Long Range University
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-white">
                About the Builder
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-white">
                Request a Consultation
              </Link>
            </li>
            <li>
              <Link href="/studio" className="transition hover:text-white">
                Content Studio
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-red">
            Contact
          </p>
          <ul className="space-y-2 text-sm text-white-muted">
            <li>Jackson, Wyoming</li>
            <li>
              <a href={`mailto:${content.email}`} className="transition hover:text-white">
                {content.email}
              </a>
            </li>
            <li>(307) 555-0142</li>
          </ul>
          <p className="mt-6 text-xs text-white-muted/60">
            Not a retail dealer. All builds by consultation and quote only.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-6 text-center text-xs text-white-muted/50">
        © {new Date().getFullYear()} {content.name} ({content.short}). All rights
        reserved.
      </div>
    </footer>
  );
}
