"use client";

import { useState, type FormEvent } from "react";
import { clsx } from "clsx";
import { Search } from "lucide-react";
import { KIND_ICONS } from "./kind-icons";
import { SEARCH_KINDS } from "@/lib/imovel-kind-categories";
import {
  PRICE_OPTIONS,
  QUARTOS_OPTIONS,
  formatPriceShort,
  searchHref,
  type SearchFilters,
} from "@/lib/search-params";
import type { CatalogSummary } from "@/lib/queries";
import type { ImovelPurpose } from "@/lib/types";

interface ImoveisFiltersProps {
  filters: SearchFilters;
  summary: CatalogSummary;
  /** "sidebar": aplica a cada mudança (desktop). "sheet": aplica no botão (painel do celular). */
  mode: "sidebar" | "sheet";
  onNavigate: (href: string) => void;
  /** Só no modo sheet: fecha o painel. */
  onClose?: () => void;
  resultCount: number;
}

const labelFont = { font: "700 15px/1.2 var(--font-display)" } as const;

function Pill({
  name,
  value,
  checked,
  disabled,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className={clsx("cursor-pointer", disabled && "cursor-not-allowed")}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={clsx(
          "flex items-center gap-1.5 h-11 px-3.5 rounded-pill border transition-colors duration-150 ease-out peer-focus-visible:shadow-focus",
          checked
            ? "bg-bg-inverse border-bg-inverse text-white"
            : "bg-bg-surface border-border-2 text-text-1 hover:border-text-1",
          disabled && "opacity-40 hover:border-border-2"
        )}
        style={{ font: "600 15px/1 var(--font-display)" }}
      >
        {children}
      </span>
    </label>
  );
}

/**
 * Filtros da busca. Tudo que vai para a URL passa por searchHref(), que só
 * grava o que o usuário escolheu (ver lib/search-params.ts). Trocar a
 * finalidade limpa o preço, porque as faixas de aluguel e venda não têm nada
 * em comum.
 */
export function ImoveisFilters({ filters, summary, mode, onNavigate, onClose, resultCount }: ImoveisFiltersProps) {
  const [draft, setDraft] = useState<SearchFilters>(filters);
  const [bairro, setBairro] = useState(filters.bairro ?? "");
  const kindCounts = summary.kinds[draft.purpose ?? "all"];
  const idPrefix = `f-${mode}`;

  function update(patch: Partial<SearchFilters>) {
    const next = { ...draft, ...patch, pagina: 1 };
    setDraft(next);
    if (mode === "sidebar") onNavigate(searchHref({ ...next, bairro }));
  }

  function setPurpose(purpose: ImovelPurpose | undefined) {
    update({ purpose, precoMin: undefined, precoMax: undefined });
  }

  function applyBairro(event?: FormEvent) {
    event?.preventDefault();
    if (mode === "sidebar") onNavigate(searchHref({ ...draft, bairro, pagina: 1 }));
  }

  function applySheet() {
    onNavigate(searchHref({ ...draft, bairro, pagina: 1 }));
    onClose?.();
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2.5 text-text-1" style={labelFont}>
          Finalidade
        </legend>
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-bg-sunken">
          {([
            [undefined, "Todos"],
            ["locacao", "Alugar"],
            ["venda", "Comprar"],
          ] as const).map(([value, label]) => {
            const checked = draft.purpose === value;
            return (
              <label key={label} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${idPrefix}-finalidade`}
                  checked={checked}
                  onChange={() => setPurpose(value)}
                  className="peer sr-only"
                />
                <span
                  className={clsx(
                    "flex items-center justify-center h-11 rounded-lg transition-colors duration-150 ease-out peer-focus-visible:shadow-focus",
                    // Azul = locação, vermelho = venda, como no resto do site.
                    checked
                      ? value === "locacao"
                        ? "bg-blue-500 text-white shadow-sm"
                        : value === "venda"
                          ? "bg-red-600 text-white shadow-sm"
                          : "bg-bg-surface text-text-1 shadow-sm"
                      : "text-text-2 hover:text-text-1"
                  )}
                  style={{ font: "700 15px/1 var(--font-display)" }}
                >
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-text-1" style={labelFont}>
          Tipo de imóvel
        </legend>
        <div className="grid grid-cols-2 gap-2 [&_label>span]:w-full">
          <Pill name={`${idPrefix}-tipo`} value="" checked={!draft.tipo} onChange={() => update({ tipo: undefined })}>
            Todos
          </Pill>
          {SEARCH_KINDS.map((k) => {
            const count = kindCounts[k.value] ?? 0;
            const checked = draft.tipo === k.value;
            const Icon = KIND_ICONS[k.value];
            return (
              <Pill
                key={k.value}
                name={`${idPrefix}-tipo`}
                value={k.value}
                checked={checked}
                disabled={count === 0 && !checked}
                onChange={() => update({ tipo: k.value })}
              >
                <Icon className="w-4 h-4" aria-hidden />
                {k.label}
                <span className={clsx("tabular", checked ? "text-white/75" : "text-text-3")}>{count}</span>
              </Pill>
            );
          })}
        </div>
      </fieldset>

      <form onSubmit={applyBairro}>
        <label htmlFor={`${idPrefix}-bairro`} className="block mb-2.5 text-text-1" style={labelFont}>
          Bairro
        </label>
        <div className="flex gap-2">
          <input
            id={`${idPrefix}-bairro`}
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            onBlur={() => mode === "sidebar" && bairro !== (filters.bairro ?? "") && applyBairro()}
            list={`${idPrefix}-bairros`}
            placeholder="Qualquer bairro"
            autoComplete="off"
            className="flex-1 min-w-0 h-11 px-3 rounded-lg border border-border-2 bg-bg-surface text-text-1 placeholder:text-text-3 focus:outline-none focus:border-border-focus focus:shadow-focus"
            style={{ font: "var(--text-body-md)" }}
          />
          {mode === "sidebar" && (
            <button
              type="submit"
              aria-label="Aplicar bairro"
              className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-bg-inverse text-white"
            >
              <Search className="w-5 h-5" aria-hidden />
            </button>
          )}
        </div>
        <datalist id={`${idPrefix}-bairros`}>
          {summary.neighborhoods.map((n) => (
            <option key={n.name} value={n.name} />
          ))}
        </datalist>
      </form>

      <fieldset>
        <legend className="mb-2.5 text-text-1" style={labelFont}>
          Quartos
        </legend>
        <div className="flex flex-wrap gap-2">
          <Pill name={`${idPrefix}-quartos`} value="" checked={!draft.quartos} onChange={() => update({ quartos: undefined })}>
            Qualquer
          </Pill>
          {QUARTOS_OPTIONS.map((q) => (
            <Pill
              key={q}
              name={`${idPrefix}-quartos`}
              value={String(q)}
              checked={draft.quartos === q}
              onChange={() => update({ quartos: q })}
            >
              {q}+
            </Pill>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-text-1" style={labelFont}>
          Preço {draft.purpose === "locacao" && <span className="text-text-3">(por mês)</span>}
        </legend>
        {draft.purpose ? (
          <div className="grid grid-cols-2 gap-2">
            {(["precoMin", "precoMax"] as const).map((field) => (
              <label key={field} className="flex flex-col gap-1">
                <span className="text-text-2" style={{ font: "var(--text-caption)" }}>
                  {field === "precoMin" ? "De" : "Até"}
                </span>
                <select
                  value={draft[field] ?? ""}
                  onChange={(e) => update({ [field]: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-11 px-2.5 rounded-lg border border-border-2 bg-bg-surface text-text-1 focus:outline-none focus:border-border-focus focus:shadow-focus"
                  style={{ font: "var(--text-body-sm)" }}
                >
                  <option value="">{field === "precoMin" ? "Sem mínimo" : "Sem máximo"}</option>
                  {PRICE_OPTIONS[draft.purpose!].map((v) => (
                    <option key={v} value={v}>
                      {formatPriceShort(v)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-text-2" style={{ font: "var(--text-body-sm)" }}>
            Escolha Alugar ou Comprar para filtrar por preço.
          </p>
        )}
      </fieldset>

      {mode === "sheet" && (
        <div className="sticky bottom-0 -mx-5 px-5 py-4 bg-bg-surface border-t border-border-1 grid grid-cols-[auto_1fr] gap-3">
          <button
            type="button"
            onClick={() => {
              setDraft({ ordem: filters.ordem, pagina: 1 });
              setBairro("");
            }}
            className="h-12 px-4 rounded-md border border-border-2 text-text-1"
            style={{ font: "600 16px/1 var(--font-display)" }}
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={applySheet}
            className="h-12 rounded-md bg-brand-primary text-white hover:bg-brand-primary-hover"
            style={{ font: "700 16px/1 var(--font-display)" }}
          >
            Ver imóveis
          </button>
        </div>
      )}
      {mode === "sidebar" && (
        <p className="sr-only" aria-live="polite">
          {resultCount} {resultCount === 1 ? "imóvel encontrado" : "imóveis encontrados"}
        </p>
      )}
    </div>
  );
}
