"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { Upload, Star, Trash2, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PROPERTY_PHOTOS_BUCKET, publicStorageUrl } from "@/lib/supabase/env";
import { compressImage } from "@/lib/image-compression";
import { addPhoto, deletePhoto, setCoverPhoto, movePhoto } from "@/app/admin/imoveis/actions";

interface Photo {
  id: string;
  url: string;
  alt: string;
  is_cover: boolean;
  position: number;
  storage_path: string;
}

interface PhotoManagerProps {
  propertyId: string;
  propertyTitle: string;
  initialPhotos: Photo[];
}

export function PhotoManager({ propertyId, propertyTitle, initialPhotos }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>(
    [...initialPhotos].sort((a, b) => a.position - b.position)
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList) {
    setError(null);
    setUploading(true);
    const supabase = createClient();

    for (const rawFile of Array.from(fileList)) {
      try {
        const file = await compressImage(rawFile);
        const path = `${propertyId}/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(PROPERTY_PHOTOS_BUCKET)
          .upload(path, file, { contentType: "image/jpeg" });
        if (uploadError) throw uploadError;

        const row = await addPhoto(propertyId, path, propertyTitle);
        setPhotos((prev) => [
          ...prev,
          {
            id: row.id,
            url: publicStorageUrl(row.storage_path),
            alt: row.alt,
            is_cover: row.is_cover,
            position: row.position,
            storage_path: row.storage_path,
          },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao enviar a foto.");
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDelete(photo: Photo) {
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    startTransition(() => {
      deletePhoto(photo.id, propertyId, photo.storage_path);
    });
  }

  function handleSetCover(photo: Photo) {
    setPhotos((prev) => prev.map((p) => ({ ...p, is_cover: p.id === photo.id })));
    startTransition(() => {
      setCoverPhoto(photo.id, propertyId);
    });
  }

  function handleMove(photo: Photo, direction: "up" | "down") {
    setPhotos((prev) => {
      const index = prev.findIndex((p) => p.id === photo.id);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
    startTransition(() => {
      movePhoto(propertyId, photo.id, direction);
    });
  }

  return (
    <div className="flex flex-col gap-4 bg-bg-surface border border-border-1 rounded-lg p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-text-1" style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}>
          Fotos
        </h2>
        <label className="inline-flex items-center gap-2 rounded-md bg-brand-primary text-white px-4 py-2.5 cursor-pointer transition-colors duration-150 ease-out hover:bg-brand-primary-hover font-display">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span style={{ font: "var(--text-label)" }}>{uploading ? "Enviando…" : "Adicionar fotos"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            className="sr-only"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      </div>

      {error && (
        <p className="text-red-600" style={{ font: "var(--text-caption)" }}>
          {error}
        </p>
      )}

      {photos.length === 0 ? (
        <p className="text-text-3" style={{ font: "var(--text-body-sm)" }}>
          Nenhuma foto ainda. As fotos aparecem na ficha do imóvel na ordem abaixo — a primeira marcada
          com estrela é a capa usada nos cards de busca.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div key={photo.id} className="flex flex-col gap-1.5">
              <div className="relative h-[110px] rounded-md overflow-hidden bg-bg-sunken border border-border-1">
                <Image src={photo.url} alt={photo.alt} fill sizes="160px" className="object-cover" />
                {photo.is_cover && (
                  <span className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-brand-primary text-white rounded-pill px-2 py-0.5" style={{ font: "var(--text-caption)" }}>
                    <Star className="w-3 h-3" fill="currentColor" />
                    Capa
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Definir como capa"
                  onClick={() => handleSetCover(photo)}
                  disabled={photo.is_cover}
                  className={clsx(
                    "flex-1 flex items-center justify-center h-7 rounded border border-border-2 cursor-pointer transition-colors duration-150 ease-out disabled:opacity-40 disabled:cursor-not-allowed",
                    photo.is_cover ? "text-brand-primary" : "text-text-2 hover:text-text-1"
                  )}
                >
                  <Star className="w-3.5 h-3.5" fill={photo.is_cover ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  title="Mover para cima"
                  onClick={() => handleMove(photo, "up")}
                  disabled={index === 0}
                  className="flex-1 flex items-center justify-center h-7 rounded border border-border-2 text-text-2 cursor-pointer transition-colors duration-150 ease-out hover:text-text-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Mover para baixo"
                  onClick={() => handleMove(photo, "down")}
                  disabled={index === photos.length - 1}
                  className="flex-1 flex items-center justify-center h-7 rounded border border-border-2 text-text-2 cursor-pointer transition-colors duration-150 ease-out hover:text-text-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Excluir foto"
                  onClick={() => handleDelete(photo)}
                  className="flex-1 flex items-center justify-center h-7 rounded border border-border-2 text-red-600 cursor-pointer transition-colors duration-150 ease-out hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
