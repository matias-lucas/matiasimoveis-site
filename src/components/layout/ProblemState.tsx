import type { ReactNode } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "./Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { SITE } from "@/lib/site";

/** Corpo comum das páginas 404 e de erro: explicação curta + caminhos úteis. */
export function ProblemState({ code, title, children }: { code: string; title: string; children: ReactNode }) {
  return (
    <Container className="py-16 lg:py-24">
      <div className="max-w-xl">
        <p className="text-red-600" style={{ font: "800 15px/1 var(--font-display)" }}>
          {code}
        </p>
        <h1 className="mt-3 text-text-1" style={{ font: "var(--text-display-lg)" }}>
          {title}
        </h1>
        <div className="mt-3 text-text-2" style={{ font: "var(--text-body-md)" }}>
          {children}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 h-12 px-5 rounded-md bg-brand-primary text-white no-underline hover:bg-brand-primary-hover hover:text-white"
            style={{ font: "600 16px/1 var(--font-display)" }}
          >
            <Search className="w-4 h-4" aria-hidden />
            Ver imóveis
          </Link>
          <WhatsAppLink message={SITE.whatsappDefaultMessage}>Falar no WhatsApp</WhatsAppLink>
        </div>
      </div>
    </Container>
  );
}
