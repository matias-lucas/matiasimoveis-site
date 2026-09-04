import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CorretorRow } from "@/lib/admin/queries";

interface CorretorFormProps {
  corretor?: CorretorRow;
  action: (formData: FormData) => void;
  submitLabel: string;
}

export function CorretorForm({ corretor, action, submitLabel }: CorretorFormProps) {
  return (
    <form action={action} className="flex flex-col gap-5 bg-bg-surface border border-border-1 rounded-lg p-7">
      <input type="hidden" name="photoPath" value={corretor?.photo_path ?? ""} />
      <Input label="Nome" name="name" defaultValue={corretor?.name} required />
      <Input label="CRECI" name="creci" placeholder="Ex.: CRECI-GO 9155" defaultValue={corretor?.creci} required />
      <div className="flex flex-col gap-1.5">
        <Input
          label="Contato"
          name="contact"
          placeholder="Ex.: (62) 9 9999-9999"
          defaultValue={corretor?.contact}
          required
        />
        <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
          Telefone/WhatsApp usado pelo cliente para falar direto com o corretor em imóveis de venda.
        </span>
      </div>

      <Button type="submit" size="lg" className="self-start mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
