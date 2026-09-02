import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import { getPropertyById, listBrokers } from "@/lib/admin/queries";
import { updateProperty, setPublished, deleteProperty } from "../actions";

export const metadata: Metadata = {
  title: "Editar imóvel",
  robots: { index: false, follow: false },
};

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const [property, brokers] = await Promise.all([getPropertyById(id), listBrokers()]);
  if (!property) notFound();

  return (
    <div className="max-w-[820px] mx-auto px-8 py-8">
      <Link
        href="/admin/imoveis"
        className="inline-flex items-center gap-1.5 text-text-2 no-underline mb-4 hover:text-text-1 transition-colors duration-150 ease-out"
        style={{ font: "var(--text-body-sm)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a lista
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge tone={property.published ? "success" : "warning"}>
              {property.published ? "Publicado" : "Rascunho"}
            </Badge>
            <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
              Ref.: {property.ref}
            </span>
          </div>
          <h1
            className="text-text-1"
            style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
          >
            {property.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {property.published && (
            <Link
              href={`/imovel/${property.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-1 bg-transparent border border-border-2 rounded-md px-3 py-2 no-underline transition-colors duration-150 ease-out hover:bg-bg-sunken"
              style={{ font: "var(--text-body-sm)" }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Pré-visualizar
            </Link>
          )}
          <form action={setPublished.bind(null, property.id, !property.published)}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md border border-transparent px-3 py-2 cursor-pointer transition-colors duration-150 ease-out bg-brand-secondary text-white hover:bg-brand-secondary-hover"
              style={{ font: "var(--text-body-sm)" }}
            >
              {property.published ? "Despublicar" : "Publicar"}
            </button>
          </form>
          <DeletePropertyButton action={deleteProperty.bind(null, property.id)} title={property.title} />
        </div>
      </div>

      <PropertyForm
        property={property}
        brokers={brokers}
        photoManager={
          <PhotoManager propertyId={property.id} propertyTitle={property.title} initialPhotos={property.photos} />
        }
        action={updateProperty.bind(null, property.id)}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
