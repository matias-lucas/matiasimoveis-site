"use client";

import { useState, type MouseEvent } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Salvar do ImovelForm. Fica desabilitado enquanto a action roda (dois cliques
 * não criam dois imóveis) e, no cadastro, segura o envio enquanto uma foto ou
 * vídeo ainda está subindo — o PhotoManager/VideoManager em modo draft marcam
 * isso com [data-media-uploading]; sem a trava, o arquivo ficava de fora.
 */
export function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const [waitingUpload, setWaitingUpload] = useState(false);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const uploading = Boolean(event.currentTarget.form?.querySelector("[data-media-uploading]"));
    setWaitingUpload(uploading);
    if (uploading) event.preventDefault();
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending}
        onClick={handleClick}
        icon={pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
      >
        {pending ? "Salvando…" : label}
      </Button>
      {waitingUpload && (
        <p role="alert" className="text-status-warning-fg" style={{ font: "var(--text-caption)" }}>
          Aguarde: ainda há fotos ou vídeos sendo enviados (aba Anúncio).
        </p>
      )}
    </div>
  );
}
