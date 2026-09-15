import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ImovelCard } from "@/components/imovel/ImovelCard";
import { SearchFilterBar } from "@/components/imovel/SearchFilterBar";
import { getFeaturedImoveis, getImovelRanges } from "@/lib/queries";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, ranges] = await Promise.all([getFeaturedImoveis(), getImovelRanges()]);

  return (
    <div>
      <section className="relative min-h-[520px] flex items-end pb-20 pt-[calc(72px+var(--space-16))] text-white overflow-hidden">
        <Image
          src="/images/hero-house.webp"
          alt="Fachada de um imóvel em Itaberaí/GO"
          fill
          priority
          sizes="100vw"
          className="object-cover -z-10"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(22,20,48,0.35) 0%, rgba(22,20,48,0.55) 55%, rgba(22,20,48,0.92) 100%)",
          }}
        />
        <Container>
          <div
            className="uppercase opacity-90 mb-3"
            style={{ font: "var(--text-eyebrow)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Itaberaí e região · {SITE.cj}
          </div>
          <h1
            className="max-w-[620px] mb-3.5"
            style={{ font: "var(--text-display-xl)", fontFamily: "var(--font-display)" }}
          >
            O imóvel certo, no lugar certo
          </h1>
          <p className="max-w-[480px] mb-7 opacity-90" style={{ font: "var(--text-body-lg)" }}>
            {SITE.description}
          </p>
          <div className="flex gap-3">
            <Link
              href="/imoveis"
              className="inline-flex items-center rounded-md bg-white text-brand-primary px-[22px] py-[11px] hover:bg-white/90 transition-colors duration-150 ease-out"
              style={{ font: "var(--text-label)", fontFamily: "var(--font-display)" }}
            >
              Buscar imóveis
            </Link>
            <Link
              href="/anuncie"
              className="inline-flex items-center rounded-md border border-white/50 text-white px-[22px] py-[11px] hover:bg-white/10 transition-colors duration-150 ease-out"
              style={{ font: "var(--text-label)", fontFamily: "var(--font-display)" }}
            >
              Anuncie seu imóvel
            </Link>
          </div>
        </Container>
      </section>

      <Container className="-mt-10 sm:-mt-16 lg:-mt-[72px] !max-w-[960px]">
        <SearchFilterBar ranges={ranges} />
      </Container>

      <Container className="py-10">
        <div className="flex flex-wrap gap-x-10 gap-y-4 justify-center items-center text-center border-y border-border-warm py-6">
          <div>
            <div style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }} className="text-text-1">
              {SITE.cj}
            </div>
            <div className="text-text-3" style={{ font: "var(--text-caption)" }}>
              Registro da imobiliária
            </div>
          </div>
          <div>
            <div style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }} className="text-text-1">
              {SITE.defaultCorretor.creci}
            </div>
            <div className="text-text-3" style={{ font: "var(--text-caption)" }}>
              {SITE.defaultCorretor.name}
            </div>
          </div>
          <div>
            <div style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }} className="text-text-1">
              {SITE.address.city}/{SITE.address.state}
            </div>
            <div className="text-text-3" style={{ font: "var(--text-caption)" }}>
              Atuação local
            </div>
          </div>
        </div>
      </Container>

      <Container className="my-16">
        <div className="flex justify-between items-baseline mb-6">
          <h2
            className="text-text-1"
            style={{ font: "var(--text-display-md)", fontFamily: "var(--font-display)" }}
          >
            Imóveis em destaque
          </h2>
          <Button variant="ghost" href="/imoveis">
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-5 flex-wrap">
          {featured.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      </Container>

      <section className="bg-bg-surface py-16 border-t border-border-1">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {SERVICES.map(({ title, description }, index) => (
              <div key={title} className="flex flex-col gap-2 pt-5 border-t-2 border-border-warm">
                <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
                  0{index + 1}
                </span>
                <div
                  className="text-text-1"
                  style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
                >
                  {title}
                </div>
                <div className="text-text-2" style={{ font: "var(--text-body-sm)" }}>
                  {description}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
