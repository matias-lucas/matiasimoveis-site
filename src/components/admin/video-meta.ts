import type { createClient } from "@/lib/supabase/client";
import { IMOVEL_PHOTOS_BUCKET } from "@/lib/supabase/env";
import { setVideoMeta } from "@/app/admin/imoveis/actions/videos";
import { readVideoInfo, type VideoInfo } from "@/lib/media-upload";

type SupabaseBrowser = ReturnType<typeof createClient>;

/** Sobe a capa (quadro do vídeo) no bucket de fotos; o de vídeos só aceita vídeo. */
export async function uploadPoster(supabase: SupabaseBrowser, imovelId: string, info: VideoInfo): Promise<string | null> {
  if (!info.poster) return null;
  const path = `${imovelId}/poster-${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(IMOVEL_PHOTOS_BUCKET).upload(path, info.poster, { contentType: "image/jpeg" });
  return error ? null : path;
}

export interface CompletedVideoMeta {
  width: number;
  height: number;
  durationSeconds: number;
  posterPath: string | null;
}

/**
 * Vídeos enviados antes de 28/09 não têm tamanho nem capa gravados: lê o
 * vídeo já publicado no navegador do admin, sobe a capa e grava tudo. A capa
 * vira a foto do anúncio que só tem vídeo (card, compartilhamento, JSON-LD).
 * Devolve null se o navegador não conseguiu ler o vídeo (fica para a próxima).
 */
export async function completeVideoMeta(
  supabase: SupabaseBrowser,
  imovelId: string,
  video: { id: string; url: string; poster_path?: string | null },
  isCancelled: () => boolean = () => false
): Promise<CompletedVideoMeta | null> {
  const info = await readVideoInfo(video.url);
  if (isCancelled() || !info) return null;
  const posterPath = video.poster_path ?? (await uploadPoster(supabase, imovelId, info));
  if (isCancelled()) return null;
  const meta = { width: info.width, height: info.height, durationSeconds: info.durationSeconds, posterPath };
  try {
    await setVideoMeta(video.id, imovelId, meta);
    return meta;
  } catch {
    return null;
  }
}
