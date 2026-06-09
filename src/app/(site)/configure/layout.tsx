import { assertPageEnabled } from "@/lib/pages";

export default async function ConfigureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertPageEnabled("configure");
  return children;
}
