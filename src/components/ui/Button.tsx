import type { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

/** Compartilhado com WhatsAppLink, que usa o mesmo dimensionamento de botão. */
export const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 px-4 py-2",
  // py-[13px]: com --text-label (14px/1.3 = 18.2px de linha) + borda de 1px em
  // cima/embaixo, py-[11px] rendia ~42.2px de altura — abaixo do alvo mínimo de
  // toque de 44px exigido pelo redesign (público de perfil mais velho). É o
  // tamanho padrão de <Button>, usado por ex. no botão "Enviar mensagem" do
  // ContactForm (/contato) sem size= explícito. +2px de cada lado fecha a conta
  // (~46.2px), com folga para variação de renderização de fonte entre navegadores.
  md: "gap-2 px-[22px] py-[13px]",
  lg: "gap-2.5 px-7 py-[15px]",
};

export const sizeFont: Record<ButtonSize, string> = {
  sm: "var(--text-body-sm)",
  md: "var(--text-label)",
  lg: "var(--text-display-sm)",
};

const variantClasses: Record<ButtonVariant, string> = {
  // bg-red-600 (não bg-brand-primary/--red-500) por contraste: branco sobre
  // --red-500 dá ~4.2:1 em --text-label (14px/600), abaixo do AA (4.5:1) —
  // mesma falha matemática já corrigida no Badge.tsx tom "venda" sólido
  // (auditoria estática da Etapa 8, achado de review). --red-600 resolve para
  // ~5.16:1. hover/active sobem um degrau (--red-700/--red-900, não há
  // --red-800) para manter estados visualmente distintos da base agora mais
  // escura.
  primary:
    "bg-red-600 text-text-on-primary border border-transparent hover:bg-red-700 active:bg-red-900",
  secondary:
    "bg-brand-secondary text-text-on-primary border border-transparent hover:bg-brand-secondary-hover active:bg-brand-secondary-active",
  // text-red-600 (não text-brand-primary) por contraste: --red-500 sobre fundo
  // claro renderiza ~4.2:1 no texto de --text-label (14px/600), abaixo do AA
  // (4.5:1) — auditoria estática da Etapa 8. --red-600 (mesma família,
  // já usado como --status-venda-fg no Badge tonal) resolve para ~5.16:1.
  outline:
    "bg-transparent text-red-600 border border-border-2 hover:bg-bg-sunken",
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
