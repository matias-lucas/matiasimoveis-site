"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { clsx } from "clsx";
import { Container } from "./Container";
import { NAV_LINKS, SITE } from "@/lib/site";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-bg-surface shadow-sm font-display">
      <Container className="flex items-center justify-between py-3.5 gap-8">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={44}
            height={46}
            className="h-11 w-auto"
            priority
          />
          <Image
            src="/images/logo-wordmark.png"
            alt={SITE.name}
            width={128}
            height={36}
            className="h-6 w-auto"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "no-underline transition-colors duration-150 ease-out",
                  active ? "text-brand-primary" : "text-text-1 hover:text-brand-primary"
                )}
                style={{ font: "var(--text-label)" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={SITE.phoneHref}
          className="hidden lg:flex items-center gap-2 text-text-1 no-underline shrink-0 hover:text-brand-primary transition-colors duration-150 ease-out"
          style={{ font: "var(--text-label)" }}
        >
          <Phone className="w-4 h-4" />
          {SITE.phone}
        </a>

        {/* Menu mobile: trigger visível só abaixo de lg, abre um drawer pela direita */}
        <Drawer swipeDirection="right">
          <DrawerTrigger
            render={
              <button
                type="button"
                aria-label="Abrir menu"
                className="lg:hidden flex items-center justify-center w-11 h-11 text-text-1"
              />
            }
          >
            <Menu className="w-6 h-6" />
          </DrawerTrigger>
          <DrawerContent className="h-full w-[280px] ml-auto rounded-none bg-bg-surface text-text-1">
            <nav className="flex flex-col gap-1 p-6 font-display">
              {NAV_LINKS.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <DrawerClose
                    key={item.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href}
                        className={clsx(
                          "block py-3 no-underline",
                          active ? "text-brand-primary" : "text-text-1"
                        )}
                        style={{ font: "var(--text-label)" }}
                      />
                    }
                  >
                    {item.label}
                  </DrawerClose>
                );
              })}
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 text-text-1 no-underline mt-4 pt-4 border-t border-border-1"
                style={{ font: "var(--text-label)" }}
              >
                <Phone className="w-4 h-4" />
                {SITE.phone}
              </a>
            </nav>
          </DrawerContent>
        </Drawer>
      </Container>
    </header>
  );
}
