import { createClient } from "@/lib/supabase/server";
import { publicStorageUrl, IMOVEL_VIDEOS_BUCKET } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

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
    .select("*, property_photos(storage_path, is_cover, position)")
    .order("created_at", { ascending: false });
  if (filter === "published") query = query.eq("published", true);
  if (filter === "draft") query = query.eq("published", false);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map(({ property_photos, ...row }) => {
    const photos = [...property_photos].sort((a, b) => a.position - b.position);
    const cover = photos.find((p) => p.is_cover) ?? photos[0];
    return { ...row, coverImage: cover ? publicStorageUrl(cover.storage_path) : undefined };
  });
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
