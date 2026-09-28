import type { StaticImageData } from "next/image";
import type { ImovelKind } from "@/lib/types";
import casa from "../../../public/images/ia/kind-casa.webp";
import apartamento from "../../../public/images/ia/kind-apartamento.webp";
import kitnet from "../../../public/images/ia/kind-kitnet.webp";
import lote from "../../../public/images/ia/kind-lote.webp";
import salaComercial from "../../../public/images/ia/kind-sala-comercial.webp";
import galpao from "../../../public/images/ia/kind-galpao.webp";

/**
 * Ilustrações (geradas com IA na Higgsfield, 28/09) do quadro "Fotos em
 * breve" de anúncios sem foto. São desenhos, não fotos: nunca passam por foto
 * do imóvel. "outros" não tem ilustração e usa o ícone.
 */
export const KIND_ILLUSTRATIONS: Partial<Record<ImovelKind, StaticImageData>> = {
  casa,
  sobrado: casa,
  apartamento,
  kitnet,
  lote,
  sala_comercial: salaComercial,
  galpao,
};
