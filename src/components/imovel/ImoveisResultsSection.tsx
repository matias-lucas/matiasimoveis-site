"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { SearchFilterBar } from "./SearchFilterBar";
import { ImovelCard } from "./ImovelCard";
import { ImovelCardSkeleton } from "./ImovelCardSkeleton";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import type { ImovelRangesByPurpose } from "@/lib/queries";
import type { Imovel, ImovelPurpose } from "@/lib/types";

interface ImoveisResultsSectionProps {
  ranges: ImovelRangesByPurpose;
  results: Imovel[];
  defaultPurpose: ImovelPurpose;
  defaultNeighborhood?: string;
  defaultKind?: string;
}

// Client component só porque precisa saber quando o SearchFilterBar disparou
// uma navegação (onPendingChange) pra trocar a grade de resultados por
// skeletons enquanto ela ainda não chegou — evita o "pisca-pisca" de sumir o
// conteúdo antigo e mostrar a página em branco até o novo payload do server
// component (page.tsx) comitar.
export function ImoveisResultsSection({
  ranges,
  results,
  defaultPurpose,
  defaultNeighborhood,
  defaultKind,
}: ImoveisResultsSectionProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <SearchFilterBar
        ranges={ranges}
        defaultPurpose={defaultPurpose}
        defaultNeighborhood={defaultNeighborhood}
        defaultKind={defaultKind}
        onPendingChange={setIsPending}
      />

      <div className="flex justify-between items-baseline my-7">
        <h1
          className="text-text-1"
          style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
        >
          {results.length} {results.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
        </h1>
      </div>

      {isPending ? (
        <div className="flex gap-5 flex-wrap">
          {Array.from({ length: Math.max(results.length, 4) }).map((_, index) => (
            <ImovelCardSkeleton key={index} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="flex gap-5 flex-wrap">
          {results.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center gap-4 py-20 px-8 bg-bg-surface border border-border-1 rounded-lg">
          <SearchX className="w-10 h-10 text-text-3" />
          <p className="text-text-1 max-w-md" style={{ font: "var(--text-body-md)" }}>
            Não encontramos nenhum imóvel com esses filtros.
          </p>
          <p className="text-text-2 max-w-md" style={{ font: "var(--text-body-sm)" }}>
            Descreva o imóvel que você procura e nós avisaremos quando encontrá-lo.
          </p>
          <WhatsAppLink message="Olá! Estou procurando um imóvel e não encontrei no site. Pode me ajudar?">
            Falar no WhatsApp
          </WhatsAppLink>
        </div>
      )}
    </>
  );
}
