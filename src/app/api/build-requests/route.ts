import { NextResponse } from "next/server";
import { createBuildRequestPayload } from "@/lib/build-submission";
import { saveBuildRequest } from "@/lib/build-requests/store";
import { persistBuildRequestToSanity } from "@/lib/build-requests/persist";
import { sendBuildRequestEmail } from "@/lib/build-requests/notify";
import { validateBuildSubmissionBody } from "@/lib/build-requests/validate";
import { isSquareConfigured } from "@/lib/square/config";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validated = validateBuildSubmissionBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const payload = createBuildRequestPayload(
    validated.config,
    validated.contact,
  );

  if (!payload.isComplete) {
    return NextResponse.json(
      { error: "Complete every configurator step before submitting" },
      { status: 400 },
    );
  }

  const requestId = saveBuildRequest(payload);

  // Durable record + notification. Run in parallel; neither must break the
  // customer submission, so both helpers swallow their own errors.
  const [sanityId, emailSent] = await Promise.all([
    persistBuildRequestToSanity(requestId, payload),
    sendBuildRequestEmail(requestId, payload),
  ]);

  if (!sanityId) {
    console.warn(
      `Build request ${requestId} was not persisted to Sanity (write client not configured or failed).`,
    );
  }
  if (!emailSent) {
    console.warn(
      `Build request ${requestId} notification email was not sent (Resend not configured or failed).`,
    );
  }

  return NextResponse.json({
    ok: true,
    requestId,
    status: "pending_review",
    squareConfigured: isSquareConfigured(),
    paymentMethod: payload.paymentMethod,
    message:
      "Build request received. A builder will review your configuration before a Square invoice for the full build price is sent.",
  });
}
