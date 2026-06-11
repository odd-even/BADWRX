import type { BuildConfiguration, ConfigStep } from "@/lib/types";
import type { BuildContactDetails, BuildSubmission } from "@/lib/build-submission";
import type { BuildContactFieldErrors } from "@/lib/contact-validation";
import { SpecPreviewGrid } from "@/components/configurator/SpecPreviewGrid";
import { formatPrice, formatLineItemPrice } from "@/lib/pricing";
import { formInputClassName } from "@/lib/form-styles";

interface BuildReviewProps {
  config: BuildConfiguration;
  submission: BuildSubmission;
  form: BuildContactDetails;
  onFormChange: (form: BuildContactDetails) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEdit: () => void;
  submitting?: boolean;
  submitError?: string | null;
  fieldErrors?: BuildContactFieldErrors;
  steps: ConfigStep[];
}

function inputClassName(hasError: boolean) {
  return `${formInputClassName} ${hasError ? "border-red" : ""}`.trim();
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red">{message}</p>;
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
  fieldErrors = {},
  steps,
}: BuildReviewProps) {
  return (
    <div className="space-y-10">
      <div className="red-tint-panel border border-red/30 p-6 sm:p-8">
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
          Estimated total · full payment due upfront before build begins
        </p>
      </div>

      <SpecPreviewGrid config={config} steps={steps} variant="review" />

      <div className="border border-white/10 bg-black-muted">
        <div className="border-b border-white/10 px-6 py-4">
          <p className="text-xs uppercase tracking-widest text-red">Build spec sheet</p>
        </div>
        <dl className="divide-y divide-white/5">
          {submission.selections.map((line) => (
            <div
              key={`${line.stepKey}-${line.optionLabel}`}
              className="grid gap-2 px-6 py-4 sm:grid-cols-[140px_1fr_auto] sm:items-start sm:gap-6"
            >
              <dt className="text-xs uppercase tracking-widest text-white-muted">
                {line.stepTitle}
              </dt>
              <dd>
                <p className="font-medium text-white">{line.optionLabel}</p>
                {Object.entries(line.specs)
                  .filter(([specKey]) => specKey !== "code")
                  .map(([specKey, value]) => (
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

      <form onSubmit={onSubmit} autoComplete="on" className="border border-white/10 bg-black-muted p-6 sm:p-8">
        <h3 className="text-xl text-white">Submit for builder review</h3>
        <p className="mt-2 text-sm text-white-muted">
          No payment required now. We&apos;ll confirm your spec and timeline
          before sending a Square invoice for the full build price. US shipping
          addresses only.
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
              autoComplete="shipping given-name"
              value={form.firstName}
              onChange={(e) =>
                onFormChange({ ...form, firstName: e.target.value })
              }
              aria-invalid={Boolean(fieldErrors.firstName)}
              className={inputClassName(Boolean(fieldErrors.firstName))}
            />
            <FieldError message={fieldErrors.firstName} />
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
              autoComplete="shipping family-name"
              value={form.lastName}
              onChange={(e) =>
                onFormChange({ ...form, lastName: e.target.value })
              }
              aria-invalid={Boolean(fieldErrors.lastName)}
              className={inputClassName(Boolean(fieldErrors.lastName))}
            />
            <FieldError message={fieldErrors.lastName} />
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
              aria-invalid={Boolean(fieldErrors.email)}
              className={inputClassName(Boolean(fieldErrors.email))}
            />
            <FieldError message={fieldErrors.email} />
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
              placeholder="(555) 555-5555"
              value={form.phone}
              onChange={(e) => onFormChange({ ...form, phone: e.target.value })}
              aria-invalid={Boolean(fieldErrors.phone)}
              className={inputClassName(Boolean(fieldErrors.phone))}
            />
            <FieldError message={fieldErrors.phone} />
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
              autoComplete="shipping address-line1"
              value={form.addressLine1}
              onChange={(e) =>
                onFormChange({ ...form, addressLine1: e.target.value })
              }
              aria-invalid={Boolean(fieldErrors.addressLine1)}
              className={inputClassName(Boolean(fieldErrors.addressLine1))}
            />
            <FieldError message={fieldErrors.addressLine1} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Apartment, suite, etc. (optional)
            </span>
            <input
              id="build-addressLine2"
              name="address-line2"
              type="text"
              autoComplete="shipping address-line2"
              value={form.addressLine2}
              onChange={(e) =>
                onFormChange({ ...form, addressLine2: e.target.value })
              }
              className={formInputClassName}
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
              autoComplete="shipping address-level2"
              value={form.city}
              onChange={(e) => onFormChange({ ...form, city: e.target.value })}
              aria-invalid={Boolean(fieldErrors.city)}
              className={inputClassName(Boolean(fieldErrors.city))}
            />
            <FieldError message={fieldErrors.city} />
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
                autoComplete="shipping address-level1"
                placeholder="MS"
                value={form.state}
                onChange={(e) =>
                  onFormChange({ ...form, state: e.target.value })
                }
                aria-invalid={Boolean(fieldErrors.state)}
                className={inputClassName(Boolean(fieldErrors.state))}
              />
              <FieldError message={fieldErrors.state} />
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
                autoComplete="shipping postal-code"
                inputMode="numeric"
                placeholder="12345"
                value={form.postalCode}
                onChange={(e) =>
                  onFormChange({ ...form, postalCode: e.target.value })
                }
                aria-invalid={Boolean(fieldErrors.postalCode)}
                className={inputClassName(Boolean(fieldErrors.postalCode))}
              />
              <FieldError message={fieldErrors.postalCode} />
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
              className={formInputClassName}
            />
          </label>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <h4 className="text-sm uppercase tracking-widest text-white">
            Payment
          </h4>
          <p className="mt-2 text-sm text-white-muted">
            After approval, we&apos;ll email a Square invoice for the full build
            price ({submission.totalFormatted}). Pay by card or bank transfer on
            the secure Square invoice link. We won&apos;t start building until
            payment is received in full.
          </p>
          <div className="mt-4 border border-white/10 bg-black-light p-4">
            <p className="font-medium text-white">Square invoice</p>
            <p className="mt-1 text-sm text-white-muted">
              Card and bank transfer (ACH) are available when you pay on Square.
              No payment details are required to submit this build request.
            </p>
          </div>
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
