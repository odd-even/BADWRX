import type { BuildConfiguration } from "@/lib/types";
import type { BuildContactDetails, BuildSubmission } from "@/lib/build-submission";
import { stepKeys } from "@/data/configurator-options";
import { OptionImage } from "@/components/configurator/OptionImage";
import { formatPrice, formatLineItemPrice } from "@/lib/pricing";

interface BuildReviewProps {
  config: BuildConfiguration;
  submission: BuildSubmission;
  form: BuildContactDetails;
  onFormChange: (form: BuildContactDetails) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEdit: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

export function BuildReview({
  config,
  submission,
  form,
  onFormChange,
  onSubmit,
  onEdit,
  submitting = false,
  submitError = null,
}: BuildReviewProps) {
  return (
    <div className="space-y-10">
      <div className="border border-red/30 bg-red/5 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-red">
          Configuration complete
        </p>
        <h2 className="mt-2 text-3xl text-white">Review your build</h2>
        <p className="mt-3 max-w-2xl text-sm text-white-muted">
          Confirm every selection below, then submit your spec sheet. A builder
          will review your configuration and follow up within 2 business days.
        </p>
        <p className="mt-4 text-2xl text-white">{submission.totalFormatted}</p>
        <p className="mt-1 text-xs text-white-muted">
          Estimated total · {submission.depositFormatted} suggested deposit after
          approval
        </p>
      </div>

      {stepKeys.some((key) => config[key]?.image) && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {submission.selections.map((line) => {
            const option = config[line.stepKey];
            if (!option?.image) return null;
            return (
              <div key={line.stepKey} className="min-w-0">
                <div className="overflow-hidden border border-white/10">
                  <OptionImage
                    url={option.image.url}
                    alt={option.image.alt}
                    label={option.label}
                    variant="swatch-fill"
                  />
                </div>
                <p className="mt-1 text-[9px] uppercase tracking-wider text-white-muted/60">
                  {line.stepTitle}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-white-muted">
                  {line.optionLabel}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="border border-white/10 bg-black-muted">
        <div className="border-b border-white/10 px-6 py-4">
          <p className="text-xs uppercase tracking-widest text-red">Build spec sheet</p>
        </div>
        <dl className="divide-y divide-white/5">
          {submission.selections.map((line) => (
            <div key={line.stepKey} className="grid gap-2 px-6 py-4 sm:grid-cols-[140px_1fr_auto] sm:items-start sm:gap-6">
              <dt className="text-[10px] uppercase tracking-widest text-white-muted">
                {line.stepTitle}
              </dt>
              <dd>
                <p className="font-medium text-white">{line.optionLabel}</p>
                {Object.entries(line.specs).map(([specKey, value]) => (
                  <p key={specKey} className="mt-1 text-sm text-white-muted">
                    {value}
                  </p>
                ))}
              </dd>
              <dd className="text-sm text-white sm:text-right">
                {formatLineItemPrice(line.priceCents, line.stepKey)}
              </dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-white/10 px-6 py-5">
          <ul className="space-y-2">
            {submission.lineItems.map((item) => (
              <li
                key={`${item.key}-${item.label}`}
                className="flex justify-between gap-4 text-sm"
              >
                <span className="text-white-muted">{item.label}</span>
                <span className="text-white">
                  {formatLineItemPrice(item.cents, item.key)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Estimated total
            </span>
            <span className="text-3xl text-white">{submission.totalFormatted}</span>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="border border-white/10 bg-black-muted p-6 sm:p-8">
        <h3 className="text-xl text-white">Submit for builder review</h3>
        <p className="mt-2 text-sm text-white-muted">
          No payment required now. We&apos;ll confirm your spec, timeline, and
          deposit before anything is charged.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              First name
            </span>
            <input
              required
              id="build-firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) =>
                onFormChange({ ...form, firstName: e.target.value })
              }
              className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Last name
            </span>
            <input
              required
              id="build-lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) =>
                onFormChange({ ...form, lastName: e.target.value })
              }
              className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Email
            </span>
            <input
              required
              id="build-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => onFormChange({ ...form, email: e.target.value })}
              className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Phone
            </span>
            <input
              required
              id="build-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => onFormChange({ ...form, phone: e.target.value })}
              className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Street address
            </span>
            <input
              required
              id="build-addressLine1"
              name="address-line1"
              type="text"
              autoComplete="address-line1"
              value={form.addressLine1}
              onChange={(e) =>
                onFormChange({ ...form, addressLine1: e.target.value })
              }
              className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Apartment, suite, etc. (optional)
            </span>
            <input
              id="build-addressLine2"
              name="address-line2"
              type="text"
              autoComplete="address-line2"
              value={form.addressLine2}
              onChange={(e) =>
                onFormChange({ ...form, addressLine2: e.target.value })
              }
              className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              City
            </span>
            <input
              required
              id="build-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => onFormChange({ ...form, city: e.target.value })}
              className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-white-muted">
                State
              </span>
              <input
                required
                id="build-state"
                name="state"
                type="text"
                autoComplete="address-level1"
                value={form.state}
                onChange={(e) =>
                  onFormChange({ ...form, state: e.target.value })
                }
                className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-white-muted">
                ZIP
              </span>
              <input
                required
                id="build-postalCode"
                name="postal-code"
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                value={form.postalCode}
                onChange={(e) =>
                  onFormChange({ ...form, postalCode: e.target.value })
                }
                className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
              />
            </label>
          </div>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Notes — intended game, hunt style, left/right hand
            </span>
            <textarea
              id="build-notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
              className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <h4 className="text-sm uppercase tracking-widest text-white">
            Deposit payment
          </h4>
          <p className="mt-2 text-sm text-white-muted">
            After approval, we&apos;ll email a Square invoice for the{" "}
            {submission.depositFormatted} deposit. Choose how you&apos;d like to
            pay on Square. Full payment is due prior to build — we won&apos;t
            start building until full payment is received.
          </p>
          <div className="mt-4 space-y-3">
            <label
              className={`flex cursor-pointer items-start gap-4 border p-4 transition ${
                form.paymentMethod === "square-card"
                  ? "border-red bg-red/5"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="square-card"
                checked={form.paymentMethod === "square-card"}
                onChange={() =>
                  onFormChange({ ...form, paymentMethod: "square-card" })
                }
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-white">
                  Square invoice — card
                </span>
                <span className="mt-1 block text-sm text-white-muted">
                  Pay by credit or debit card on the secure Square invoice link.
                </span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-start gap-4 border p-4 transition ${
                form.paymentMethod === "square-ach"
                  ? "border-red bg-red/5"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="square-ach"
                checked={form.paymentMethod === "square-ach"}
                onChange={() =>
                  onFormChange({ ...form, paymentMethod: "square-ach" })
                }
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-white">
                  Square invoice — ACH
                </span>
                <span className="mt-1 block text-sm text-white-muted">
                  Same Square invoice — select bank transfer (ACH) when you pay.
                  Typically clears in 1–3 business days.
                </span>
              </span>
            </label>
          </div>
          {form.paymentMethod === "square-ach" && (
            <p className="mt-4 border border-white/10 bg-black-light px-4 py-3 text-xs text-white-muted">
              ACH is handled through Square on the invoice payment page. No bank
              details are required to submit this build request.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {submitError && (
            <p className="w-full text-sm text-red sm:order-last sm:basis-full">
              {submitError}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-12"
          >
            {submitting ? "Submitting…" : "Submit Build Request"}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs uppercase tracking-widest text-white-muted transition hover:text-white"
          >
            ← Edit configuration
          </button>
        </div>
      </form>
    </div>
  );
}
