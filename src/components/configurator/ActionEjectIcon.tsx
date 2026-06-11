import type { ActionEject } from "@/lib/types";

interface ActionEjectIconProps {
  direction: ActionEject;
  className?: string;
}

export function ActionEjectIcon({ direction, className = "" }: ActionEjectIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "right" ? (
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>
      ) : (
        <>
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </>
      )}
    </svg>
  );
}
