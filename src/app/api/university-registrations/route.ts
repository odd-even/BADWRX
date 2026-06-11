import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { sendUniversityRegistrationEmail } from "@/lib/university-registrations/notify";
import {
  createUniversityRegistrationPayload,
  validateUniversityRegistrationBody,
} from "@/lib/university-registrations/validate";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validated = validateUniversityRegistrationBody(body);
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error, fieldErrors: validated.fieldErrors },
      { status: 400 },
    );
  }

  const registrationId = randomUUID();
  const payload = createUniversityRegistrationPayload(
    validated.input,
    registrationId,
  );

  const emailSent = await sendUniversityRegistrationEmail(payload);

  if (!emailSent) {
    console.warn(
      `University registration ${registrationId} notification email was not sent (Resend not configured or failed).`,
    );
  }

  return NextResponse.json({
    ok: true,
    registrationId,
    emailSent,
    message:
      "Registration received. We'll respond within 2 business days with availability, class details, and next steps.",
  });
}
