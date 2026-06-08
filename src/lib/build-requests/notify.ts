import { Resend } from "resend";
import {
  getContactAddress,
  getContactFullName,
  type BuildRequestPayload,
} from "@/lib/build-submission";
import { formatLineItemPrice } from "@/lib/pricing";

const DEFAULT_TO = "ernest@oddpluseven.com";
const DEFAULT_FROM = "BADWRX Builds <builds@oddpluseven.com>";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(requestId: string, payload: BuildRequestPayload): string {
  const { contact } = payload;
  const rows = payload.selections
    .map(
      (line) => `
        <tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(line.stepTitle)}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;">${escapeHtml(line.optionLabel)}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(formatLineItemPrice(line.priceCents, line.stepKey))}</td>
        </tr>`,
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:640px;margin:0 auto;">
    <h2 style="margin:0 0 4px;">New build request</h2>
    <p style="margin:0 0 16px;color:#666;font-size:13px;">Reference: ${escapeHtml(requestId)} · ${escapeHtml(payload.submittedAt)}</p>

    <h3 style="margin:24px 0 8px;">Customer</h3>
    <p style="margin:0;line-height:1.6;">
      <strong>${escapeHtml(getContactFullName(contact))}</strong><br/>
      <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a><br/>
      ${escapeHtml(contact.phone)}<br/>
      ${escapeHtml(getContactAddress(contact))}<br/>
      Payment: ${escapeHtml(payload.paymentMethod)}
    </p>
    ${contact.notes ? `<p style="margin:12px 0 0;"><strong>Notes:</strong><br/>${escapeHtml(contact.notes).replace(/\n/g, "<br/>")}</p>` : ""}

    <h3 style="margin:24px 0 8px;">Spec sheet</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tbody>${rows}</tbody>
    </table>

    <p style="margin:16px 0 0;font-size:16px;">
      <strong>Estimated total: ${escapeHtml(payload.totalFormatted)}</strong><br/>
      <span style="color:#666;font-size:13px;">Suggested deposit: ${escapeHtml(payload.depositFormatted)}</span>
    </p>
  </div>`;
}

function buildText(requestId: string, payload: BuildRequestPayload): string {
  const { contact } = payload;
  const lines = payload.selections
    .map(
      (line) =>
        `- ${line.stepTitle}: ${line.optionLabel} (${formatLineItemPrice(line.priceCents, line.stepKey)})`,
    )
    .join("\n");

  return [
    `New build request`,
    `Reference: ${requestId}`,
    `Submitted: ${payload.submittedAt}`,
    ``,
    `Customer: ${getContactFullName(contact)}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.phone}`,
    `Address: ${getContactAddress(contact)}`,
    `Payment: ${payload.paymentMethod}`,
    contact.notes ? `Notes: ${contact.notes}` : null,
    ``,
    `Spec sheet:`,
    lines,
    ``,
    `Estimated total: ${payload.totalFormatted}`,
    `Suggested deposit: ${payload.depositFormatted}`,
  ]
    .filter((value): value is string => value !== null)
    .join("\n");
}

/**
 * Email the build request to the shop. Never throws — a failed send must not
 * break the customer's submission (the Sanity record is the source of truth).
 */
export async function sendBuildRequestEmail(
  requestId: string,
  payload: BuildRequestPayload,
): Promise<boolean> {
  if (!isEmailConfigured()) return false;

  const to = process.env.BUILD_NOTIFICATION_TO?.trim() || DEFAULT_TO;
  const from = process.env.BUILD_NOTIFICATION_FROM?.trim() || DEFAULT_FROM;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: payload.contact.email,
      subject: `New build request — ${getContactFullName(payload.contact)} (${payload.totalFormatted})`,
      html: buildHtml(requestId, payload),
      text: buildText(requestId, payload),
    });

    if (error) {
      console.error("Failed to send build request email:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send build request email:", error);
    return false;
  }
}
