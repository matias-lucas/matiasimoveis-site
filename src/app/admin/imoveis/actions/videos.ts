"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { IMOVEL_PHOTOS_BUCKET, IMOVEL_VIDEOS_BUCKET } from "@/lib/supabase/env";

/** Tamanho, duração e capa lidos no navegador do admin (ver lib/media-upload.ts). */
export interface VideoMeta {
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
  /** Caminho da capa no bucket property-photos (o de vídeos só aceita vídeo). */
  posterPath?: string | null;
}

function metaColumns(meta: VideoMeta) {
  return {
    ...(meta.width ? { width: Math.round(meta.width) } : {}),
    ...(meta.height ? { height: Math.round(meta.height) } : {}),
    ...(meta.durationSeconds ? { duration_seconds: Math.round(meta.durationSeconds * 1000) / 1000 } : {}),
    ...(meta.posterPath ? { poster_path: meta.posterPath } : {}),
  };
}

// A ficha (/imovel/[slug]) é estática com revalidação: sem isto a mudança só
// aparecia depois de até 1 minuto.
function revalidatePublic(imovelId: string) {
  revalidatePath(`/admin/imoveis/${imovelId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
  revalidatePath("/imovel/[slug]", "page");
}

export async function addVideo(imovelId: string, storagePath: string, label: string, meta: VideoMeta = {}) {
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
      ...metaColumns(meta),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePublic(imovelId);
  return data;
}

/** Completa tamanho/capa de vídeos enviados antes de 28/09 (o VideoManager chama sozinho). */
export async function setVideoMeta(videoId: string, imovelId: string, meta: VideoMeta) {
  const columns = metaColumns(meta);
  if (Object.keys(columns).length === 0) return;
  const supabase = await createClient();
  const { error } = await supabase.from("property_videos").update(columns).eq("id", videoId);
  if (error) throw new Error(error.message);
  revalidatePublic(imovelId);
}

export async function deleteVideo(videoId: string, imovelId: string, storagePath: string) {
  const supabase = await createClient();

  const { data: row } = await supabase.from("property_videos").select("poster_path").eq("id", videoId).maybeSingle();
  await supabase.storage.from(IMOVEL_VIDEOS_BUCKET).remove([storagePath]);
  if (row?.poster_path) await supabase.storage.from(IMOVEL_PHOTOS_BUCKET).remove([row.poster_path]);
  const { error } = await supabase.from("property_videos").delete().eq("id", videoId);
  if (error) throw new Error(error.message);

  revalidatePublic(imovelId);
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

  // A ordem decide qual vídeo é o destaque da ficha.
  revalidatePublic(imovelId);
}
