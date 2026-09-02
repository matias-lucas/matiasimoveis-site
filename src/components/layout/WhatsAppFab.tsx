import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppUrl(SITE.whatsappDefaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed right-6 bottom-6 z-50 flex items-center justify-center w-[60px] h-[60px] rounded-full bg-whatsapp text-white shadow-lg transition-transform duration-150 ease-out hover:scale-105 focus-visible:outline-none focus-visible:shadow-focus"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
