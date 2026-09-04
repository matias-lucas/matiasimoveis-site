import type { Metadata } from "next";
import Link from "next/link";
import { clsx } from "clsx";
import { Plus, Eye, EyeOff, Star, Pencil } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PropertyPhoto } from "@/components/property/PropertyPhoto";
import { listProperties, type PublishFilter } from "@/lib/admin/queries";
import { KIND_LABELS, LEGACY_KIND_LABELS, STATUS_LABELS } from "@/lib/admin/labels";
import { formatPrice } from "@/lib/format";
import { setPublished, setFeatured } from "./actions";

export const metadata: Metadata = {
  title: "Imóveis",
  robots: { index: false, follow: false },
};

const TABS: { value: PublishFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "published", label: "Publicados" },
  { value: "draft", label: "Ocultos" },
];

interface AdminImoveisPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminImoveisPage({ searchParams }: AdminImoveisPageProps) {
  const { status } = await searchParams;
  const filter: PublishFilter = status === "published" || status === "draft" ? status : "all";
  const properties = await listProperties(filter);

  return (
    <Container className="py-8">
      <div className="flex justify-between items-baseline mb-6">
        <h1
          className="text-text-1"
          style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
        >
          Imóveis
        </h1>
        <Button href="/admin/imoveis/novo" icon={<Plus className="w-4 h-4" />}>
          Novo imóvel
        </Button>
      </div>

      <div className="inline-flex bg-bg-page border border-border-1 rounded-pill p-1 gap-1 mb-6 font-display">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/admin/imoveis" : `/admin/imoveis?status=${tab.value}`}
            className={clsx(
              "block px-4 py-1.5 rounded-pill no-underline transition-colors duration-150 ease-out",
              filter === tab.value ? "bg-brand-primary text-white" : "text-text-2 hover:text-text-1"
            )}
            style={{ font: "var(--text-label)" }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-2 py-20 px-8 bg-bg-surface border border-border-1 rounded-lg">
          <p className="text-text-1" style={{ font: "var(--text-body-md)" }}>
            Nenhum imóvel encontrado.
          </p>
        </div>
      ) : (
        <div className="pg-grid grid gap-[13.6px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {properties.map((property) => (
            <div
              key={property.id}
              className="pg-card flex flex-col bg-bg-surface border border-border-1 rounded-lg overflow-hidden"
            >
              <div className="relative w-full aspect-[4/3] bg-bg-sunken">
                <PropertyPhoto
                  src={property.coverImage}
                  alt={property.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  iconClassName="w-6 h-6"
                />
                <div className="absolute top-3 left-3">
                  <Badge tone={property.purpose === "locacao" ? "locacao" : "venda"}>
                    {property.purpose === "locacao" ? "Locação" : "Venda"}
                  </Badge>
                </div>
              </div>

              <div className="pg-card-body flex flex-col p-[13.6px] gap-[6.8px]">
                <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
                  {property.kind === "outros" && property.kind_other
                    ? property.kind_other
                    : (KIND_LABELS[property.kind] ?? LEGACY_KIND_LABELS[property.kind])}{" "}
                  · Ref.: {property.ref}
                </span>
                <div className="text-text-1 font-semibold truncate" style={{ font: "var(--text-body-md)" }}>
                  {property.title}
                </div>
                <div className="flex items-center gap-1 min-w-0" style={{ font: "var(--text-body-sm)" }}>
                  <span className="text-text-2 truncate min-w-0">
                    {property.neighborhood}
                  </span>
                  <span className="text-text-2 shrink-0">· {STATUS_LABELS[property.status]}</span>
                </div>
                <div className="text-text-1" style={{ font: "var(--text-price)", fontSize: 18 }}>
                  {formatPrice(Number(property.price), property.purpose)}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <form action={setFeatured.bind(null, property.id, !property.featured)}>
                    <button
                      type="submit"
                      title={property.featured ? "Remover destaque" : "Destacar na home"}
                      className={clsx(
                        "flex items-center justify-center w-9 h-9 rounded-md border transition-colors duration-150 ease-out cursor-pointer",
                        property.featured
                          ? "bg-amber-100 border-amber-500 text-amber-500"
                          : "bg-transparent border-border-2 text-text-3 hover:text-text-1"
                      )}
                    >
                      <Star className="w-4 h-4" fill={property.featured ? "currentColor" : "none"} />
                    </button>
                  </form>

                  <form action={setPublished.bind(null, property.id, !property.published)}>
                    <button
                      type="submit"
                      className={clsx(
                        "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 cursor-pointer transition-colors duration-150 ease-out",
                        property.published
                          ? "bg-status-success-bg text-status-success-fg border-transparent hover:opacity-80"
                          : "bg-status-warning-bg text-status-warning-fg border-transparent hover:opacity-80"
                      )}
                      style={{ font: "var(--text-body-sm)" }}
                    >
                      {property.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {property.published ? "Visível" : "Oculto"}
                    </button>
                  </form>

                  <Button
                    href={`/admin/imoveis/${property.id}`}
                    variant="outline"
                    size="sm"
                    icon={<Pencil className="w-3.5 h-3.5" />}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
