"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  configuratorSteps,
  stepKeys,
  type StepKey,
} from "@/data/configurator-options";
import type { BuildConfiguration, ConfigOption } from "@/lib/types";
import { OptionImage } from "@/components/configurator/OptionImage";
import { TruncatedText } from "@/components/ui/TruncatedText";
import { BuildReview } from "@/components/configurator/BuildReview";
import {
  compileBuildSubmission,
  type BuildContactDetails,
} from "@/lib/build-submission";
import {
  computeBuildLineItems,
  computeBuildTotal,
  computeDepositCents,
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
  muzzleBrake: null,
  suppressor: null,
  rifleCase: null,
};

const swatchSteps: StepKey[] = ["stockPaint", "rings"];

type ConfiguratorPhase = "configure" | "review" | "submitted";

function configToSummary(config: BuildConfiguration): Record<string, string> {
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
  return summary;
}

export function Configurator() {
  const [phase, setPhase] = useState<ConfiguratorPhase>("configure");
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState<BuildConfiguration>(emptyConfig);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [form, setForm] = useState<BuildContactDetails>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    paymentMethod: "square-card",
  });

  const currentStep = configuratorSteps[stepIndex];
  const currentKey = stepKeys[stepIndex] as StepKey;
  const summary = useMemo(() => configToSummary(config), [config]);
  const submission = useMemo(() => compileBuildSubmission(config), [config]);
  const buildTotalCents = useMemo(() => computeBuildTotal(config), [config]);
  const buildLineItems = useMemo(() => computeBuildLineItems(config), [config]);
  const depositCents = useMemo(
    () => computeDepositCents(buildTotalCents),
    [buildTotalCents],
  );
  const selectedCount = stepKeys.filter((key) => config[key] !== null).length;
  const isLastStep = stepIndex === configuratorSteps.length - 1;
  const canAdvance = config[currentKey] !== null;
  const isBuildComplete = submission.isComplete;
  const isSwatchStep = swatchSteps.includes(currentKey);
  const isImageGridStep =
    currentStep.options.some((option) => option.image) && !isSwatchStep;

  function selectOption(option: ConfigOption) {
    setConfig((prev) => ({ ...prev, [currentKey]: option }));
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
          {form.paymentMethod === "square-ach"
            ? " We'll send a Square invoice for your deposit — choose bank transfer (ACH) when you pay on Square."
            : " We'll send a Square invoice for your deposit when your build is approved."}
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
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="mb-8 flex gap-2">
          {configuratorSteps.map((step, i) => (
            <button
              key={step.id}
              type="button"
              onClick={() => i <= stepIndex && setStepIndex(i)}
              className={`h-1 flex-1 transition ${
                i <= stepIndex ? "bg-red" : "bg-white/10"
              }`}
              aria-label={`Step ${i + 1}: ${step.title}`}
            />
          ))}
        </div>

        <p className="text-xs uppercase tracking-widest text-red">
          Step {stepIndex + 1} of {configuratorSteps.length}
        </p>
        <h2 className="mt-2 text-3xl text-white">{currentStep.title}</h2>
        <p className="mt-2 text-sm text-white-muted">
          <TruncatedText
            text={currentStep.subtitle}
            title={currentStep.title}
            maxLines={2}
            minCharsForMore={100}
          />
        </p>

        <div
          className={
            isImageGridStep
              ? "mt-8 grid gap-4 sm:grid-cols-2"
              : "mt-8 space-y-3"
          }
        >
          {currentStep.options.map((option) => {
            const selected = config[currentKey]?.id === option.id;
            const optionPrice = getOptionPrice(option.id);
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
                    <p className="mt-2 text-xs uppercase tracking-widest text-red">
                      {formatPriceDelta(optionPrice)}
                    </p>
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
            <button
              type="button"
              onClick={() => setPhase("review")}
              className="mt-6 w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark sm:w-auto sm:px-10"
            >
              Review & Submit Build →
            </button>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex((i) => i - 1)}
              className="border border-white/20 px-6 py-3 text-xs uppercase tracking-widest text-white-muted transition hover:border-white hover:text-white"
            >
              Back
            </button>
          )}
          {!isLastStep && (
            <button
              type="button"
              disabled={!canAdvance}
              onClick={() => setStepIndex((i) => i + 1)}
              className="border border-red bg-red px-6 py-3 text-xs uppercase tracking-widest text-white transition hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          )}
        </div>
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
              {stepKeys.some((key) => config[key]?.image) && (
                <div className="mt-6 grid grid-cols-3 gap-x-2 gap-y-3">
                  {stepKeys.map((key) => {
                    const option = config[key];
                    if (!option?.image) return null;
                    const stepTitle = configuratorSteps.find(
                      (step) => step.id === key,
                    )?.title;
                    return (
                      <div key={key} className="min-w-0">
                        <div className="overflow-hidden border border-white/10">
                          <OptionImage
                            url={option.image.url}
                            alt={option.image.alt}
                            label={option.label}
                            variant="swatch-fill"
                          />
                        </div>
                        {stepTitle && (
                          <p className="mt-1 text-[9px] uppercase tracking-wider text-white-muted/60">
                            {stepTitle}
                          </p>
                        )}
                        <p className="mt-0.5 text-[10px] leading-snug text-white-muted">
                          {option.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
              <dl className="mt-6 space-y-3">
                {Object.entries(summary).map(([key, value]) => (
                  <div key={key} className="border-b border-white/5 pb-3">
                    <dt className="text-[10px] uppercase tracking-widest text-white-muted">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="mt-1 text-sm text-white">{value}</dd>
                  </div>
                ))}
              </dl>

              {selectedCount > 0 && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-[10px] uppercase tracking-widest text-white-muted">
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
                          {item.cents === 0 ? "Included" : formatPrice(item.cents)}
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
                  <p className="mt-2 text-[10px] text-white-muted/70">
                    Suggested deposit (50%): {formatPrice(depositCents)} — due
                    after builder review
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
              Estimated lead time: <span className="text-white">12–16 weeks</span>
            </p>
            <p className="mt-2 text-xs text-white-muted">
              All builds include accuracy verification and test targets.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
