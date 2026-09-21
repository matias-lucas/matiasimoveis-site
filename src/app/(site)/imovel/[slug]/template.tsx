"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// template.tsx (diferente de layout.tsx) remonta a cada navegação para
// dentro deste segmento — dá o efeito de entrada na ficha do imóvel vindo
// da listagem, sem depender de nenhuma API experimental do Next 16. A
// página em si (page.tsx) continua Server Component; só este wrapper é
// client, e só existe para o segmento /imovel/[slug] — não afeta a
// navegação entre as outras páginas públicas.
export default function ImovelDetailTemplate({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
