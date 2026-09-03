import { createPublicClient } from "./supabase/public";
import { publicStorageUrl, PROPERTY_VIDEOS_BUCKET } from "./supabase/env";
import type { Database } from "./supabase/database.types";
import type { Property, PropertyKind, PropertyPurpose } from "./types";

/**
 * Public read layer, backed by Supabase (RLS restricts these to
 * `published = true` rows — see the "public read..." policies applied via
 * the Supabase MCP migrations). Replaces the old mock-properties.ts;
 * callers didn't need to change shape, only to `await` these now.
 */

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type PhotoRow = Database["public"]["Tables"]["property_photos"]["Row"];
type VideoRow = Database["public"]["Tables"]["property_videos"]["Row"];
type BrokerRow = Database["public"]["Tables"]["brokers"]["Row"];
type RowWithPhotos = PropertyRow & {
  property_photos: PhotoRow[];
  property_videos: VideoRow[];
  brokers: BrokerRow | null;
};

const PROPERTY_SELECT =
  "*, property_photos(id, storage_path, alt, is_cover, position), property_videos(id, storage_path, label, position), brokers(id, name, creci, contact)";

function mapRow(row: RowWithPhotos): Property {
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
    condoPrice: row.condo_price != null ? Number(row.condo_price) : undefined,
    iptuPrice: row.iptu_price != null ? Number(row.iptu_price) : undefined,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    parking: row.parking ?? undefined,
    parkingMotorcycleOnly: row.parking_motorcycle_only,
    areaM2: Number(row.area_m2 ?? 0),
    lotAreaM2: row.lot_area_m2 != null ? Number(row.lot_area_m2) : undefined,
    features: row.features.length ? row.features : undefined,
    status: row.status,
    featured: row.featured,
    broker: row.brokers
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
      url: publicStorageUrl(v.storage_path, PROPERTY_VIDEOS_BUCKET),
      label: v.label,
      position: v.position,
    })),
  };
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(4);

  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as RowWithPhotos));
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
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

export interface PropertyFilters {
  purpose?: PropertyPurpose;
  neighborhood?: string;
  kind?: PropertyKind;
  minBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
}

export async function searchProperties(filters: PropertyFilters): Promise<Property[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (filters.purpose) query = query.eq("purpose", filters.purpose);
  if (filters.neighborhood) query = query.ilike("neighborhood", `%${filters.neighborhood}%`);
  if (filters.kind) query = query.eq("kind", filters.kind);
  if (filters.minBedrooms) query = query.gte("bedrooms", filters.minBedrooms);
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as RowWithPhotos));
}
