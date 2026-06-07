import type { RifleSpecs } from "@/lib/types";

interface SpecTableProps {
  specs: RifleSpecs;
  compact?: boolean;
}

const specLabels: Record<keyof RifleSpecs, string> = {
  action: "Action",
  caliber: "Caliber",
  barrel: "Barrel",
  barrelLength: "Barrel Length",
  twistRate: "Twist Rate",
  stock: "Stock / Chassis",
  stockPaint: "Stock Paint",
  trigger: "Trigger",
  finish: "Finish",
  scope: "Scope",
  rings: "Rings",
  muzzleBrake: "Muzzle Brake",
  suppressor: "Suppressor",
  rifleCase: "Case",
  weight: "Weight",
  overallLength: "Overall Length",
  accuracy: "Accuracy Guarantee",
  magazine: "Magazine",
};

export function SpecTable({ specs, compact = false }: SpecTableProps) {
  const entries = Object.entries(specs).filter(([, v]) => v) as [
    keyof RifleSpecs,
    string,
  ][];

  return (
    <div
      className={
        compact
          ? "divide-y divide-white/10 border border-white/10"
          : "divide-y divide-white/10 border border-white/10 bg-black-muted"
      }
    >
      {entries.map(([key, value]) => (
        <div
          key={key}
          className={`grid ${compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"} gap-1 px-4 py-3 sm:gap-4`}
        >
          <dt className="text-xs uppercase tracking-widest text-red">
            {specLabels[key]}
          </dt>
          <dd className="text-sm text-white">{value}</dd>
        </div>
      ))}
    </div>
  );
}
