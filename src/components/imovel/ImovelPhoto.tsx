import Image from "next/image";
import { clsx } from "clsx";
import { KIND_ICONS } from "./kind-icons";
import { KIND_ILLUSTRATIONS } from "./kind-illustrations";
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
  /** Quadro "sem foto" compacto (sem o selo): miniaturas; "mobile" = só abaixo de 640px (card em linha da busca). */
  compact?: boolean | "mobile";
}

/**
 * Slot de imagem compartilhado por cards, galerias e miniaturas. Sem foto
 * real, mostra um quadro "Fotos em breve" com a ilustração do tipo do imóvel
 * — um desenho, nunca uma foto de banco ou de IA no lugar da foto do anúncio.
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

  const illustration = KIND_ILLUSTRATIONS[kind ?? "casa"];
  const Icon = KIND_ICONS[kind ?? "casa"];
  return (
    <div className={clsx("absolute inset-0 flex flex-col items-center justify-center bg-[#fbf8eb]", className)}>
      {illustration ? (
        // Borda esfumada (máscara radial) para o fundo creme do desenho se
        // fundir ao do quadro sem aparecer o recorte quadrado.
        <span
          className={clsx(
            "relative aspect-square",
            compact === true && "h-[88%]",
            compact === "mobile" && "h-[88%] sm:h-[72%] sm:-mt-[6%]",
            !compact && "h-[72%] -mt-[6%]"
          )}
        >
          <Image
            src={illustration}
            alt=""
            fill
            sizes={compact === true ? "96px" : "240px"}
            className="object-contain [mask-image:radial-gradient(closest-side,#000_78%,transparent)]"
          />
        </span>
      ) : (
        <Icon className={clsx("text-blue-500", compact === true ? "w-6 h-6" : "w-10 h-10")} strokeWidth={1.5} aria-hidden />
      )}
      {compact !== true && (
        <span
          className={clsx(
            "absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-white/90 px-3 py-1.5 text-blue-900 shadow-sm",
            compact === "mobile" && "hidden sm:block"
          )}
          style={{ font: "600 13px/1 var(--font-display)" }}
        >
          Fotos em breve
        </span>
      )}
    </div>
  );
}
