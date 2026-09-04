"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { buildWhatsAppUrl, contactInquiryMessage } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().trim().min(2, "Conte seu nome."),
  email: z.email("Informe um e-mail válido."),
  message: z.string().trim().min(5, "Escreva sua mensagem."),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    const message = contactInquiryMessage(values);
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-bg-surface border border-border-1 rounded-lg p-7 self-start"
      noValidate
    >
      <div>
        <Input label="Nome" placeholder="Seu nome" {...register("name")} />
        {errors.name && <FieldError message={errors.name.message} className="mt-1" />}
      </div>
      <div>
        <Input label="E-mail" placeholder="voce@email.com" {...register("email")} />
        {errors.email && <FieldError message={errors.email.message} className="mt-1" />}
      </div>
      <div>
        <Textarea label="Mensagem" rows={4} placeholder="Como podemos ajudar?" {...register("message")} />
        {errors.message && <FieldError message={errors.message.message} className="mt-1" />}
      </div>
      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
        Enviar mensagem
      </Button>
    </form>
  );
}
