"use client";

import { useState } from "react";

interface ContactFormProps {
  courseTitle?: string;
  merchTitle?: string;
  submitLabel?: string;
}

export function ContactForm({
  courseTitle,
  merchTitle,
  submitLabel = "Send Message",
}: ContactFormProps) {
  const inquiryTitle = courseTitle ?? merchTitle;
  const inquiryLabel = courseTitle ? "Registering for" : merchTitle ? "Inquiring about" : null;
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-red/30 bg-black-muted p-8">
        <p className="text-xs uppercase tracking-widest text-red">
          {inquiryTitle ? (courseTitle ? "Registration received" : "Inquiry received") : "Message sent"}
        </p>
        <p className="mt-4 text-white">
          Thank you. We&apos;ll respond within 2 business days.
        </p>
      </div>
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
        <input
          required
          type="text"
          className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-white-muted">Email</span>
        <input
          required
          type="email"
          className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none focus:border-red"
        />
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
          className="mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none placeholder:text-white-muted/40 focus:border-red"
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
