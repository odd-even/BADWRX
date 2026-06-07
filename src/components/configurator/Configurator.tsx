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

const emptyConfig: BuildConfiguration = {
  platform: null,
  caliber: null,
  barrel: null,
  stock: null,
  stockPaint: null,
  trigger: null,
  finish: null,
};

const swatchSteps: StepKey[] = ["stockPaint", "trigger", "finish"];

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
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState<BuildConfiguration>(emptyConfig);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const currentStep = configuratorSteps[stepIndex];
  const currentKey = stepKeys[stepIndex] as StepKey;
  const summary = useMemo(() => configToSummary(config), [config]);
  const isLastStep = stepIndex === configuratorSteps.length - 1;
  const canAdvance = config[currentKey] !== null;
  const isSwatchStep = swatchSteps.includes(currentKey);
  const isImageGridStep =
    currentStep.options.some((option) => option.image) && !isSwatchStep;

  function selectOption(option: ConfigOption) {
    setConfig((prev) => ({ ...prev, [currentKey]: option }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-red/30 bg-black-muted p-10 text-center">
        <p className="text-xs uppercase tracking-widest text-red">Build submitted</p>
        <h2 className="mt-4 text-3xl text-white">
          We&apos;ll be in touch
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-white-muted">
          Your configuration has been recorded. A builder will review your spec
          sheet and respond within 2 business days. No payment required at this
          stage.
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
        <h2 className="mt-2 text-3xl text-white">
          {currentStep.title}
        </h2>
        <p className="mt-2 text-sm text-white-muted">{currentStep.subtitle}</p>

        <div
          className={
            isImageGridStep
              ? "mt-8 grid gap-4 sm:grid-cols-2"
              : "mt-8 space-y-3"
          }
        >
          {currentStep.options.map((option) => {
            const selected = config[currentKey]?.id === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(option)}
                className={`w-full border text-left transition ${
                  isImageGridStep ? "overflow-hidden p-0" : "p-5"
                } ${
                  isSwatchStep ? "flex items-start gap-4" : ""
                } ${
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
                      <p className="mt-1 text-sm text-white-muted">
                        {option.description}
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

        {isLastStep && canAdvance && (
          <form onSubmit={handleSubmit} className="mt-10 border-t border-white/10 pt-10">
            <h3 className="text-xl text-white">
              Request a build consultation
            </h3>
            <p className="mt-2 text-sm text-white-muted">
              No payment now — we&apos;ll review your spec and follow up to
              discuss timeline and pricing.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Name
                </span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Phone (optional)
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  Notes — intended game, hunt style, left/right hand
                </span>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-6 w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark sm:w-auto sm:px-10"
            >
              Submit Build Request
            </button>
          </form>
        )}
      </div>

      <aside className="lg:col-span-2">
        <div className="sticky top-24 border border-white/10 bg-black-muted p-6">
          <p className="text-xs uppercase tracking-widest text-red">Live spec sheet</p>
          <h3 className="mt-2 text-xl text-white">
            Your Configuration
          </h3>

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
            </>
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
