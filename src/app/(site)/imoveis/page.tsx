import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SearchFilterBar } from "@/components/imovel/SearchFilterBar";
import { ImovelCard } from "@/components/imovel/ImovelCard";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { searchImoveis } from "@/lib/queries";
import { parsePriceBand } from "@/lib/price-bands";
import type { ImovelKind, ImovelPurpose } from "@/lib/types";

export const metadata: Metadata = {
  title: "Buscar imóveis",
  description: "Casas, apartamentos, lotes e imóveis comerciais à venda e para alugar em Itaberaí/GO.",
};

export const revalidate = 60;

interface ImoveisPageProps {
  searchParams: Promise<{
    finalidade?: string;
    bairro?: string;
    tipo?: string;
    quartos?: string;
    preco?: string;
  }>;
}

export default async function ImoveisPage({ searchParams }: ImoveisPageProps) {
  const params = await searchParams;
  const purpose = params.finalidade as ImovelPurpose | undefined;
  const { min: minPrice, max: maxPrice } = parsePriceBand(params.preco);

  const results = await searchImoveis({
    purpose,
    neighborhood: params.bairro,
    kind: params.tipo as ImovelKind | undefined,
    minBedrooms: params.quartos ? Number(params.quartos) : undefined,
    minPrice,
    maxPrice,
  });

  return (
    <Container className="py-8">
      <SearchFilterBar
        defaultPurpose={purpose ?? "locacao"}
        defaultNeighborhood={params.bairro}
      />

      <div className="flex justify-between items-baseline my-7">
        <h1
          className="text-text-1"
          style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
        >
          {results.length} {results.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
        </h1>
      </div>

      {results.length > 0 ? (
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
    </Container>
  );
}
