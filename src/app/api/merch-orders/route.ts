import { NextResponse } from "next/server";
import { getAllMerch } from "@/lib/content";
import { saveMerchOrder } from "@/lib/merch-orders/store";
import { validateMerchCheckoutBody } from "@/lib/merch-orders/validate";
import { createMerchInvoice } from "@/lib/square/invoices";
import {
  isSquareConfigured,
  SquareNotConfiguredError,
} from "@/lib/square/config";

export async function POST(request: Request) {
  if (!isSquareConfigured()) {
    return NextResponse.json(
      {
        error:
          "Payments are not configured. Add SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID to your environment.",
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

  const products = await getAllMerch();
  const validated = validateMerchCheckoutBody(body, products);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { notes, ...payload } = validated.data;

  try {
    const invoice = await createMerchInvoice(payload, notes);
    saveMerchOrder(payload, {
      invoiceId: invoice.invoiceId,
      orderId: invoice.orderId,
      paymentUrl: invoice.publicUrl,
    });

    if (!invoice.publicUrl) {
      return NextResponse.json(
        { error: "Square did not return a payment link. Try again in a moment." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: payload.orderId,
      totalCents: payload.totalCents,
      paymentUrl: invoice.publicUrl,
      message:
        "Order received. Complete payment on Square to confirm your order.",
      notes: notes ?? null,
    });
  } catch (error) {
    if (error instanceof SquareNotConfiguredError) {
      return NextResponse.json(
        { error: error.message, code: "square_not_configured" },
        { status: 503 },
      );
    }

    console.error("[merch-orders]", error);
    return NextResponse.json(
      { error: "Could not create payment link. Please try again." },
      { status: 502 },
    );
  }
}
