import type { ImovelPurpose } from "./types";
import { isValidTipo } from "./imovel-kind-categories";

/**
 * Parâmetros da busca pública (/imoveis), validados num lugar só.
 *
 * Regras que corrigem os bugs do review de 28/09:
 * - Nada inválido chega às queries: `finalidade=aluguel` ou `quartos_min=abc`
 *   derrubavam a página com erro 500.
 * - A URL só carrega o que o usuário escolheu. Antes, os sliders gravavam
 *   sempre os limites (quartos_min/max, preco_min/max): isso escondia imóveis
 *   sem quartos (lote, galpão) e "congelava" links salvos, que deixavam de
 *   mostrar anúncios novos acima do máximo antigo.
 * - Quartos é "mínimo" (1+, 2+…), não faixa; preço usa valores prontos.
 */

export type SortOption = "recentes" | "menor-preco" | "maior-preco";

export interface SearchFilters {
  purpose?: ImovelPurpose;
  /** Um ImovelKind ou uma categoria antiga (residencial/comercial/lotes). */
  tipo?: string;
  bairro?: string;
  /** Mínimo de quartos. */
  quartos?: number;
  precoMin?: number;
  precoMax?: number;
  ordem: SortOption;
  pagina: number;
}

export const PAGE_SIZE = 12;

export const QUARTOS_OPTIONS = [1, 2, 3, 4] as const;

export const PRICE_OPTIONS: Record<ImovelPurpose, number[]> = {
  locacao: [500, 800, 1000, 1500, 2000, 3000, 5000],
  venda: [100000, 150000, 200000, 300000, 400000, 500000, 750000, 1000000, 2000000],
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recentes", label: "Mais recentes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
];

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInt(value: string | undefined, max: number): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const n = Number(value);
  return n > 0 && n <= max ? n : undefined;
}

export function parseSearchParams(raw: RawParams): SearchFilters {
  const finalidade = first(raw.finalidade);
  const purpose = finalidade === "venda" || finalidade === "locacao" ? finalidade : undefined;

  const tipoRaw = first(raw.tipo)?.trim();
  const tipo = tipoRaw && isValidTipo(tipoRaw) ? tipoRaw : undefined;

  const bairroRaw = first(raw.bairro)?.trim().slice(0, 60);
  const bairro = bairroRaw ? bairroRaw : undefined;

  // `quartos` é o parâmetro novo; `quartos_min` mantém links antigos úteis.
  const quartos = positiveInt(first(raw.quartos) ?? first(raw.quartos_min), 10);

  let precoMin = positiveInt(first(raw.preco_min), 100_000_000);
  let precoMax = positiveInt(first(raw.preco_max), 100_000_000);
  if (precoMin && precoMax && precoMin > precoMax) [precoMin, precoMax] = [precoMax, precoMin];

  const ordemRaw = first(raw.ordem);
  const ordem: SortOption = ordemRaw === "menor-preco" || ordemRaw === "maior-preco" ? ordemRaw : "recentes";

  const pagina = positiveInt(first(raw.pagina), 1000) ?? 1;

  return { purpose, tipo, bairro, quartos, precoMin, precoMax, ordem, pagina };
}

/** Monta /imoveis?… só com o que difere do padrão (sem ordem/página padrão). */
export function searchHref(filters: Partial<SearchFilters>): string {
  const params = new URLSearchParams();
  if (filters.purpose) params.set("finalidade", filters.purpose);
  if (filters.tipo) params.set("tipo", filters.tipo);
  if (filters.bairro?.trim()) params.set("bairro", filters.bairro.trim());
  if (filters.quartos) params.set("quartos", String(filters.quartos));
  if (filters.precoMin) params.set("preco_min", String(filters.precoMin));
  if (filters.precoMax) params.set("preco_max", String(filters.precoMax));
  if (filters.ordem && filters.ordem !== "recentes") params.set("ordem", filters.ordem);
  if (filters.pagina && filters.pagina > 1) params.set("pagina", String(filters.pagina));
  const query = params.toString();
  return query ? `/imoveis?${query}` : "/imoveis";
}

/** Quantos filtros (fora finalidade/ordem/página) estão ativos — para o botão "Filtros (n)". */
export function countActiveFilters(filters: SearchFilters): number {
  return [filters.tipo, filters.bairro, filters.quartos, filters.precoMin, filters.precoMax].filter(Boolean).length;
}

/** "R$ 1.500" / "R$ 300 mil" / "R$ 1,2 mi" — rótulos curtos para os selects de preço. */
export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const mi = value / 1_000_000;
    return `R$ ${mi.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  }
  if (value >= 10_000) return `R$ ${Math.round(value / 1000).toLocaleString("pt-BR")} mil`;
  return `R$ ${value.toLocaleString("pt-BR")}`;
}
