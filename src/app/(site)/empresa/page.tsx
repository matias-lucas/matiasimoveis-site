import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Empresa",
  description: `Conheça a ${SITE.name}, imobiliária ${SITE.cj} em Itaberaí/GO.`,
};

export default function EmpresaPage() {
  return (
    <div>
      <section
        className="py-16 px-8 text-white"
        style={{ background: "linear-gradient(135deg, var(--bg-inverse), var(--blue-700))" }}
      >
        <Container className="!px-0">
          <div
            className="uppercase opacity-75 mb-3"
            style={{ font: "var(--text-eyebrow)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Empresa · {SITE.cj}
          </div>
          <h1
            className="max-w-[560px] mb-4"
            style={{ font: "var(--text-display-lg)", fontFamily: "var(--font-display)" }}
          >
            Uma imobiliária de Itaberaí, para Itaberaí e região
          </h1>
          <p className="max-w-[560px] opacity-85" style={{ font: "var(--text-body-lg)" }}>
            A {SITE.name} atua na intermediação de compra, venda e locação de imóveis na
            cidade — casas, apartamentos, lotes e imóveis comerciais — com o registro
            profissional {SITE.cj}. Atendimento direto, sem intermediários escondidos: você
            fala com quem conhece os bairros da cidade.
          </p>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid grid-cols-2 gap-12 items-start">
          <div>
            <h2
              className="text-text-1 mb-3"
              style={{ font: "var(--text-display-md)", fontFamily: "var(--font-display)" }}
            >
              Como trabalhamos
            </h2>
            <p className="text-text-2" style={{ font: "var(--text-body-md)" }}>
              Nosso trabalho não termina na assinatura do contrato — acompanhamos vistorias,
              documentação e o pós-venda com o mesmo cuidado do primeiro contato. É assim que
              uma imobiliária local ganha e mantém a confiança da cidade.
            </p>
          </div>
          <div className="bg-bg-surface border border-border-1 rounded-lg p-6">
            <div className="text-text-1 font-semibold mb-1" style={{ font: "var(--text-body-md)" }}>
              Corretor responsável
            </div>
            <div className="text-text-2" style={{ font: "var(--text-body-sm)" }}>
              {SITE.defaultBroker.name} · {SITE.defaultBroker.creci}
            </div>
            <div className="text-text-3 mt-3" style={{ font: "var(--text-caption)" }}>
              Registro jurídico da imobiliária: {SITE.cj}
            </div>
          </div>
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

      <Container className="py-14 text-center flex flex-col items-center gap-4">
        <h2
          className="text-text-1"
          style={{ font: "var(--text-display-md)", fontFamily: "var(--font-display)" }}
        >
          Vamos conversar sobre o seu imóvel?
        </h2>
        <WhatsAppLink message={SITE.whatsappDefaultMessage} size="lg">
          Falar no WhatsApp
        </WhatsAppLink>
      </Container>
    </div>
  );
}
