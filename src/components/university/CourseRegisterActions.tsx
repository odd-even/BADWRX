"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CourseRegistrationModal } from "@/components/university/CourseRegistrationModal";

interface CourseRegisterActionsProps {
  course: { slug: string; title: string };
  openOnMount?: boolean;
  variant?: "sidebar" | "footer";
}

export function CourseRegisterActions({
  course,
  openOnMount = false,
  variant = "sidebar",
}: CourseRegisterActionsProps) {
  const [open, setOpen] = useState(openOnMount);

  useEffect(() => {
    if (openOnMount) setOpen(true);
  }, [openOnMount]);

  if (variant === "footer") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-red bg-red px-10 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
        >
          Register
        </button>
        <Link
          href={`/contact?university=1&course=${course.slug}`}
          className="border border-white/20 px-10 py-4 text-center text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
        >
          Ask a question
        </Link>
        <CourseRegistrationModal
          course={course}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 block w-full border border-red bg-red py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
      >
        Register Now
      </button>
      <CourseRegistrationModal
        course={course}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
