import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ImovelForm, PhotoManager, VideoManager, ImovelQuickActions } from "@/components/admin/imovel-form";
import { getImovelById, listCorretores } from "@/lib/admin/queries";
import { updateImovel, setPublished, setFeatured, deleteImovel } from "../actions/imoveis";

export const metadata: Metadata = {
  title: "Editar imóvel",
  robots: { index: false, follow: false },
};

interface EditImovelPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditImovelPage({ params }: EditImovelPageProps) {
  const { id } = await params;
  const [imovel, corretores] = await Promise.all([getImovelById(id), listCorretores()]);
  if (!imovel) notFound();

  return (
    <div className="max-w-[1080px] mx-auto px-8 py-8">
      <Link
        href="/admin/imoveis"
        className="inline-flex items-center gap-1.5 text-text-2 no-underline mb-4 hover:text-text-1 transition-colors duration-150 ease-out"
        style={{ font: "var(--text-body-sm)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge tone={imovel.published ? "success" : "warning"}>
              {imovel.published ? "Visível" : "Oculto"}
            </Badge>
            <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
              Ref.: {imovel.ref}
            </span>
          </div>
          <h1
            className="text-text-1"
            style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
          >
            {imovel.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {imovel.published && (
            <Link
              href={`/imovel/${imovel.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-1 bg-transparent border border-border-2 rounded-md px-3 py-2 no-underline transition-colors duration-150 ease-out hover:bg-bg-sunken"
              style={{ font: "var(--text-body-sm)" }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Pré-visualizar
            </Link>
          )}
        </div>
      </div>

      <ImovelForm
        imovel={imovel}
        corretores={corretores}
        photoManager={
          <PhotoManager imovelId={imovel.id} imovelTitle={imovel.title} initialPhotos={imovel.photos} />
        }
        videoManager={
          <VideoManager imovelId={imovel.id} imovelTitle={imovel.title} initialVideos={imovel.videos} />
        }
        action={updateImovel.bind(null, imovel.id)}
        submitLabel="Salvar alterações"
        quickActions={
          <ImovelQuickActions
            featured={imovel.featured}
            published={imovel.published}
            title={imovel.title}
            onToggleFeatured={setFeatured.bind(null, imovel.id, !imovel.featured)}
            onTogglePublished={setPublished.bind(null, imovel.id, !imovel.published)}
            onDelete={deleteImovel.bind(null, imovel.id)}
          />
        }
      />
    </div>
  );
}
