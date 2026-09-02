import { MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { ButtonSize } from "./Button";

interface WhatsAppLinkProps {
  message: string;
  children: React.ReactNode;
  size?: ButtonSize;
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 px-4 py-2",
  md: "gap-2 px-[22px] py-[11px]",
  lg: "gap-2.5 px-7 py-[15px]",
};

const sizeFont: Record<ButtonSize, string> = {
  sm: "var(--text-body-sm)",
  md: "var(--text-label)",
  lg: "var(--text-display-sm)",
};

export function WhatsAppLink({ message, children, size = "md", className }: WhatsAppLinkProps) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
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
