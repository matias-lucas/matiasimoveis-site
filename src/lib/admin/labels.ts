import type { PropertyKind, PropertyStatus } from "@/lib/types";

export const KIND_OPTIONS: { value: PropertyKind; label: string }[] = [
  { value: "casa", label: "Casa" },
  { value: "sobrado", label: "Sobrado" },
  { value: "kitnet", label: "Kitnet" },
  { value: "apartamento", label: "Apartamento" },
  { value: "sala_comercial", label: "Sala comercial" },
  { value: "galpao", label: "Galpão" },
  { value: "lote", label: "Lote" },
  { value: "outros", label: "Outros" },
];

export const KIND_LABELS: Record<PropertyKind, string> = Object.fromEntries(
  KIND_OPTIONS.map((o) => [o.value, o.label])
) as Record<PropertyKind, string>;

export const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "disponivel", label: "Disponível" },
  { value: "em_negociacao", label: "Em negociação" },
  { value: "vendido", label: "Vendido" },
  { value: "alugado", label: "Alugado" },
];

export const STATUS_LABELS: Record<PropertyStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label])
) as Record<PropertyStatus, string>;
