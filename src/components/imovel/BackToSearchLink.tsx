"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const LAST_SEARCH_KEY = "matias:ultima-busca";

function readLastSearch(): string {
  try {
    const saved = sessionStorage.getItem(LAST_SEARCH_KEY);
    return saved?.startsWith("/imoveis") ? saved : "/imoveis";
  } catch {
    // sessionStorage indisponível (modo privado etc.): volta para /imoveis.
    return "/imoveis";
  }
}

const noopSubscribe = () => () => {};

/**
 * "Voltar para a busca" que preserva os filtros: aponta para a última URL de
 * /imoveis visitada nesta aba (gravada por ImoveisShell). Antes o link era
 * fixo em /imoveis e os filtros se perdiam (review 28/09).
 */
export function BackToSearchLink() {
  const href = useSyncExternalStore(noopSubscribe, readLastSearch, () => "/imoveis");

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 h-11 text-text-2 no-underline hover:text-text-1"
      style={{ font: "600 15px/1 var(--font-display)" }}
    >
      <ArrowLeft className="w-4 h-4" aria-hidden />
      Voltar para a busca
    </Link>
  );
}
