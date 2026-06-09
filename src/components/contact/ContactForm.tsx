"use client";

import { useState } from "react";
import { formInputClassName, formSelectClassName } from "@/lib/form-styles";

export type ContactInquiryMode = "platform" | "university" | "merch";

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
  courses?: { slug: string; title: string }[];
  merchItems?: { slug: string; title: string }[];
  initialCourseSlug?: string;
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
  if (mode === "university") {
    return { eyebrow: "Registration received", body: "Thank you. We'll respond within 2 business days." };
  }
  if (mode === "merch") {
    return { eyebrow: "Inquiry received", body: "Thank you. We'll respond within 2 business days." };
  }
  return { eyebrow: "Build request received", body: "Thank you. We'll respond within 2 business days." };
}

export function ContactForm({
  mode,
  submitLabel = "Send",
  buildFields,
  courses = [],
  merchItems = [],
  initialCourseSlug,
  initialMerchSlug,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => ({
    course: initialCourseSlug ?? courses[0]?.slug ?? "",
    merch: initialMerchSlug ?? "",
  }));

  const selectedCourse = courses.find((course) => course.slug === values.course);
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

  if (mode === "university") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {courses.length > 1 ? (
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Class
            </span>
            <select
              required
              value={values.course ?? ""}
              onChange={(event) => setValue("course", event.target.value)}
              className={selectClassName}
            >
              <option value="">Select a class…</option>
              {courses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
        ) : selectedCourse ? (
          <div className="border border-red/30 bg-black-light px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-red">Registering for</p>
            <p className="mt-1 text-sm text-white">{selectedCourse.title}</p>
          </div>
        ) : null}

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-white-muted">Full name</span>
          <input
            required
            type="text"
            autoComplete="name"
            value={values["full-name"] ?? ""}
            onChange={(event) => setValue("full-name", event.target.value)}
            className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
                className={inputClassName}
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
                className={inputClassName}
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
                className={inputClassName}
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
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-white-muted">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={values.email ?? ""}
            onChange={(event) => setValue("email", event.target.value)}
            className={inputClassName}
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
            className={`${inputClassName} placeholder:text-white-muted/40`}
          />
        </label>

        <SubmitButton label={submitLabel} />
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
