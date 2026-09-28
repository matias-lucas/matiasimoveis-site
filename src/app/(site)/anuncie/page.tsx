import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SellForm } from "@/components/forms/SellForm";
import ruaIpe from "../../../../public/images/ia/rua-ipe.webp";

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
// 720px, desalinhado do logo no tablet — review 28/09). A faixa do topo usa
// uma rua gerada com IA (Higgsfield, 28/09), marcada como ilustrativa e
// espelhada para o ipê ficar à direita, fora do degradê do texto.
export default function AnunciePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-bg-inverse text-white">
        <Image
          src={ruaIpe}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[center_40%] -scale-x-100 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-blue-900/90 via-blue-900/60 to-blue-900/10" />
        <Container className="py-12 sm:py-16 lg:py-24">
          <h1 className="reveal max-w-[18ch]" style={{ font: "var(--text-display-lg)" }}>
            Anuncie seu imóvel com a Matias
          </h1>
          <p className="reveal reveal-d1 mt-3 max-w-[44ch] text-white/85" style={{ font: "var(--text-body-lg)" }}>
            Quer vender ou alugar? Conte o básico sobre o imóvel e nossa equipe retorna para avaliar.
          </p>
        </Container>
        <span className="absolute bottom-2 right-3 text-white/70" style={{ font: "var(--text-caption)" }}>
          Imagem ilustrativa
        </span>
      </section>

      <Container className="py-10 lg:py-16 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-start">
        <div>
          <h2 className="text-text-1" style={{ font: "var(--text-display-md)" }}>
            Como funciona
          </h2>
          <ol className="mt-6 flex flex-col gap-5">
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
    </>
  );
}
