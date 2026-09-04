import { MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { sizeClasses, sizeFont, type ButtonSize } from "./Button";

interface WhatsAppLinkProps {
  message: string;
  /** Sobrescreve o número de destino (só dígitos, com DDI). Padrão: SITE.whatsappNumber. */
  number?: string;
  children: React.ReactNode;
  size?: ButtonSize;
  className?: string;
}

export function WhatsAppLink({ message, number, children, size = "md", className }: WhatsAppLinkProps) {
  return (
    <a
      href={buildWhatsAppUrl(message, number)}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "inline-flex items-center justify-center rounded-md bg-whatsapp text-white transition-colors duration-150 ease-out hover:bg-whatsapp-hover focus-visible:outline-none focus-visible:shadow-focus font-display",
        sizeClasses[size],
        className
      )}
      style={{ font: sizeFont[size] }}
    >
      <MessageCircle className="w-4 h-4" />
      {children}
    </a>
  );
}
