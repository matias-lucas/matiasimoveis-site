import type { Metadata } from "next";
import { Plus, Pencil } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { DeleteBrokerButton } from "@/components/admin/DeleteBrokerButton";
import { listBrokers } from "@/lib/admin/queries";
import { deleteBroker } from "./actions";

export const metadata: Metadata = {
  title: "Corretores",
  robots: { index: false, follow: false },
};

export default async function AdminCorretoresPage() {
  const brokers = await listBrokers();

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

      {brokers.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-2 py-20 px-8 bg-bg-surface border border-border-1 rounded-lg">
          <p className="text-text-1" style={{ font: "var(--text-body-md)" }}>
            Nenhum corretor cadastrado.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {brokers.map((broker) => (
            <div
              key={broker.id}
              className="flex items-center gap-4 bg-bg-surface border border-border-1 rounded-lg p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="text-text-1 font-semibold truncate" style={{ font: "var(--text-body-md)" }}>
                  {broker.name}
                </div>
                <div className="text-text-2 truncate" style={{ font: "var(--text-body-sm)" }}>
                  {broker.creci} · {broker.contact}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  href={`/admin/corretores/${broker.id}`}
                  variant="outline"
                  size="sm"
                  icon={<Pencil className="w-3.5 h-3.5" />}
                >
                  Editar
                </Button>
                <DeleteBrokerButton action={deleteBroker.bind(null, broker.id)} name={broker.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
