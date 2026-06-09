import { assertPageEnabled } from "@/lib/pages";

export default async function BuildsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertPageEnabled("builds");
  return children;
}
