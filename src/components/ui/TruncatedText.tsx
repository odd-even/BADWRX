"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const lineClampClass: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

interface TruncatedTextProps {
  text: string;
  /** Modal heading — defaults to "Details" */
  title?: string;
  maxLines?: 2 | 3 | 4 | 5;
  className?: string;
  /** Show More when text exceeds this length even if clamp doesn't overflow */
  minCharsForMore?: number;
}

export function TruncatedText({
  text,
  title = "Details",
  maxLines = 3,
  className = "",
  minCharsForMore = 120,
}: TruncatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [open, setOpen] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [text, maxLines, measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const showMore =
    overflows || text.length > minCharsForMore;
  const clamp = lineClampClass[maxLines] ?? "line-clamp-3";

  return (
    <>
      <p ref={ref} className={`${clamp} ${className}`.trim()}>
        {text}
      </p>
      {showMore && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }
          }}
          className="mt-1.5 inline-block cursor-pointer text-[10px] font-semibold uppercase tracking-widest text-red transition hover:text-red-dark"
        >
          More
        </span>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="truncated-text-modal-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto border border-white/10 bg-black-muted p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              id="truncated-text-modal-title"
              className="text-xs uppercase tracking-widest text-red"
            >
              {title}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white-muted whitespace-pre-wrap">
              {text}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-8 w-full border border-white/20 py-3 text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red sm:w-auto sm:px-10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
