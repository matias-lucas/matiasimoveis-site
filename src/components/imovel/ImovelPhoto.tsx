import Image from "next/image";
import { ImageOff } from "lucide-react";
import { clsx } from "clsx";

interface ImovelPhotoProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  iconClassName?: string;
}

/**
 * Slot de imagem compartilhado por cards, galerias e miniaturas. Cai para um
 * estado honesto de "sem foto ainda" em vez de reaproveitar uma foto de
 * banco de imagens entre anúncios fictícios sem relação — ver
 * docs/PLANO-IMPLEMENTACAO.md seção 5.
 */
export function ImovelPhoto({
  src,
  alt,
  className,
  priority,
  sizes,
  iconClassName = "w-8 h-8",
}: ImovelPhotoProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "280px"}
        className={clsx("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "w-full h-full flex flex-col items-center justify-center gap-1.5 bg-bg-sunken text-text-3",
        className
      )}
    >
      <ImageOff className={iconClassName} />
      <span style={{ font: "var(--text-caption)" }}>Foto em breve</span>
    </div>
  );
}
