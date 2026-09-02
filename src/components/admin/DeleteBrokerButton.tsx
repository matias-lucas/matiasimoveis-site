"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

interface DeleteBrokerButtonProps {
  action: () => Promise<void>;
  name: string;
  className?: string;
}

export function DeleteBrokerButton({ action, name, className }: DeleteBrokerButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`Excluir "${name}"? Essa ação não pode ser desfeita.`)) return;
          setError(null);
          startTransition(() => {
            action().catch((e) => setError(e instanceof Error ? e.message : "Falha ao excluir."));
          });
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
      {error && (
        <p className="text-red-600 text-right max-w-[240px]" style={{ font: "var(--text-caption)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
