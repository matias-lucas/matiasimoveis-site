import { Phone } from "lucide-react";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { formatPriceParts } from "@/lib/format";
import type { ImovelPurpose } from "@/lib/types";

interface ImovelMobilePriceBarProps {
  price: number;
  purpose: ImovelPurpose;
  whatsappMessage: string;
  whatsappNumber?: string;
  phoneHref: string;
}

/**
 * Barra só-mobile (abaixo de lg) com preço + WhatsApp + ligar. É `sticky`
 * no fim do conteúdo da ficha, não `fixed`: gruda no rodapé da tela enquanto
 * a pessoa rola e para antes do footer do site, que antes ficava coberto
 * (review 28/09). O WhatsAppFab global fica escondido nesta rota.
 */
export function ImovelMobilePriceBar({ price, purpose, whatsappMessage, whatsappNumber, phoneHref }: ImovelMobilePriceBarProps) {
  const { value, suffix } = formatPriceParts(price, purpose);
  return (
    <div className="lg:hidden sticky bottom-0 z-30 -mx-4 sm:-mx-6 mt-8 flex items-center gap-3 bg-bg-surface border-t border-border-1 shadow-lg px-4 sm:px-6 py-3">
      <div className="min-w-0 flex-1 text-blue-900 tabular" style={{ font: "800 20px/1.1 var(--font-display)" }}>
        {value}
        {suffix && (
          <span className="text-text-2" style={{ font: "600 14px/1 var(--font-display)" }}>
            {suffix}
          </span>
        )}
      </div>
      <a
        href={phoneHref}
        aria-label="Ligar"
        className="flex items-center justify-center w-12 h-12 shrink-0 rounded-md border border-border-2 text-text-1"
      >
        <Phone className="w-5 h-5" aria-hidden />
      </a>
      <WhatsAppLink message={whatsappMessage} number={whatsappNumber}>
        WhatsApp
      </WhatsAppLink>
    </div>
  );
}
