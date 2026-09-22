import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { SITE } from "@/lib/site";

// RealEstateAgent no layout público inteiro (não em /admin) — presente em
// toda página pública para o Google associar qualquer página do site à
// mesma organização, não só a ficha de imóvel individual.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.state,
    addressCountry: "BR",
  },
  areaServed: `${SITE.address.city}/${SITE.address.state}`,
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
