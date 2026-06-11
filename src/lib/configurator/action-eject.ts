import type { ActionEject } from "@/lib/types";

export const ACTION_EJECT_OPTIONS: { id: ActionEject; label: string }[] = [
  { id: "right", label: "Right eject" },
  { id: "left", label: "Left eject" },
];

export function actionEjectLabel(value: ActionEject | null | undefined): string | null {
  if (!value) return null;
  return ACTION_EJECT_OPTIONS.find((option) => option.id === value)?.label ?? null;
}
