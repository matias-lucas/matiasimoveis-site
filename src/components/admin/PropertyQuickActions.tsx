"use client";

import { useTransition } from "react";
import { clsx } from "clsx";
import { Star, Eye, EyeOff } from "lucide-react";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";

interface PropertyQuickActionsProps {
  featured: boolean;
  published: boolean;
  title: string;
  onToggleFeatured: () => Promise<void>;
  onTogglePublished: () => Promise<void>;
  onDelete: () => Promise<void>;
}

/** Destacar/Publicar/Excluir as direct server-action calls (no <form>) —
 *  this renders inside PropertyForm's own <form>, and nested <form>
 *  elements are invalid HTML and break hydration. Same pattern as
 *  DeletePropertyButton. */
export function PropertyQuickActions({
  featured,
  published,
  title,
  onToggleFeatured,
  onTogglePublished,
  onDelete,
}: PropertyQuickActionsProps) {
  const [featuredPending, startFeaturedTransition] = useTransition();
  const [publishedPending, startPublishedTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={featuredPending}
        title={featured ? "Remover destaque" : "Destacar na home"}
        onClick={() => startFeaturedTransition(() => onToggleFeatured())}
        className={clsx(
          "flex items-center justify-center w-11 h-11 rounded-md border transition-colors duration-150 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          featured
            ? "bg-amber-100 border-amber-500 text-amber-500"
            : "bg-transparent border-border-2 text-text-3 hover:text-text-1"
        )}
      >
        <Star className="w-4 h-4" fill={featured ? "currentColor" : "none"} />
      </button>

      <button
        type="button"
        disabled={publishedPending}
        onClick={() => startPublishedTransition(() => onTogglePublished())}
        className={clsx(
          "flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-md border border-transparent cursor-pointer transition-colors duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed",
          published
            ? "bg-status-success-bg text-status-success-fg hover:opacity-80"
            : "bg-status-warning-bg text-status-warning-fg hover:opacity-80"
        )}
        style={{ font: "var(--text-body-sm)" }}
      >
        {published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        {published ? "Visível" : "Oculto"}
      </button>

      <DeletePropertyButton action={onDelete} title={title} />
    </div>
  );
}
