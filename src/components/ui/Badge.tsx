import type { ReactNode } from "react";
import { clsx } from "clsx";

export type BadgeTone = "venda" | "locacao" | "success" | "warning" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  venda: "bg-status-venda-bg text-status-venda-fg",
  locacao: "bg-status-locacao-bg text-status-locacao-fg",
  success: "bg-status-success-bg text-status-success-fg",
  warning: "bg-status-warning-bg text-status-warning-fg",
  neutral: "bg-bg-sunken text-text-1",
};

/** Variante sólida para sobrepor fotos (card de imóvel), onde uma pílula
 * tonal ficaria com contraste baixo demais sobre o fundo pálido do placeholder.
 * venda usa --red-600 (não --red-500/--brand-primary): branco sobre --red-500
 * dá ~4.2:1 no --text-caption em negrito (12px), abaixo do AA (4.5:1) —
 * auditoria estática da Etapa 8. --red-600 resolve para ~5.16:1. */
const toneClassesSolid: Record<BadgeTone, string> = {
  venda: "bg-red-600 text-white",
  locacao: "bg-blue-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-amber-100 text-gray-900",
  neutral: "bg-white/95 text-text-1",
};

interface BadgeProps {
  tone?: BadgeTone;
  solid?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "venda", solid = false, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-pill px-3 py-1.5 whitespace-nowrap",
        solid ? toneClassesSolid[tone] : toneClasses[tone],
        className
      )}
      style={{ font: solid ? "700 12px/1 var(--font-display)" : "600 13px/1 var(--font-display)" }}
    >
      {children}
    </span>
  );
}
