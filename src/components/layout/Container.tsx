import type { ReactNode, ElementType } from "react";
import { clsx } from "clsx";

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export function Container({ as: As = "div", children, className }: ContainerProps) {
  return (
    <As
      className={clsx("mx-auto w-full px-8", className)}
      style={{ maxWidth: "var(--container-max)" }}
    >
      {children}
    </As>
  );
}
