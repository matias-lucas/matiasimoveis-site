import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BrokerForm } from "@/components/admin/BrokerForm";
import { DeleteBrokerButton } from "@/components/admin/DeleteBrokerButton";
import { getBrokerById } from "@/lib/admin/queries";
import { updateBroker, deleteBroker } from "../actions";

export const metadata: Metadata = {
  title: "Editar corretor",
  robots: { index: false, follow: false },
};

interface EditBrokerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBrokerPage({ params }: EditBrokerPageProps) {
  const { id } = await params;
  const broker = await getBrokerById(id);
  if (!broker) notFound();

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
          {broker.name}
        </h1>
        <DeleteBrokerButton action={deleteBroker.bind(null, broker.id)} name={broker.name} />
      </div>

      <BrokerForm broker={broker} action={updateBroker.bind(null, broker.id)} submitLabel="Salvar alterações" />
    </Container>
  );
}
