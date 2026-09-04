"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { IMOVEL_VIDEOS_BUCKET } from "@/lib/supabase/env";

export async function addVideo(imovelId: string, storagePath: string, label: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("property_videos")
    .select("id", { count: "exact", head: true })
    .eq("property_id", imovelId);

  const { data, error } = await supabase
    .from("property_videos")
    .insert({
      property_id: imovelId,
      storage_path: storagePath,
      label,
      position: count ?? 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${imovelId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
  return data;
}

export async function deleteVideo(videoId: string, imovelId: string, storagePath: string) {
  const supabase = await createClient();

  await supabase.storage.from(IMOVEL_VIDEOS_BUCKET).remove([storagePath]);
  const { error } = await supabase.from("property_videos").delete().eq("id", videoId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${imovelId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
}

export async function moveVideo(imovelId: string, videoId: string, direction: "up" | "down") {
  const supabase = await createClient();

  const { data: videos, error } = await supabase
    .from("property_videos")
    .select("id, position")
    .eq("property_id", imovelId)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  if (!videos) return;

  const index = videos.findIndex((v) => v.id === videoId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= videos.length) return;

  const a = videos[index];
  const b = videos[swapWith];

  await Promise.all([
    supabase.from("property_videos").update({ position: b.position }).eq("id", a.id),
    supabase.from("property_videos").update({ position: a.position }).eq("id", b.id),
  ]);

  revalidatePath(`/admin/imoveis/${imovelId}`);
}
