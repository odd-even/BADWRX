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
}

export function RifleCard({
  rifle,
  priority = false,
  compact = false,
  showConfigure = true,
}: RifleCardProps) {
  const isTightHero =
    rifle.heroImage.url.includes("cropped") ||
    rifle.heroImage.url.includes("copy.webp");

  return (
    <article className={`rifle-card group flex flex-col overflow-hidden border border-white/10 bg-black-muted transition hover:border-red/50 ${compact ? "h-full w-full" : ""}`}>
      <Link href={`/builds/${rifle.slug}`} className={`rifle-card-main block ${compact ? "flex flex-1 flex-col" : ""}`}>
        <div
          className={`relative overflow-hidden ${
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
                ? "object-contain bg-black-light p-2 transition duration-500 group-hover:scale-[1.02]"
                : "object-contain bg-black-light p-4 transition duration-500 group-hover:scale-[1.02]"
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <span className="absolute left-4 top-4 bg-black-light/80 px-3 py-1 text-[10px] uppercase tracking-widest text-red">
            {categoryLabels[rifle.category]}
          </span>
        </div>

        <div
          className={
            compact
              ? "flex flex-1 flex-col p-5 pb-3"
              : "p-6 pb-4"
          }
        >
          <h3
            className={`text-xl text-white transition group-hover:text-red ${
              compact ? "line-clamp-1" : ""
            }`}
          >
            {rifle.title}
          </h3>
          <p
            className={`mt-2 text-sm text-white-muted ${
              compact ? "line-clamp-2 min-h-[2.5rem] flex-1" : ""
            }`}
          >
            {rifle.tagline}
          </p>
          <p
            className={`text-xs uppercase tracking-widest text-white-muted ${
              compact ? "mt-4 min-h-[1.25rem] shrink-0" : rifle.startingAt ? "mt-4" : "hidden"
            }`}
          >
            {rifle.startingAt ? (
              <>
                From{" "}
                <span className="font-semibold text-white">{rifle.startingAt}</span>
              </>
            ) : compact ? (
              <span aria-hidden="true">&nbsp;</span>
            ) : null}
          </p>
        </div>
      </Link>

      <div
        className={`grid gap-px border-t border-white/10 bg-white/10 ${
          showConfigure ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        <Link
          href={`/builds/${rifle.slug}`}
          className="rifle-card-action bg-black-muted py-3 text-center text-[10px] uppercase tracking-widest text-white-muted transition hover:bg-black-light hover:text-white"
        >
          View build
        </Link>
        {showConfigure ? (
          <Link
            href={configureHref(rifle.slug)}
            className="rifle-card-action bg-black-muted py-3 text-center text-[10px] uppercase tracking-widest text-red transition hover:bg-red/10 hover:text-white"
          >
            Configure
          </Link>
        ) : null}
      </div>
    </article>
  );
}
