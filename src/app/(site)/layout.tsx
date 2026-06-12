import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteScrollReveal } from "@/components/layout/SiteScrollReveal";
import { SiteProviders } from "@/components/layout/SiteProviders";
import { getSiteSettings } from "@/lib/content";
import {
  footerNavLinks,
  headerNavLinks,
  isPageEnabled,
} from "@/lib/pages";

/** Must be a literal — Next.js does not allow imported segment config values. */
export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const visibility = settings.pageVisibility;

  return (
    <SiteProviders
      ageVerificationEnabled={settings.siteAccess.ageVerificationEnabled}
    >
      <Header
        navLinks={headerNavLinks(visibility)}
        showConfigureCta={isPageEnabled("configure", visibility)}
        showMerchCart={isPageEnabled("merch", visibility)}
        navImageFade={settings.navImageFade}
      />
      <main className="pt-[72px]">
        <SiteScrollReveal />
        {children}
      </main>
      <Footer
        navLinks={footerNavLinks(visibility)}
        showConfigureCta={isPageEnabled("configure", visibility)}
      />
    </SiteProviders>
  );
}
