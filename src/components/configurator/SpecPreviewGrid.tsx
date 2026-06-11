import { stepKeys } from "@/lib/configurator/constants";
import { showsInSpecPreview } from "@/lib/configurator/spec-preview";
import type { BuildConfiguration, ConfigStep } from "@/lib/types";
import { OptionImage } from "@/components/configurator/OptionImage";

interface SpecPreviewGridProps {
  config: BuildConfiguration;
  steps: ConfigStep[];
  className?: string;
  variant?: "live" | "review";
}

export function SpecPreviewGrid({
  config,
  steps,
  className = "",
  variant = "live",
}: SpecPreviewGridProps) {
  if (!stepKeys.some((key) => showsInSpecPreview(key, config[key]))) {
    return null;
  }

  const compact = variant === "review";

  return (
    <div
      className={
        compact
          ? `grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 sm:gap-2 ${className}`.trim()
          : `grid grid-cols-3 gap-x-2 gap-y-3 ${className}`.trim()
      }
    >
      {stepKeys.map((key) => {
        const option = config[key];
        if (!option || !showsInSpecPreview(key, option)) return null;
        const stepTitle = steps.find((step) => step.id === key)?.title;
        return (
          <div key={key} className="min-w-0">
            <div className="overflow-hidden border border-white/10 hover-zoom">
              {option.image ? (
                <OptionImage
                  url={option.image.url}
                  alt={option.image.alt}
                  label={option.label}
                  variant="swatch-fill"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-black-light p-2 sm:p-3">
                  <p
                    className={`text-center font-medium leading-snug text-white ${compact ? "text-xs sm:text-sm" : "text-sm leading-tight sm:text-base"}`}
                  >
                    {option.label}
                  </p>
                </div>
              )}
            </div>
            {stepTitle && (
              <p
                className={`mt-1.5 uppercase tracking-wider text-white-muted/60 ${compact ? "text-xs sm:text-sm" : "text-xs sm:text-sm"}`}
              >
                {stepTitle}
              </p>
            )}
            {option.image && (
              <p
                className={`leading-snug text-white-muted ${compact ? "mt-0.5 text-xs sm:text-sm" : "mt-1 text-sm sm:text-base"}`}
              >
                {option.label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
