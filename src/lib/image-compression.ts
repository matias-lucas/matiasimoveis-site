/**
 * Redimensiona/reencoda via canvas, só no client, antes do upload — fotos de
 * celular chegam com 4-5MB brutos e prejudicariam o formulário admin e o
 * carregamento das páginas se armazenadas assim (ver docs/PLANO-IMPLEMENTACAO.md
 * Fase 8). Não precisa de dependência extra.
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) return file;

  const name = file.name.replace(/\.\w+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}
