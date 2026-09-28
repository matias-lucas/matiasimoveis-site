/// <reference types="react/canary" />
import Link from "next/link";
import { ViewTransition } from "react";
import { clsx } from "clsx";
import { BedDouble, Bath, Car, Ruler, MapPin, Camera, Play, type LucideIcon } from "lucide-react";
import { ImovelPhoto } from "./ImovelPhoto";
import { formatPriceParts } from "@/lib/format";
import { imovelSpecs, type SpecKey } from "@/lib/imovel-specs";
import type { Imovel } from "@/lib/types";

const SPEC_ICONS: Record<SpecKey, LucideIcon> = {
  quartos: BedDouble,
  banheiros: Bath,
  vagas: Car,
  area: Ruler,
  terreno: Ruler,
};

interface ImovelCardProps {
  imovel: Imovel;
  /** Em telas estreitas vira uma linha (foto à esquerda): cabem 4-5 por tela em vez de 2. */
  listOnMobile?: boolean;
  /** Pré-carrega a foto (primeiro card visível). */
  preload?: boolean;
}

/**
 * Card de imóvel. Ordem de leitura pensada para "achar em segundos": preço
 * grande, título, bairro, e as características com palavra (não só ícone +
 * número, que ninguém sabia ler — review 28/09). "Ref." fica só na ficha.
 */
export function ImovelCard({ imovel, listOnMobile = false, preload }: ImovelCardProps) {
  const { slug, purpose, price, title, neighborhood, coverImage, kind, status, photos, videos } = imovel;
  const hasVideo = (videos?.length ?? 0) > 0;
  const { value, suffix } = formatPriceParts(price, purpose);
  const specs = imovelSpecs(imovel).filter((s) => s.key !== "terreno");
  const photoCount = photos?.length ?? 0;

  return (
    <Link
      href={`/imovel/${slug}`}
      className={clsx(
        "group w-full bg-bg-surface rounded-xl overflow-hidden border border-border-1 no-underline text-text-1 hover:text-text-1 transition-[box-shadow,transform] duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:shadow-focus",
        listOnMobile ? "grid grid-cols-[38%_1fr] sm:flex sm:flex-col" : "flex flex-col"
      )}
    >
      <div className={clsx("relative bg-bg-sunken overflow-hidden", listOnMobile ? "min-h-[132px] sm:aspect-[4/3]" : "aspect-[4/3]")}>
        <ViewTransition name={`imovel-photo-${slug}`} share="morph" default="none">
          <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.03]">
            <ImovelPhoto src={coverImage} alt={title} kind={kind} compact={listOnMobile ? "mobile" : false} preload={preload} />
          </div>
        </ViewTransition>
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span
            className={clsx(
              "rounded-pill px-2.5 py-1 text-white",
              purpose === "locacao" ? "bg-blue-500" : "bg-red-600"
            )}
            style={{ font: "700 12px/1 var(--font-display)" }}
          >
            {purpose === "locacao" ? "Aluguel" : "Venda"}
          </span>
          {hasVideo && (
            <span
              className="inline-flex items-center gap-1 rounded-pill bg-white/95 px-2.5 py-1 text-gray-900 shadow-sm"
              style={{ font: "700 12px/1 var(--font-display)" }}
            >
              <Play
                className={clsx("w-3 h-3", purpose === "locacao" ? "fill-blue-500 text-blue-500" : "fill-red-600 text-red-600")}
                aria-hidden
              />
              Vídeo
            </span>
          )}
          {status === "em_negociacao" && (
            <span className="rounded-pill px-2.5 py-1 bg-amber-100 text-gray-900" style={{ font: "700 12px/1 var(--font-display)" }}>
              Em negociação
            </span>
          )}
        </div>
        {photoCount > 1 && (
          <span
            className={clsx(
              "absolute bottom-2.5 right-2.5 items-center gap-1 rounded-pill bg-black/65 text-white px-2 py-1",
              listOnMobile ? "hidden sm:inline-flex" : "inline-flex"
            )}
            style={{ font: "600 12px/1 var(--font-display)" }}
          >
            <Camera className="w-3.5 h-3.5" aria-hidden />
            {photoCount}
            <span className="sr-only"> fotos</span>
          </span>
        )}
      </div>

      <div className={clsx("flex flex-col gap-1.5 min-w-0", listOnMobile ? "p-3 sm:p-4" : "p-4")}>
        <div className="text-blue-900 tabular" style={{ font: "var(--text-price)" }}>
          {value}
          {suffix && (
            <span className="text-text-2" style={{ font: "600 15px/1 var(--font-display)" }}>
              {suffix}
            </span>
          )}
        </div>
        <h3 className="text-text-1 line-clamp-2" style={{ font: "600 17px/1.3 var(--font-display)" }}>
          {title}
        </h3>
        <div className="flex items-center gap-1 text-text-2 min-w-0" style={{ font: "var(--text-body-sm)" }}>
          <MapPin className="w-4 h-4 shrink-0" aria-hidden />
          <span className="truncate">{neighborhood}</span>
        </div>
        {specs.length > 0 && (
          <ul
            className="flex flex-wrap gap-x-3 gap-y-1 mt-1 pt-2.5 border-t border-border-1 text-text-2"
            style={{ font: "500 14px/1.3 var(--font-body)" }}
          >
            {specs.map((spec) => {
              const Icon = SPEC_ICONS[spec.key];
              return (
                <li key={spec.key} className="flex items-center gap-1 whitespace-nowrap">
                  <Icon className="w-4 h-4 shrink-0 text-text-3" aria-hidden />
                  <span>
                    {spec.value}
                    {spec.short && ` ${spec.short}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Link>
  );
}
