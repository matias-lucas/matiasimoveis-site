"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { VideoSemCapa } from "@/lib/admin/queries";
import { completeVideoMeta } from "./video-meta";

/**
 * Na lista de imóveis: gera a capa (e grava tamanho/duração) dos vídeos
 * antigos que ainda não têm, um de cada vez, no navegador do admin. Sem isso
 * um anúncio só com vídeo ficava com "Fotos em breve" no card até alguém
 * abrir aquele imóvel no admin. Quem usa passa uma `key` com os ids, para
 * a contagem recomeçar quando a lista muda depois do refresh.
 */
export function VideoPosterBackfill({ videos }: { videos: VideoSemCapa[] }) {
  const router = useRouter();
  const [left, setLeft] = useState(videos.length);

  useEffect(() => {
    if (videos.length === 0) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      let changed = false;
      for (const video of videos) {
        const meta = await completeVideoMeta(supabase, video.imovelId, video, () => cancelled);
        if (cancelled) return;
        if (meta) changed = true;
        setLeft((n) => n - 1);
      }
      // Recarrega a lista para mostrar as capas novas; os que falharam voltam
      // na próxima visita (e não entram em laço: sem mudança, não recarrega).
      if (changed) router.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [videos, router]);

  if (left <= 0) return null;
  return (
    <p className="flex items-center gap-2 mb-4 text-text-3" style={{ font: "var(--text-caption)" }}>
      <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
      Gerando a capa de {left === 1 ? "1 vídeo" : `${left} vídeos`} (ela aparece como foto nos anúncios só com vídeo)…
    </p>
  );
}
