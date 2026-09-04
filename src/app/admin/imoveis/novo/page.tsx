import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImovelForm } from "@/components/admin/imovel-form";
import { listCorretores } from "@/lib/admin/queries";
import { createImovel } from "../actions/imoveis";

export const metadata: Metadata = {
  title: "Novo imóvel",
  robots: { index: false, follow: false },
};

export default async function NewImovelPage() {
  const corretores = await listCorretores();

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

      <h1
        className="text-text-1 mb-2"
        style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
      >
        Novo imóvel
      </h1>
      <p className="text-text-2 mb-6" style={{ font: "var(--text-body-sm)" }}>
        Salve os dados básicos primeiro — as fotos são adicionadas na tela seguinte. O imóvel fica
        como rascunho até você publicá-lo na lista.
      </p>

      <ImovelForm corretores={corretores} action={createImovel} submitLabel="Salvar e continuar" />
    </div>
  );
}
