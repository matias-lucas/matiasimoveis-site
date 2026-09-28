import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Phone, MessageCircle, Mail, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";
import fachada from "../../../../public/images/fachada-matias.webp";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a ${SITE.name}: telefone, WhatsApp, endereço e formulário de contato.`,
};

function ContactRow({ icon: Icon, label, value, href, external }: { icon: LucideIcon; label: string; value: string; href?: string; external?: boolean }) {
  const content = (
    <>
      <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-red-50 text-red-600">
        <Icon className="w-5 h-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-text-2" style={{ font: "var(--text-caption)" }}>
          {label}
        </span>
        <span className="block text-text-1" style={{ font: "700 17px/1.3 var(--font-display)" }}>
          {value}
        </span>
      </span>
    </>
  );
  const className = "flex items-center gap-3 rounded-xl border border-border-1 bg-bg-surface p-3.5 no-underline";
  return href ? (
    <a
      href={href}
      className={`${className} hover:border-text-1`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default function ContatoPage() {
  const fullAddress = `${SITE.address.street}, ${SITE.address.district}, ${SITE.address.city} - ${SITE.address.state}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return (
    <Container className="py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      <div>
        <h1 className="text-text-1" style={{ font: "var(--text-display-lg)" }}>
          Fale com a {SITE.name}
        </h1>
        <p className="mt-2 mb-6 text-text-2" style={{ font: "var(--text-body-md)" }}>
          O jeito mais rápido é o WhatsApp. Toque para ligar, conversar ou mandar e-mail.
        </p>
        {/* Todos clicáveis: antes telefone e WhatsApp eram texto puro (review 28/09). */}
        <div className="grid gap-3">
          <ContactRow
            icon={MessageCircle}
            label="WhatsApp"
            value={SITE.phone}
            href={buildWhatsAppUrl(SITE.whatsappDefaultMessage)}
            external
          />
          <ContactRow icon={Phone} label="Telefone" value={SITE.phone} href={SITE.phoneHref} />
          <ContactRow icon={Mail} label="E-mail" value={SITE.email} href={`mailto:${SITE.email}`} />
          <ContactRow icon={MapPin} label="Endereço" value={fullAddress} />
        </div>
        {/* Fachada real: ajuda a reconhecer a loja na rua (placa vermelha e azul). */}
        <figure className="mt-6">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src={fachada}
              alt="Fachada da Matias Imóveis em Itaberaí"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-[center_45%]"
            />
          </div>
          <figcaption className="mt-2 text-text-2" style={{ font: "var(--text-caption)" }}>
            Nossa fachada: {SITE.address.street}, {SITE.address.district}
          </figcaption>
        </figure>
        <div className="h-[200px] lg:h-[240px] rounded-xl mt-4 overflow-hidden border border-border-1">
          <iframe
            src={mapSrc}
            title={`Mapa: ${fullAddress}`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div>
        <h2 className="text-text-1 mb-4" style={{ font: "var(--text-display-sm)" }}>
          Ou deixe sua mensagem
        </h2>
        <ContactForm />
      </div>
    </Container>
  );
}
