import Image from "next/image";
import Link from "next/link";
import { configureHref } from "@/data/configurator-options";
import { categoryLabels } from "@/data/rifles";
import type { Rifle } from "@/lib/types";

interface RifleCardProps {
  rifle: Rifle;
  priority?: boolean;
  compact?: boolean;
  showConfigure?: boolean;
  showPricing?: boolean;
}

export function RifleCard({
  rifle,
  priority = false,
  compact = false,
  showConfigure = true,
  showPricing = true,
}: RifleCardProps) {
  const isTightHero =
    rifle.heroImage.url.includes("cropped") ||
    rifle.heroImage.url.includes("copy.webp");

  return (
    <article className="rifle-card group flex h-full w-full flex-col overflow-hidden border border-white/10 bg-black-muted transition hover:border-red/50">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Link
          href={`/builds/${rifle.slug}`}
          className="rifle-card-main flex min-h-0 flex-1 flex-col"
        >
          <div
            className={`relative shrink-0 overflow-hidden hover-zoom ${
              compact ? "aspect-[3/2]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={rifle.heroImage.url}
              alt={rifle.heroImage.alt}
              fill
              priority={priority}
              className={
                isTightHero
                  ? "object-contain bg-black-light p-2"
                  : "object-contain bg-black-light p-4"
              }
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div
            className={`flex min-h-0 flex-1 flex-col ${
              compact ? "p-5 pb-3" : "p-6 pb-4"
            }`}
          >
            <h3
              className={`shrink-0 text-xl text-white transition group-hover:text-red ${
                compact ? "line-clamp-1" : ""
              }`}
            >
              {rifle.title}
            </h3>
            <p
              className={`mt-2 min-h-0 flex-1 text-sm text-white-muted ${
                compact ? "line-clamp-2" : ""
              }`}
            >
              {rifle.tagline}
            </p>
            {showPricing && rifle.startingAt ? (
              <p className="mt-4 shrink-0 text-xs uppercase tracking-widest text-white-muted">
                From{" "}
                <span className="font-semibold text-white">{rifle.startingAt}</span>
              </p>
            ) : null}
          </div>
        </Link>
        <span
          className="rifle-card-tag pointer-events-none absolute left-4 top-4 z-10 bg-black-light/80 px-3 py-1 text-[10px] uppercase tracking-widest text-red"
          aria-hidden
        >
          {categoryLabels[rifle.category]}
        </span>
      </div>

      <div
        className={`grid shrink-0 gap-px border-t border-white/10 bg-white/10 ${
          showConfigure ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        <Link
          href={`/builds/${rifle.slug}`}
          className="rifle-card-action flex min-h-11 items-center justify-center bg-black-muted text-center text-[10px] uppercase tracking-widest text-white-muted transition hover:bg-black-light hover:text-white"
        >
          View build
        </Link>
        {showConfigure ? (
          <Link
            href={configureHref(rifle.slug)}
            className="rifle-card-action flex min-h-11 items-center justify-center bg-black-muted text-center text-[10px] uppercase tracking-widest text-red transition hover:bg-red/10 hover:text-white"
          >
            Configure
          </Link>
        ) : null}
      </div>
    </article>
  );
}
