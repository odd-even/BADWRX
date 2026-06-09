import { assertPageEnabled } from "@/lib/pages";

export default async function MerchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertPageEnabled("merch");
  return children;
}
