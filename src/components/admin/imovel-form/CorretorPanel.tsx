import Link from "next/link";
import { Select } from "@/components/ui/Select";
import type { CorretorRow } from "@/lib/admin/queries";
import { FormField } from "./FormField";

interface CorretorPanelProps {
  corretores: CorretorRow[];
  defaultCorretorId?: string;
}

/** Aba "Corretor responsável" do ImovelForm — só relevante para imóveis de venda. */
export function CorretorPanel({ corretores, defaultCorretorId }: CorretorPanelProps) {
  if (corretores.length === 0) {
    return (
      <p className="text-text-3" style={{ font: "var(--text-body-sm)" }}>
        Nenhum corretor cadastrado ainda.{" "}
        <Link href="/admin/corretores/novo" className="text-brand-primary">
          Cadastre um corretor
        </Link>{" "}
        para poder atribuí-lo a imóveis de venda.
      </p>
    );
  }

  return (
    <FormField>
      <Select
        label="Corretor responsável"
        name="corretorId"
        placeholder="Selecione um corretor"
        defaultValue={defaultCorretorId ?? ""}
        options={corretores.map((c) => ({ value: c.id, label: `${c.name} · ${c.creci}` }))}
      />
      <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
        Em imóveis de venda, o cliente entra em contato diretamente com este corretor.
      </span>
    </FormField>
  );
}
