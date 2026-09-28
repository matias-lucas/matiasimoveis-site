import Image from "next/image";
import { clsx } from "clsx";
import { KIND_ICONS } from "./kind-icons";
import type { ImovelKind } from "@/lib/types";

interface ImovelPhotoProps {
  src?: string;
  alt: string;
  className?: string;
  /** Pré-carrega (foto principal da ficha, LCP). Substitui `priority`, descontinuado no Next 16. */
  preload?: boolean;
  sizes?: string;
  /** Tipo do imóvel, para o ícone do quadro "sem foto". */
  kind?: ImovelKind;
  /** Tamanho do quadro "sem foto": compacto em miniaturas/cards pequenos. */
  compact?: boolean;
}

/**
 * Slot de imagem compartilhado por cards, galerias e miniaturas. Sem foto
 * real, mostra um quadro honesto com o ícone do tipo do imóvel — nunca uma
 * foto de banco ou de IA no lugar da foto do anúncio.
 */
export function ImovelPhoto({ src, alt, className, preload, sizes, kind, compact }: ImovelPhotoProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
        className={clsx("object-cover", className)}
      />
    );
  }

  const Icon = KIND_ICONS[kind ?? "casa"];
  return (
    <div
      className={clsx(
        "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-blue-50 text-blue-500",
        className
      )}
    >
      <Icon className={compact ? "w-6 h-6" : "w-10 h-10"} strokeWidth={1.5} aria-hidden />
      {!compact && (
        <span className="text-blue-600" style={{ font: "600 13px/1.2 var(--font-display)" }}>
          Fotos em breve
        </span>
      )}
    </div>
  );
}
