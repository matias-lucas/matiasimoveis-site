import type { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

/** Compartilhado com WhatsAppLink, que usa o mesmo dimensionamento de botão. */
export const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 px-4 py-2",
  md: "gap-2 px-[22px] py-[11px]",
  lg: "gap-2.5 px-7 py-[15px]",
};

export const sizeFont: Record<ButtonSize, string> = {
  sm: "var(--text-body-sm)",
  md: "var(--text-label)",
  lg: "var(--text-display-sm)",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-text-on-primary border border-transparent hover:bg-brand-primary-hover active:bg-brand-primary-active",
  secondary:
    "bg-brand-secondary text-text-on-primary border border-transparent hover:bg-brand-secondary-hover active:bg-brand-secondary-active",
  outline:
    "bg-transparent text-brand-primary border border-border-2 hover:bg-bg-sunken",
  ghost: "bg-transparent text-text-1 border border-transparent hover:bg-bg-sunken",
  whatsapp:
    "bg-whatsapp text-white border border-transparent hover:bg-whatsapp-hover",
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
    "font-display",
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
