import Link from "next/link";
import { BedDouble, Bath, Car, Ruler, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ImovelPhoto } from "./ImovelPhoto";
import { formatArea, formatPrice } from "@/lib/format";
import type { Imovel } from "@/lib/types";

interface ImovelCardProps {
  imovel: Imovel;
}

export function ImovelCard({ imovel }: ImovelCardProps) {
  const {
    slug,
    purpose,
    price,
    title,
    neighborhood,
    bedrooms,
    bathrooms,
    parking,
    areaM2,
    ref,
    coverImage,
  } = imovel;

  return (
    <Link
      href={`/imovel/${slug}`}
      className="group block w-[280px] bg-bg-surface rounded-lg overflow-hidden shadow-md transition-shadow duration-150 ease-out hover:shadow-lg font-body"
    >
      <div className="relative h-[180px] bg-bg-sunken">
        <ImovelPhoto src={coverImage} alt={title} />
        <Badge
          tone={purpose === "locacao" ? "locacao" : "venda"}
          solid
          className="absolute top-3 left-3"
        >
          {purpose === "locacao" ? "Locação" : "Venda"}
        </Badge>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="text-text-1" style={{ font: "var(--text-price)" }}>
          {formatPrice(price, purpose)}
        </div>
        <div className="text-text-1 font-semibold" style={{ font: "var(--text-body-md)" }}>
          {title}
        </div>
        <div
          className="flex items-center gap-1 text-text-2"
          style={{ font: "var(--text-body-sm)" }}
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {neighborhood}
        </div>
        <div
          className="flex items-center gap-3.5 pt-2 border-t border-border-1 text-text-2"
          style={{ font: "var(--text-caption)" }}
        >
          {bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" />
              {bedrooms}
            </span>
          )}
          {bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {bathrooms}
            </span>
          )}
          {parking != null && (
            <span className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              {parking}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Ruler className="w-3.5 h-3.5" />
            {formatArea(areaM2)}
          </span>
          <span className="ml-auto">Ref.: {ref}</span>
        </div>
      </div>
    </Link>
  );
}
