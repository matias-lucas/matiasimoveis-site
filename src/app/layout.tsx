import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Imóveis em Itaberaí/GO`,
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
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-page">{children}</body>
    </html>
  );
}
