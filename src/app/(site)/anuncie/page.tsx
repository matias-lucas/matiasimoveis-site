import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SellForm } from "@/components/forms/SellForm";

export const metadata: Metadata = {
  title: "Anuncie seu imóvel",
  description:
    "Preencha os dados do seu imóvel e fale direto com a Matias Imóveis pelo WhatsApp para anunciar venda ou locação.",
};

export default function AnunciePage() {
  return (
    <Container className="!max-w-[720px] py-20 lg:py-24">
      <div
        className="uppercase text-red-600 mb-2"
        style={{ font: "var(--text-eyebrow)", letterSpacing: "var(--tracking-eyebrow)" }}
      >
        Seu imóvel
      </div>
      <h1
        className="text-text-1 mb-2"
        style={{ font: "var(--text-display-lg)", fontFamily: "var(--font-display)" }}
      >
        Anuncie seu imóvel com a Matias
      </h1>
      <p className="text-text-2 mb-8" style={{ font: "var(--text-body-md)" }}>
        Preencha os dados abaixo e nossa equipe entrará em contato para avaliar seu imóvel.
      </p>
      <SellForm />
    </Container>
  );
}
