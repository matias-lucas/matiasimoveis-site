import { createClient } from "@/lib/supabase/server";
import { publicStorageUrl, IMOVEL_VIDEOS_BUCKET } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";
import { videoPosterUrl } from "@/lib/media";

export type AdminImovelRow = Database["public"]["Tables"]["properties"]["Row"];
export type AdminPhotoRow = Database["public"]["Tables"]["property_photos"]["Row"];
export type AdminVideoRow = Database["public"]["Tables"]["property_videos"]["Row"];
export type CorretorRow = Database["public"]["Tables"]["brokers"]["Row"];

export interface AdminImovel extends AdminImovelRow {
  photos: (AdminPhotoRow & { url: string })[];
  videos: (AdminVideoRow & { url: string })[];
}

export interface AdminImovelListItem extends AdminImovelRow {
  coverImage?: string;
}

export type PublishFilter = "all" | "published" | "draft";

export async function listImoveis(filter: PublishFilter = "all"): Promise<AdminImovelListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select("*, property_photos(storage_path, is_cover, position), property_videos(poster_path, position)")
    .order("created_at", { ascending: false });
  if (filter === "published") query = query.eq("published", true);
  if (filter === "draft") query = query.eq("published", false);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map(({ property_photos, property_videos, ...row }) => {
    const photos = [...property_photos].sort((a, b) => a.position - b.position);
    const cover = photos.find((p) => p.is_cover) ?? photos[0];
    const videos = [...property_videos].sort((a, b) => a.position - b.position);
    return { ...row, coverImage: cover ? publicStorageUrl(cover.storage_path) : videoPosterUrl(videos) };
  });
}

export interface VideoSemCapa {
  id: string;
  imovelId: string;
  url: string;
  poster_path: string | null;
}

/**
 * Vídeos enviados antes de 28/09, ainda sem capa ou tamanho gravados. A lista
 * de imóveis completa esses dados sozinha (VideoPosterBackfill) para o anúncio
 * que só tem vídeo ganhar a capa como foto logo que o admin entra.
 */
export async function listVideosSemCapa(): Promise<VideoSemCapa[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_videos")
    .select("id, property_id, storage_path, poster_path")
    .or("poster_path.is.null,width.is.null,height.is.null");
  // Secundário: se falhar, a lista de imóveis abre normalmente sem completar nada.
  if (error) return [];
  return (data ?? []).map((v) => ({
    id: v.id,
    imovelId: v.property_id,
    url: publicStorageUrl(v.storage_path, IMOVEL_VIDEOS_BUCKET),
    poster_path: v.poster_path,
  }));
}

export async function getImovelById(id: string): Promise<AdminImovel | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_photos(*), property_videos(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const { property_photos, property_videos, ...rest } = data;
  return {
    ...rest,
    photos: [...property_photos]
      .sort((a, b) => a.position - b.position)
      .map((p) => ({ ...p, url: publicStorageUrl(p.storage_path) })),
    videos: [...property_videos]
      .sort((a, b) => a.position - b.position)
      .map((v) => ({ ...v, url: publicStorageUrl(v.storage_path, IMOVEL_VIDEOS_BUCKET) })),
  };
}

export async function listCorretores(): Promise<CorretorRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("brokers").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCorretorById(id: string): Promise<CorretorRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("brokers").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUserEmail(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}
