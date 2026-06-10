"use client";

import { useState } from "react";
import { formInputClassName } from "@/lib/form-styles";

interface UniversityRegistrationFormProps {
  course: { slug: string; title: string };
  submitLabel?: string;
  onSubmitted?: () => void;
}

export function UniversityRegistrationForm({
  course,
  submitLabel = "Register Now",
  onSubmitted,
}: UniversityRegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  function setValue(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    onSubmitted?.();
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
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-red/30 bg-black-light px-4 py-3">
        <p className="text-xs uppercase tracking-widest text-red">Registering for</p>
        <p className="mt-1 text-sm text-white">{course.title}</p>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">
          Full name
        </span>
        <input
          required
          type="text"
          autoComplete="name"
          value={values["full-name"] ?? ""}
          onChange={(event) => setValue("full-name", event.target.value)}
          className={formInputClassName}
        />
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
            autoComplete="address-line1"
            value={values["address-line1"] ?? ""}
            onChange={(event) => setValue("address-line1", event.target.value)}
            className={formInputClassName}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-white-muted/80">
            Apartment, suite, etc.
          </span>
          <input
            type="text"
            autoComplete="address-line2"
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
              autoComplete="address-level2"
              value={values.city ?? ""}
              onChange={(event) => setValue("city", event.target.value)}
              className={formInputClassName}
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted/80">
              State
            </span>
            <input
              required
              type="text"
              autoComplete="address-level1"
              value={values.state ?? ""}
              onChange={(event) => setValue("state", event.target.value)}
              className={formInputClassName}
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted/80">
              ZIP code
            </span>
            <input
              required
              type="text"
              autoComplete="postal-code"
              inputMode="numeric"
              value={values["postal-code"] ?? ""}
              onChange={(event) => setValue("postal-code", event.target.value)}
              className={formInputClassName}
            />
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
          autoComplete="tel"
          value={values.phone ?? ""}
          onChange={(event) => setValue("phone", event.target.value)}
          className={formInputClassName}
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">
          Email
        </span>
        <input
          required
          type="email"
          autoComplete="email"
          value={values.email ?? ""}
          onChange={(event) => setValue("email", event.target.value)}
          className={formInputClassName}
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">
          Additional details
        </span>
        <textarea
          rows={4}
          placeholder="Experience level, preferred dates, rifle setup, or any questions about the class..."
          value={values.message ?? ""}
          onChange={(event) => setValue("message", event.target.value)}
          className={`${formInputClassName} placeholder:text-white-muted/40`}
        />
      </label>

      <button
        type="submit"
        className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark sm:w-auto sm:px-10"
      >
        {submitLabel}
      </button>
    </form>
  );
}
