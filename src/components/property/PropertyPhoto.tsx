import Image from "next/image";
import { ImageOff } from "lucide-react";
import { clsx } from "clsx";

interface PropertyPhotoProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  iconClassName?: string;
}

/**
 * Shared image slot for cards, galleries and thumbnails. Falls back to an
 * honest "sem foto ainda" state instead of reusing a stock photo across
 * unrelated mock listings — see docs/PLANO-IMPLEMENTACAO.md section 5.
 */
export function PropertyPhoto({
  src,
  alt,
  className,
  priority,
  sizes,
  iconClassName = "w-8 h-8",
}: PropertyPhotoProps) {
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
