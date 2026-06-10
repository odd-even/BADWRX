import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Checkout",
  ...noindexMetadata,
};

export default function MerchCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
