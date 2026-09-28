import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SellForm } from "@/components/forms/SellForm";

export const metadata: Metadata = {
  title: "Anuncie seu imóvel",
  description:
    "Preencha os dados do seu imóvel e fale direto com a Matias Imóveis pelo WhatsApp para anunciar venda ou locação.",
};

const STEPS = [
  { title: "Você preenche os dados", text: "Leva um minuto. A mensagem vai pronta para o nosso WhatsApp." },
  { title: "O corretor entra em contato", text: "Para tirar dúvidas e combinar a avaliação do imóvel." },
  { title: "Seu imóvel no site", text: "Divulgamos para quem está procurando em Itaberaí e região." },
];

// Mesmo Container do resto do site (antes era um container próprio de
// 720px, desalinhado do logo no tablet — review 28/09).
export default function AnunciePage() {
  return (
    <Container className="py-10 lg:py-16 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-start">
      <div>
        <h1 className="text-text-1" style={{ font: "var(--text-display-lg)" }}>
          Anuncie seu imóvel com a Matias
        </h1>
        <p className="mt-3 text-text-2 max-w-[48ch]" style={{ font: "var(--text-body-md)" }}>
          Quer vender ou alugar? Conte o básico sobre o imóvel e nossa equipe retorna para avaliar.
        </p>
        <ol className="mt-8 flex flex-col gap-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-bg-inverse text-white tabular"
                style={{ font: "800 16px/1 var(--font-display)" }}
              >
                {i + 1}
              </span>
              <span>
                <span className="block text-text-1" style={{ font: "700 18px/1.3 var(--font-display)" }}>
                  {step.title}
                </span>
                <span className="block text-text-2" style={{ font: "var(--text-body-sm)" }}>
                  {step.text}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <SellForm />
    </Container>
  );
}
