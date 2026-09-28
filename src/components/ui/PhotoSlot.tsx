import Image, { type StaticImageData } from "next/image";
import { Camera } from "lucide-react";
import { clsx } from "clsx";

interface PhotoSlotProps {
  src?: string | StaticImageData;
  alt: string;
  /** O que a foto vai mostrar, escrito abaixo de "Foto pendente" (ex.: "Atendimento no escritório"). */
  pendingLabel?: string;
  sizes: string;
  /** Tamanho/proporção do quadro (ex.: "aspect-[4/3] rounded-2xl"). */
  className?: string;
  preload?: boolean;
}

/**
 * Quadro de foto do site que ainda pode estar sem a foto real. Sem `src`,
 * mostra "Foto pendente" no próprio lugar da foto, para o layout final já
 * ficar visível enquanto a foto não é enviada (pedido do dono em 28/09).
 */
export function PhotoSlot({ src, alt, pendingLabel, sizes, className, preload }: PhotoSlotProps) {
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          placeholder={typeof src === "string" ? "empty" : "blur"}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={`Foto pendente: ${pendingLabel ?? alt}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center bg-bg-sunken border-2 border-dashed border-border-2 rounded-[inherit] text-text-2"
        >
          <Camera className="w-8 h-8 text-text-3" strokeWidth={1.5} aria-hidden />
          <span className="text-text-1" style={{ font: "700 15px/1.2 var(--font-display)" }}>
            Foto pendente
          </span>
          {pendingLabel && <span style={{ font: "var(--text-caption)" }}>{pendingLabel}</span>}
        </div>
      )}
    </div>
  );
}
