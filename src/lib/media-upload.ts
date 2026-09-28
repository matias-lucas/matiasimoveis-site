import { VERTICAL_VIDEO_MAX_ASPECT } from "./media";

/**
 * Só no navegador (admin): lê o tamanho de fotos e vídeos antes de gravar,
 * para a ficha montar o layout sem esticar nem cortar, e tira um quadro do
 * vídeo para servir de capa (com o play por cima na ficha e no card).
 */

export interface MediaSize {
  width: number;
  height: number;
}

export async function readImageSize(file: Blob): Promise<MediaSize | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
}

export interface VideoInfo extends MediaSize {
  durationSeconds: number;
  /** JPEG de um quadro do início do vídeo; null se o navegador não conseguiu desenhar. */
  poster: Blob | null;
}

const POSTER_MAX_SIDE = 1280;

/**
 * @param source o arquivo escolhido no upload, ou a URL pública de um vídeo já
 * enviado (vídeos antigos, sem tamanho/capa gravados).
 */
export function readVideoInfo(source: File | string, timeoutMs = 20000): Promise<VideoInfo | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = typeof source === "string" ? null : URL.createObjectURL(source);
    let meta: MediaSize & { durationSeconds: number } | null = null;
    let done = false;

    const finish = (info: VideoInfo | null) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      video.removeAttribute("src");
      video.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(info);
    };
    const timer = setTimeout(() => finish(meta ? { ...meta, poster: null } : null), timeoutMs);

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    // Sem isso o canvas fica "manchado" com vídeo de outro domínio e não exporta a capa.
    if (typeof source === "string") video.crossOrigin = "anonymous";

    video.onloadedmetadata = () => {
      if (!video.videoWidth || !video.videoHeight) return finish(null);
      const durationSeconds = Number.isFinite(video.duration) ? video.duration : 0;
      meta = { width: video.videoWidth, height: video.videoHeight, durationSeconds };
      // Quadro de ~1s (ou de 1/4 do vídeo, se for curto): o primeiro costuma ser preto.
      video.currentTime = Math.max(0.1, Math.min(1, durationSeconds * 0.25));
    };

    video.onseeked = () => {
      if (!meta) return;
      const current = meta;
      try {
        const scale = Math.min(1, POSTER_MAX_SIDE / Math.max(current.width, current.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(current.width * scale);
        canvas.height = Math.round(current.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return finish({ ...current, poster: null });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => finish({ ...current, poster: blob }), "image/jpeg", 0.82);
      } catch {
        finish({ ...current, poster: null });
      }
    };

    video.onerror = () => finish(meta ? { ...meta, poster: null } : null);
    video.src = objectUrl ?? (source as string);
  });
}

/** Como o vídeo vai aparecer na ficha, para o admin saber antes de publicar. */
export function describeOrientation(width?: number | null, height?: number | null): string | null {
  if (!width || !height) return null;
  const aspect = width / height;
  if (aspect < VERTICAL_VIDEO_MAX_ASPECT) return "Vertical (em pé)";
  if (aspect > 1.1) return "Horizontal (deitado)";
  return "Quadrado";
}
