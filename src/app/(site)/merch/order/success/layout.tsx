import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Order Confirmed",
  ...noindexMetadata,
};

export default function MerchOrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
