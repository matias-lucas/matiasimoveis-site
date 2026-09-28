"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Search, MapPin } from "lucide-react";
import { KIND_ICONS } from "@/components/imovel/kind-icons";
import { SEARCH_KINDS } from "@/lib/imovel-kind-categories";
import { searchHref } from "@/lib/search-params";
import type { CatalogSummary } from "@/lib/queries";
import type { ImovelPurpose } from "@/lib/types";

interface HomeSearchProps {
  summary: CatalogSummary;
}

/**
 * Busca do hero da Home. Diferente da busca antiga, NÃO navega a cada
 * mudança: o usuário monta finalidade + tipo + bairro e só então toca em
 * "Buscar" (antes, digitar "Jar" e pausar levava para /imoveis?bairro=Jar e
 * o resto do texto se perdia — review 28/09). Sem JavaScript, o <form> GET
 * nativo continua funcionando.
 */
export function HomeSearch({ summary }: HomeSearchProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState<ImovelPurpose>("locacao");
  const kindCounts = summary.kinds[purpose];
  const tiles = SEARCH_KINDS.filter((k) => (kindCounts[k.value] ?? 0) > 0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    router.push(
      searchHref({
        purpose,
        tipo: String(data.get("tipo") ?? "") || undefined,
        bairro: String(data.get("bairro") ?? "") || undefined,
      })
    );
  }

  return (
    <div>
      <form
        action="/imoveis"
        method="get"
        onSubmit={handleSubmit}
        className="bg-bg-surface text-text-1 rounded-2xl shadow-lg p-4 sm:p-5"
        role="search"
        aria-label="Buscar imóveis"
      >
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-bg-sunken mb-4" role="radiogroup" aria-label="Finalidade">
          {(["locacao", "venda"] as const).map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name="finalidade"
                value={option}
                checked={purpose === option}
                onChange={() => setPurpose(option)}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  "flex items-center justify-center h-12 rounded-lg transition-colors duration-150 ease-out peer-focus-visible:shadow-focus",
                  purpose === option
                    ? option === "locacao"
                      ? "bg-blue-500 text-white"
                      : "bg-red-600 text-white"
                    : "text-text-2 hover:text-text-1"
                )}
                style={{ font: "700 17px/1 var(--font-display)" }}
              >
                {option === "locacao" ? "Alugar" : "Comprar"}
                <span className="ml-1.5 opacity-80 tabular" style={{ font: "600 14px/1 var(--font-display)" }}>
                  ({summary.byPurpose[option]})
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] gap-3">
          <label className="flex flex-col gap-1.5 min-w-0">
            <span style={{ font: "var(--text-label)" }}>Tipo</span>
            <select
              name="tipo"
              defaultValue=""
              className="w-full min-w-0 h-12 px-3 rounded-lg border border-border-2 bg-bg-surface text-text-1 focus:outline-none focus:border-border-focus focus:shadow-focus"
              style={{ font: "var(--text-body-md)" }}
            >
              <option value="">Todos os tipos</option>
              {SEARCH_KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 min-w-0">
            <span style={{ font: "var(--text-label)" }}>Bairro</span>
            <span className="flex items-center gap-2 h-12 px-3 rounded-lg border border-border-2 focus-within:border-border-focus focus-within:shadow-focus">
              <MapPin className="w-5 h-5 text-text-3 shrink-0" aria-hidden />
              <input
                name="bairro"
                list="home-bairros"
                placeholder="Qualquer bairro"
                autoComplete="off"
                className="flex-1 min-w-0 bg-transparent outline-none text-text-1 placeholder:text-text-3"
                style={{ font: "var(--text-body-md)" }}
              />
            </span>
            <datalist id="home-bairros">
              {summary.neighborhoods.map((n) => (
                <option key={n.name} value={n.name} />
              ))}
            </datalist>
          </label>
          <button
            type="submit"
            className="self-end inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:shadow-focus"
            style={{ font: "700 17px/1 var(--font-display)" }}
          >
            <Search className="w-5 h-5" aria-hidden />
            Buscar
          </button>
        </div>
      </form>

      {tiles.length > 0 && (
        <nav aria-label="Atalhos por tipo" className="mt-4">
          <ul className="snap-row flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {tiles.map((k) => {
              const Icon = KIND_ICONS[k.value];
              return (
                <li key={k.value} className="shrink-0">
                  <Link
                    href={searchHref({ purpose, tipo: k.value })}
                    className="flex items-center gap-2 h-11 px-4 rounded-pill bg-white/10 text-white no-underline border border-white/15 hover:bg-white/20 hover:text-white transition-colors duration-150 ease-out"
                    style={{ font: "600 15px/1 var(--font-display)" }}
                  >
                    <Icon className="w-4 h-4" aria-hidden />
                    {k.plural}
                    <span className="tabular opacity-75">{kindCounts[k.value]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
