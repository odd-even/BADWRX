import type { BuildRequestPayload } from "@/lib/build-submission";

export interface StoredBuildRequest {
  id: string;
  payload: BuildRequestPayload;
  status: "pending_review" | "approved" | "invoiced";
  createdAt: string;
  squareInvoiceId?: string;
}

/** In-memory store — replace with a database when you go to production */
const buildRequests = new Map<string, StoredBuildRequest>();

export function saveBuildRequest(payload: BuildRequestPayload): string {
  const id = crypto.randomUUID();
  buildRequests.set(id, {
    id,
    payload,
    status: "pending_review",
    createdAt: payload.submittedAt,
  });
  return id;
}

export function getBuildRequest(id: string): StoredBuildRequest | undefined {
  return buildRequests.get(id);
}

export function markBuildRequestInvoiced(
  id: string,
  squareInvoiceId: string,
): StoredBuildRequest | undefined {
  const record = buildRequests.get(id);
  if (!record) return undefined;
  const updated: StoredBuildRequest = {
    ...record,
    status: "invoiced",
    squareInvoiceId,
  };
  buildRequests.set(id, updated);
  return updated;
}
