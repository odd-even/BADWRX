"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { UniversityRegistrationForm } from "@/components/university/UniversityRegistrationForm";

interface CourseRegistrationModalProps {
  course: { slug: string; title: string };
  open: boolean;
  onClose: () => void;
}

export function CourseRegistrationModal({
  course,
  open,
  onClose,
}: CourseRegistrationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-registration-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-white/10 bg-black-muted p-6 shadow-xl sm:p-8 lg:max-w-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-red">Register for class</p>
            <h2
              id="course-registration-title"
              className="mt-2 text-2xl text-white"
            >
              {course.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white-muted">
              Complete the form and our team will follow up with availability,
              class details, and next steps. No payment required to register your
              interest.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration form"
            className="shrink-0 border border-white/20 px-3 py-2 text-xs uppercase tracking-widest text-white-muted transition hover:border-red hover:text-red"
          >
            Close
          </button>
        </div>

        <div className="mt-8">
          <UniversityRegistrationForm course={course} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
