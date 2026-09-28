import type { ReactNode } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "./FormField";

interface AnnouncementPanelProps {
  /** Na edição grava na hora; no cadastro vem em modo `draft` (ver
   *  lib/admin/draft-media.ts). */
  photoManager?: ReactNode;
  /** Idem, para vídeos. */
  videoManager?: ReactNode;
  description?: string;
}

/** Aba "Anúncio" do ImovelForm: fotos, vídeos e a descrição pública do imóvel. */
export function AnnouncementPanel({ photoManager, videoManager, description }: AnnouncementPanelProps) {
  return (
    <>
      {photoManager}
      {videoManager}

      <FormField>
        <Textarea
          label="Descrição"
          name="description"
          rows={4}
          placeholder="Descreva o imóvel: cômodos, localização, diferenciais…"
          defaultValue={description}
        />
      </FormField>
    </>
  );
}
