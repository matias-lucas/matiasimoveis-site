import { clsx } from "clsx";

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className={clsx("text-red-600", className)} style={{ font: "var(--text-caption)" }}>
      {message}
    </p>
  );
}
