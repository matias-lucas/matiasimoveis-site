import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Outfit, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE } from "@/lib/site";

// Outfit (sans geométrica, pesos altos) nos títulos e preços no lugar da
// Fraunces serifada: leitura mais rápida e visual de vitrine, não de revista
// (review 28/09). Só os pesos realmente usados, sem itálico.
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: imóveis para alugar e comprar em Itaberaí/GO`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
};

/**
 * Casca mínima compartilhada pelo site público e pelo painel admin. O
 * "chrome" público (Navbar/Footer/WhatsAppFab) fica em app/(site)/layout.tsx
 * em vez de aqui, para que /admin/* renderize seu próprio chrome — ver
 * admin/layout.tsx.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-page">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
