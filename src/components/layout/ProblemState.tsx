import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "./Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { SITE } from "@/lib/site";
import buscaVazia from "../../../public/images/ia/busca-vazia.webp";

/** Corpo comum das páginas 404 e de erro: explicação curta + caminhos úteis. */
export function ProblemState({ code, title, children }: { code: string; title: string; children: ReactNode }) {
  return (
    <Container className="py-16 lg:py-24 flex flex-col-reverse items-start gap-8 md:flex-row md:items-center md:justify-between">
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
      <Image
        src={buscaVazia}
        alt=""
        width={260}
        height={260}
        className="w-32 h-32 md:w-[260px] md:h-[260px] shrink-0 [mask-image:radial-gradient(closest-side,#000_78%,transparent)]"
      />
    </Container>
  );
}
