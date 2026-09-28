"use client";

import { Suspense, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { clsx } from "clsx";
import { Container } from "./Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { NAV_LINKS, SITE } from "@/lib/site";

type NavLink = (typeof NAV_LINKS)[number];

function isActive(link: NavLink, pathname: string, finalidade: string | null): boolean {
  if ("purpose" in link) return pathname === "/imoveis" && finalidade === link.purpose;
  return pathname.startsWith(link.href);
}

function NavLinks({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const finalidade = useSearchParams().get("finalidade");
  return <NavLinkList variant={variant} pathname={pathname} finalidade={finalidade} />;
}

function NavLinkList({
  variant,
  pathname,
  finalidade,
}: {
  variant: "desktop" | "mobile";
  pathname: string;
  finalidade: string | null;
}) {
  return (
    <>
      {NAV_LINKS.map((link) => {
        const active = isActive(link, pathname, finalidade);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "no-underline transition-colors duration-150 ease-out",
              variant === "desktop"
                ? "relative flex items-center h-16 px-1"
                : "flex items-center h-14 px-2 border-b border-border-1",
              active ? "text-red-600" : "text-text-1 hover:text-red-600"
            )}
            style={{ font: variant === "desktop" ? "600 16px/1 var(--font-display)" : "700 20px/1 var(--font-display)" }}
          >
            {link.label}
            {variant === "desktop" && active && (
              <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-t bg-red-600" aria-hidden />
            )}
          </Link>
        );
      })}
    </>
  );
}

/**
 * Menu do celular com a Popover API nativa (popover/popovertarget), sem a
 * lib de drawer: ela ia para o JavaScript de TODAS as páginas (~52 KB) só
 * para abrir este menu (review 28/09). O único JS aqui fecha o menu quando a
 * navegação acontece.
 */
function MobileMenu() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (menu?.matches(":popover-open")) menu.hidePopover();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        popoverTarget="menu-mobile"
        aria-label="Abrir menu"
        className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 text-text-1"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div
        id="menu-mobile"
        ref={menuRef}
        popover="auto"
        className="menu-mobile m-0 ml-auto h-dvh max-h-none w-[min(320px,86vw)] bg-bg-surface text-text-1 shadow-lg p-0 border-0"
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border-1">
          <span style={{ font: "700 18px/1 var(--font-display)" }}>Menu</span>
          <button
            type="button"
            popoverTarget="menu-mobile"
            popoverTargetAction="hide"
            aria-label="Fechar menu"
            className="flex items-center justify-center w-11 h-11 -mr-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col px-3 py-2" aria-label="Menu principal">
          <Suspense fallback={<NavLinkList variant="mobile" pathname="" finalidade={null} />}>
            <NavLinks variant="mobile" />
          </Suspense>
        </nav>
        <div className="flex flex-col gap-3 p-5">
          <WhatsAppLink message={SITE.whatsappDefaultMessage} size="lg" className="w-full">
            Falar no WhatsApp
          </WhatsAppLink>
          <a
            href={SITE.phoneHref}
            className="flex items-center justify-center gap-2 h-12 rounded-md border border-border-2 text-text-1 no-underline"
            style={{ font: "600 16px/1 var(--font-display)" }}
          >
            <Phone className="w-4 h-4" aria-hidden />
            {SITE.phone}
          </a>
        </div>
      </div>
    </>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-bg-surface/95 backdrop-blur border-b border-border-1">
      <Container className="flex items-center justify-between gap-6 h-16">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${SITE.name}: início`}>
          <Image src="/images/logo-mark.png" alt="" width={40} height={36} className="h-9 w-auto" preload />
          <Image src="/images/logo-wordmark.png" alt="" width={128} height={36} className="h-6 w-auto" preload />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Menu principal">
          <Suspense fallback={<NavLinkList variant="desktop" pathname="" finalidade={null} />}>
            <NavLinks variant="desktop" />
          </Suspense>
        </nav>

        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 text-text-1 no-underline hover:text-red-600"
            style={{ font: "600 15px/1 var(--font-display)" }}
          >
            <Phone className="w-4 h-4" aria-hidden />
            {SITE.phone}
          </a>
          <WhatsAppLink message={SITE.whatsappDefaultMessage} size="sm">
            WhatsApp
          </WhatsAppLink>
        </div>

        <MobileMenu />
      </Container>
    </header>
  );
}
