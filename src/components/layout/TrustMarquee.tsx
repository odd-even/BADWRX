import { brand } from "@/lib/brand";

interface TrustMarqueeProps {
  items?: string[];
}

const defaultItems = [
  `${brand.partners.barrels} Barrels`,
  `${brand.partners.optics} Optics`,
  "Hand Test-Fired",
  "Ballistics Table Included",
  "Rifle-Specific Ammo Data",
];

export function TrustMarquee({ items = defaultItems }: TrustMarqueeProps) {
  const sequence = [...items, ...items];

  return (
    <section
      className="trust-marquee border-b border-white/10 bg-black-light py-5"
      aria-label="Build standards"
    >
      <div className="overflow-hidden">
        <div className="trust-marquee-track flex w-max items-center gap-12 whitespace-nowrap px-6 text-xs uppercase tracking-widest text-white-muted">
          {sequence.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex shrink-0 items-center gap-12"
              aria-hidden={index >= items.length ? true : undefined}
            >
              <span>{item}</span>
              <span className="text-red">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
