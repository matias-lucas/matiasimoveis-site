import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BrokerForm } from "@/components/admin/BrokerForm";
import { createBroker } from "../actions";

export const metadata: Metadata = {
  title: "Novo corretor",
  robots: { index: false, follow: false },
};

export default function NewBrokerPage() {
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

      <h1
        className="text-text-1 mb-6"
        style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
      >
        Novo corretor
      </h1>

      <BrokerForm action={createBroker} submitLabel="Salvar corretor" />
    </Container>
  );
}
