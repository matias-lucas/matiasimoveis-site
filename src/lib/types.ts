export type ImovelPurpose = "venda" | "locacao";

export type ImovelKind =
  | "casa"
  | "apartamento"
  | "sobrado"
  | "lote"
  | "galpao"
  | "kitnet"
  | "sala_comercial"
  | "outros";

export type ImovelStatus = "disponivel" | "em_negociacao" | "vendido" | "alugado";

export interface Corretor {
  id: string;
  name: string;
  creci: string;
  contact: string;
}

export interface ImovelPhotoRecord {
  id: string;
  url: string;
  alt: string;
  isCover: boolean;
  position: number;
}

export interface ImovelVideoRecord {
  id: string;
  url: string;
  label: string;
  position: number;
}

export interface Imovel {
  id: string;
  slug: string;
  ref: string;
  purpose: ImovelPurpose;
  kind: ImovelKind;
  /** Texto livre quando kind === "outros". */
  kindOther?: string;
  title: string;
  description: string;
  neighborhood: string;
  city: string;
  state: string;
  /** Preço em reais inteiros (BRL). Renderizado via formatPrice. */
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  /** True quando as vagas de `parking` são só para moto, não para carro. */
  parkingMotorcycleOnly?: boolean;
  areaM2: number;
  lotAreaM2?: number;
  features?: string[];
  status?: ImovelStatus;
  featured?: boolean;
  /** Definido só quando `purpose === "venda"` — ver notas de corretor em PRODUCT.md / CLAUDE.md. */
  corretor?: Corretor;
  /** Fotos públicas do anúncio, em ordem; a de capa também define coverImage. */
  photos?: ImovelPhotoRecord[];
  /** URL da foto de capa (Supabase Storage), ou undefined para exibir o estado de placeholder. */
  coverImage?: string;
  /** Vídeos públicos do anúncio, em ordem. */
  videos?: ImovelVideoRecord[];
}
