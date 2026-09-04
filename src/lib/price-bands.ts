import type { ImovelPurpose } from "./types";

export interface PriceBand {
  value: string;
  label: string;
  min?: number;
  max?: number;
}

/**
 * Preços de venda e locação diferem por ordens de grandeza, então as opções
 * de "faixa de preço" precisam depender de qual modo (Comprar/Alugar) está
 * selecionado — o protótipo do handoff usava uma única escala fixa voltada
 * para venda em ambos os casos, o que faria toda locação cair fora de
 * qualquer faixa. Ver SearchFilterBar.
 */
export const PRICE_BANDS: Record<ImovelPurpose, PriceBand[]> = {
  locacao: [
    { value: "0-800", label: "Até R$800/mês", max: 800 },
    { value: "800-1500", label: "R$800 – R$1.500/mês", min: 800, max: 1500 },
    { value: "1500-3000", label: "R$1.500 – R$3.000/mês", min: 1500, max: 3000 },
    { value: "3000-", label: "Acima de R$3.000/mês", min: 3000 },
  ],
  venda: [
    { value: "0-150000", label: "Até R$150 mil", max: 150000 },
    { value: "150000-300000", label: "R$150 – R$300 mil", min: 150000, max: 300000 },
    { value: "300000-500000", label: "R$300 – R$500 mil", min: 300000, max: 500000 },
    { value: "500000-", label: "Acima de R$500 mil", min: 500000 },
  ],
};

export function parsePriceBand(value: string | undefined): { min?: number; max?: number } {
  if (!value) return {};
  const [minRaw, maxRaw] = value.split("-");
  const min = minRaw ? Number(minRaw) : undefined;
  const max = maxRaw ? Number(maxRaw) : undefined;
  return {
    min: Number.isFinite(min) ? min : undefined,
    max: Number.isFinite(max) ? max : undefined,
  };
}
