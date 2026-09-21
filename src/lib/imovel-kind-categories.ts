import type { ImovelKind } from "./types";

export type ImovelKindCategory = "residencial" | "comercial" | "lotes";

/**
 * Agrupamento de ImovelKind em categorias amplas para o filtro "Tipo" do
 * SearchFilterBar (primeira linha de botões: Todos/Residencial/Comercial/
 * Lotes). A segunda linha do filtro usa KIND_OPTIONS diretamente (um botão
 * por tipo específico) — essas categorias só existem como atalho.
 */
export const KIND_CATEGORIES: { value: ImovelKindCategory; label: string; kinds: ImovelKind[] }[] = [
  { value: "residencial", label: "Residencial", kinds: ["casa", "kitnet", "apartamento"] },
  { value: "comercial", label: "Comercial", kinds: ["sala_comercial", "galpao"] },
  { value: "lotes", label: "Lotes", kinds: ["lote"] },
];

/**
 * Resolve o valor bruto do parâmetro `tipo` da URL — pode ser um ImovelKind
 * específico (vindo da segunda linha de botões) ou uma categoria (primeira
 * linha) — no formato que searchImoveis() espera: um kind único, uma lista
 * de kinds (para os filtros .in()), ou undefined ("Todos").
 */
export function resolveKindFilter(tipo?: string): ImovelKind | ImovelKind[] | undefined {
  if (!tipo) return undefined;
  const category = KIND_CATEGORIES.find((c) => c.value === tipo);
  return category ? category.kinds : (tipo as ImovelKind);
}

/**
 * Rótulos em português por tipo de imóvel — usados no filtro de busca
 * público (SearchFilterBar), no admin (formulário e listagem) e nos
 * metadados/SEO da ficha do imóvel. Vive aqui (não em lib/admin/) porque
 * o público depende diretamente disso.
 */
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
