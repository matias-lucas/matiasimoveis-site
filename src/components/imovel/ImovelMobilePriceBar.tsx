import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { formatPrice } from "@/lib/format";
import type { ImovelPurpose } from "@/lib/types";

interface ImovelMobilePriceBarProps {
  price: number;
  purpose: ImovelPurpose;
  whatsappMessage: string;
  whatsappNumber?: string;
}

// Barra fixa só-mobile (abaixo de lg) com preço + WhatsApp — substitui a
// sidebar sticky do desktop, que não cabe/não faz sentido em tela estreita.
// O WhatsAppFab global fica escondido em telas pequenas (ver WhatsAppFab.tsx)
// justamente para não duplicar esse CTA aqui.
export function ImovelMobilePriceBar({
  price,
  purpose,
  whatsappMessage,
  whatsappNumber,
}: ImovelMobilePriceBarProps) {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 bg-bg-surface border-t border-border-1 shadow-lg px-4 py-3">
      <div className="text-brand-primary" style={{ font: "var(--text-price)" }}>
        {formatPrice(price, purpose)}
      </div>
      <WhatsAppLink message={whatsappMessage} number={whatsappNumber} size="sm">
        WhatsApp
      </WhatsAppLink>
    </div>
  );
}
