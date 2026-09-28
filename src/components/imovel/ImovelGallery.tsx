/// <reference types="react/canary" />
"use client";

import { useEffect, useRef, useState, useSyncExternalStore, ViewTransition, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { clsx } from "clsx";
import { ImovelPhoto } from "./ImovelPhoto";
import type { ImovelKind, ImovelPhotoRecord } from "@/lib/types";

interface ImovelGalleryProps {
  slug: string;
  photos: ImovelPhotoRecord[];
  title: string;
  kind: ImovelKind;
}

/**
 * Galeria da ficha. Antes: capa + 4 miniaturas fixas — com 12 fotos só 5
 * eram alcançáveis, e um imóvel com 2 fotos mostrava 3 quadros falsos de
 * "Foto em breve"; no celular as setas do lightbox ficavam fora da tela
 * (review 28/09). Agora todas as fotos são acessíveis, com contador, e o
 * lightbox é um <dialog> nativo com rolagem por snap (sem libs de carrossel
 * ou diálogo no JavaScript da página).
 */
const DESKTOP_QUERY = "(min-width: 1024px)";
function subscribeDesktop(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** Só uma das duas fotos principais (celular/desktop) pode carregar o nome
 * da transição de cada vez: nomes duplicados montados quebram o morph. */
function Morph({ name, enabled, children }: { name: string; enabled: boolean; children: ReactNode }) {
  if (!enabled) return <>{children}</>;
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

export function ImovelGallery({ slug, photos, title, kind }: ImovelGalleryProps) {
  const isDesktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP_QUERY).matches, () => false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [stripIndex, setStripIndex] = useState(0);
  const count = photos.length;

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

  // Índice atual derivado da rolagem (funciona com swipe, setas e teclado).
  useEffect(() => {
    const track = trackRef.current;
    const strip = stripRef.current;
    const onTrack = () => track && setCurrent(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
    const onStrip = () => strip && setStripIndex(Math.round(strip.scrollLeft / Math.max(1, strip.clientWidth)));
    track?.addEventListener("scroll", onTrack, { passive: true });
    strip?.addEventListener("scroll", onStrip, { passive: true });
    return () => {
      track?.removeEventListener("scroll", onTrack);
      strip?.removeEventListener("scroll", onStrip);
    };
  }, []);

  if (count === 0) {
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

  const [first, second, third] = photos;
  const showMosaic = count >= 3;

  return (
    <>
      {/* Celular: fileira com rolagem lateral de TODAS as fotos + contador. */}
      <div className="lg:hidden relative -mx-4 sm:mx-0">
        <div ref={stripRef} className="snap-row flex overflow-x-auto sm:rounded-2xl">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => open(i)}
              className="relative w-full shrink-0 aspect-[4/3]"
              aria-label={`Ampliar foto ${i + 1} de ${count}`}
            >
              {i === 0 ? (
                <Morph name={`imovel-photo-${slug}`} enabled={!isDesktop}>
                  <div className="absolute inset-0">
                    <ImovelPhoto src={photo.url} alt={photo.alt || title} preload sizes="100vw" />
                  </div>
                </Morph>
              ) : (
                <ImovelPhoto src={photo.url} alt={photo.alt || title} sizes="100vw" />
              )}
            </button>
          ))}
        </div>
        {count > 1 && (
          <span
            className="absolute bottom-3 right-3 sm:right-3 rounded-pill bg-black/70 text-white px-2.5 py-1 tabular pointer-events-none"
            style={{ font: "600 13px/1 var(--font-display)" }}
          >
            {stripIndex + 1}/{count}
          </span>
        )}
      </div>

      {/* Desktop: foto grande + duas menores (quando há 3+) e "ver todas". */}
      <div className={clsx("hidden lg:grid gap-2 rounded-2xl overflow-hidden h-[440px]", showMosaic && "grid-cols-[2fr_1fr] grid-rows-2")}>
        <button
          type="button"
          onClick={() => open(0)}
          className={clsx("relative", showMosaic && "row-span-2")}
          aria-label={`Ampliar foto 1 de ${count}`}
        >
          <Morph name={`imovel-photo-${slug}`} enabled={isDesktop}>
            <div className="absolute inset-0">
              <ImovelPhoto src={first.url} alt={first.alt || title} preload sizes="(min-width: 1280px) 560px, 45vw" />
            </div>
          </Morph>
        </button>
        {showMosaic &&
          [second, third].map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => open(i + 1)}
              className="relative"
              aria-label={`Ampliar foto ${i + 2} de ${count}`}
            >
              <ImovelPhoto src={photo.url} alt={photo.alt || title} sizes="300px" />
            </button>
          ))}
      </div>
      {count > 1 && (
        <button
          type="button"
          onClick={() => open(0)}
          className="hidden lg:inline-flex items-center gap-2 mt-3 h-11 px-4 rounded-md border border-border-2 bg-bg-surface text-text-1 hover:border-text-1"
          style={{ font: "600 15px/1 var(--font-display)" }}
        >
          <Images className="w-4 h-4" aria-hidden />
          Ver todas as {count} fotos
        </button>
      )}

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
    </>
  );
}
