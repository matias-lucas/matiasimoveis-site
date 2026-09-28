import Link from "next/link";
import Image from "next/image";
import { MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { HomeSearch } from "@/components/home/HomeSearch";
import { ListingShowcase } from "@/components/home/ListingShowcase";
import { ServicesList } from "@/components/home/ServicesList";
import { ImobiliariaSelo } from "@/components/layout/ImobiliariaSelo";
import { getCatalogSummary, getHomeImoveis, type CatalogSummary } from "@/lib/queries";
import { searchHref } from "@/lib/search-params";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";
import type { Imovel } from "@/lib/types";
import fachada from "../../../public/images/fachada-matias.webp";

export const revalidate = 60;

const EMPTY_SUMMARY: CatalogSummary = {
  total: 0,
  byPurpose: { locacao: 0, venda: 0 },
  kinds: { all: {}, locacao: {}, venda: {} },
  neighborhoods: [],
};

// Se o banco estiver fora (ex.: projeto Supabase pausado), a Home ainda
// abre — com busca e contatos — em vez da tela de erro genérica.
async function loadHome(): Promise<{ summary: CatalogSummary; aluguel: Imovel[]; venda: Imovel[]; ok: boolean }> {
  try {
    const [summary, aluguel, venda] = await Promise.all([
      getCatalogSummary(),
      getHomeImoveis("locacao"),
      getHomeImoveis("venda"),
    ]);
    return { summary, aluguel, venda, ok: true };
  } catch (error) {
    console.error("Home: falha ao carregar o catálogo", error);
    return { summary: EMPTY_SUMMARY, aluguel: [], venda: [], ok: false };
  }
}

export default async function HomePage() {
  const { summary, aluguel, venda, ok } = await loadHome();
  const bairros = summary.neighborhoods.slice(0, 10);

  return (
    <>
      {/* Hero: a busca é a protagonista. No desktop, ao lado, a fachada real
          da imobiliária; no celular a busca vem primeiro e sozinha. */}
      <section className="bg-bg-inverse text-white">
        <Container className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 lg:gap-14 items-center pt-8 pb-10 sm:pt-12 lg:pt-16 lg:pb-16">
          <div className="min-w-0">
            <h1 className="reveal max-w-[16ch]" style={{ font: "var(--text-display-xl)" }}>
              Seu próximo imóvel em Itaberaí
            </h1>
            <p className="reveal reveal-d1 mt-3 mb-6 max-w-[46ch] text-white/80" style={{ font: "var(--text-body-lg)" }}>
              Casas, apartamentos, lotes e salas para alugar ou comprar, com atendimento direto pelo WhatsApp.
            </p>
            <div className="reveal reveal-d2">
              <HomeSearch summary={summary} />
            </div>
            {!ok && (
              <p className="mt-4 text-white/80" style={{ font: "var(--text-body-sm)" }}>
                O catálogo está temporariamente indisponível. Fale com a gente pelo WhatsApp.
              </p>
            )}
          </div>

          <div className="hidden lg:block relative reveal reveal-d3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={fachada}
                alt="Fachada da Matias Imóveis em Itaberaí"
                fill
                preload
                placeholder="blur"
                sizes="(min-width: 1280px) 520px, 40vw"
                className="object-cover"
              />
            </div>
            {/* O número é o da imobiliária, não de um corretor (dono, 28/09). */}
            <a
              href={buildWhatsAppUrl(SITE.whatsappDefaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-xl bg-bg-surface text-text-1 no-underline shadow-lg px-4 py-3 hover:text-text-1 hover:shadow-xl transition-shadow duration-150 ease-out"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-whatsapp text-white">
                <MessageCircle className="w-5 h-5" aria-hidden />
              </span>
              <span>
                <span className="block" style={{ font: "700 15px/1.2 var(--font-display)" }}>
                  Fale direto conosco
                </span>
                <span className="block text-text-2" style={{ font: "var(--text-body-sm)" }}>
                  WhatsApp · {SITE.phone}
                </span>
              </span>
            </a>
          </div>
        </Container>
      </section>

      <ListingShowcase purpose="locacao" title="Imóveis para alugar" imoveis={aluguel} total={summary.byPurpose.locacao} />
      <div className="border-t border-border-1" />
      <ListingShowcase purpose="venda" title="Imóveis à venda" imoveis={venda} total={summary.byPurpose.venda} />

      {bairros.length > 0 && (
        <section className="bg-bg-surface border-y border-border-1 py-12 lg:py-16" aria-labelledby="bairros">
          <Container>
            <h2 id="bairros" className="text-text-1 mb-5" style={{ font: "var(--text-display-md)" }}>
              Buscar por bairro
            </h2>
            <ul className="flex flex-wrap gap-2.5">
              {bairros.map((b) => (
                <li key={b.name}>
                  <Link
                    href={searchHref({ bairro: b.name })}
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-pill border border-border-2 bg-bg-surface text-text-1 no-underline hover:border-text-1 hover:text-text-1 transition-colors duration-150 ease-out"
                    style={{ font: "600 15px/1 var(--font-display)" }}
                  >
                    <MapPin className="w-4 h-4 text-text-3" aria-hidden />
                    {b.name}
                    <span className="tabular text-text-3">{b.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="bg-brand-primary text-white" aria-labelledby="anuncie">
        <Container className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-10 lg:py-12">
          <div className="max-w-2xl">
            <h2 id="anuncie" style={{ font: "var(--text-display-md)" }}>
              Quer vender ou alugar seu imóvel?
            </h2>
            <p className="mt-2 text-white/90" style={{ font: "var(--text-body-md)" }}>
              A Matias avalia e divulga seu imóvel para quem está procurando em Itaberaí.
            </p>
          </div>
          <Button
            href="/anuncie"
            variant="light"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" aria-hidden />}
            className="flex-row-reverse self-start lg:self-auto"
          >
            Anunciar meu imóvel
          </Button>
        </Container>
      </section>

      <section className="py-12 lg:py-20" aria-labelledby="confianca">
        <Container className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <h2 id="confianca" className="text-text-1" style={{ font: "var(--text-display-md)" }}>
              Atendimento de quem conhece a cidade
            </h2>
            <p className="mt-3 text-text-2 max-w-[52ch]" style={{ font: "var(--text-body-md)" }}>
              Imobiliária de Itaberaí, com registro {SITE.cj}. Você fala direto com a gente, do primeiro contato à
              entrega das chaves.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-border-1 bg-bg-surface p-5">
              <div className="flex-1 min-w-[200px]">
                <ImobiliariaSelo size={64} />
              </div>
              <WhatsAppLink message={SITE.whatsappDefaultMessage}>Falar no WhatsApp</WhatsAppLink>
            </div>
            <Link
              href="/empresa"
              className="inline-flex items-center gap-1.5 mt-4 text-text-1 underline underline-offset-4 hover:text-text-1"
              style={{ font: "600 15px/1 var(--font-display)" }}
            >
              Conheça nossa equipe
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
          <ServicesList />
        </Container>
      </section>
    </>
  );
}
