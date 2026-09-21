"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// Revelação escalonada (eyebrow → título → parágrafo → CTAs) no load do
// hero da Home — o único "momento" de motion mais chamativo do site (ver
// docs/REDESIGN-BRIEF.md §5). Cada filho direto vira um passo do stagger.
export function HeroReveal({ children }: { children: ReactNode[] }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {children.map((child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
