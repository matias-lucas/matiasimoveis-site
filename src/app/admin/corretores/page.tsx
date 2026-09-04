import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { CorretorCard } from "@/components/admin/corretor";
import { listCorretores } from "@/lib/admin/queries";
import { updateCorretor, deleteCorretor } from "./actions";

export const metadata: Metadata = {
  title: "Corretores",
  robots: { index: false, follow: false },
};

export default async function AdminCorretoresPage() {
  const corretores = await listCorretores();

  return (
    <Container className="py-8">
      <div className="flex justify-between items-baseline mb-6">
        <h1
          className="text-text-1"
          style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
        >
          Corretores
        </h1>
        <Button href="/admin/corretores/novo" icon={<Plus className="w-4 h-4" />}>
          Novo corretor
        </Button>
      </div>

      {corretores.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-2 py-20 px-8 bg-bg-surface border border-border-1 rounded-lg">
          <p className="text-text-1" style={{ font: "var(--text-body-md)" }}>
            Nenhum corretor cadastrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {corretores.map((corretor) => (
            <CorretorCard
              key={corretor.id}
              corretor={corretor}
              updateAction={updateCorretor.bind(null, corretor.id)}
              deleteAction={deleteCorretor.bind(null, corretor.id)}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
