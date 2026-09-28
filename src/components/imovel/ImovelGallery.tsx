/// <reference types="react/canary" />
"use client";

import { useEffect, useRef, useState, ViewTransition, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { clsx } from "clsx";
import { ImovelPhoto } from "./ImovelPhoto";
import { ImovelVideo } from "./ImovelVideo";
import { aspectOf } from "@/lib/media";
import type { ImovelKind, ImovelPhotoRecord, ImovelPurpose, ImovelVideoRecord } from "@/lib/types";

// Mídias antigas, sem tamanho gravado: começam com a proporção mais comum e
// são corrigidas assim que o navegador lê o arquivo.
const PHOTO_FALLBACK_ASPECT = 4 / 3;
const VIDEO_FALLBACK_ASPECT = 16 / 9;
const GAP_PX = 6;

interface ImovelGalleryProps {
  slug: string;
  title: string;
  kind: ImovelKind;
  purpose: ImovelPurpose;
  photos: ImovelPhotoRecord[];
  /** Vídeos que entram na fileira (o vídeo em pé de destaque fica fora, ao lado das informações). */
  videos: ImovelVideoRecord[];
  /** "destaque": faixa grande no topo da ficha. "miniaturas": fileira menor ao lado do vídeo em pé. */
  variant: "destaque" | "miniaturas";
}

type Item =
  | { type: "video"; key: string; video: ImovelVideoRecord }
  | { type: "photo"; key: string; photo: ImovelPhotoRecord; index: number };

/** A capa do card "vira" a primeira foto da ficha (View Transition). */
function Morph({ name, enabled, children }: { name: string; enabled: boolean; children: ReactNode }) {
  if (!enabled) return <>{children}</>;
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

/**
 * Fotos e vídeos da ficha, lado a lado e com a mesma altura, cada um na
 * proporção do arquivo enviado: nada esticado, cortado ou com tarja. O vídeo
 * vem primeiro, com play no meio. Antes (até 28/09) tudo entrava num quadro
 * fixo: a foto quadrada do imóvel 740 aparecia esticada e o vídeo em pé
 * ganhava faixas pretas. A altura é calculada em CSS (.midia-row em
 * globals.css, com container query), então não há "pulo" ao carregar.
 */
export function ImovelGallery({ slug, title, kind, purpose, photos, videos, variant }: ImovelGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [scroll, setScroll] = useState({ prev: false, next: false });
  const count = photos.length;

  const items: Item[] = [
    ...videos.map((video) => ({ type: "video" as const, key: `v-${video.id}`, video })),
    ...photos.map((photo, index) => ({ type: "photo" as const, key: `p-${photo.id}`, photo, index })),
  ];
  const aspectOfItem = (item: Item) =>
    aspects[item.key] ??
    (item.type === "video" ? aspectOf(item.video, VIDEO_FALLBACK_ASPECT) : aspectOf(item.photo, PHOTO_FALLBACK_ASPECT));
  const itemAspects = items.map(aspectOfItem);
  const rowStyle = {
    "--max-ar": Math.max(...itemAspects, 0.1),
    "--sum-ar": itemAspects.reduce((a, b) => a + b, 0) || 1,
    "--gaps": `${Math.max(0, items.length - 1) * GAP_PX}px`,
  } as CSSProperties;

  function learnAspect(key: string, aspect: number) {
    setAspects((prev) => (Math.abs((prev[key] ?? 0) - aspect) < 0.01 ? prev : { ...prev, [key]: aspect }));
  }

  function open(index: number) {
    setCurrent(index);
    dialogRef.current?.showModal();
    requestAnimationFrame(() => {
      const track = trackRef.current;
      if (track) track.scrollTo({ left: index * track.clientWidth, behavior: "instant" as ScrollBehavior });
    });
  }

  function go(delta: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(count - 1, current + delta));
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  }

  function scrollRow(direction: 1 | -1) {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  }

  // Índice do lightbox derivado da rolagem (swipe, setas e teclado).
  useEffect(() => {
    const track = trackRef.current;
    const onTrack = () => track && setCurrent(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
    track?.addEventListener("scroll", onTrack, { passive: true });
    return () => track?.removeEventListener("scroll", onTrack);
  }, []);

  // Setas da fileira só quando há o que rolar para aquele lado.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () =>
      setScroll({ prev: row.scrollLeft > 4, next: row.scrollLeft + row.clientWidth < row.scrollWidth - 4 });
    update();
    row.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="relative aspect-[4/3] lg:aspect-[16/9] rounded-2xl overflow-hidden">
        <ViewTransition name={`imovel-photo-${slug}`} share="morph" default="none">
          <div className="absolute inset-0">
            <ImovelPhoto alt={title} kind={kind} />
          </div>
        </ViewTransition>
      </div>
    );
  }

  const destaque = variant === "destaque";

  return (
    <>
      <div className={clsx("midia-wrap relative", destaque && "-mx-4 sm:mx-0")}>
        <div
          ref={rowRef}
          className={clsx(
            "midia-row snap-row flex overflow-x-auto",
            // Poucas mídias no desktop: a faixa fica centralizada, sem sobra de um lado só.
            destaque ? "[justify-content:safe_center]" : "midia-row--mini"
          )}
          style={{ ...rowStyle, gap: GAP_PX }}
        >
          {items.map((item, i) => {
            const style = { "--ar": itemAspects[i] } as CSSProperties;
            const rounded = destaque ? "sm:rounded-xl" : "rounded-lg";
            if (item.type === "video") {
              return (
                <ImovelVideo
                  key={item.key}
                  video={item.video}
                  title={title}
                  size={destaque ? "lg" : "sm"}
                  purpose={purpose}
                  className={clsx("midia-item", rounded)}
                  style={style}
                  onAspect={(aspect) => learnAspect(item.key, aspect)}
                />
              );
            }
            const { photo, index } = item;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => open(index)}
                className={clsx("midia-item relative overflow-hidden bg-bg-sunken", rounded)}
                style={style}
                aria-label={`Ampliar foto ${index + 1} de ${count}`}
              >
                <Morph name={`imovel-photo-${slug}`} enabled={index === 0}>
                  <div className="absolute inset-0">
                    <Image
                      src={photo.url}
                      alt={photo.alt || title}
                      fill
                      preload={destaque && i === 0}
                      sizes={destaque ? "(min-width: 1024px) 60vw, 100vw" : "260px"}
                      className="object-cover transition-transform duration-300 ease-out hover:scale-[1.02]"
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (!photo.width && img.naturalWidth && img.naturalHeight) {
                          learnAspect(item.key, img.naturalWidth / img.naturalHeight);
                        }
                      }}
                    />
                  </div>
                </Morph>
              </button>
            );
          })}
        </div>

        {(["prev", "next"] as const).map((side) =>
          scroll[side] ? (
            <button
              key={side}
              type="button"
              onClick={() => scrollRow(side === "prev" ? -1 : 1)}
              aria-label={side === "prev" ? "Voltar" : "Ver mais"}
              className={clsx(
                "hidden lg:flex absolute top-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-lg hover:bg-white",
                destaque ? "w-12 h-12" : "w-10 h-10",
                side === "prev" ? "left-3" : "right-3"
              )}
            >
              {side === "prev" ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          ) : null
        )}
      </div>

      {count > 1 && (
        <button
          type="button"
          onClick={() => open(0)}
          className="inline-flex items-center gap-2 mt-3 h-11 px-4 rounded-md border border-border-2 bg-bg-surface text-text-1 hover:border-text-1"
          style={{ font: "600 15px/1 var(--font-display)" }}
        >
          <Images className="w-4 h-4" aria-hidden />
          Ver as {count} fotos
        </button>
      )}

      {count > 0 && (
        <dialog
          ref={dialogRef}
          aria-label={`Fotos: ${title}`}
          className="lightbox m-0 w-screen h-dvh max-w-none max-h-none bg-black text-white p-0"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          <div className="flex items-center justify-between h-14 px-4">
            <span className="tabular" style={{ font: "600 15px/1 var(--font-display)" }}>
              {current + 1} de {count}
            </span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Fechar fotos"
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20"
              autoFocus
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div ref={trackRef} className="snap-row flex overflow-x-auto h-[calc(100dvh-3.5rem)]">
            {photos.map((photo, i) => (
              <div key={photo.id} className="relative w-full h-full shrink-0">
                <Image
                  src={photo.url}
                  alt={photo.alt || `${title}, foto ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  loading={Math.abs(i - current) <= 1 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={current === 0}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-gray-900 disabled:opacity-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={current === count - 1}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-gray-900 disabled:opacity-0"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </dialog>
      )}
    </>
  );
}
