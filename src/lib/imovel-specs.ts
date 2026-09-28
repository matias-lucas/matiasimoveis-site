import { pluralize, formatArea } from "./format";
import type { Imovel } from "./types";

export type SpecKey = "quartos" | "banheiros" | "vagas" | "area" | "terreno";

export interface Spec {
  key: SpecKey;
  /** Número/área já formatado ("2", "65 m²"). */
  value: string;
  /** Rótulo por extenso, no singular/plural certo ("quartos", "vaga de moto"). */
  label: string;
  /** Rótulo curto para o card ("banh."). */
  short: string;
}

/**
 * Características numéricas exibíveis de um imóvel, já sem zeros e sem campos
 * vazios: lote e galpão têm quartos/banheiros/vagas = 0 no banco e apareciam
 * como "0 quartos"/"0m²" (review 28/09). Card e ficha usam a mesma lista.
 */
export function imovelSpecs(imovel: Pick<Imovel, "bedrooms" | "bathrooms" | "parking" | "parkingMotorcycleOnly" | "areaM2" | "lotAreaM2">): Spec[] {
  const specs: Spec[] = [];
  const { bedrooms, bathrooms, parking, parkingMotorcycleOnly, areaM2, lotAreaM2 } = imovel;
  if (bedrooms) {
    const label = pluralize(bedrooms, "quarto", "quartos");
    specs.push({ key: "quartos", value: String(bedrooms), label, short: label });
  }
  if (bathrooms) {
    specs.push({
      key: "banheiros",
      value: String(bathrooms),
      label: pluralize(bathrooms, "banheiro", "banheiros"),
      short: "banh.",
    });
  }
  if (parking) {
    const base = pluralize(parking, "vaga", "vagas");
    const label = parkingMotorcycleOnly ? `${base} de moto` : base;
    specs.push({ key: "vagas", value: String(parking), label, short: label });
  }
  if (areaM2) specs.push({ key: "area", value: formatArea(areaM2), label: "de área", short: "" });
  if (lotAreaM2 && lotAreaM2 !== areaM2) {
    specs.push({ key: "terreno", value: formatArea(lotAreaM2), label: "de terreno", short: "terreno" });
  }
  return specs;
}
