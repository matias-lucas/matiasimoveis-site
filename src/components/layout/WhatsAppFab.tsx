"use client";

import { MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";

// Rotas que já têm seu próprio CTA de WhatsApp inline/fixo no mobile — nelas o
// FAB global ficaria duplicado, então continua escondido abaixo de "lg" só
// aqui. /imovel/[slug] tem a ImovelMobilePriceBar; /contato, /anuncie e
// /empresa têm CTA inline nos próprios formulários/seções. Fora dessa lista
// (Home e /imoveis, hoje) o FAB fica visível também no mobile — Home não tem
// nenhum CTA de WhatsApp alternativo ali, e /imoveis só tem um no estado
// vazio de resultados, então escondê-lo ali por padrão deixava essas duas
// páginas (justamente as de maior tráfego mobile) sem nenhum "um clique de
// WhatsApp", contra o princípio de produto do site. Achado da revisão final
// da branch.
const ROUTES_WITH_INLINE_WHATSAPP_CTA = ["/contato", "/anuncie", "/empresa", "/imovel/"];

export function WhatsAppFab() {
  const pathname = usePathname();
  const hasInlineCta = ROUTES_WITH_INLINE_WHATSAPP_CTA.some((prefix) =>
    pathname.startsWith(prefix)
  );

  return (
    <a
      href={buildWhatsAppUrl(SITE.whatsappDefaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={clsx(
        hasInlineCta ? "hidden lg:flex" : "flex",
        "fixed right-6 bottom-6 z-50 items-center justify-center w-[60px] h-[60px] rounded-full bg-whatsapp text-white shadow-lg transition-transform duration-150 ease-out hover:scale-105 focus-visible:outline-none focus-visible:shadow-focus"
      )}
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
