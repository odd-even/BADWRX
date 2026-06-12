import Image from "next/image";
import Link from "next/link";
import { configureHref } from "@/lib/configurator/constants";
import { categoryLabels } from "@/lib/rifle-labels";
import type { Rifle } from "@/lib/types";

interface RifleCardProps {
  rifle: Rifle;
  priority?: boolean;
  compact?: boolean;
  showConfigure?: boolean;
  showPricing?: boolean;
  titleAs?: "h2" | "h3";
}

export function RifleCard({
  rifle,
  priority = false,
  compact = false,
  showConfigure = true,
  showPricing = true,
  titleAs: TitleTag = "h3",
}: RifleCardProps) {
  const cardImage = compact ? rifle.compactCardImage : rifle.cardImage;

  return (
    <article className="rifle-card group flex h-full w-full flex-col overflow-hidden border border-white/10 bg-black-muted transition hover:border-red/50">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Link
          href={`/builds/${rifle.slug}`}
          className="rifle-card-main flex min-h-0 flex-1 flex-col"
        >
          <div
            className={`rifle-card-media relative shrink-0 overflow-hidden hover-zoom ${
              compact ? "aspect-[3/2]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={cardImage.url}
              alt={cardImage.alt}
              fill
              priority={priority}
              className="object-cover bg-black-light object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black via-transparent to-transparent" />
            <span
              className="rifle-card-tag pointer-events-none absolute left-4 top-4 z-[2] bg-black-light/80 px-3 py-1 text-[10px] uppercase tracking-widest text-red"
              aria-hidden
            >
              {categoryLabels[rifle.category]}
            </span>
          </div>

          <div
            className={`flex min-h-0 flex-1 flex-col ${
              compact ? "px-5 pt-7 pb-6" : "px-6 pt-8 pb-8"
            }`}
          >
            <TitleTag
              className={`shrink-0 text-white transition group-hover:text-red ${
                compact ? "text-2xl line-clamp-1" : "text-2xl md:text-3xl"
              }`}
            >
              {rifle.title}
            </TitleTag>
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
      </div>

      <div className="shrink-0">
        <div className="h-px bg-white/10" aria-hidden />
        <div
          className={`grid gap-px bg-white/10 ${
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
      </div>
    </article>
  );
}
