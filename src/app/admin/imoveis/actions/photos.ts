"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { IMOVEL_PHOTOS_BUCKET } from "@/lib/supabase/env";

export async function addPhoto(imovelId: string, storagePath: string, alt: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("property_photos")
    .select("id", { count: "exact", head: true })
    .eq("property_id", imovelId);

  const { data, error } = await supabase
    .from("property_photos")
    .insert({
      property_id: imovelId,
      storage_path: storagePath,
      alt,
      position: count ?? 0,
      is_cover: !count,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${imovelId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
  return data;
}

export async function deletePhoto(photoId: string, imovelId: string, storagePath: string) {
  const supabase = await createClient();

  await supabase.storage.from(IMOVEL_PHOTOS_BUCKET).remove([storagePath]);
  const { error } = await supabase.from("property_photos").delete().eq("id", photoId);
  if (error) throw new Error(error.message);

  const { data: remaining } = await supabase
    .from("property_photos")
    .select("id, is_cover")
    .eq("property_id", imovelId)
    .order("position", { ascending: true });

  if (remaining?.length && !remaining.some((p) => p.is_cover)) {
    await supabase.from("property_photos").update({ is_cover: true }).eq("id", remaining[0].id);
  }

  revalidatePath(`/admin/imoveis/${imovelId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
}

export async function setCoverPhoto(photoId: string, imovelId: string) {
  const supabase = await createClient();

  await supabase.from("property_photos").update({ is_cover: false }).eq("property_id", imovelId);
  const { error } = await supabase.from("property_photos").update({ is_cover: true }).eq("id", photoId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${imovelId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
}

export async function movePhoto(imovelId: string, photoId: string, direction: "up" | "down") {
  const supabase = await createClient();

  const { data: photos, error } = await supabase
    .from("property_photos")
    .select("id, position")
    .eq("property_id", imovelId)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  if (!photos) return;

  const index = photos.findIndex((p) => p.id === photoId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= photos.length) return;

  const a = photos[index];
  const b = photos[swapWith];

  await Promise.all([
    supabase.from("property_photos").update({ position: b.position }).eq("id", a.id),
    supabase.from("property_photos").update({ position: a.position }).eq("id", b.id),
  ]);

  revalidatePath(`/admin/imoveis/${imovelId}`);
}
