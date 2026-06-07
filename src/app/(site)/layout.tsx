import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteProviders } from "@/components/layout/SiteProviders";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteProviders>
      <Header />
      <main className="pt-[72px]">{children}</main>
      <Footer />
    </SiteProviders>
  );
}
