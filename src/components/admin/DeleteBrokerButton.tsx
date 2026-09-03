"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

interface DeleteBrokerButtonProps {
  action: () => Promise<void>;
  name: string;
  className?: string;
  /** Renders just the trash icon (no "Excluir" label) — for tight spaces like
   *  a hover-revealed corner action cluster on a card. */
  iconOnly?: boolean;
}

export function DeleteBrokerButton({ action, name, className, iconOnly = false }: DeleteBrokerButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={iconOnly ? "flex flex-col items-end gap-1.5 relative" : "flex flex-col items-end gap-1.5"}>
      <button
        type="button"
        disabled={pending}
        aria-label="Excluir"
        onClick={() => {
          if (!window.confirm(`Excluir "${name}"? Essa ação não pode ser desfeita.`)) return;
          setError(null);
          startTransition(() => {
            action().catch((e) => setError(e instanceof Error ? e.message : "Falha ao excluir."));
          });
        }}
        className={
          className ??
          (iconOnly
            ? "inline-flex items-center justify-center w-7 h-7 text-text-2 bg-bg-surface border border-border-1 rounded-md cursor-pointer transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            : "inline-flex items-center gap-1.5 text-red-600 bg-transparent border border-border-2 rounded-md px-3 py-2 cursor-pointer transition-colors duration-150 ease-out hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed")
        }
        style={{ font: "var(--text-body-sm)" }}
      >
        <Trash2 className="w-3.5 h-3.5" />
        {!iconOnly && "Excluir"}
      </button>
      {error && (
        <p
          className={
            iconOnly
              ? "absolute top-full right-0 mt-1 w-max max-w-[200px] text-red-600 text-right bg-bg-surface border border-border-1 rounded-md px-2 py-1 shadow-md z-10"
              : "text-red-600 text-right max-w-[240px]"
          }
          style={{ font: "var(--text-caption)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
