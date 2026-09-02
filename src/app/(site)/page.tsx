import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SearchFilterBar } from "@/components/property/SearchFilterBar";
import { getFeaturedProperties } from "@/lib/queries";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedProperties();

  return (
    <div>
      <section
        className="pt-[72px] px-8 pb-[104px] text-white"
        style={{ background: "linear-gradient(135deg, var(--bg-inverse), var(--blue-700))" }}
      >
        <Container className="grid grid-cols-[1.1fr_1fr] gap-12 items-center !px-0">
          <div>
            <div
              className="uppercase opacity-75 mb-3"
              style={{
                font: "var(--text-eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
              }}
            >
              Itaberaí e região · {SITE.cj}
            </div>
            <h1
              className="max-w-[420px] mb-3.5"
              style={{ font: "var(--text-display-lg)", fontFamily: "var(--font-display)" }}
            >
              O imóvel certo, no lugar certo
            </h1>
            <p className="max-w-[420px] mb-6 opacity-85" style={{ font: "var(--text-body-lg)" }}>
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
          </div>
          <div className="relative w-full h-[260px] rounded-lg overflow-hidden">
            <Image
              src="/images/hero-house.webp"
              alt="Fachada de um imóvel em Itaberaí/GO"
              fill
              priority
              sizes="(min-width: 1024px) 500px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <Container className="-mt-[72px] !max-w-[960px]">
        <SearchFilterBar />
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
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </Container>

      <section className="bg-bg-surface py-14 px-8 border-t border-border-1">
        <Container className="grid grid-cols-3 gap-8 text-center !px-0">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <Icon className="w-8 h-8 text-brand-primary mx-auto" />
              <div
                className="text-text-1 mt-3 mb-1.5"
                style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
              >
                {title}
              </div>
              <div className="text-text-2" style={{ font: "var(--text-body-sm)" }}>
                {description}
              </div>
            </div>
          ))}
        </Container>
      </section>
    </div>
  );
}
