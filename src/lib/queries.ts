import { createPublicClient } from "./supabase/public";
import { publicStorageUrl, IMOVEL_VIDEOS_BUCKET } from "./supabase/env";
import type { Database } from "./supabase/database.types";
import type { Imovel, ImovelKind, ImovelPurpose } from "./types";

/**
 * Camada de leitura pública, apoiada no Supabase (RLS restringe estas
 * consultas a linhas com `published = true` — ver as políticas "public
 * read..." aplicadas via as migrations do Supabase MCP). Substitui o antigo
 * mock-properties.ts; os call sites não precisaram mudar de formato, só
 * passaram a usar `await`.
 */

type ImovelRow = Database["public"]["Tables"]["properties"]["Row"];
type PhotoRow = Database["public"]["Tables"]["property_photos"]["Row"];
type VideoRow = Database["public"]["Tables"]["property_videos"]["Row"];
type CorretorRow = Database["public"]["Tables"]["brokers"]["Row"];
type RowWithPhotos = ImovelRow & {
  property_photos: PhotoRow[];
  property_videos: VideoRow[];
  brokers: CorretorRow | null;
};

const IMOVEL_SELECT =
  "*, property_photos(id, storage_path, alt, is_cover, position), property_videos(id, storage_path, label, position), brokers(id, name, creci, contact)";

function mapRow(row: RowWithPhotos): Imovel {
  const photos = [...row.property_photos].sort((a, b) => a.position - b.position);
  const cover = photos.find((p) => p.is_cover) ?? photos[0];
  const videos = [...row.property_videos].sort((a, b) => a.position - b.position);

  return {
    id: row.id,
    slug: row.slug,
    ref: row.ref,
    purpose: row.purpose,
    kind: row.kind,
    kindOther: row.kind_other ?? undefined,
    title: row.title,
    description: row.description,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    price: Number(row.price),
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    parking: row.parking ?? undefined,
    parkingMotorcycleOnly: row.parking_motorcycle_only,
    areaM2: Number(row.area_m2 ?? 0),
    lotAreaM2: row.lot_area_m2 != null ? Number(row.lot_area_m2) : undefined,
    features: row.features.length ? row.features : undefined,
    status: row.status,
    featured: row.featured,
    corretor: row.brokers
      ? { id: row.brokers.id, name: row.brokers.name, creci: row.brokers.creci, contact: row.brokers.contact }
      : undefined,
    photos: photos.map((p) => ({
      id: p.id,
      url: publicStorageUrl(p.storage_path),
      alt: p.alt,
      isCover: p.is_cover,
      position: p.position,
    })),
    coverImage: cover ? publicStorageUrl(cover.storage_path) : undefined,
    videos: videos.map((v) => ({
      id: v.id,
      url: publicStorageUrl(v.storage_path, IMOVEL_VIDEOS_BUCKET),
      label: v.label,
      position: v.position,
    })),
  };
}

export async function getFeaturedImoveis(): Promise<Imovel[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select(IMOVEL_SELECT)
    .eq("published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(4);

  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as RowWithPhotos));
}

export async function getImovelBySlug(slug: string): Promise<Imovel | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select(IMOVEL_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as RowWithPhotos) : undefined;
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("properties").select("slug").eq("published", true);
  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export interface ImovelFilters {
  purpose?: ImovelPurpose;
  neighborhood?: string;
  // Lista de kinds quando o filtro "Tipo" é uma categoria (Residencial/
  // Comercial/Lotes) — ver resolveKindFilter() em lib/imovel-kind-categories.
  kind?: ImovelKind | ImovelKind[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ImovelRange {
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  maxBedrooms: number;
}

export interface ImovelRangesByPurpose {
  locacao: ImovelRange;
  venda: ImovelRange;
}

// Usado quando não há nenhum imóvel publicado para a finalidade (catálogo
// vazio ainda) — sem isso min/max ficariam os dois em 0 e o slider de faixa
// dupla teria largura zero.
const FALLBACK_RANGE: ImovelRange = { minPrice: 0, maxPrice: 5000, minBedrooms: 0, maxBedrooms: 5 };

function computeRange(rows: { price: number; bedrooms: number | null }[]): ImovelRange {
  if (rows.length === 0) return FALLBACK_RANGE;

  const prices = rows.map((row) => row.price);
  const bedrooms = rows.map((row) => row.bedrooms).filter((value): value is number => value != null);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minBedrooms = bedrooms.length ? Math.min(...bedrooms) : FALLBACK_RANGE.minBedrooms;
  const maxBedrooms = bedrooms.length ? Math.max(...bedrooms) : FALLBACK_RANGE.maxBedrooms;

  return {
    minPrice,
    // maxPrice === minPrice (só um imóvel, ou todos com o mesmo preço)
    // também deixaria o slider com largura zero.
    maxPrice: maxPrice > minPrice ? maxPrice : minPrice + 500,
    minBedrooms,
    maxBedrooms: maxBedrooms > minBedrooms ? maxBedrooms : minBedrooms + 1,
  };
}

/**
 * Menor/maior preço e nº de quartos entre os imóveis publicados, por
 * finalidade — usado para calibrar os extremos do slider de faixa dupla do
 * SearchFilterBar em vez de limites fixos arbitrários.
 */
export async function getImovelRanges(): Promise<ImovelRangesByPurpose> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("properties").select("purpose, price, bedrooms").eq("published", true);

  if (error) throw error;

  const rows = data ?? [];
  const byPurpose = (purpose: ImovelPurpose) =>
    rows
      .filter((row) => row.purpose === purpose)
      .map((row) => ({ price: Number(row.price), bedrooms: row.bedrooms }));

  return {
    locacao: computeRange(byPurpose("locacao")),
    venda: computeRange(byPurpose("venda")),
  };
}

export async function searchImoveis(filters: ImovelFilters): Promise<Imovel[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("properties")
    .select(IMOVEL_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (filters.purpose) query = query.eq("purpose", filters.purpose);
  if (filters.neighborhood) query = query.ilike("neighborhood", `%${filters.neighborhood}%`);
  if (filters.kind) {
    query = Array.isArray(filters.kind) ? query.in("kind", filters.kind) : query.eq("kind", filters.kind);
  }
  if (filters.minBedrooms) query = query.gte("bedrooms", filters.minBedrooms);
  if (filters.maxBedrooms != null) query = query.lte("bedrooms", filters.maxBedrooms);
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as RowWithPhotos));
}
