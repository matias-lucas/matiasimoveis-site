"use client";

import { useEffect, useRef, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { SlidersHorizontal, X } from "lucide-react";
import { ImoveisFilters } from "./ImoveisFilters";
import { LAST_SEARCH_KEY } from "./BackToSearchLink";
import { KIND_CATEGORIES, SEARCH_KINDS } from "@/lib/imovel-kind-categories";
import { SORT_OPTIONS, countActiveFilters, formatPriceShort, searchHref, type SearchFilters, type SortOption } from "@/lib/search-params";
import type { CatalogSummary } from "@/lib/queries";
import { normalizeText } from "@/lib/format";

interface ImoveisShellProps {
  filters: SearchFilters;
  summary: CatalogSummary;
  total: number;
  /** Grade de resultados + paginação, renderizadas no servidor. */
  children: ReactNode;
}

function tipoLabel(tipo: string): string {
  return SEARCH_KINDS.find((k) => k.value === tipo)?.label ?? KIND_CATEGORIES.find((c) => c.value === tipo)?.label ?? tipo;
}

function headingFor(filters: SearchFilters, total: number, summary: CatalogSummary): string {
  const count = `${total} ${total === 1 ? "imóvel" : "imóveis"}`;
  const purpose = filters.purpose === "locacao" ? " para alugar" : filters.purpose === "venda" ? " à venda" : "";
  // Nome oficial do bairro quando o digitado casa exatamente (ignorando acento/caixa).
  const bairro = filters.bairro
    ? summary.neighborhoods.find((n) => normalizeText(n.name) === normalizeText(filters.bairro!))?.name ?? filters.bairro
    : undefined;
  const where = bairro ? ` em ${bairro}` : "";
  return `${count}${purpose}${where}`;
}

/**
 * Casca da página /imoveis: filtros na lateral (desktop) ou num painel
 * (celular, <dialog> nativo), ordenação, chips dos filtros ativos e o estado
 * "carregando" enquanto uma nova busca chega. Antes, no celular, a primeira
 * tela inteira era formulário e nenhum imóvel aparecia (review 28/09).
 */
export function ImoveisShell({ filters, summary, total, children }: ImoveisShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const sheetRef = useRef<HTMLDialogElement>(null);
  const activeCount = countActiveFilters(filters);
  const urlKey = searchHref(filters);

  // Lembra a busca atual para o "Voltar para a busca" da ficha do imóvel.
  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_SEARCH_KEY, urlKey);
    } catch {
      // sessionStorage indisponível: o voltar cai em /imoveis.
    }
  }, [urlKey]);

  function navigate(href: string) {
    startTransition(() => router.push(href, { scroll: false }));
  }

  const chips: { label: string; without: Partial<SearchFilters> }[] = [];
  if (filters.tipo) chips.push({ label: tipoLabel(filters.tipo), without: { tipo: undefined } });
  if (filters.bairro) chips.push({ label: filters.bairro, without: { bairro: undefined } });
  if (filters.quartos) chips.push({ label: `${filters.quartos}+ quartos`, without: { quartos: undefined } });
  if (filters.precoMin) chips.push({ label: `De ${formatPriceShort(filters.precoMin)}`, without: { precoMin: undefined } });
  if (filters.precoMax) chips.push({ label: `Até ${formatPriceShort(filters.precoMax)}`, without: { precoMax: undefined } });

  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Filtros">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-1 pb-6">
          <ImoveisFilters key={urlKey} filters={filters} summary={summary} mode="sidebar" onNavigate={navigate} resultCount={total} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-text-1" style={{ font: "var(--text-display-md)" }}>
            {headingFor(filters, total, summary)}
          </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => sheetRef.current?.showModal()}
              className="lg:hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-bg-inverse text-white"
              style={{ font: "700 15px/1 var(--font-display)" }}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden />
              Filtros{activeCount > 0 && ` (${activeCount})`}
            </button>
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Ordenar por</span>
              <select
                value={filters.ordem}
                onChange={(e) => navigate(searchHref({ ...filters, ordem: e.target.value as SortOption, pagina: 1 }))}
                className="w-full h-11 px-3 rounded-md border border-border-2 bg-bg-surface text-text-1 focus:outline-none focus:shadow-focus"
                style={{ font: "600 15px/1 var(--font-display)" }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-5" aria-label="Filtros ativos">
            {chips.map((chip) => (
              <li key={chip.label}>
                <button
                  type="button"
                  onClick={() => navigate(searchHref({ ...filters, ...chip.without, pagina: 1 }))}
                  className="inline-flex items-center gap-1.5 h-9 pl-3 pr-2 rounded-pill bg-bg-sunken text-text-1 hover:bg-border-1"
                  style={{ font: "600 14px/1 var(--font-display)" }}
                  aria-label={`Remover filtro ${chip.label}`}
                >
                  {chip.label}
                  <X className="w-4 h-4" aria-hidden />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => navigate(searchHref({ purpose: filters.purpose, ordem: filters.ordem }))}
                className="inline-flex items-center h-9 px-2 text-text-2 underline underline-offset-2 hover:text-text-1"
                style={{ font: "600 14px/1 var(--font-display)" }}
              >
                Limpar filtros
              </button>
            </li>
          </ul>
        )}

        <div
          aria-busy={isPending}
          className={clsx("transition-opacity duration-200", isPending && "opacity-45 pointer-events-none")}
        >
          {children}
        </div>
      </div>

      <dialog
        ref={sheetRef}
        className="filter-sheet m-0 mt-auto w-full max-w-none max-h-[88dvh] rounded-t-2xl bg-bg-surface text-text-1 p-0"
        aria-label="Filtros"
      >
        <div className="flex items-center justify-between h-14 px-5 border-b border-border-1 sticky top-0 bg-bg-surface z-10">
          <span style={{ font: "700 18px/1 var(--font-display)" }}>Filtros</span>
          <button
            type="button"
            onClick={() => sheetRef.current?.close()}
            aria-label="Fechar filtros"
            className="flex items-center justify-center w-11 h-11 -mr-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="px-5 pt-5">
          <ImoveisFilters
            key={urlKey}
            filters={filters}
            summary={summary}
            mode="sheet"
            onNavigate={navigate}
            onClose={() => sheetRef.current?.close()}
            resultCount={total}
          />
        </div>
      </dialog>
    </div>
  );
}
