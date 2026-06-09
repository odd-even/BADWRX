import { assertPageEnabled } from "@/lib/pages";

export default async function UniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertPageEnabled("university");
  return children;
}
