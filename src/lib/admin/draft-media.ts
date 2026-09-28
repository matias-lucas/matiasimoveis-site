/**
 * Fotos e vídeos escolhidos no cadastro ("Novo imóvel"), antes de o imóvel
 * existir. A página gera o id do imóvel de antemão; o PhotoManager/VideoManager
 * em modo `draft` já sobem os arquivos para o Storage em `<id>/…` (as políticas
 * do bucket não dependem da linha em properties) e guardam a lista nestes
 * campos ocultos do formulário. Ao salvar, createImovel grava o imóvel com esse
 * id e só então as linhas de property_photos/property_videos, que precisam dele.
 */

export const DRAFT_PHOTOS_FIELD = "draftPhotos";
export const DRAFT_VIDEOS_FIELD = "draftVideos";

export interface DraftPhoto {
  path: string;
  width?: number | null;
  height?: number | null;
  isCover?: boolean;
}

export interface DraftVideo {
  path: string;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
  /** Capa no bucket property-photos (o de vídeos só aceita vídeo). */
  posterPath?: string | null;
}

function readList(formData: FormData, field: string): Record<string, unknown>[] {
  try {
    const value = JSON.parse(String(formData.get(field) ?? "[]"));
    return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
  } catch {
    return [];
  }
}

function positive(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Lê os campos ocultos, na ordem em que o admin deixou. Só aceita caminhos
 * dentro da pasta do próprio imóvel — o formulário vem do navegador, então um
 * caminho de outro imóvel é descartado em vez de virar foto deste.
 * @param imovelId já validado como UUID por quem chama.
 */
export function parseDraftMedia(formData: FormData, imovelId: string) {
  const isOwnPath = (value: unknown): value is string =>
    typeof value === "string" && value.startsWith(`${imovelId}/`) && !value.slice(imovelId.length + 1).includes("/");

  const photos: DraftPhoto[] = readList(formData, DRAFT_PHOTOS_FIELD).flatMap((item) =>
    isOwnPath(item.path)
      ? [{ path: item.path, width: positive(item.width), height: positive(item.height), isCover: item.isCover === true }]
      : []
  );

  const videos: DraftVideo[] = readList(formData, DRAFT_VIDEOS_FIELD).flatMap((item) =>
    isOwnPath(item.path)
      ? [
          {
            path: item.path,
            width: positive(item.width),
            height: positive(item.height),
            durationSeconds: positive(item.durationSeconds),
            posterPath: isOwnPath(item.posterPath) ? item.posterPath : null,
          },
        ]
      : []
  );

  return { photos, videos };
}
