import type { ReactNode } from "react";
import { clsx } from "clsx";

interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

/** Empilha label + controle com o espaçamento padrão usado no ImovelForm. */
export function FormField({ children, className }: FormFieldProps) {
  return <div className={clsx("flex flex-col gap-1.5", className)}>{children}</div>;
}

/** Título de subseção dentro de uma aba do ImovelForm (ex.: "Localização", "Situação"). */
export function SubLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-text-2 mt-1" style={{ font: "var(--text-label)" }}>
      {children}
    </h3>
  );
}
