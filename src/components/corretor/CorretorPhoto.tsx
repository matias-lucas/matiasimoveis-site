import Image from "next/image";
import { UserRound } from "lucide-react";
import { clsx } from "clsx";

interface CorretorPhotoProps {
  corretor: { name: string; photoUrl?: string };
  /** Diâmetro em px. */
  size: number;
  className?: string;
}

/**
 * Foto redonda do corretor, enviada em Admin → Corretores. Enquanto não
 * houver foto, o círculo fica no lugar com "Foto pendente".
 */
export function CorretorPhoto({ corretor, size, className }: CorretorPhotoProps) {
  const style = { width: size, height: size };
  if (corretor.photoUrl) {
    return (
      <span className={clsx("relative block shrink-0 overflow-hidden rounded-full bg-bg-sunken", className)} style={style}>
        <Image src={corretor.photoUrl} alt={`Foto de ${corretor.name}`} fill sizes={`${size}px`} className="object-cover" />
      </span>
    );
  }
  const showText = size >= 56;
  return (
    <span
      role="img"
      aria-label={`Foto pendente: ${corretor.name}`}
      className={clsx(
        "flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border-2 border-dashed border-border-2 bg-bg-sunken text-text-3 text-center",
        className
      )}
      style={style}
      title="Foto pendente"
    >
      <UserRound className={size >= 96 ? "w-8 h-8" : "w-5 h-5"} strokeWidth={1.5} aria-hidden />
      {showText && (
        <span
          className="text-text-2 px-1"
          style={{ font: `600 ${size >= 96 ? 13 : 10}px/1.1 var(--font-display)` }}
          aria-hidden
        >
          Foto pendente
        </span>
      )}
    </span>
  );
}
