import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ImoveisResultsSection } from "@/components/imovel/ImoveisResultsSection";
import { searchImoveis, getImovelRanges } from "@/lib/queries";
import { resolveKindFilter } from "@/lib/imovel-kind-categories";
import type { ImovelPurpose } from "@/lib/types";

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
    quartos_min?: string;
    quartos_max?: string;
    preco_min?: string;
    preco_max?: string;
  }>;
}

export default async function ImoveisPage({ searchParams }: ImoveisPageProps) {
  const params = await searchParams;
  const purpose = params.finalidade as ImovelPurpose | undefined;

  const [results, ranges] = await Promise.all([
    searchImoveis({
      purpose,
      neighborhood: params.bairro,
      kind: resolveKindFilter(params.tipo),
      minBedrooms: params.quartos_min ? Number(params.quartos_min) : undefined,
      maxBedrooms: params.quartos_max ? Number(params.quartos_max) : undefined,
      minPrice: params.preco_min ? Number(params.preco_min) : undefined,
      maxPrice: params.preco_max ? Number(params.preco_max) : undefined,
    }),
    getImovelRanges(),
  ]);

  return (
    <Container className="py-8">
      <ImoveisResultsSection
        ranges={ranges}
        results={results}
        defaultPurpose={purpose ?? "locacao"}
        defaultNeighborhood={params.bairro}
        defaultKind={params.tipo}
      />
    </Container>
  );
}
