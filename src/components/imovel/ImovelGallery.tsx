"use client";

import { useState } from "react";
import { ImovelPhoto } from "./ImovelPhoto";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { ImovelPhotoRecord } from "@/lib/types";

interface ImovelGalleryProps {
  photos: ImovelPhotoRecord[];
  coverImage?: string;
  title: string;
}

// Galeria da ficha do imóvel: foto grande + até 4 miniaturas clicáveis,
// abrindo um lightbox (Dialog + Carousel) posicionado na foto clicada. Sem
// fotos reais, ImovelPhoto já cai para o estado "Foto em breve" sozinho — a
// galeria não precisa de um caso especial pra isso.
export function ImovelGallery({ photos, coverImage, title }: ImovelGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const others = photos.filter((p) => !p.isCover).slice(0, 4);
  const allSlides = [
    { url: coverImage, alt: title },
    ...others.map((p) => ({ url: p.url, alt: p.alt || title })),
  ];

  return (
    <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
      <button
        type="button"
        onClick={() => coverImage && setOpenIndex(0)}
        className="relative h-[380px] w-full bg-bg-sunken rounded-lg overflow-hidden mb-3 block"
        aria-label="Ampliar foto"
      >
        <ImovelPhoto
          src={coverImage}
          alt={title}
          iconClassName="w-12 h-12"
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
        />
      </button>
      <div className="flex gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => {
          const thumb = others[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => thumb && setOpenIndex(i + 1)}
              className="relative flex-1 h-[72px] bg-bg-sunken rounded-sm overflow-hidden block"
              aria-label={thumb ? `Ver foto ${i + 2}` : undefined}
              disabled={!thumb}
            >
              <ImovelPhoto src={thumb?.url} alt={thumb?.alt || title} iconClassName="w-5 h-5" />
            </button>
          );
        })}
      </div>

      <DialogContent className="sm:max-w-4xl bg-transparent border-none shadow-none p-0">
        {/* Nome acessível do lightbox pra leitor de tela — sem isso o Dialog
            abre sem título anunciado. Visualmente oculto, não afeta o layout
            (a galeria já mostra as fotos, não precisa de um heading visível
            aqui). Auditoria estática da Etapa 8. */}
        <DialogTitle className="sr-only">Fotos: {title}</DialogTitle>
        <Carousel opts={{ startIndex: openIndex ?? 0 }}>
          <CarouselContent>
            {allSlides.map((slide, i) => (
              <CarouselItem key={i}>
                <div className="relative aspect-[4/3] bg-bg-sunken rounded-lg overflow-hidden">
                  <ImovelPhoto src={slide.url} alt={slide.alt} sizes="90vw" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
