import {
  getContactAddress,
  getContactFullName,
  type BuildRequestPayload,
} from "@/lib/build-submission";
import {
  getSanityWriteClient,
  isSanityWriteConfigured,
} from "@/sanity/lib/serverClient";

/**
 * Persist a build request to Sanity as the durable source of truth.
 * Returns the Sanity document id, or null when Sanity writes aren't configured.
 * Never throws — persistence failures must not break the customer submission.
 */
export async function persistBuildRequestToSanity(
  requestId: string,
  payload: BuildRequestPayload,
): Promise<string | null> {
  if (!isSanityWriteConfigured()) return null;

  try {
    const client = getSanityWriteClient();
    const doc = await client.create({
      _type: "buildRequest",
      requestId,
      status: "pending_review",
      submittedAt: payload.submittedAt,
      customerName: getContactFullName(payload.contact),
      customerFirstName: payload.contact.firstName,
      customerLastName: payload.contact.lastName,
      customerEmail: payload.contact.email,
      customerPhone: payload.contact.phone,
      customerAddress: getContactAddress(payload.contact),
      addressLine1: payload.contact.addressLine1,
      addressLine2: payload.contact.addressLine2 || undefined,
      city: payload.contact.city,
      state: payload.contact.state,
      postalCode: payload.contact.postalCode,
      notes: payload.contact.notes || undefined,
      paymentMethod: payload.paymentMethod,
      totalCents: payload.totalCents,
      depositCents: payload.depositCents,
      totalFormatted: payload.totalFormatted,
      selections: payload.selections.map((line) => ({
        _key: line.stepKey,
        _type: "object",
        stepKey: line.stepKey,
        stepTitle: line.stepTitle,
        optionLabel: line.optionLabel,
        priceCents: line.priceCents,
      })),
    });
    return doc._id;
  } catch (error) {
    console.error("Failed to persist build request to Sanity:", error);
    return null;
  }
}
