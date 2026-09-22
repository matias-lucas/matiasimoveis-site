"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface FadeInOnMountProps {
  children: ReactNode;
  className?: string;
}

// Fade-up ao montar (diferente de FadeInWhenVisible, que dispara ao entrar no
// viewport) — usado na ficha do imóvel para o conteúdo ao redor da galeria,
// que ganha sua própria continuidade visual via <ViewTransition> (ver
// ImovelCard/ImovelGallery). Não envolve a galeria nem a ImovelMobilePriceBar:
// opacity:0 no wrapper esconderia a foto durante o morph, e o transform
// (mesmo em y:0) criaria um containing block novo que quebraria o
// position:fixed da barra de preço mobile.
export function FadeInOnMount({ children, className }: FadeInOnMountProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
