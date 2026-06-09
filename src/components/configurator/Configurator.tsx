"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { stepKeys, type StepKey } from "@/data/configurator-options";
import type { ConfiguratorData } from "@/lib/configurator/types";
import type { BuildConfiguration, ConfigOption } from "@/lib/types";
import { OptionImage } from "@/components/configurator/OptionImage";
import { TruncatedText } from "@/components/ui/TruncatedText";
import { BuildReview } from "@/components/configurator/BuildReview";
import { BallisticPackageStep } from "@/components/configurator/BallisticPackageStep";
import { BasecampPackageStep } from "@/components/configurator/BasecampPackageStep";
import { SpecPreviewGrid } from "@/components/configurator/SpecPreviewGrid";
import {
  compileBuildSubmission,
  type BuildContactDetails,
} from "@/lib/build-submission";
import {
  BASECAMP_NONE_OPTION,
  summarizeBasecampSelection,
} from "@/lib/configurator/basecamp-items";
import {
  companionSelection,
  filterStepOptions,
  platformSpecDefaults,
  calibersForPlatform,
} from "@/lib/configurator/filter-options";
import {
  computeBuildLineItems,
  computeBuildTotal,
  formatLineItemPrice,
  formatPrice,
  formatPriceDelta,
  getOptionPrice,
} from "@/lib/pricing";

const emptyConfig: BuildConfiguration = {
  platform: null,
  caliber: null,
  stockPaint: null,
  scope: null,
  rings: null,
  basecampPackage: null,
  basecampItems: [],
  ballisticPackage: null,
};

const swatchSteps: StepKey[] = ["stockPaint", "rings"];

/**
 * Rings are determined automatically from the optics selection (see
 * companionSelection), so the rings step is hidden from configurator navigation.
 */
const hiddenStepKeys: StepKey[] = ["rings"];

/** Platform fields shown in the live spec sheet (fixed order) */
const PLATFORM_SPEC_KEYS = [
  "action",
  "barrel",
  "platform",
  "use",
  "muzzleBrake",
  "trigger",
] as const;

/** Optics fields shown in the live spec sheet (fixed order) */
const SCOPE_SPEC_KEYS = ["scope", "magnification", "reticle"] as const;

/** Internal catalog fields — hide from the live spec sheet */
const HIDDEN_SPEC_SHEET_KEYS = new Set(["code"]);

function formatSpecLabel(key: string): string {
  const labels: Record<string, string> = {
    use: "Primary use",
    muzzleBrake: "Muzzle device",
  };
  return labels[key] ?? key.replace(/([A-Z])/g, " $1").trim();
}

function splitSpecSummary(summary: Record<string, string>) {
  const platform: [string, string][] = [];
  const scope: [string, string][] = [];
  const seen = new Set<string>();

  for (const key of PLATFORM_SPEC_KEYS) {
    const value = summary[key];
    if (value) {
      platform.push([key, value]);
      seen.add(key);
    }
  }

  for (const key of SCOPE_SPEC_KEYS) {
    const value = summary[key];
    if (value) {
      scope.push([key, value]);
      seen.add(key);
    }
  }

  const other = Object.entries(summary).filter(
    ([key]) => !seen.has(key) && !HIDDEN_SPEC_SHEET_KEYS.has(key),
  );
  return { platform, scope, other };
}

function SpecSheetGrid({
  specs,
  className = "",
}: {
  specs: [string, string][];
  className?: string;
}) {
  if (specs.length === 0) return null;
  return (
    <dl className={`grid grid-cols-2 gap-x-4 gap-y-3 ${className}`.trim()}>
      {specs.map(([key, value]) => (
        <SpecSheetRow key={key} label={formatSpecLabel(key)} value={value} />
      ))}
    </dl>
  );
}

function SpecSheetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/5 pb-3">
      <dt className="text-xs uppercase tracking-widest text-white-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-white">{value}</dd>
    </div>
  );
}

type ConfiguratorPhase = "configure" | "review" | "submitted";

interface ConfiguratorProps {
  data: ConfiguratorData;
}

function configToSummary(
  config: BuildConfiguration,
  data: ConfiguratorData,
): Record<string, string> {
  const summary: Record<string, string> = {};
  for (const key of stepKeys) {
    const option = config[key];
    if (option?.specs) {
      Object.assign(summary, option.specs);
    }
    if (option && !option.specs) {
      summary[key] = option.label;
    }
  }
  const defaults = platformSpecDefaults(
    config.platform?.id,
    data.platformDefaults,
    config.platform?.specs?.action,
  );
  for (const [key, value] of Object.entries(defaults)) {
    if (value && !summary[key]) {
      summary[key] = value;
    }
  }
  return summary;
}

function scrollConfiguratorToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

interface StepNavButtonsProps {
  navPosition: number;
  isLastStep: boolean;
  canAdvance: boolean;
  isBuildComplete: boolean;
  onBack: () => void;
  onContinue: () => void;
  onReview: () => void;
  layout: "inline" | "sticky";
}

function stepNavPrimaryClassName(enabled: boolean, isSticky: boolean, extra = "") {
  const layout = isSticky ? "flex-1 md:flex-none " : "";
  const shared =
    `${layout}px-6 py-3 text-center text-xs uppercase tracking-widest transition `.trim();
  if (enabled) {
    return `${shared} border border-red bg-red text-white hover:bg-red-dark ${extra}`.trim();
  }
  return `${shared} cursor-not-allowed border border-white/15 bg-white/5 text-white-muted ${extra}`.trim();
}

function StepNavButtons({
  navPosition,
  isLastStep,
  canAdvance,
  isBuildComplete,
  onBack,
  onContinue,
  onReview,
  layout,
}: StepNavButtonsProps) {
  const isSticky = layout === "sticky";
  const backClassName = `${
    isSticky ? "flex-1 " : ""
  }border border-white/20 px-6 py-3 text-center text-xs uppercase tracking-widest text-white-muted transition hover:border-white hover:text-white${
    isSticky ? " md:flex-none" : ""
  }`;

  return (
    <>
      {navPosition > 0 && (
        <button type="button" onClick={onBack} className={backClassName}>
          Back
        </button>
      )}
      {isLastStep ? (
        isSticky ? (
          <button
            type="button"
            disabled={!isBuildComplete}
            onClick={onReview}
            className={stepNavPrimaryClassName(
              isBuildComplete,
              isSticky,
              "font-semibold",
            )}
          >
            Review & Submit
          </button>
        ) : null
      ) : (
        <button
          type="button"
          disabled={!canAdvance}
          onClick={onContinue}
          className={stepNavPrimaryClassName(canAdvance, isSticky)}
        >
          Continue
        </button>
      )}
    </>
  );
}

export function Configurator({ data }: ConfiguratorProps) {
  const configuratorSteps = data.steps;
  const pricing = data.pricing;
  const navigableStepIndices = useMemo(
    () =>
      configuratorSteps
        .map((_, index) => index)
        .filter((index) => !hiddenStepKeys.includes(stepKeys[index] as StepKey)),
    [configuratorSteps],
  );

  const searchParams = useSearchParams();
  const appliedInitialPlatform = useRef(false);
  const [phase, setPhase] = useState<ConfiguratorPhase>("configure");
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState<BuildConfiguration>(emptyConfig);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [form, setForm] = useState<BuildContactDetails>({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    email: "",
    phone: "",
    notes: "",
    paymentMethod: "square-invoice",
  });

  const currentStep = configuratorSteps[stepIndex];
  const currentKey = stepKeys[stepIndex] as StepKey;
  const summary = useMemo(() => configToSummary(config, data), [config, data]);
  const { platform: platformSpecs, scope: scopeSpecs, other: otherSpecs } =
    useMemo(() => splitSpecSummary(summary), [summary]);
  const submission = useMemo(
    () => compileBuildSubmission(config, configuratorSteps, pricing),
    [config, configuratorSteps, pricing],
  );
  const buildTotalCents = useMemo(
    () => computeBuildTotal(config, pricing),
    [config, pricing],
  );
  const buildLineItems = useMemo(
    () => computeBuildLineItems(config, pricing),
    [config, pricing],
  );
  const selectedCount = stepKeys.filter((key) => config[key] !== null).length;
  const navPosition = navigableStepIndices.indexOf(stepIndex);
  const isLastStep = navPosition === navigableStepIndices.length - 1;
  const goToStep = (position: number) => {
    const target = navigableStepIndices[position];
    if (target === undefined) return;
    setStepIndex(target);
  };
  const canAdvance = config[currentKey] !== null;
  const isBuildComplete = submission.isComplete;
  const showStepNav =
    navPosition > 0 || !isLastStep || (isLastStep && isBuildComplete);
  const showInlineStepNav = navPosition > 0 || !isLastStep;
  const isSwatchStep = swatchSteps.includes(currentKey);
  const isBasecampStep = currentKey === "basecampPackage";
  const isBallisticStep = currentKey === "ballisticPackage";
  const isPackageStep = isBasecampStep || isBallisticStep;
  const isImageGridStep =
    currentStep.options.some((option) => option.image) &&
    !isSwatchStep &&
    !isPackageStep;
  const basecampPackageOption = currentStep.options.find(
    (option) => option.id !== "case-none",
  );
  const basecampNoneOption =
    currentStep.options.find((option) => option.id === "case-none") ??
    BASECAMP_NONE_OPTION;
  const ballisticPackageOption = currentStep.options.find(
    (option) => option.id !== "ballistic-none",
  );
  const ballisticNoneOption = currentStep.options.find(
    (option) => option.id === "ballistic-none",
  );

  const visibleOptions = useMemo(
    () =>
      filterStepOptions(currentKey, currentStep.options, config, {
        caliberAvailability: data.caliberAvailability,
        rings: data.rings,
      }),
    [currentKey, currentStep.options, config, data.caliberAvailability, data.rings],
  );

  useEffect(() => {
    if (appliedInitialPlatform.current) return;

    const slug = searchParams.get("platform");
    if (!slug) return;

    const platform = configuratorSteps[0]?.options.find(
      (option) => option.id === slug,
    );
    if (!platform) return;

    appliedInitialPlatform.current = true;
    setConfig((prev) => ({ ...prev, platform }));
    setStepIndex(1);
  }, [searchParams, configuratorSteps]);

  useLayoutEffect(() => {
    scrollConfiguratorToTop();
  }, [stepIndex, phase]);

  function toggleBasecampItem(option: ConfigOption) {
    setConfig((prev) => {
      const selected = prev.basecampItems.some((item) => item.id === option.id);
      const basecampItems = selected
        ? prev.basecampItems.filter((item) => item.id !== option.id)
        : [...prev.basecampItems, option];
      return {
        ...prev,
        basecampItems,
        basecampPackage:
          basecampItems.length > 0
            ? summarizeBasecampSelection(basecampItems)
            : null,
      };
    });
  }

  function selectBasecampNone() {
    setConfig((prev) => ({
      ...prev,
      basecampItems: [],
      basecampPackage: BASECAMP_NONE_OPTION,
    }));
  }

  function selectOption(option: ConfigOption) {
    setConfig((prev) => {
      const next: BuildConfiguration = {
        ...prev,
        [currentKey]: option,
        ...companionSelection(currentKey, option, data.rings),
      };
      if (currentKey === "platform" && prev.caliber) {
        const allowed = calibersForPlatform(option.id, data.caliberAvailability).map(
          ([id]) => id,
        );
        if (!allowed.includes(prev.caliber.id)) {
          next.caliber = null;
        }
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/build-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, contact: form }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        requestId?: string;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.requestId) {
        throw new Error(data.error ?? "Could not submit build request");
      }

      setRequestId(data.requestId);
      setPhase("submitted");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not submit build request",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "submitted") {
    return (
      <div className="border border-red/30 bg-black-muted p-10 text-center">
        <p className="text-xs uppercase tracking-widest text-red">Build submitted</p>
        <h2 className="mt-4 text-3xl text-white">We&apos;ll be in touch</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-white-muted">
          Your full spec sheet ({submission.totalFormatted} estimated) has been
          recorded. A builder will review your configuration and respond within
          2 business days.
          {" We'll send a Square invoice for the full build price when your build is approved."}
          {requestId && (
            <>
              {" "}
              Reference: <span className="text-white">{requestId}</span>
            </>
          )}
        </p>
        <Link
          href="/builds"
          className="mt-8 inline-block border border-white/20 px-6 py-3 text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
        >
          View Past Builds
        </Link>
      </div>
    );
  }

  if (phase === "review") {
    return (
      <BuildReview
        config={config}
        submission={submission}
        form={form}
        onFormChange={setForm}
        onSubmit={handleSubmit}
        onEdit={() => setPhase("configure")}
        submitting={submitting}
        submitError={submitError}
        steps={configuratorSteps}
      />
    );
  }

  return (
    <>
    {navPosition === 0 && (
      <p className="mb-8 max-w-2xl text-white-muted">
        Walk through platform, caliber, finish, optics, rings, Basecamp Package,
        and Ballistic Package — matching the six BADWRX builds in our source
        spec. Muzzle device and trigger are set per platform. Submit your spec
        for a consultation — no payment required.
      </p>
    )}
    <div className={`grid gap-8 lg:grid-cols-5 ${showStepNav ? "pb-24" : ""}`}>
      <div className="lg:col-span-3">
        <div className="mb-8 flex gap-2">
          {navigableStepIndices.map((stepIdx, position) => {
            const step = configuratorSteps[stepIdx];
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => position <= navPosition && goToStep(position)}
                className={`h-1 flex-1 transition ${
                  position <= navPosition ? "bg-red" : "bg-white/10"
                }`}
                aria-label={`Step ${position + 1}: ${step.title}`}
              />
            );
          })}
        </div>

        <p className="text-xs uppercase tracking-widest text-red">
          Step {navPosition + 1} of {navigableStepIndices.length}
        </p>
        <h2 className="mt-2 text-3xl text-white">{currentStep.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white-muted">
          {currentStep.subtitle}
        </p>

        {isBasecampStep && basecampPackageOption ? (
          <BasecampPackageStep
            details={data.basecampDetails}
            pricing={pricing}
            packageOption={basecampPackageOption}
            noneOption={basecampNoneOption}
            itemOptions={data.basecampDetails.itemOptions ?? []}
            selectedIds={config.basecampItems.map((item) => item.id)}
            noneSelected={config.basecampPackage?.id === basecampNoneOption.id}
            onToggleItem={toggleBasecampItem}
            onSelectNone={selectBasecampNone}
          />
        ) : isBallisticStep && ballisticPackageOption && ballisticNoneOption ? (
          <BallisticPackageStep
            details={data.ballisticDetails}
            pricing={pricing}
            packageOption={ballisticPackageOption}
            noneOption={ballisticNoneOption}
            selectedId={config.ballisticPackage?.id}
            onSelect={selectOption}
          />
        ) : (
        <div
          className={
            isImageGridStep
              ? "mt-8 grid gap-4 sm:grid-cols-2"
              : "mt-8 space-y-3"
          }
        >
          {visibleOptions.map((option) => {
            const selected = config[currentKey]?.id === option.id;
            const optionPrice = getOptionPrice(option.id, pricing);
            const priceLabel = formatPriceDelta(optionPrice, currentKey);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(option)}
                className={`w-full border text-left transition ${
                  isImageGridStep ? "overflow-hidden p-0" : "p-5"
                } ${isSwatchStep ? "flex items-start gap-4" : ""} ${
                  selected
                    ? "border-red bg-red/5"
                    : "border-white/10 bg-black-muted hover:border-white/30"
                }`}
              >
                {option.image && (
                  <OptionImage
                    url={option.image.url}
                    alt={option.image.alt}
                    label={option.label}
                    variant={isSwatchStep ? "swatch" : "banner"}
                  />
                )}
                <div
                  className={`flex min-w-0 flex-1 items-start justify-between gap-4 ${
                    isImageGridStep ? "p-5" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-white">{option.label}</p>
                    {option.description && (
                      <div className="mt-1">
                        <TruncatedText
                          text={option.description}
                          title={option.label}
                          maxLines={isImageGridStep ? 2 : 3}
                          className="text-sm text-white-muted"
                          minCharsForMore={90}
                        />
                      </div>
                    )}
                    {priceLabel && (
                      <p className="mt-2 text-xs uppercase tracking-widest text-red">
                        {priceLabel}
                      </p>
                    )}
                  </div>
                  <span
                    className={`mt-1 h-4 w-4 shrink-0 border ${
                      selected ? "border-red bg-red" : "border-white/30"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
        )}

        {isLastStep && isBuildComplete && (
          <div className="mt-10 border border-red/40 bg-red/5 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-red">
              Ready for review
            </p>
            <h3 className="mt-2 text-2xl text-white">
              Your rifle is fully configured
            </h3>
            <p className="mt-2 text-sm text-white-muted">
              Review your complete spec sheet, confirm pricing, and submit to a
              builder for the next step.
            </p>
          </div>
        )}

        {showInlineStepNav ? (
          <div className="mt-8 hidden gap-4 md:flex">
            <StepNavButtons
              layout="inline"
              navPosition={navPosition}
              isLastStep={isLastStep}
              canAdvance={canAdvance}
              isBuildComplete={isBuildComplete}
              onBack={() => goToStep(navPosition - 1)}
              onContinue={() => goToStep(navPosition + 1)}
              onReview={() => setPhase("review")}
            />
          </div>
        ) : null}
      </div>

      <aside className="lg:col-span-2">
        <div className="sticky top-24 border border-white/10 bg-black-muted p-6">
          <p className="text-xs uppercase tracking-widest text-red">Live spec sheet</p>
          <h3 className="mt-2 text-xl text-white">Your Configuration</h3>

          {Object.keys(summary).length === 0 ? (
            <p className="mt-6 text-sm text-white-muted">
              Selections will appear here as you configure your rifle.
            </p>
          ) : (
            <>
              <SpecPreviewGrid config={config} steps={configuratorSteps} className="mt-6" />
              <SpecSheetGrid specs={platformSpecs} className="mt-6" />
              <SpecSheetGrid
                specs={scopeSpecs}
                className={
                  platformSpecs.length > 0
                    ? "mt-6 border-t border-white/10 pt-6"
                    : "mt-6"
                }
              />
              {otherSpecs.length > 0 && (
                <dl
                  className={
                    platformSpecs.length > 0 || scopeSpecs.length > 0
                      ? "mt-6 space-y-3 border-t border-white/10 pt-6"
                      : "mt-6 space-y-3"
                  }
                >
                  {otherSpecs.map(([key, value]) => (
                    <SpecSheetRow
                      key={key}
                      label={formatSpecLabel(key)}
                      value={value}
                    />
                  ))}
                </dl>
              )}

              {selectedCount > 0 && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-widest text-white-muted">
                    Price estimate
                  </p>
                  <ul className="mt-3 space-y-2">
                    {buildLineItems.map((item) => (
                      <li
                        key={`${item.key}-${item.label}`}
                        className="flex items-start justify-between gap-3 text-xs"
                      >
                        <span className="text-white-muted">{item.label}</span>
                        <span className="shrink-0 text-white">
                          {formatLineItemPrice(item.cents, item.key)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
                    <span className="text-xs uppercase tracking-widest text-white-muted">
                      Estimated total
                    </span>
                    <span className="text-2xl text-white">
                      {formatPrice(buildTotalCents)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white-muted/70">
                    Full payment is due upfront after builder review — we
                    won&apos;t start building until payment is received.
                  </p>
                </div>
              )}
            </>
          )}

          {isBuildComplete && (
            <button
              type="button"
              onClick={() => setPhase("review")}
              className="mt-6 w-full border border-red bg-red py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
            >
              Review & Submit Build
            </button>
          )}

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs text-white-muted">
              Estimated lead time: <span className="text-white">24–30 weeks</span>
            </p>
            <p className="mt-2 text-xs text-white-muted">
              All builds include accuracy verification and test targets.
            </p>
          </div>
        </div>
      </aside>
    </div>

    {showStepNav ? (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#080a07] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="mx-auto flex max-w-7xl gap-3 px-4 py-3 md:justify-end md:gap-4 md:px-6 md:py-4">
          <StepNavButtons
            layout="sticky"
            navPosition={navPosition}
            isLastStep={isLastStep}
            canAdvance={canAdvance}
            isBuildComplete={isBuildComplete}
            onBack={() => goToStep(navPosition - 1)}
            onContinue={() => goToStep(navPosition + 1)}
            onReview={() => setPhase("review")}
          />
        </div>
      </div>
    ) : null}
    </>
  );
}
