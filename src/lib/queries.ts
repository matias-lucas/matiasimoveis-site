import { createPublicClient } from "./supabase/public";
import { publicStorageUrl, IMOVEL_VIDEOS_BUCKET, CORRETOR_PHOTOS_BUCKET } from "./supabase/env";
import type { Database } from "./supabase/database.types";
import type { Corretor, Imovel, ImovelKind, ImovelPurpose } from "./types";
import { resolveKindFilter, searchKindOf } from "./imovel-kind-categories";
import { PAGE_SIZE, type SearchFilters } from "./search-params";
import { normalizeText } from "./format";
import { videoPosterUrl } from "./media";

/**
 * Camada de leitura pública, apoiada no Supabase (RLS restringe estas
 * consultas a linhas com `published = true` — ver as políticas "public
 * read..." aplicadas via as migrations do Supabase MCP).
 *
 * Listagens (Home, /imoveis, parecidos) usam CARD_SELECT, só com o que o card
 * mostra: antes cada card trazia descrição, vídeos e corretor, e /imoveis
 * mandava tudo isso para o navegador sem paginação (review 28/09).
 */

type ImovelRow = Database["public"]["Tables"]["properties"]["Row"];
type PhotoRow = Database["public"]["Tables"]["property_photos"]["Row"];
type VideoRow = Database["public"]["Tables"]["property_videos"]["Row"];
type CorretorRow = Database["public"]["Tables"]["brokers"]["Row"];
type RowWithRelations = Partial<ImovelRow> &
  Pick<ImovelRow, "id" | "slug" | "ref" | "purpose" | "kind" | "title" | "neighborhood" | "city" | "state" | "price"> & {
    property_photos?: (Pick<PhotoRow, "id" | "storage_path" | "alt" | "is_cover" | "position"> &
      Partial<Pick<PhotoRow, "width" | "height">>)[];
    property_videos?: (Pick<VideoRow, "id" | "position"> &
      Partial<Pick<VideoRow, "storage_path" | "label" | "width" | "height" | "duration_seconds" | "poster_path">>)[];
    brokers?: CorretorFields | null;
  };
type CorretorFields = Pick<CorretorRow, "id" | "name" | "creci" | "contact" | "photo_path">;

const CORRETOR_SELECT = "id, name, creci, contact, photo_path";

const FULL_SELECT = `*, property_photos(id, storage_path, alt, is_cover, position, width, height), property_videos(id, storage_path, label, position, width, height, duration_seconds, poster_path), brokers(${CORRETOR_SELECT})`;

// Do vídeo, o card só precisa saber que existe (selo "Vídeo") e do quadro de
// capa, usado quando o anúncio não tem foto.
const CARD_SELECT =
  "id, slug, ref, purpose, kind, kind_other, title, neighborhood, city, state, price, bedrooms, bathrooms, parking, parking_motorcycle_only, area_m2, lot_area_m2, status, featured, published_at, property_photos(id, storage_path, alt, is_cover, position), property_videos(id, position, poster_path)";

/** Vendidos/alugados saem das listagens; a ficha continua acessível pelo link. */
const HIDDEN_STATUSES = "(vendido,alugado)";

function positiveOrUndefined(value: number | string | null | undefined): number | undefined {
  if (value == null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function mapCorretor(row: CorretorFields): Corretor {
  return {
    id: row.id,
    name: row.name,
    creci: row.creci,
    contact: row.contact,
    photoUrl: row.photo_path ? publicStorageUrl(row.photo_path, CORRETOR_PHOTOS_BUCKET) : undefined,
  };
}

function mapRow(row: RowWithRelations): Imovel {
  const photos = [...(row.property_photos ?? [])].sort((a, b) => a.position - b.position);
  // Capa primeiro e sem repetir: antes, sem nenhuma foto marcada como capa, a
  // primeira aparecia duas vezes na galeria (capa + miniatura).
  const cover = photos.find((p) => p.is_cover) ?? photos[0];
  const ordered = cover ? [cover, ...photos.filter((p) => p !== cover)] : photos;
  const videos = [...(row.property_videos ?? [])].sort((a, b) => a.position - b.position);

  return {
    id: row.id,
    slug: row.slug,
    ref: row.ref,
    purpose: row.purpose,
    kind: row.kind,
    kindOther: row.kind_other ?? undefined,
    title: row.title,
    description: row.description ?? "",
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    price: Number(row.price),
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    parking: row.parking ?? undefined,
    parkingMotorcycleOnly: row.parking_motorcycle_only ?? false,
    // 0/nulo = não informado (antes aparecia "0m²" no card, na ficha e no JSON-LD).
    areaM2: positiveOrUndefined(row.area_m2),
    lotAreaM2: positiveOrUndefined(row.lot_area_m2),
    features: row.features?.length ? row.features : undefined,
    status: row.status,
    featured: row.featured,
    corretor: row.brokers ? mapCorretor(row.brokers) : undefined,
    photos: ordered.map((p) => ({
      id: p.id,
      url: publicStorageUrl(p.storage_path),
      alt: p.alt,
      isCover: p === cover,
      position: p.position,
      width: p.width ?? undefined,
      height: p.height ?? undefined,
    })),
    // Anúncio só com vídeo: o quadro de capa do vídeo faz o papel da foto em
    // todo o site (card, semelhantes, imagem de compartilhamento, JSON-LD).
    coverImage: cover ? publicStorageUrl(cover.storage_path) : videoPosterUrl(videos),
    videos: videos.map((v) => ({
      id: v.id,
      url: v.storage_path ? publicStorageUrl(v.storage_path, IMOVEL_VIDEOS_BUCKET) : "",
      label: v.label ?? "",
      position: v.position,
      width: v.width ?? undefined,
      height: v.height ?? undefined,
      durationSeconds: v.duration_seconds != null ? Number(v.duration_seconds) : undefined,
      posterUrl: v.poster_path ? publicStorageUrl(v.poster_path) : undefined,
    })),
  };
}

/** Vitrine da Home por finalidade: destaques primeiro, depois os mais recentes. */
export async function getHomeImoveis(purpose: ImovelPurpose, limit = 4): Promise<Imovel[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select(CARD_SELECT)
    .eq("published", true)
    .eq("purpose", purpose)
    .not("status", "in", HIDDEN_STATUSES)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as RowWithRelations));
}

export async function getImovelBySlug(slug: string): Promise<Imovel | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select(FULL_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as RowWithRelations) : undefined;
}

/** "Imóveis parecidos" na ficha: mesma finalidade, mesmo tipo primeiro. */
export async function getSimilarImoveis(imovel: Imovel, limit = 4): Promise<Imovel[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select(CARD_SELECT)
    .eq("published", true)
    .eq("purpose", imovel.purpose)
    .neq("id", imovel.id)
    .not("status", "in", HIDDEN_STATUSES)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(12);

  if (error) throw error;
  const rows = (data ?? []).map((row) => mapRow(row as RowWithRelations));
  const sameKind = rows.filter((r) => searchKindOf(r.kind) === searchKindOf(imovel.kind));
  const others = rows.filter((r) => searchKindOf(r.kind) !== searchKindOf(imovel.kind));
  return [...sameKind, ...others].slice(0, limit);
}

/** Equipe pública (Empresa, Home, ficha), na ordem de cadastro. */
export async function getCorretores(): Promise<Corretor[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("brokers").select(CORRETOR_SELECT).order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapCorretor);
}

/** getCorretores() tolerante a falha: sem banco, a página abre sem fotos em vez de cair na tela de erro. */
export async function getCorretoresSafe(): Promise<Corretor[]> {
  try {
    return await getCorretores();
  } catch (error) {
    console.error("Falha ao carregar corretores", error);
    return [];
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("properties").select("slug").eq("published", true);
  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export type KindCounts = Partial<Record<ImovelKind, number>>;

export interface CatalogSummary {
  total: number;
  byPurpose: Record<ImovelPurpose, number>;
  /** Contagem por tipo: geral e por finalidade (sobrado conta como casa). */
  kinds: { all: KindCounts; locacao: KindCounts; venda: KindCounts };
  /** Bairros com anúncios, do que tem mais para o que tem menos. */
  neighborhoods: { name: string; count: number }[];
}

/**
 * Resumo leve do catálogo (3 colunas por anúncio) para os atalhos com
 * contagem ("Casas (3)"), os chips de tipo e as sugestões de bairro.
 * Substitui getImovelRanges(), que existia só para calibrar os sliders.
 */
export async function getCatalogSummary(): Promise<CatalogSummary> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select("purpose, kind, neighborhood")
    .eq("published", true)
    .not("status", "in", HIDDEN_STATUSES);

  if (error) throw error;

  const summary: CatalogSummary = {
    total: 0,
    byPurpose: { locacao: 0, venda: 0 },
    kinds: { all: {}, locacao: {}, venda: {} },
    neighborhoods: [],
  };
  const hoods = new Map<string, number>();
  for (const row of data ?? []) {
    const kind = searchKindOf(row.kind);
    summary.total += 1;
    summary.byPurpose[row.purpose] += 1;
    summary.kinds.all[kind] = (summary.kinds.all[kind] ?? 0) + 1;
    summary.kinds[row.purpose][kind] = (summary.kinds[row.purpose][kind] ?? 0) + 1;
    const hood = row.neighborhood.trim();
    if (hood) hoods.set(hood, (hoods.get(hood) ?? 0) + 1);
  }
  summary.neighborhoods = [...hoods.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"));
  return summary;
}

export interface SearchResult {
  items: Imovel[];
  total: number;
}

/**
 * @param knownNeighborhoods bairros existentes (de getCatalogSummary): o
 * bairro digitado é comparado sem acento em JS e vira um filtro exato
 * `.in()`, já que o banco não tem a extensão unaccent.
 */
export async function searchImoveis(filters: SearchFilters, knownNeighborhoods: string[] = []): Promise<SearchResult> {
  const supabase = createPublicClient();
  let query = supabase
    .from("properties")
    .select(CARD_SELECT, { count: "exact" })
    .eq("published", true)
    .not("status", "in", HIDDEN_STATUSES);

  if (filters.purpose) query = query.eq("purpose", filters.purpose);

  if (filters.bairro) {
    const needle = normalizeText(filters.bairro);
    const matches = knownNeighborhoods.filter((name) => normalizeText(name).includes(needle));
    if (matches.length === 0) return { items: [], total: 0 };
    query = query.in("neighborhood", matches);
  }

  const kind = resolveKindFilter(filters.tipo);
  if (kind) query = Array.isArray(kind) ? query.in("kind", kind) : query.eq("kind", kind);

  // Só filtra quartos quando o usuário pediu: antes o filtro ia sempre na URL
  // e tirava da lista imóveis sem quartos (lote, galpão, sala).
  if (filters.quartos) query = query.gte("bedrooms", filters.quartos);
  if (filters.precoMin) query = query.gte("price", filters.precoMin);
  if (filters.precoMax) query = query.lte("price", filters.precoMax);

  if (filters.ordem === "menor-preco") query = query.order("price", { ascending: true });
  else if (filters.ordem === "maior-preco") query = query.order("price", { ascending: false });
  else query = query.order("published_at", { ascending: false, nullsFirst: false });
  query = query.order("id", { ascending: true });

  const from = (filters.pagina - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data, error, count } = await query;
  if (error) {
    // Página além do fim (ex.: ?pagina=99) responde 416 no PostgREST.
    if (error.code === "PGRST103") return { items: [], total: count ?? 0 };
    throw error;
  }
  return { items: (data ?? []).map((row) => mapRow(row as RowWithRelations)), total: count ?? 0 };
}
