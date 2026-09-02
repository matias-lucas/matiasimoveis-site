import { SITE } from "./site";
import { formatPrice } from "./format";
import type { Property } from "./types";

export function buildWhatsAppUrl(message: string, number: string = SITE.whatsappNumber): string {
  const params = new URLSearchParams({ phone: number, text: message });
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

export function propertyInquiryMessage(property: Property): string {
  const price = formatPrice(property.price, property.purpose);
  const url = `${SITE.url}/imovel/${property.slug}`;
  return [
    `Olá! Tenho interesse no imóvel:`,
    `${property.title} — ${property.neighborhood}, ${property.city}/${property.state}`,
    `Ref.: ${property.ref} · ${price}`,
    url,
  ].join("\n");
}

interface SellFormValues {
  name: string;
  phone: string;
  purpose: string;
  kind: string;
  neighborhood: string;
  askingPrice: string;
}

export function sellInquiryMessage(values: SellFormValues): string {
  return [
    `Olá! Quero anunciar um imóvel com a Matias Imóveis.`,
    `Nome: ${values.name}`,
    `Telefone: ${values.phone}`,
    `Finalidade: ${values.purpose}`,
    `Tipo de imóvel: ${values.kind}`,
    `Bairro: ${values.neighborhood}`,
    values.askingPrice ? `Valor pretendido: ${values.askingPrice}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export function contactInquiryMessage(values: ContactFormValues): string {
  return [
    `Olá! Meu nome é ${values.name} (${values.email}).`,
    values.message,
  ].join("\n");
}
