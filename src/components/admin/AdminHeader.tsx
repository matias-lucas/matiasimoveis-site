import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { signOut } from "@/app/admin/actions";
import { SITE } from "@/lib/site";

const NAV_LINKS = [
  { href: "/admin/imoveis", label: "Imóveis" },
  { href: "/admin/corretores", label: "Corretores" },
] as const;

export function AdminHeader({ username }: { username: string | null }) {
  return (
    <header className="bg-bg-inverse font-display">
      <Container className="flex items-center justify-between py-3.5 gap-8">
        <div className="flex items-center gap-8 min-w-0">
          <Link href="/admin/imoveis" className="flex items-center gap-3 shrink-0 no-underline">
            <Image src="/images/logo-icon.png" alt="" width={36} height={38} className="h-9 w-auto" />
            <div>
              <div className="text-text-on-inverse" style={{ font: "var(--text-label)" }}>
                {SITE.name}
              </div>
              <div className="text-white/60" style={{ font: "var(--text-caption)" }}>
                Painel administrativo
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 no-underline hover:text-white transition-colors duration-150 ease-out"
                style={{ font: "var(--text-body-sm)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {username && (
            <span className="text-white/70" style={{ font: "var(--text-body-sm)" }}>
              {username}
            </span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-white/80 bg-transparent border border-white/25 rounded-md px-3 py-2 cursor-pointer transition-colors duration-150 ease-out hover:bg-white/10 hover:text-white"
              style={{ font: "var(--text-body-sm)" }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </form>
        </div>
      </Container>
    </header>
  );
}
