"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { USERNAME_PATTERN, usernameToEmail } from "@/lib/admin/auth";

const schema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(USERNAME_PATTERN, "Use de 3 a 32 letras, números, ponto, traço ou underline."),
  password: z.string().min(1, "Informe a senha."),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(values.username),
      password: values.password,
    });

    if (error) {
      setFormError("Usuário ou senha inválidos.");
      return;
    }

    router.push("/admin/imoveis");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-bg-surface border border-border-1 rounded-lg shadow-md p-7 w-full max-w-[380px]"
      noValidate
    >
      <div>
        <Input label="Usuário" placeholder="divino" autoCapitalize="none" autoCorrect="off" {...register("username")} />
        {errors.username && <FieldError message={errors.username.message} />}
      </div>
      <div>
        <Input label="Senha" type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <FieldError message={errors.password.message} />}
      </div>

      {formError && <FieldError message={formError} />}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        icon={<LogIn className="w-4 h-4" />}
        className="justify-center mt-2"
      >
        Entrar
      </Button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-red-600" style={{ font: "var(--text-caption)" }}>
      {message}
    </p>
  );
}
