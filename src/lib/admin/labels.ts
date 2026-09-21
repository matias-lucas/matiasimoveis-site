import type { ImovelStatus } from "@/lib/types";

// KIND_OPTIONS/KIND_LABELS/LEGACY_KIND_LABELS vivem em imovel-kind-categories.ts
// (código público já depende deles — ver SearchFilterBar.tsx) — re-exportados
// aqui só para não quebrar os imports existentes do admin.
export { KIND_OPTIONS, KIND_LABELS, LEGACY_KIND_LABELS } from "@/lib/imovel-kind-categories";

export const STATUS_OPTIONS: { value: ImovelStatus; label: string }[] = [
  { value: "disponivel", label: "Disponível" },
  { value: "em_negociacao", label: "Em negociação" },
  { value: "vendido", label: "Vendido" },
  { value: "alugado", label: "Alugado" },
];

export const STATUS_LABELS: Record<ImovelStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label])
) as Record<ImovelStatus, string>;
