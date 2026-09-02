import type { PropertyPurpose } from "./types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** R$ 320.000 for sale, R$ 900/mês for rent. */
export function formatPrice(price: number, purpose: PropertyPurpose): string {
  const value = currencyFormatter.format(price);
  return purpose === "locacao" ? `${value}/mês` : value;
}

export function formatArea(areaM2: number): string {
  return `${areaM2}m²`;
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
