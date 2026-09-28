import type { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "light";
export type ButtonSize = "sm" | "md" | "lg";

/** Compartilhado com WhatsAppLink, que usa o mesmo dimensionamento de botão.
 * Alturas fixas (40/48/56px) em vez de padding vertical + altura de linha:
 * antes cada botão do site tinha uma altura (42/44/46/59px) e dois deles
 * ficavam abaixo do alvo de toque de 44px (review 28/09). */
export const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 px-4 h-10",
  md: "gap-2 px-5 h-12",
  lg: "gap-2.5 px-7 h-14",
};

/** Uma família só (a de títulos) em todos os tamanhos — antes o "lg" usava a
 * serifada de 22px e os demais a sans, na mesma página. */
export const sizeFont: Record<ButtonSize, string> = {
  sm: "600 14px/1 var(--font-display)",
  md: "600 16px/1 var(--font-display)",
  lg: "700 18px/1 var(--font-display)",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-text-on-primary border border-transparent hover:bg-brand-primary-hover active:bg-brand-primary-active",
  secondary:
    "bg-bg-inverse text-text-on-primary border border-transparent hover:bg-blue-700 active:bg-blue-600",
  outline:
    "bg-bg-surface text-text-1 border border-border-2 hover:border-text-1",
  ghost: "bg-transparent text-text-1 border border-transparent hover:bg-bg-sunken",
  whatsapp:
    "bg-whatsapp text-white border border-transparent hover:bg-whatsapp-hover",
  light: "bg-white text-text-1 border border-transparent hover:bg-gray-100",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-md cursor-pointer transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:shadow-focus";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & {
    href: React.ComponentProps<typeof Link>["href"];
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    "whitespace-nowrap",
    className
  );
  const style = { font: sizeFont[size] } as React.CSSProperties;

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as Omit<ButtonAsLink, keyof CommonProps>;
    return (
      <Link href={href} className={classes} style={style} {...linkRest}>
        {icon}
        {children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, keyof CommonProps>;
  return (
    <button className={classes} style={style} {...buttonRest}>
      {icon}
      {children}
    </button>
  );
}
