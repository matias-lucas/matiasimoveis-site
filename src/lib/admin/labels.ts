import type { ImovelKind, ImovelStatus } from "@/lib/types";

export const KIND_OPTIONS: { value: ImovelKind; label: string }[] = [
  { value: "casa", label: "Casa" },
  { value: "kitnet", label: "Kitnet" },
  { value: "apartamento", label: "Apartamento" },
  { value: "sala_comercial", label: "Sala comercial" },
  { value: "galpao", label: "Galpão" },
  { value: "lote", label: "Lote" },
  { value: "outros", label: "Outros" },
];

/**
 * "sobrado" foi removido das opções selecionáveis (decisão do cliente — esse
 * tipo de imóvel agora entra em "Casa"/"Outros"), mas o enum do banco e uma
 * linha de exemplo já existente (`ref: "4"`) ainda usam esse valor, e não dá
 * para renomear com segurança sem acesso direto ao banco. Mantido só para o
 * ImovelForm mostrar como opção de fallback (quase somente leitura) ao
 * editar essa linha legada específica, em vez do <select> trocar
 * silenciosamente para outro tipo ao salvar.
 */
export const LEGACY_KIND_LABELS: Partial<Record<ImovelKind, string>> = {
  sobrado: "Sobrado (descontinuado)",
};

export const KIND_LABELS: Record<ImovelKind, string> = Object.fromEntries(
  KIND_OPTIONS.map((o) => [o.value, o.label])
) as Record<ImovelKind, string>;

export const STATUS_OPTIONS: { value: ImovelStatus; label: string }[] = [
  { value: "disponivel", label: "Disponível" },
  { value: "em_negociacao", label: "Em negociação" },
  { value: "vendido", label: "Vendido" },
  { value: "alugado", label: "Alugado" },
];

export const STATUS_LABELS: Record<ImovelStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label])
) as Record<ImovelStatus, string>;
