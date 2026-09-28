import { SITE } from "./site";
import { normalizeText } from "./format";
import type { Corretor } from "./types";

export interface CorretorExibido {
  name: string;
  creci: string;
  photoUrl?: string;
}

/**
 * O corretor padrão do site (SITE.defaultCorretor, usado na Home e nos
 * anúncios sem corretor próprio) com a foto cadastrada no admin, quando o
 * cadastro dele existe no banco. Nome e CRECI continuam vindo de SITE.
 */
export function corretorPadrao(corretores: Corretor[]): CorretorExibido {
  const target = normalizeText(SITE.defaultCorretor.name);
  const match = corretores.find((c) => normalizeText(c.name) === target);
  return { name: SITE.defaultCorretor.name, creci: SITE.defaultCorretor.creci, photoUrl: match?.photoUrl };
}
