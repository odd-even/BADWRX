/** Default inboxes for shop notifications (build requests, etc.). */
export const DEFAULT_NOTIFICATION_TO = [
  "info@badwrx.com",
  "ernest@oddpluseven.com",
] as const;

/** Parse BUILD_NOTIFICATION_TO — comma-separated list, or use defaults. */
export function notificationRecipients(envValue?: string): string[] {
  if (!envValue?.trim()) return [...DEFAULT_NOTIFICATION_TO];
  return envValue
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
