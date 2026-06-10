import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Cart",
  ...noindexMetadata,
};

export default function MerchCartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
