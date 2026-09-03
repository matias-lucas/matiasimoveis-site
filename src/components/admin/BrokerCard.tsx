"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Camera, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DeleteBrokerButton } from "@/components/admin/DeleteBrokerButton";
import { createClient } from "@/lib/supabase/client";
import { BROKER_PHOTOS_BUCKET, publicStorageUrl } from "@/lib/supabase/env";
import { compressImage } from "@/lib/image-compression";
import type { BrokerRow } from "@/lib/admin/queries";

interface BrokerCardProps {
  broker: BrokerRow;
  updateAction: (formData: FormData) => void;
  deleteAction: () => Promise<void>;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function BrokerCard({ broker, updateAction, deleteAction }: BrokerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [photoPath, setPhotoPath] = useState(broker.photo_path);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handlePhotoChange(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const path = `${broker.id}/${crypto.randomUUID()}.jpg`;
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(BROKER_PHOTOS_BUCKET)
        .upload(path, compressed, { contentType: "image/jpeg" });
      if (error) throw error;
      setPhotoPath(path);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Falha ao enviar a foto.");
    } finally {
      setUploading(false);
    }
  }

  if (isEditing) {
    return (
      <form
        action={updateAction}
        className="flex flex-col items-center text-center gap-4 bg-bg-surface border border-border-1 rounded-lg p-6"
      >
        <input type="hidden" name="photoPath" value={photoPath ?? ""} />

        <label className="relative w-20 h-20 shrink-0 cursor-pointer group/photo">
          <div className="w-20 h-20 rounded-full bg-bg-sunken border border-border-1 flex items-center justify-center text-text-2 overflow-hidden">
            {photoPath ? (
              <Image
                src={publicStorageUrl(photoPath, BROKER_PHOTOS_BUCKET)}
                alt=""
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <span style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}>
                {initials(broker.name)}
              </span>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover/photo:bg-black/40 transition-colors duration-150 ease-out">
            {uploading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Camera className="w-4 h-4 text-white opacity-0 group-hover/photo:opacity-100 transition-opacity duration-150 ease-out" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            className="sr-only"
            onChange={(e) => e.target.files?.[0] && handlePhotoChange(e.target.files[0])}
          />
        </label>
        {uploadError && (
          <p className="text-red-600" style={{ font: "var(--text-caption)" }}>
            {uploadError}
          </p>
        )}

        <div className="flex flex-col gap-3 w-full">
          <Input label="Nome" name="name" defaultValue={broker.name} required />
          <Input label="CRECI" name="creci" defaultValue={broker.creci} required />
          <Input label="Contato" name="contact" defaultValue={broker.contact} required />
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button type="submit" size="sm" disabled={uploading}>
            Salvar
          </Button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-text-2 bg-transparent border-none cursor-pointer px-2 py-2 transition-colors duration-150 ease-out hover:text-text-1"
            style={{ font: "var(--text-body-sm)" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-bg-sunken border border-border-1">
      {broker.photo_path ? (
        <Image
          src={publicStorageUrl(broker.photo_path, BROKER_PHOTOS_BUCKET)}
          alt={broker.name}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-text-2"
          style={{ font: "var(--text-display-lg)", fontFamily: "var(--font-display)" }}
        >
          {initials(broker.name)}
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-2/5 opacity-70 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(21,22,28,0.85), rgba(21,22,28,0))" }}
      />

      <div className="absolute bottom-0 inset-x-0 p-4 text-left">
        <div className="text-white font-semibold" style={{ font: "var(--text-body-md)" }}>
          {broker.name}
        </div>
        <div className="text-white/80" style={{ font: "var(--text-body-sm)" }}>
          {broker.creci}
        </div>
        <div className="text-white/80" style={{ font: "var(--text-body-sm)" }}>
          {broker.contact}
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 ease-out">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label="Editar"
          className="inline-flex items-center justify-center w-7 h-7 text-text-1 bg-white/90 border border-white/40 rounded-md cursor-pointer transition-colors duration-150 ease-out hover:bg-white"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <DeleteBrokerButton action={deleteAction} name={broker.name} iconOnly />
      </div>
    </div>
  );
}
