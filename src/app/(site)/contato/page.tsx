import type { Metadata } from "next";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a ${SITE.name}: telefone, WhatsApp, endereço e formulário de contato.`,
};

export default function ContatoPage() {
  const fullAddress = `${SITE.address.street}, ${SITE.address.district}, ${SITE.address.city} - ${SITE.address.state}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return (
    <Container className="py-12 grid grid-cols-2 gap-12">
      <div>
        <div
          className="uppercase text-brand-primary mb-2"
          style={{ font: "var(--text-eyebrow)", letterSpacing: "var(--tracking-eyebrow)" }}
        >
          Contato
        </div>
        <h1
          className="text-text-1 mb-6"
          style={{ font: "var(--text-display-lg)", fontFamily: "var(--font-display)" }}
        >
          Fale com a {SITE.name}
        </h1>
        <div className="flex flex-col gap-3.5 text-text-2 mb-7" style={{ font: "var(--text-body-md)" }}>
          <div className="flex gap-2.5 items-center">
            <MapPin className="w-[18px] h-[18px] text-brand-primary shrink-0" />
            {fullAddress}
          </div>
          <div className="flex gap-2.5 items-center">
            <Phone className="w-[18px] h-[18px] text-brand-primary shrink-0" />
            {SITE.phone}
          </div>
          <div className="flex gap-2.5 items-center">
            <MessageCircle className="w-[18px] h-[18px] text-brand-primary shrink-0" />
            {SITE.phone} (WhatsApp)
          </div>
        </div>
        <WhatsAppLink message={SITE.whatsappDefaultMessage}>Falar no WhatsApp agora</WhatsAppLink>
        <div className="h-[220px] rounded-lg mt-7 overflow-hidden border border-border-1">
          <iframe
            src={mapSrc}
            title={`Mapa: ${fullAddress}`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <ContactForm />
    </Container>
  );
}
