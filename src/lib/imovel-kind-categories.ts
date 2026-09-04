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
