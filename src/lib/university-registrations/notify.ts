import { Resend } from "resend";
import { isEmailConfigured } from "@/lib/build-requests/notify";
import { notificationRecipients } from "@/lib/notifications/recipients";
import { formatUniversityRegistrationAddress } from "@/lib/university-registrations/validate";
import type { UniversityRegistrationPayload } from "@/lib/university-registrations/types";

const DEFAULT_FROM = "BADWRX University <info@badwrx.com>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(payload: UniversityRegistrationPayload): string {
  const address = formatUniversityRegistrationAddress(payload);

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:640px;margin:0 auto;">
    <h2 style="margin:0 0 4px;">Long Range University registration</h2>
    <p style="margin:0 0 16px;color:#666;font-size:13px;">
      Reference: ${escapeHtml(payload.registrationId)} · ${escapeHtml(payload.submittedAt)}
    </p>

    <h3 style="margin:24px 0 8px;">Course</h3>
    <p style="margin:0;line-height:1.6;">
      <strong>${escapeHtml(payload.course.title)}</strong><br/>
      Slug: ${escapeHtml(payload.course.slug)}
    </p>

    <h3 style="margin:24px 0 8px;">Student</h3>
    <p style="margin:0;line-height:1.6;">
      <strong>${escapeHtml(payload.name)}</strong><br/>
      <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a><br/>
      ${escapeHtml(payload.phone)}<br/>
      ${escapeHtml(address).replace(/\n/g, "<br/>")}
    </p>
    ${
      payload.message
        ? `<p style="margin:12px 0 0;"><strong>Additional details:</strong><br/>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>`
        : ""
    }
  </div>`;
}

function buildText(payload: UniversityRegistrationPayload): string {
  const address = formatUniversityRegistrationAddress(payload);

  return [
    "Long Range University registration",
    `Reference: ${payload.registrationId}`,
    `Submitted: ${payload.submittedAt}`,
    "",
    `Course: ${payload.course.title} (${payload.course.slug})`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Address:\n${address}`,
    payload.message ? `Additional details: ${payload.message}` : null,
  ]
    .filter((value): value is string => value !== null)
    .join("\n");
}

function universityNotificationRecipients(): string[] {
  return notificationRecipients(
    process.env.UNIVERSITY_NOTIFICATION_TO ?? process.env.BUILD_NOTIFICATION_TO,
  );
}

function universityNotificationFrom(): string {
  return (
    process.env.UNIVERSITY_NOTIFICATION_FROM?.trim() ||
    process.env.BUILD_NOTIFICATION_FROM?.trim() ||
    DEFAULT_FROM
  );
}

/** Never throws — a failed send must not break the customer's submission. */
export async function sendUniversityRegistrationEmail(
  payload: UniversityRegistrationPayload,
): Promise<boolean> {
  if (!isEmailConfigured()) return false;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: universityNotificationFrom(),
      to: universityNotificationRecipients(),
      replyTo: payload.email,
      subject: `University registration — ${payload.course.title} — ${payload.name}`,
      html: buildHtml(payload),
      text: buildText(payload),
    });

    if (error) {
      console.error("Failed to send university registration email:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send university registration email:", error);
    return false;
  }
}
