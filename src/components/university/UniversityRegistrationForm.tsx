"use client";

import { useState } from "react";
import { formInputClassName } from "@/lib/form-styles";
import type { UniversityRegistrationFieldErrors } from "@/lib/university-registrations/validate";

interface UniversityRegistrationFormProps {
  course: { slug: string; title: string };
  submitLabel?: string;
  onSubmitted?: () => void;
}

function inputClass(hasError: boolean) {
  return `${formInputClassName}${hasError ? " border-red" : ""}`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm text-red" role="alert">
      {message}
    </p>
  );
}

export function UniversityRegistrationForm({
  course,
  submitLabel = "Register Now",
  onSubmitted,
}: UniversityRegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UniversityRegistrationFieldErrors>({});
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  function setValue(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      const fieldMap: Record<string, keyof UniversityRegistrationFieldErrors> = {
        name: "name",
        email: "email",
        phone: "phone",
        "address-line1": "addressLine1",
        city: "city",
        state: "state",
        "postal-code": "postalCode",
      };
      const field = fieldMap[id];
      if (field) delete next[field];
      return next;
    });
    setSubmitError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/university-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course,
          name: values.name ?? "",
          addressLine1: values["address-line1"] ?? "",
          addressLine2: values["address-line2"] ?? "",
          city: values.city ?? "",
          state: values.state ?? "",
          postalCode: values["postal-code"] ?? "",
          email: values.email ?? "",
          phone: values.phone ?? "",
          message: values.message ?? "",
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        registrationId?: string;
        error?: string;
        fieldErrors?: UniversityRegistrationFieldErrors;
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        throw new Error(data.error ?? "Could not submit registration");
      }

      setRegistrationId(data.registrationId ?? null);
      setSubmitted(true);
      onSubmitted?.();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not submit registration",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-red/30 bg-black-light p-6">
        <p className="text-xs uppercase tracking-widest text-red">
          Registration received
        </p>
        <p className="mt-4 text-sm text-white">
          Thank you. We&apos;ll respond within 2 business days with availability,
          class details, and next steps.
          {registrationId ? (
            <>
              {" "}
              Reference: <span className="text-white-muted">{registrationId}</span>
            </>
          ) : null}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
      <div className="border border-red/30 bg-black-light px-4 py-3">
        <p className="text-xs uppercase tracking-widest text-red">Registering for</p>
        <p className="mt-1 text-sm text-white">{course.title}</p>
      </div>

      {submitError ? (
        <p className="text-sm text-red" role="alert">
          {submitError}
        </p>
      ) : null}

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">
          Full name
        </span>
        <input
          required
          type="text"
          name="name"
          autoComplete="name"
          value={values.name ?? ""}
          onChange={(event) => setValue("name", event.target.value)}
          className={inputClass(Boolean(fieldErrors.name))}
        />
        <FieldError message={fieldErrors.name} />
      </label>

      <fieldset className="space-y-4">
        <legend className="text-xs uppercase tracking-widest text-white-muted">
          Address
        </legend>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-white-muted/80">
            Street address
          </span>
          <input
            required
            type="text"
            name="address-line1"
            autoComplete="shipping address-line1"
            value={values["address-line1"] ?? ""}
            onChange={(event) => setValue("address-line1", event.target.value)}
            className={inputClass(Boolean(fieldErrors.addressLine1))}
          />
          <FieldError message={fieldErrors.addressLine1} />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-white-muted/80">
            Apartment, suite, etc.
          </span>
          <input
            type="text"
            name="address-line2"
            autoComplete="shipping address-line2"
            value={values["address-line2"] ?? ""}
            onChange={(event) => setValue("address-line2", event.target.value)}
            className={formInputClassName}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-widest text-white-muted/80">
              City
            </span>
            <input
              required
              type="text"
              name="city"
              autoComplete="shipping address-level2"
              value={values.city ?? ""}
              onChange={(event) => setValue("city", event.target.value)}
              className={inputClass(Boolean(fieldErrors.city))}
            />
            <FieldError message={fieldErrors.city} />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted/80">
              State
            </span>
            <input
              required
              type="text"
              name="state"
              autoComplete="shipping address-level1"
              value={values.state ?? ""}
              onChange={(event) => setValue("state", event.target.value)}
              className={inputClass(Boolean(fieldErrors.state))}
            />
            <FieldError message={fieldErrors.state} />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted/80">
              ZIP code
            </span>
            <input
              required
              type="text"
              name="postal-code"
              autoComplete="shipping postal-code"
              inputMode="numeric"
              value={values["postal-code"] ?? ""}
              onChange={(event) => setValue("postal-code", event.target.value)}
              className={inputClass(Boolean(fieldErrors.postalCode))}
            />
            <FieldError message={fieldErrors.postalCode} />
          </label>
        </div>
      </fieldset>

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">
          Phone number
        </span>
        <input
          required
          type="tel"
          name="tel"
          autoComplete="tel"
          inputMode="tel"
          value={values.phone ?? ""}
          onChange={(event) => setValue("phone", event.target.value)}
          className={inputClass(Boolean(fieldErrors.phone))}
        />
        <FieldError message={fieldErrors.phone} />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">
          Email
        </span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          value={values.email ?? ""}
          onChange={(event) => setValue("email", event.target.value)}
          className={inputClass(Boolean(fieldErrors.email))}
        />
        <FieldError message={fieldErrors.email} />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">
          Additional details
        </span>
        <textarea
          rows={4}
          name="message"
          placeholder="Experience level, preferred dates, rifle setup, or any questions about the class..."
          value={values.message ?? ""}
          onChange={(event) => setValue("message", event.target.value)}
          className={`${formInputClassName} placeholder:text-white-muted/40`}
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {submitting ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
