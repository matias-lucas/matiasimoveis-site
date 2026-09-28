/** Proporção largura/altura de uma mídia; `fallback` quando o tamanho não foi gravado (mídia antiga). */
export function aspectOf(media: { width?: number; height?: number }, fallback: number): number {
  return media.width && media.height ? media.width / media.height : fallback;
}

/** Vídeo em pé (9:16, 3:4, 4:5): na ficha ele vai grande ao lado das informações. */
export const VERTICAL_VIDEO_MAX_ASPECT = 0.9;

/** 13.9 → "0:14"; 75 → "1:15". */
export function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}
