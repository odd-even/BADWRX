import { randomUUID } from "node:crypto";
import {
  getContactFullName,
  type BuildRequestPayload,
} from "@/lib/build-submission";
import { shippingOptions } from "@/lib/merch/shipping";
import { getSquareClient } from "@/lib/square/client";
import {
  getSquareConfig,
  isSquareConfigured,
  SquareNotConfiguredError,
} from "@/lib/square/config";
import type {
  MerchCartLine,
  MerchOrderPayload,
  MerchShippingMethod,
} from "@/lib/types";

export interface CreateDepositInvoiceInput {
  requestId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  totalCents: number;
  buildSummary: string;
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
 * Creates and publishes a Square invoice for the full build price. Customer
 * pays on Square's hosted page — card and bank transfer (ACH) when enabled.
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

  const address = input.customerAddress;
  const customerResponse = await client.customers.create({
    idempotencyKey: randomUUID(),
    givenName,
    familyName,
    emailAddress: input.customerEmail,
    phoneNumber: input.customerPhone || undefined,
    address: address?.addressLine1
      ? {
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || undefined,
          locality: address.city || undefined,
          administrativeDistrictLevel1: address.state || undefined,
          postalCode: address.postalCode || undefined,
          country: "US",
        }
      : undefined,
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
          name: "Custom rifle build",
          quantity: "1",
          basePriceMoney: {
            amount: BigInt(input.totalCents),
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
      title: "BADWRX Custom Rifle",
      description: input.buildSummary,
      acceptedPaymentMethods: {
        card: true,
        bankAccount: true,
        squareGiftCard: false,
        buyNowPayLater: false,
        cashAppPay: false,
      },
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

export interface CreateMerchInvoiceResult {
  invoiceId: string;
  orderId: string;
  customerId: string;
  status: string;
  publicUrl?: string;
}

function formatMerchLineName(line: MerchCartLine): string {
  const parts = [line.title, line.size];
  if (line.color) parts.push(line.color);
  return parts.join(" · ");
}

function merchShippingLabel(method: MerchShippingMethod): string {
  return shippingOptions.find((option) => option.id === method)?.label ?? method;
}

function buildMerchLineItems(
  items: MerchCartLine[],
  shippingCents: number,
  shippingMethod: MerchShippingMethod,
) {
  const lineItems = items.map((item) => ({
    name: formatMerchLineName(item),
    quantity: String(item.quantity),
    basePriceMoney: {
      amount: BigInt(item.priceCents),
      currency: "USD" as const,
    },
  }));

  if (shippingCents > 0) {
    lineItems.push({
      name: `Shipping (${merchShippingLabel(shippingMethod)})`,
      quantity: "1",
      basePriceMoney: {
        amount: BigInt(shippingCents),
        currency: "USD",
      },
    });
  }

  return lineItems;
}

/**
 * Creates and publishes a Square invoice for a merch order. Called automatically
 * at checkout — customer pays on Square's hosted page (card / ACH when enabled).
 */
export async function createMerchInvoice(
  payload: MerchOrderPayload,
  notes?: string,
): Promise<CreateMerchInvoiceResult> {
  if (!isSquareConfigured()) {
    throw new SquareNotConfiguredError();
  }

  const client = getSquareClient();
  const { locationId } = getSquareConfig();
  const { givenName, familyName } = splitName(payload.contact.name);

  const customerResponse = await client.customers.create({
    idempotencyKey: randomUUID(),
    givenName,
    familyName,
    emailAddress: payload.contact.email,
    phoneNumber: payload.contact.phone || undefined,
    address: {
      addressLine1: payload.shipping.line1,
      addressLine2: payload.shipping.line2 || undefined,
      locality: payload.shipping.city,
      administrativeDistrictLevel1: payload.shipping.state,
      postalCode: payload.shipping.postalCode,
      country: "US",
    },
    referenceId: payload.orderId,
    note: `BADWRX merch order ${payload.orderId}`,
  });

  const customerId = customerResponse.customer?.id;
  if (!customerId) {
    throw new Error("Square customer creation did not return a customer ID");
  }

  const orderResponse = await client.orders.create({
    idempotencyKey: randomUUID(),
    order: {
      locationId,
      referenceId: payload.orderId,
      customerId,
      lineItems: buildMerchLineItems(
        payload.items,
        payload.shippingCents,
        payload.shippingMethod,
      ),
    },
  });

  const squareOrderId = orderResponse.order?.id;
  if (!squareOrderId) {
    throw new Error("Square order creation did not return an order ID");
  }

  const itemSummary = payload.items
    .map((line) => `${line.title} × ${line.quantity}`)
    .join(" · ");
  const description = [
    itemSummary,
    notes ? `Notes: ${notes}` : null,
    `Order ${payload.orderId.slice(0, 8).toUpperCase()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const invoiceResponse = await client.invoices.create({
    idempotencyKey: randomUUID(),
    invoice: {
      locationId,
      orderId: squareOrderId,
      primaryRecipient: { customerId },
      paymentRequests: [
        {
          requestType: "BALANCE",
          dueDate: dueDateDaysFromNow(7),
          automaticPaymentSource: "NONE",
        },
      ],
      deliveryMethod: "EMAIL",
      title: "BADWRX Merch",
      description,
      acceptedPaymentMethods: {
        card: true,
        bankAccount: true,
        squareGiftCard: false,
        buyNowPayLater: false,
        cashAppPay: false,
      },
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
    orderId: squareOrderId,
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
    customerName: getContactFullName(payload.contact),
    customerEmail: payload.contact.email,
    customerPhone: payload.contact.phone || undefined,
    customerAddress: {
      addressLine1: payload.contact.addressLine1,
      addressLine2: payload.contact.addressLine2,
      city: payload.contact.city,
      state: payload.contact.state,
      postalCode: payload.contact.postalCode,
    },
    totalCents: payload.totalCents,
    buildSummary,
  });
}
