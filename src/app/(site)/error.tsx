"use client";

import { useEffect } from "react";
import { ProblemState } from "@/components/layout/ProblemState";

/**
 * Falha ao carregar dados (ex.: banco fora do ar). Antes não existia: o
 * visitante via a tela de erro genérica do Next, em inglês e sem menu.
 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ProblemState code="Instabilidade" title="Não conseguimos carregar os imóveis agora">
      <p>Tente de novo em alguns instantes. Se preferir, fale direto com o corretor pelo WhatsApp.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 underline underline-offset-2 text-text-1"
        style={{ font: "600 16px/1 var(--font-display)" }}
      >
        Tentar de novo
      </button>
    </ProblemState>
  );
}
