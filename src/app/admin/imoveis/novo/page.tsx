import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { listBrokers } from "@/lib/admin/queries";
import { createProperty } from "../actions";

export const metadata: Metadata = {
  title: "Novo imóvel",
  robots: { index: false, follow: false },
};

export default async function NewPropertyPage() {
  const brokers = await listBrokers();

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

      <PropertyForm brokers={brokers} action={createProperty} submitLabel="Salvar e continuar" />
    </div>
  );
}
