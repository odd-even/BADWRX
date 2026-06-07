import Image from "next/image";
import Link from "next/link";
import type { Rifle } from "@/lib/types";
import { categoryLabels } from "@/data/rifles";

interface RifleCardProps {
  rifle: Rifle;
  priority?: boolean;
}

export function RifleCard({ rifle, priority = false }: RifleCardProps) {
  const isCroppedHero = rifle.heroImage.url.includes("cropped");

  return (
    <Link
      href={`/builds/${rifle.slug}`}
      className="group block overflow-hidden border border-white/10 bg-black-muted transition hover:border-red/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={rifle.heroImage.url}
          alt={rifle.heroImage.alt}
          fill
          priority={priority}
          className={
            isCroppedHero
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

      <div className="p-6">
        <h3 className="text-xl text-white transition group-hover:text-red">
          {rifle.title}
        </h3>
        <p className="mt-2 text-sm text-white-muted">{rifle.tagline}</p>
        {rifle.startingAt && (
          <p className="mt-4 text-xs uppercase tracking-widest text-white-muted">
            From{" "}
            <span className="font-semibold text-white">{rifle.startingAt}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
