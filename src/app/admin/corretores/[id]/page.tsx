import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CorretorForm } from "@/components/admin/corretor";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { getCorretorById } from "@/lib/admin/queries";
import { updateCorretor, deleteCorretor } from "../actions";

export const metadata: Metadata = {
  title: "Editar corretor",
  robots: { index: false, follow: false },
};

interface EditCorretorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCorretorPage({ params }: EditCorretorPageProps) {
  const { id } = await params;
  const corretor = await getCorretorById(id);
  if (!corretor) notFound();

  return (
    <Container className="py-8 max-w-[560px]">
      <Link
        href="/admin/corretores"
        className="inline-flex items-center gap-1.5 text-text-2 no-underline mb-4 hover:text-text-1 transition-colors duration-150 ease-out"
        style={{ font: "var(--text-body-sm)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a lista
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1
          className="text-text-1"
          style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
        >
          {corretor.name}
        </h1>
        <ConfirmDeleteButton
          action={deleteCorretor.bind(null, corretor.id)}
          confirmMessage={`Excluir "${corretor.name}"? Essa ação não pode ser desfeita.`}
        />
      </div>

      <CorretorForm corretor={corretor} action={updateCorretor.bind(null, corretor.id)} submitLabel="Salvar alterações" />
    </Container>
  );
}
