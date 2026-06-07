import type { MerchOrderPayload } from "@/lib/types";

export interface StoredMerchOrder {
  id: string;
  payload: MerchOrderPayload;
  status: "pending" | "paid" | "shipped";
  createdAt: string;
}

const merchOrders = new Map<string, StoredMerchOrder>();

export function saveMerchOrder(payload: MerchOrderPayload): string {
  merchOrders.set(payload.orderId, {
    id: payload.orderId,
    payload,
    status: "pending",
    createdAt: payload.submittedAt,
  });
  return payload.orderId;
}

export function getMerchOrder(id: string): StoredMerchOrder | undefined {
  return merchOrders.get(id);
}
