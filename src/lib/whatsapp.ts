import { SITE } from "./site";
import { formatPrice } from "./format";
import type { Imovel } from "./types";

export function buildWhatsAppUrl(message: string, number: string = SITE.whatsappNumber): string {
  const params = new URLSearchParams({ phone: number, text: message });
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

/** Normaliza um telefone brasileiro digitado por humano (ex.: "(62) 99999-9999")
 *  para o formato só-dígitos com DDI que a API do WhatsApp espera. */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function imovelInquiryMessage(imovel: Imovel): string {
  const price = formatPrice(imovel.price, imovel.purpose);
  const url = `${SITE.url}/imovel/${imovel.slug}`;
  return [
    `Olá! Tenho interesse no imóvel:`,
    `${imovel.title} — ${imovel.neighborhood}, ${imovel.city}/${imovel.state}`,
    `Ref.: ${imovel.ref} · ${price}`,
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
