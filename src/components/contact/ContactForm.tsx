"use client";

import { useState } from "react";
import { formInputClassName, formSelectClassName } from "@/lib/form-styles";

export type ContactInquiryMode = "platform" | "merch";

export interface ContactField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
}

const inputClassName = formInputClassName;
const selectClassName = formSelectClassName;

interface ContactFormProps {
  mode: ContactInquiryMode;
  submitLabel?: string;
  buildFields?: ContactField[];
  merchItems?: { slug: string; title: string }[];
  initialMerchSlug?: string;
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

function successCopy(mode: ContactInquiryMode) {
  if (mode === "merch") {
    return { eyebrow: "Inquiry received", body: "Thank you. We'll respond within 2 business days." };
  }
  return { eyebrow: "Build request received", body: "Thank you. We'll respond within 2 business days." };
}

export function ContactForm({
  mode,
  submitLabel = "Send",
  buildFields,
  merchItems = [],
  initialMerchSlug,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => ({
    merch: initialMerchSlug ?? "",
  }));

  const selectedMerch = merchItems.find((item) => item.slug === values.merch);

  function setValue(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    const copy = successCopy(mode);
    return (
      <div className="border border-red/30 bg-black-light p-8">
        <p className="text-xs uppercase tracking-widest text-red">{copy.eyebrow}</p>
        <p className="mt-4 text-white">{copy.body}</p>
      </div>
    );
  }

  if (mode === "platform" && buildFields?.length) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
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
                  name={field.id === "first-name" ? "givenName" : "familyName"}
                  autoComplete={
                    field.id === "first-name" ? "given-name" : "family-name"
                  }
                  value={values[field.id] ?? ""}
                  onChange={(event) => setValue(field.id, event.target.value)}
                  className={inputClassName}
                />
              </label>
            ))}
        </div>

        {buildFields
          .filter(
            (field) => field.id === "email-address" || field.id === "phone-number",
          )
          .map((field) => (
            <label key={field.id} className="block">
              <span className="text-xs uppercase tracking-widest text-white-muted">
                {field.label}
              </span>
              <input
                required={field.required}
                type={field.id === "email-address" ? "email" : "tel"}
                name={field.id === "email-address" ? "email" : "tel"}
                autoComplete={field.id === "email-address" ? "email" : "tel"}
                inputMode={field.id === "phone-number" ? "tel" : undefined}
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
                className={selectClassName}
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

        <SubmitButton label={submitLabel} />
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">
          Product
        </span>
        <select
          value={values.merch ?? ""}
          onChange={(event) => setValue("merch", event.target.value)}
          className={selectClassName}
        >
          <option value="">General merch inquiry</option>
          {merchItems.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.title}
            </option>
          ))}
        </select>
      </label>

      {selectedMerch && (
        <div className="border border-red/30 bg-black-light px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-red">Inquiring about</p>
          <p className="mt-1 text-sm text-white">{selectedMerch.title}</p>
        </div>
      )}

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">Name</span>
        <input
          required
          type="text"
          name="name"
          autoComplete="name"
          value={values.name ?? ""}
          onChange={(event) => setValue("name", event.target.value)}
          className={inputClassName}
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">Email</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          value={values.email ?? ""}
          onChange={(event) => setValue("email", event.target.value)}
          className={inputClassName}
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">Message</span>
        <textarea
          required
          rows={5}
          placeholder="Tell us your size, color preference, quantity, or shipping questions..."
          value={values.message ?? ""}
          onChange={(event) => setValue("message", event.target.value)}
          className={`${inputClassName} placeholder:text-white-muted/40`}
        />
      </label>

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark sm:w-auto sm:px-10"
    >
      {label}
    </button>
  );
}
