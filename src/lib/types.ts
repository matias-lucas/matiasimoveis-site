export type PropertyPurpose = "venda" | "locacao";

export type PropertyKind =
  | "casa"
  | "apartamento"
  | "sobrado"
  | "lote"
  | "galpao"
  | "kitnet"
  | "sala_comercial"
  | "outros";

export type PropertyStatus = "disponivel" | "em_negociacao" | "vendido" | "alugado";

export interface Broker {
  id: string;
  name: string;
  creci: string;
  contact: string;
}

export interface PropertyPhotoRecord {
  id: string;
  url: string;
  alt: string;
  isCover: boolean;
  position: number;
}

export interface Property {
  id: string;
  slug: string;
  ref: string;
  purpose: PropertyPurpose;
  kind: PropertyKind;
  /** Free-text label when kind === "outros". */
  kindOther?: string;
  title: string;
  description: string;
  neighborhood: string;
  city: string;
  state: string;
  /** Price in whole reais (BRL). Rendered via formatPrice. */
  price: number;
  condoPrice?: number;
  iptuPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  /** True when `parking` spots are motorcycle-only, not car spots. */
  parkingMotorcycleOnly?: boolean;
  areaM2: number;
  lotAreaM2?: number;
  features?: string[];
  status?: PropertyStatus;
  featured?: boolean;
  /** Only set for `purpose === "venda"` — see PRODUCT.md / CLAUDE.md broker notes. */
  broker?: Broker;
  /** Public listing photos, ordered; the cover one also drives coverImage. */
  photos?: PropertyPhotoRecord[];
  /** Cover photo URL (Supabase Storage), or undefined to show the placeholder state. */
  coverImage?: string;
}
