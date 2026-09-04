import type { ReactNode } from "react";
import { clsx } from "clsx";

export type BadgeTone = "venda" | "locacao" | "success" | "warning";

const toneClasses: Record<BadgeTone, string> = {
  venda: "bg-status-venda-bg text-status-venda-fg",
  locacao: "bg-status-locacao-bg text-status-locacao-fg",
  success: "bg-status-success-bg text-status-success-fg",
  warning: "bg-status-warning-bg text-status-warning-fg",
};

/** Variante sólida para sobrepor fotos (card de imóvel), onde uma pílula
 * tonal ficaria com contraste baixo demais sobre o fundo pálido do placeholder. */
const toneClassesSolid: Record<BadgeTone, string> = {
  venda: "bg-red-500 text-white",
  locacao: "bg-blue-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-amber-500 text-white",
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
        "inline-flex items-center rounded-pill px-3.5 py-1.5 font-bold font-body",
        solid ? toneClassesSolid[tone] : toneClasses[tone],
        className
      )}
      style={{ font: solid ? "var(--text-caption)" : "var(--text-label)", fontWeight: 700 }}
    >
      {children}
    </span>
  );
}
