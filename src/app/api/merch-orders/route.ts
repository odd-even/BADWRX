import { NextResponse } from "next/server";
import { saveMerchOrder } from "@/lib/merch-orders/store";
import { validateMerchCheckoutBody } from "@/lib/merch-orders/validate";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validated = validateMerchCheckoutBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { notes, ...payload } = validated.data;
  saveMerchOrder(payload);

  return NextResponse.json({
    ok: true,
    orderId: payload.orderId,
    totalCents: payload.totalCents,
    message:
      "Order received. We'll email you a payment link and ship once payment clears.",
    notes: notes ?? null,
  });
}
