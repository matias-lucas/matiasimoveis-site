import type { ImovelPurpose } from "./types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** R$ 320.000 para venda, R$ 900/mês para locação. */
export function formatPrice(price: number, purpose: ImovelPurpose): string {
  const value = currencyFormatter.format(price);
  return purpose === "locacao" ? `${value}/mês` : value;
}

export function formatArea(areaM2: number): string {
  return `${areaM2.toLocaleString("pt-BR")} m²`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Preço separado do sufixo, para o "/mês" sair menor que o valor no card. */
export function formatPriceParts(price: number, purpose: ImovelPurpose): { value: string; suffix?: string } {
  return { value: currencyFormatter.format(price), suffix: purpose === "locacao" ? "/mês" : undefined };
}

/** Minúsculas e sem acento: "Ipês" e "ipes" viram a mesma coisa (busca por bairro). */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
