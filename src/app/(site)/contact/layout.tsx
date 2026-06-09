import { assertPageEnabled } from "@/lib/pages";

export default async function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertPageEnabled("contact");
  return children;
}
