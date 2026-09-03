import type { PropertyKind, PropertyStatus } from "@/lib/types";

export const KIND_OPTIONS: { value: PropertyKind; label: string }[] = [
  { value: "casa", label: "Casa" },
  { value: "kitnet", label: "Kitnet" },
  { value: "apartamento", label: "Apartamento" },
  { value: "sala_comercial", label: "Sala comercial" },
  { value: "galpao", label: "Galpão" },
  { value: "lote", label: "Lote" },
  { value: "outros", label: "Outros" },
];

/**
 * "sobrado" was dropped from the selectable options (client's call — this
 * property type is folded into "Casa"/"Outros" now), but the DB enum and one
 * existing seed row (`ref: "4"`) still use it, and can't be safely renamed
 * without direct DB access. Kept only so PropertyForm can show it as a
 * read-only-ish fallback option when editing that specific legacy row,
 * instead of the <select> silently coercing it to a different kind on save.
 */
export const LEGACY_KIND_LABELS: Partial<Record<PropertyKind, string>> = {
  sobrado: "Sobrado (descontinuado)",
};

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
