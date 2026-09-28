"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Play } from "lucide-react";
import { clsx } from "clsx";
import { formatDuration } from "@/lib/media";
import type { ImovelPurpose, ImovelVideoRecord } from "@/lib/types";

interface ImovelVideoProps {
  video: ImovelVideoRecord;
  title: string;
  /** Tamanho do quadro: quem usa define largura/altura com a proporção do vídeo (sem tarjas). */
  className?: string;
  style?: CSSProperties;
  /** "lg": destaque da ficha; "sm": vídeo extra na fileira de miniaturas. */
  size?: "lg" | "sm";
  /** Cor do play: azul na locação, vermelho na venda. */
  purpose: ImovelPurpose;
  /** Vídeos antigos sem tamanho gravado: avisa a proporção real quando o navegador descobre. */
  onAspect?: (aspect: number) => void;
}

/**
 * Vídeo da ficha: parado, mostra o quadro de capa com um play grande no
 * meio; ao tocar, toca ali mesmo, com som e com os controles do navegador.
 * O quadro sempre tem a proporção do próprio vídeo, então não aparecem
 * tarjas pretas nem imagem esticada. Um único <video> do começo ao fim: o
 * play() sai direto do toque, que é o que o Safari do iPhone exige.
 */
export function ImovelVideo({ video, title, className, style, size = "lg", purpose, onAspect }: ImovelVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Sem capa gerada (vídeo antigo), o navegador mostra o quadro de 0,5s.
  const src = video.posterUrl ? video.url : `${video.url}#t=0.5`;

  function start() {
    const el = ref.current;
    if (!el) return;
    if (!video.posterUrl) el.currentTime = 0;
    setPlaying(true);
    el.play().catch(() => {
      // Bloqueado pelo navegador: os controles já aparecem para a pessoa tocar.
    });
  }

  return (
    <div className={clsx("relative overflow-hidden bg-black", className)} style={style}>
      <video
        ref={ref}
        src={src}
        poster={video.posterUrl}
        preload={video.posterUrl ? "none" : "metadata"}
        playsInline
        controls={playing}
        onPlay={() => setPlaying(true)}
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          if (onAspect && el.videoWidth && el.videoHeight) onAspect(el.videoWidth / el.videoHeight);
        }}
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={`Vídeo: ${title}`}
      />
      {!playing && (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 flex items-center justify-center text-white focus-visible:outline-none"
          aria-label={`Assistir ao vídeo: ${title}`}
        >
          <span className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-black/10" aria-hidden />
          <span
            className={clsx(
              "relative flex items-center justify-center rounded-full bg-white/95 shadow-xl ring-8 ring-white/25 transition-transform duration-200 ease-out group-hover:scale-110 group-focus-visible:ring-white/70",
              size === "lg" ? "w-20 h-20 sm:w-24 sm:h-24" : "w-12 h-12 ring-4"
            )}
            aria-hidden
          >
            <Play
              className={clsx(
                purpose === "locacao" ? "text-blue-500 fill-blue-500" : "text-red-600 fill-red-600",
                size === "lg" ? "w-9 h-9 sm:w-10 sm:h-10 ml-1.5" : "w-5 h-5 ml-0.5"
              )}
            />
          </span>
          {size === "lg" && (
            <span
              className="absolute left-4 bottom-4 flex items-center gap-2 rounded-pill bg-black/60 px-3 py-1.5"
              style={{ font: "700 14px/1 var(--font-display)" }}
            >
              Assistir ao vídeo
              {video.durationSeconds ? (
                <span className="tabular text-white/80" style={{ font: "600 13px/1 var(--font-display)" }}>
                  {formatDuration(video.durationSeconds)}
                </span>
              ) : null}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
