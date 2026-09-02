import { createClient } from "@/lib/supabase/server";
import { publicStorageUrl } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

export type AdminPropertyRow = Database["public"]["Tables"]["properties"]["Row"];
export type AdminPhotoRow = Database["public"]["Tables"]["property_photos"]["Row"];
export type BrokerRow = Database["public"]["Tables"]["brokers"]["Row"];

export interface AdminProperty extends AdminPropertyRow {
  photos: (AdminPhotoRow & { url: string })[];
}

export interface AdminPropertyListItem extends AdminPropertyRow {
  coverImage?: string;
}

export type PublishFilter = "all" | "published" | "draft";

export async function listProperties(filter: PublishFilter = "all"): Promise<AdminPropertyListItem[]> {
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

export async function getPropertyById(id: string): Promise<AdminProperty | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_photos(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const { property_photos, ...rest } = data;
  return {
    ...rest,
    photos: [...property_photos]
      .sort((a, b) => a.position - b.position)
      .map((p) => ({ ...p, url: publicStorageUrl(p.storage_path) })),
  };
}

export async function listBrokers(): Promise<BrokerRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("brokers").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBrokerById(id: string): Promise<BrokerRow | null> {
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
