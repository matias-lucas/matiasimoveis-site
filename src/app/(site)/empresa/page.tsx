import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { Container } from "@/components/layout/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { CorretorPhoto } from "@/components/corretor/CorretorPhoto";
import { ServicesList } from "@/components/home/ServicesList";
import { getCorretoresSafe } from "@/lib/queries";
import { corretorPadrao } from "@/lib/corretor";
import { toWhatsAppNumber } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";
import fachada from "../../../../public/images/fachada-matias-angulo.webp";

export const metadata: Metadata = {
  title: "Empresa",
  description: `Conheça a ${SITE.name}, imobiliária ${SITE.cj} em Itaberaí/GO.`,
};

// A equipe vem do banco (fotos enviadas em Admin → Corretores).
export const revalidate = 60;

// Foto do atendimento/interior do escritório: ainda não existe. Para ativar,
// salvar o arquivo em public/images/ e trocar `undefined` pelo import dele.
const FOTO_ESCRITORIO: StaticImageData | undefined = undefined;

export default async function EmpresaPage() {
  const corretores = await getCorretoresSafe();
  // Sem banco, a equipe mostra ao menos o corretor responsável.
  const equipe = corretores.length > 0 ? corretores : [{ ...corretorPadrao([]), id: "padrao", contact: "" }];

  return (
    <>
      <section className="bg-bg-inverse text-white">
        <Container className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 lg:gap-14 items-center py-10 lg:py-16">
          <div>
            <h1 className="reveal max-w-[20ch]" style={{ font: "var(--text-display-lg)" }}>
              Uma imobiliária de Itaberaí, para Itaberaí e região
            </h1>
            <p className="reveal reveal-d1 mt-4 max-w-[58ch] text-white/85" style={{ font: "var(--text-body-lg)" }}>
              A {SITE.name} intermedia a compra, a venda e a locação de casas, apartamentos, lotes e imóveis comerciais.
              Você fala direto com quem conhece os bairros da cidade.
            </p>
            <p className="reveal reveal-d2 mt-5 text-white/70" style={{ font: "var(--text-body-sm)" }}>
              {SITE.address.street}, {SITE.address.district} · Registro {SITE.cj}
            </p>
          </div>
          <div className="reveal reveal-d2 relative aspect-[4/3] lg:aspect-[4/5] max-h-[560px] rounded-2xl overflow-hidden">
            <Image
              src={fachada}
              alt="Fachada da Matias Imóveis em Itaberaí"
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover object-[center_35%]"
            />
          </div>
        </Container>
      </section>

      <section className="py-12 lg:py-20" aria-labelledby="equipe">
        <Container>
          <h2 id="equipe" className="text-text-1" style={{ font: "var(--text-display-md)" }}>
            Nossa equipe
          </h2>
          <p className="mt-2 mb-8 text-text-2 max-w-[56ch]" style={{ font: "var(--text-body-md)" }}>
            Corretores de Itaberaí, com CRECI. Chame direto no WhatsApp de quem vai te atender.
          </p>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {equipe.map((c) => (
              <li
                key={c.id}
                className="flex flex-col items-center text-center gap-3 rounded-2xl border border-border-1 bg-bg-surface p-6"
              >
                <CorretorPhoto corretor={c} size={128} />
                <div>
                  <div className="text-text-1" style={{ font: "700 19px/1.25 var(--font-display)" }}>
                    {c.name}
                  </div>
                  <div className="text-text-2" style={{ font: "var(--text-body-sm)" }}>
                    Corretor · {c.creci}
                  </div>
                </div>
                <WhatsAppLink
                  message={SITE.whatsappDefaultMessage}
                  number={c.contact ? toWhatsAppNumber(c.contact) : undefined}
                  className="mt-1"
                >
                  Falar no WhatsApp
                </WhatsAppLink>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-bg-surface border-t border-border-1 py-12 lg:py-20" aria-labelledby="como-trabalhamos">
        <Container className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <h2 id="como-trabalhamos" className="text-text-1" style={{ font: "var(--text-display-md)" }}>
              Como trabalhamos
            </h2>
            <p className="mt-3 mb-8 text-text-2 max-w-[56ch]" style={{ font: "var(--text-body-md)" }}>
              Nosso trabalho não termina na assinatura do contrato: acompanhamos vistorias, documentação e o pós-venda com o
              mesmo cuidado do primeiro contato. É assim que uma imobiliária local ganha e mantém a confiança da cidade.
            </p>
            <ServicesList />
          </div>
          <PhotoSlot
            src={FOTO_ESCRITORIO}
            alt="Atendimento no escritório da Matias Imóveis"
            pendingLabel="Atendimento no escritório"
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-[4/3] rounded-2xl"
          />
        </Container>
      </section>
    </>
  );
}
