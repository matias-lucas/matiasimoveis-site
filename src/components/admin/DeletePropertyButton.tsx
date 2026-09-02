"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

interface DeletePropertyButtonProps {
  action: () => Promise<void>;
  title: string;
  className?: string;
}

export function DeletePropertyButton({ action, title, className }: DeletePropertyButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Excluir "${title}"? Essa ação não pode ser desfeita.`)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className={
        className ??
        "inline-flex items-center gap-1.5 text-red-600 bg-transparent border border-border-2 rounded-md px-3 py-2 cursor-pointer transition-colors duration-150 ease-out hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
      }
      style={{ font: "var(--text-body-sm)" }}
    >
      <Trash2 className="w-3.5 h-3.5" />
      Excluir
    </button>
  );
}
