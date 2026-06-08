"use client";

import { useState } from "react";
interface ContactField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
}

const inputClassName =
  "mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red";

interface ContactFormProps {
  courseTitle?: string;
  merchTitle?: string;
  submitLabel?: string;
  buildFields?: ContactField[];
}

function isRadioField(field: ContactField) {
  return field.type.toLowerCase().includes("radio");
}

function isTextAreaField(field: ContactField) {
  return (
    field.type.toLowerCase().includes("textarea") ||
    field.label.toLowerCase().includes("additional")
  );
}

export function ContactForm({
  courseTitle,
  merchTitle,
  submitLabel = "Send Message",
  buildFields,
}: ContactFormProps) {
  const inquiryTitle = courseTitle ?? merchTitle;
  const inquiryLabel = courseTitle ? "Registering for" : merchTitle ? "Inquiring about" : null;
  const isBuildForm = Boolean(buildFields?.length) && !inquiryTitle;
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  function setValue(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-red/30 bg-black-muted p-8">
        <p className="text-xs uppercase tracking-widest text-red">
          {inquiryTitle ? (courseTitle ? "Registration received" : "Inquiry received") : "Build request received"}
        </p>
        <p className="mt-4 text-white">
          Thank you. We&apos;ll respond within 2 business days.
        </p>
      </div>
    );
  }

  if (isBuildForm && buildFields) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {buildFields
            .filter((field) => field.id === "first-name" || field.id === "last-name")
            .map((field) => (
              <label key={field.id} className="block">
                <span className="text-xs uppercase tracking-widest text-white-muted">
                  {field.label}
                </span>
                <input
                  required={field.required}
                  type="text"
                  value={values[field.id] ?? ""}
                  onChange={(event) => setValue(field.id, event.target.value)}
                  className={inputClassName}
                />
              </label>
            ))}
        </div>

        {buildFields
          .filter(
            (field) =>
              field.id === "email-address" ||
              field.id === "phone-number",
          )
          .map((field) => (
            <label key={field.id} className="block">
              <span className="text-xs uppercase tracking-widest text-white-muted">
                {field.label}
              </span>
              <input
                required={field.required}
                type={field.id === "email-address" ? "email" : "tel"}
                value={values[field.id] ?? ""}
                onChange={(event) => setValue(field.id, event.target.value)}
                className={inputClassName}
              />
            </label>
          ))}

        {buildFields
          .filter((field) => field.type.toLowerCase().includes("dropdown"))
          .map((field) => (
            <label key={field.id} className="block">
              <span className="text-xs uppercase tracking-widest text-white-muted">
                {field.label}
              </span>
              <select
                required={field.required}
                value={values[field.id] ?? ""}
                onChange={(event) => setValue(field.id, event.target.value)}
                className={inputClassName}
              >
                <option value="">Select…</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}

        {buildFields.filter(isRadioField).map((field) => (
          <fieldset key={field.id} className="space-y-2">
            <legend className="text-xs uppercase tracking-widest text-white-muted">
              {field.label}
            </legend>
            <div className="flex flex-wrap gap-4">
              {field.options.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={values[field.id] === option}
                    onChange={() => setValue(field.id, option)}
                    className="accent-red"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {buildFields.filter(isTextAreaField).map((field) => (
          <label key={field.id} className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              {field.label}
            </span>
            <textarea
              rows={5}
              placeholder={field.options[0]}
              value={values[field.id] ?? ""}
              onChange={(event) => setValue(field.id, event.target.value)}
              className={`${inputClassName} placeholder:text-white-muted/40`}
            />
          </label>
        ))}

        <button
          type="submit"
          className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark sm:w-auto sm:px-10"
        >
          Send My Build Request
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {inquiryTitle && inquiryLabel && (
        <div className="border border-red/30 bg-black-light px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-red">{inquiryLabel}</p>
          <p className="mt-1 text-sm text-white">{inquiryTitle}</p>
        </div>
      )}
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">Name</span>
        <input required type="text" className={inputClassName} />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">Email</span>
        <input required type="email" className={inputClassName} />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">Message</span>
        <textarea
          required
          rows={5}
          placeholder={
            courseTitle
              ? "Tell us about your experience level, preferred dates, or any questions about the class..."
              : merchTitle
                ? "Tell us your size, color preference, quantity, or shipping questions..."
                : "Tell us about your hunt, preferred caliber, or questions about a past build..."
          }
          className={`${inputClassName} placeholder:text-white-muted/40`}
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
