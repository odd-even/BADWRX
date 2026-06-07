import { NextResponse } from "next/server";
import { createBuildRequestPayload } from "@/lib/build-submission";
import { saveBuildRequest } from "@/lib/build-requests/store";
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

  return NextResponse.json({
    ok: true,
    requestId,
    status: "pending_review",
    squareConfigured: isSquareConfigured(),
    depositCents: payload.depositCents,
    paymentMethod: payload.paymentMethod,
    message:
      "Build request received. A builder will review your configuration before a Square deposit invoice is sent.",
  });
}
