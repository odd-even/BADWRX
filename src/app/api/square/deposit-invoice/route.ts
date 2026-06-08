import { NextResponse } from "next/server";
import type { BuildRequestPayload } from "@/lib/build-submission";
import {
  getBuildRequest,
  markBuildRequestInvoiced,
} from "@/lib/build-requests/store";
import {
  createDepositInvoiceFromBuildRequest,
} from "@/lib/square/invoices";
import {
  isSquareConfigured,
  SquareNotConfiguredError,
} from "@/lib/square/config";

function isAuthorized(request: Request): boolean {
  const adminKey = process.env.BUILD_ADMIN_API_KEY?.trim();
  if (!adminKey) {
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("authorization");
  return header === `Bearer ${adminKey}`;
}

/**
 * Creates and sends a Square invoice for the full build price after approval.
 * Protected by BUILD_ADMIN_API_KEY in production.
 *
 * Body: { requestId: string } or { payload: BuildRequestPayload }
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSquareConfigured()) {
    return NextResponse.json(
      {
        error:
          "Square is not configured. Add SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID to your environment.",
        code: "square_not_configured",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { requestId, payload } = body as {
    requestId?: string;
    payload?: BuildRequestPayload;
  };

  let buildPayload: BuildRequestPayload;
  let resolvedRequestId: string;

  if (requestId) {
    const stored = getBuildRequest(requestId);
    if (!stored) {
      return NextResponse.json(
        { error: "Build request not found" },
        { status: 404 },
      );
    }
    buildPayload = stored.payload;
    resolvedRequestId = requestId;
  } else if (payload) {
    buildPayload = payload;
    resolvedRequestId = crypto.randomUUID();
  } else {
    return NextResponse.json(
      { error: "Provide requestId or payload" },
      { status: 400 },
    );
  }

  try {
    const invoice = await createDepositInvoiceFromBuildRequest(
      resolvedRequestId,
      buildPayload,
    );

    if (requestId) {
      markBuildRequestInvoiced(requestId, invoice.invoiceId);
    }

    return NextResponse.json({
      ok: true,
      requestId: resolvedRequestId,
      invoice,
    });
  } catch (error) {
    if (error instanceof SquareNotConfiguredError) {
      return NextResponse.json(
        { error: error.message, code: "square_not_configured" },
        { status: 503 },
      );
    }

    console.error("[square/deposit-invoice]", error);
    return NextResponse.json(
      { error: "Failed to create Square invoice" },
      { status: 502 },
    );
  }
}
