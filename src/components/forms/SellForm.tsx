"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl, sellInquiryMessage } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().trim().min(2, "Conte seu nome completo."),
  phone: z.string().trim().min(8, "Informe um telefone válido."),
  purpose: z.string().min(1, "Escolha uma opção."),
  kind: z.string().min(1, "Escolha uma opção."),
  neighborhood: z.string().trim().min(2, "Informe o bairro."),
  askingPrice: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

const PURPOSE_OPTIONS = [
  { value: "Vender", label: "Vender" },
  { value: "Alugar", label: "Alugar" },
];

const KIND_OPTIONS = [
  { value: "Casa", label: "Casa" },
  { value: "Kitnet", label: "Kitnet" },
  { value: "Apartamento", label: "Apartamento" },
  { value: "Sala comercial", label: "Sala comercial" },
  { value: "Galpão", label: "Galpão" },
  { value: "Lote", label: "Lote" },
  { value: "Outros", label: "Outros" },
];

export function SellForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    const message = sellInquiryMessage({ ...values, askingPrice: values.askingPrice ?? "" });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-bg-surface border border-border-1 rounded-lg p-7"
      noValidate
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input label="Nome completo" placeholder="Seu nome" {...register("name")} />
          {errors.name && <FieldError message={errors.name.message} />}
        </div>
        <div>
          <Input
            label="Telefone / WhatsApp"
            placeholder="(62) 90000-0000"
            {...register("phone")}
          />
          {errors.phone && <FieldError message={errors.phone.message} />}
        </div>
      </div>

      <div>
        <Select
          label="Finalidade"
          placeholder="Escolha"
          options={PURPOSE_OPTIONS}
          {...register("purpose")}
        />
        {errors.purpose && <FieldError message={errors.purpose.message} />}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            label="Tipo de imóvel"
            placeholder="Escolha"
            options={KIND_OPTIONS}
            {...register("kind")}
          />
          {errors.kind && <FieldError message={errors.kind.message} />}
        </div>
        <div>
          <Input label="Bairro" placeholder="Ex.: Setor Sul" {...register("neighborhood")} />
          {errors.neighborhood && <FieldError message={errors.neighborhood.message} />}
        </div>
      </div>

      <Input label="Valor pretendido" placeholder="R$" {...register("askingPrice")} />

      <Button type="submit" variant="whatsapp" size="lg" disabled={isSubmitting} className="self-start mt-2">
        Falar no WhatsApp
      </Button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-red-600 mt-1" style={{ font: "var(--text-caption)" }}>
      {message}
    </p>
  );
}
