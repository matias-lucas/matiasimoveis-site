import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { clsx } from "clsx";
import { Container } from "@/components/layout/Container";
import { ImoveisShell } from "@/components/imovel/ImoveisShell";
import { ImovelCard } from "@/components/imovel/ImovelCard";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { getCatalogSummary, searchImoveis } from "@/lib/queries";
import { PAGE_SIZE, parseSearchParams, searchHref, type SearchFilters } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Imóveis para alugar e comprar",
  description: "Casas, apartamentos, lotes e imóveis comerciais à venda e para alugar em Itaberaí/GO.",
};

interface ImoveisPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function Pagination({ filters, total }: { filters: SearchFilters; total: number }) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;
  const current = Math.min(filters.pagina, pages);
  const linkClass =
    "inline-flex items-center justify-center gap-1 h-11 min-w-11 px-3 rounded-md border border-border-2 bg-bg-surface text-text-1 no-underline hover:border-text-1 hover:text-text-1";
  const font = { font: "600 15px/1 var(--font-display)" } as const;

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Paginação">
      {current > 1 && (
        <Link href={searchHref({ ...filters, pagina: current - 1 })} className={linkClass} style={font} scroll>
          <ChevronLeft className="w-4 h-4" aria-hidden />
          Anterior
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={searchHref({ ...filters, pagina: page })}
          aria-current={page === current ? "page" : undefined}
          className={clsx(linkClass, "hidden sm:inline-flex", page === current && "!bg-bg-inverse !text-white !border-bg-inverse")}
          style={font}
        >
          {page}
        </Link>
      ))}
      <span className="sm:hidden text-text-2" style={font}>
        {current} de {pages}
      </span>
      {current < pages && (
        <Link href={searchHref({ ...filters, pagina: current + 1 })} className={linkClass} style={font}>
          Próxima
          <ChevronRight className="w-4 h-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}

export default async function ImoveisPage({ searchParams }: ImoveisPageProps) {
  const filters = parseSearchParams(await searchParams);
  const summary = await getCatalogSummary();
  const { items, total } = await searchImoveis(
    filters,
    summary.neighborhoods.map((n) => n.name)
  );

  return (
    <Container className="py-6 lg:py-10">
      <ImoveisShell filters={filters} summary={summary} total={total}>
        {items.length > 0 ? (
          <>
            <ul className="grid gap-3 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((imovel, index) => (
                <li key={imovel.id} className="flex">
                  <ImovelCard imovel={imovel} listOnMobile preload={index === 0} />
                </li>
              ))}
            </ul>
            <Pagination filters={filters} total={total} />
          </>
        ) : (
          <div className="flex flex-col items-center text-center gap-4 py-14 px-6 bg-bg-surface border border-border-1 rounded-xl">
            <SearchX className="w-10 h-10 text-text-3" aria-hidden />
            <p className="text-text-1" style={{ font: "var(--text-display-sm)" }}>
              Nenhum imóvel com esses filtros.
            </p>
            <p className="text-text-2 max-w-md" style={{ font: "var(--text-body-sm)" }}>
              Tente tirar algum filtro, ou conte o que você procura: avisamos pelo WhatsApp quando entrar um imóvel assim.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={searchHref({ purpose: filters.purpose })}
                className="inline-flex items-center h-12 px-5 rounded-md border border-border-2 text-text-1 no-underline hover:border-text-1 hover:text-text-1"
                style={{ font: "600 16px/1 var(--font-display)" }}
              >
                Limpar filtros
              </Link>
              <WhatsAppLink message="Olá! Estou procurando um imóvel e não encontrei no site. Pode me ajudar?">
                Avise-me pelo WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        )}
      </ImoveisShell>
    </Container>
  );
}
