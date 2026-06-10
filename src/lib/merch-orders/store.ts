import type { MerchOrderPayload } from "@/lib/types";

export interface StoredMerchOrder {
  id: string;
  payload: MerchOrderPayload;
  status: "awaiting_payment" | "paid" | "shipped";
  squareInvoiceId?: string;
  squareOrderId?: string;
  paymentUrl?: string;
  createdAt: string;
}

const merchOrders = new Map<string, StoredMerchOrder>();

export function saveMerchOrder(
  payload: MerchOrderPayload,
  square?: {
    invoiceId: string;
    orderId: string;
    paymentUrl?: string;
  },
): string {
  merchOrders.set(payload.orderId, {
    id: payload.orderId,
    payload,
    status: "awaiting_payment",
    squareInvoiceId: square?.invoiceId,
    squareOrderId: square?.orderId,
    paymentUrl: square?.paymentUrl,
    createdAt: payload.submittedAt,
  });
  return payload.orderId;
}

export function getMerchOrder(id: string): StoredMerchOrder | undefined {
  return merchOrders.get(id);
}
