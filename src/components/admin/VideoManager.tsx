"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Trash2, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PROPERTY_VIDEOS_BUCKET, publicStorageUrl } from "@/lib/supabase/env";
import { addVideo, deleteVideo, moveVideo } from "@/app/admin/imoveis/actions";

const MAX_FILE_BYTES = 100 * 1024 * 1024; // matches the property-videos bucket's file_size_limit
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

interface Video {
  id: string;
  url: string;
  label: string;
  position: number;
  storage_path: string;
}

interface VideoManagerProps {
  propertyId: string;
  propertyTitle: string;
  initialVideos: Video[];
}

export function VideoManager({ propertyId, propertyTitle, initialVideos }: VideoManagerProps) {
  const [videos, setVideos] = useState<Video[]>(
    [...initialVideos].sort((a, b) => a.position - b.position)
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList) {
    setError(null);
    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(fileList)) {
      try {
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(`Formato não suportado: ${file.name}. Envie um vídeo .mp4, .webm ou .mov.`);
        }
        if (file.size > MAX_FILE_BYTES) {
          throw new Error(`${file.name} tem mais de 100MB — reduza a duração ou a qualidade antes de enviar.`);
        }

        const extension = file.name.split(".").pop()?.toLowerCase() || "mp4";
        const path = `${propertyId}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from(PROPERTY_VIDEOS_BUCKET)
          .upload(path, file, { contentType: file.type });
        if (uploadError) throw uploadError;

        const row = await addVideo(propertyId, path, propertyTitle);
        setVideos((prev) => [
          ...prev,
          {
            id: row.id,
            url: publicStorageUrl(row.storage_path, PROPERTY_VIDEOS_BUCKET),
            label: row.label,
            position: row.position,
            storage_path: row.storage_path,
          },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao enviar o vídeo.");
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDelete(video: Video) {
    setVideos((prev) => prev.filter((v) => v.id !== video.id));
    startTransition(() => {
      deleteVideo(video.id, propertyId, video.storage_path);
    });
  }

  function handleMove(video: Video, direction: "up" | "down") {
    setVideos((prev) => {
      const index = prev.findIndex((v) => v.id === video.id);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
    startTransition(() => {
      moveVideo(propertyId, video.id, direction);
    });
  }

  return (
    <div className="flex flex-col gap-4 bg-bg-surface border border-border-1 rounded-lg p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-text-1" style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}>
          Vídeos
        </h2>
        <label className="inline-flex items-center gap-2 rounded-md bg-brand-primary text-white px-4 py-2.5 cursor-pointer transition-colors duration-150 ease-out hover:bg-brand-primary-hover font-display">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span style={{ font: "var(--text-label)" }}>{uploading ? "Enviando…" : "Adicionar vídeo"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            multiple
            disabled={uploading}
            className="sr-only"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      </div>

      <p className="text-text-3" style={{ font: "var(--text-caption)" }}>
        Formatos aceitos: MP4, WebM ou MOV, até 100MB por vídeo.
      </p>

      {error && (
        <p className="text-red-600" style={{ font: "var(--text-caption)" }}>
          {error}
        </p>
      )}

      {videos.length === 0 ? (
        <p className="text-text-3" style={{ font: "var(--text-body-sm)" }}>
          Nenhum vídeo ainda. Os vídeos aparecem na ficha do imóvel, abaixo das fotos.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {videos.map((video, index) => (
            <div key={video.id} className="flex flex-col gap-1.5">
              <div className="relative h-[140px] rounded-md overflow-hidden bg-bg-sunken border border-border-1">
                <video src={video.url} controls preload="metadata" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Mover para cima"
                  onClick={() => handleMove(video, "up")}
                  disabled={index === 0}
                  className="flex-1 flex items-center justify-center h-7 rounded border border-border-2 text-text-2 cursor-pointer transition-colors duration-150 ease-out hover:text-text-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Mover para baixo"
                  onClick={() => handleMove(video, "down")}
                  disabled={index === videos.length - 1}
                  className="flex-1 flex items-center justify-center h-7 rounded border border-border-2 text-text-2 cursor-pointer transition-colors duration-150 ease-out hover:text-text-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Excluir vídeo"
                  onClick={() => handleDelete(video)}
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
