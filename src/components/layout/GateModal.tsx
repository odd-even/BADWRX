"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { images } from "@/lib/images";
import { useBodyScrollLock } from "@/lib/modal-body-lock";

interface GateModalProps {
  open: boolean;
  eyebrow: string;
  title: string;
  titleId: string;
  description: string;
  children: ReactNode;
  backdropClassName?: string;
}

export function GateModal({
  open,
  eyebrow,
  title,
  titleId,
  description,
  children,
  backdropClassName = "bg-black/95",
}: GateModalProps) {
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto overscroll-contain px-4 py-5 backdrop-blur-sm sm:items-center sm:px-6 sm:py-8 ${backdropClassName}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="my-auto w-full max-w-sm border border-white/10 bg-black-light p-5 shadow-2xl sm:max-w-md sm:p-8">
        <div className="flex justify-center">
          <Image
            src={images.logos.badge}
            alt={`${brand.short} logo`}
            width={120}
            height={113}
            className="h-20 w-auto sm:h-32 md:h-40"
            priority
          />
        </div>

        <p className="mt-4 text-center text-xs uppercase tracking-widest text-red sm:mt-6">
          {eyebrow}
        </p>
        <h1
          id={titleId}
          className="mt-2 text-center text-2xl text-white sm:text-3xl"
        >
          {title}
        </h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-white-muted sm:mt-4">
          {description}
        </p>

        {children}
      </div>
    </div>
  );
}
