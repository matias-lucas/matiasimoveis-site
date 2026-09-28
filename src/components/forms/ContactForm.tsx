"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { buildWhatsAppUrl, contactInquiryMessage, openWhatsApp } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().trim().min(2, "Conte seu nome."),
  // Opcional: a mensagem vai pelo WhatsApp, o e-mail é só um contato extra.
  email: z.union([z.literal(""), z.email("Informe um e-mail válido.")]).optional(),
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
    openWhatsApp(buildWhatsAppUrl(message));
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-bg-surface border border-border-1 rounded-lg p-7 self-start"
      noValidate
    >
      <div>
        <Input label="Nome" placeholder="Seu nome" autoComplete="name" {...register("name")} />
        {errors.name && <FieldError message={errors.name.message} className="mt-1" />}
      </div>
      <div>
        <Input label="E-mail (opcional)" type="email" placeholder="voce@email.com" autoComplete="email" {...register("email")} />
        {errors.email && <FieldError message={errors.email.message} className="mt-1" />}
      </div>
      <div>
        <Textarea label="Mensagem" rows={4} placeholder="Como podemos ajudar?" {...register("message")} />
        {errors.message && <FieldError message={errors.message.message} className="mt-1" />}
      </div>
      <PrivacyNotice />
      <Button type="submit" variant="whatsapp" size="lg" disabled={isSubmitting} className="w-full">
        Enviar pelo WhatsApp
      </Button>
    </form>
  );
}
