import { Home, Building2, BedSingle, LandPlot, Store, Warehouse, Ellipsis, type LucideIcon } from "lucide-react";
import type { ImovelKind } from "@/lib/types";

/** Ícone por tipo de imóvel — atalhos da Home, filtro de tipo e o quadro "sem foto". */
export const KIND_ICONS: Record<ImovelKind, LucideIcon> = {
  casa: Home,
  sobrado: Home,
  apartamento: Building2,
  kitnet: BedSingle,
  lote: LandPlot,
  sala_comercial: Store,
  galpao: Warehouse,
  outros: Ellipsis,
};
