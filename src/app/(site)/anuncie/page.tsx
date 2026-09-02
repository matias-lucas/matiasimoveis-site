import type { Metadata } from "next";
import { SellForm } from "@/components/forms/SellForm";

export const metadata: Metadata = {
  title: "Anuncie seu imóvel",
  description:
    "Preencha os dados do seu imóvel e fale direto com a Matias Imóveis pelo WhatsApp para anunciar venda ou locação.",
};

export default function AnunciePage() {
  return (
    <div className="max-w-[720px] mx-auto px-8 py-12">
      <div
        className="uppercase text-brand-primary mb-2"
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
    </div>
  );
}
