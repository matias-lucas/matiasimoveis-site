import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { BrokerRow } from "@/lib/admin/queries";

interface BrokerFormProps {
  broker?: BrokerRow;
  action: (formData: FormData) => void;
  submitLabel: string;
}

export function BrokerForm({ broker, action, submitLabel }: BrokerFormProps) {
  return (
    <form action={action} className="flex flex-col gap-5 bg-bg-surface border border-border-1 rounded-lg p-7">
      <input type="hidden" name="photoPath" value={broker?.photo_path ?? ""} />
      <Input label="Nome" name="name" defaultValue={broker?.name} required />
      <Input label="CRECI" name="creci" placeholder="Ex.: CRECI-GO 9155" defaultValue={broker?.creci} required />
      <div className="flex flex-col gap-1.5">
        <Input
          label="Contato"
          name="contact"
          placeholder="Ex.: (62) 9 9999-9999"
          defaultValue={broker?.contact}
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
