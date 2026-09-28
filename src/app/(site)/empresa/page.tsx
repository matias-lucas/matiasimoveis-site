import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ServicesList } from "@/components/home/ServicesList";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Empresa",
  description: `Conheça a ${SITE.name}, imobiliária ${SITE.cj} em Itaberaí/GO.`,
};

export default function EmpresaPage() {
  return (
    <>
      <section className="bg-bg-inverse text-white">
        <Container className="py-12 lg:py-20">
          <h1 className="max-w-[20ch]" style={{ font: "var(--text-display-lg)" }}>
            Uma imobiliária de Itaberaí, para Itaberaí e região
          </h1>
          <p className="mt-4 max-w-[58ch] text-white/85" style={{ font: "var(--text-body-lg)" }}>
            A {SITE.name} intermedia a compra, a venda e a locação de casas, apartamentos, lotes e imóveis comerciais.
            Você fala direto com quem conhece os bairros da cidade.
          </p>
        </Container>
      </section>

      <Container className="py-12 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <h2 className="text-text-1" style={{ font: "var(--text-display-md)" }}>
            Como trabalhamos
          </h2>
          <p className="mt-3 text-text-2 max-w-[56ch]" style={{ font: "var(--text-body-md)" }}>
            Nosso trabalho não termina na assinatura do contrato: acompanhamos vistorias, documentação e o pós-venda com o
            mesmo cuidado do primeiro contato. É assim que uma imobiliária local ganha e mantém a confiança da cidade.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-border-1 bg-bg-surface p-5">
            <div className="flex-1 min-w-[200px]">
              <div className="text-text-2" style={{ font: "var(--text-caption)" }}>
                Corretor responsável
              </div>
              <div className="text-text-1" style={{ font: "700 18px/1.3 var(--font-display)" }}>
                {SITE.defaultCorretor.name}
              </div>
              <div className="text-text-2" style={{ font: "var(--text-body-sm)" }}>
                {SITE.defaultCorretor.creci} · Imobiliária {SITE.cj}
              </div>
            </div>
            <WhatsAppLink message={SITE.whatsappDefaultMessage}>Falar no WhatsApp</WhatsAppLink>
          </div>
        </div>
        <div>
          <h2 className="text-text-1 mb-4" style={{ font: "var(--text-display-md)" }}>
            O que fazemos
          </h2>
          <ServicesList />
        </div>
      </Container>
    </>
  );
}
