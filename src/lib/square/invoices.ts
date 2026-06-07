import { randomUUID } from "node:crypto";
import type {
  BuildRequestPayload,
  SquareInvoiceMethod,
} from "@/lib/build-submission";
import { getSquareClient } from "@/lib/square/client";
import {
  getSquareConfig,
  isSquareConfigured,
  SquareNotConfiguredError,
} from "@/lib/square/config";

export interface CreateDepositInvoiceInput {
  requestId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  depositCents: number;
  buildSummary: string;
  preferredMethod: SquareInvoiceMethod;
}

export interface CreateDepositInvoiceResult {
  invoiceId: string;
  orderId: string;
  customerId: string;
  status: string;
  publicUrl?: string;
}

function splitName(fullName: string): {
  givenName: string;
  familyName?: string;
} {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { givenName: parts[0] };
  }
  return { givenName: parts[0], familyName: parts.slice(1).join(" ") };
}

function dueDateDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Creates and publishes a Square deposit invoice. Customer pays on Square's
 * hosted page — card and bank transfer (ACH) when enabled on the invoice.
 */
export async function createDepositInvoice(
  input: CreateDepositInvoiceInput,
): Promise<CreateDepositInvoiceResult> {
  if (!isSquareConfigured()) {
    throw new SquareNotConfiguredError();
  }

  const client = getSquareClient();
  const { locationId } = getSquareConfig();
  const { givenName, familyName } = splitName(input.customerName);

  const customerResponse = await client.customers.create({
    idempotencyKey: randomUUID(),
    givenName,
    familyName,
    emailAddress: input.customerEmail,
    phoneNumber: input.customerPhone || undefined,
    referenceId: input.requestId,
    note: `BADWRX build request ${input.requestId}`,
  });

  const customerId = customerResponse.customer?.id;
  if (!customerId) {
    throw new Error("Square customer creation did not return a customer ID");
  }

  const orderResponse = await client.orders.create({
    idempotencyKey: randomUUID(),
    order: {
      locationId,
      referenceId: input.requestId,
      customerId,
      lineItems: [
        {
          name: "Custom rifle build — deposit",
          quantity: "1",
          basePriceMoney: {
            amount: BigInt(input.depositCents),
            currency: "USD",
          },
        },
      ],
    },
  });

  const orderId = orderResponse.order?.id;
  if (!orderId) {
    throw new Error("Square order creation did not return an order ID");
  }

  const invoiceResponse = await client.invoices.create({
    idempotencyKey: randomUUID(),
    invoice: {
      locationId,
      orderId,
      primaryRecipient: { customerId },
      paymentRequests: [
        {
          requestType: "BALANCE",
          dueDate: dueDateDaysFromNow(14),
          automaticPaymentSource: "NONE",
        },
      ],
      deliveryMethod: "EMAIL",
      title: "BADWRX Custom Rifle — Deposit",
      description: input.buildSummary,
      acceptedPaymentMethods: {
        card: true,
        bankAccount: true,
        squareGiftCard: false,
        buyNowPayLater: false,
        cashAppPay: false,
      },
      customFields:
        input.preferredMethod === "ach"
          ? [
              {
                label: "Preferred payment",
                value: "Bank transfer (ACH)",
                placement: "ABOVE_LINE_ITEMS",
              },
            ]
          : undefined,
    },
  });

  const invoice = invoiceResponse.invoice;
  if (!invoice?.id || invoice.version == null) {
    throw new Error("Square invoice creation did not return an invoice");
  }

  const published = await client.invoices.publish({
    invoiceId: invoice.id,
    version: invoice.version,
    idempotencyKey: randomUUID(),
  });

  return {
    invoiceId: invoice.id,
    orderId,
    customerId,
    status: published.invoice?.status ?? "SENT",
    publicUrl: published.invoice?.publicUrl,
  };
}

export function createDepositInvoiceFromBuildRequest(
  requestId: string,
  payload: BuildRequestPayload,
): Promise<CreateDepositInvoiceResult> {
  const buildSummary = payload.selections
    .map((line) => `${line.stepTitle}: ${line.optionLabel}`)
    .join(" · ");

  return createDepositInvoice({
    requestId,
    customerName: payload.contact.name,
    customerEmail: payload.contact.email,
    customerPhone: payload.contact.phone || undefined,
    depositCents: payload.depositCents,
    buildSummary,
    preferredMethod: payload.squareInvoice.method,
  });
}
