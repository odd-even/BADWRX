import { assertPageEnabled } from "@/lib/pages";

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertPageEnabled("about");
  return children;
}
