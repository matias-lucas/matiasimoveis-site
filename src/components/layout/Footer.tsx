import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { Container } from "./Container";
import { FOOTER_LINKS, SITE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Rodapé em grade no mesmo Container do resto do site (antes usava px-8 +
 * flex-wrap: ficava 32px fora do alinhamento e a última coluna caía sozinha
 * numa linha no celular — review 28/09). Agora também traz os contatos, que
 * não apareciam em lugar nenhum do rodapé.
 */
export function Footer() {
  return (
    <footer className="bg-bg-inverse text-text-on-inverse pt-12 pb-8 font-body">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] gap-x-6 gap-y-10">
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/images/logo.png"
              alt={SITE.name}
              width={160}
              height={50}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="mt-4 max-w-[32ch] text-white/75" style={{ font: "var(--text-body-sm)" }}>
              Venda e locação de imóveis em Itaberaí e região.
            </p>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.heading}>
              <h2 className="text-white/60 mb-3" style={{ font: "600 14px/1 var(--font-display)" }}>
                {column.heading}
              </h2>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center min-h-11 text-white no-underline opacity-90 hover:opacity-100 hover:text-white"
                      style={{ font: "var(--text-body-sm)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-white/60 mb-3" style={{ font: "600 14px/1 var(--font-display)" }}>
              Contato
            </h2>
            <ul className="flex flex-col" style={{ font: "var(--text-body-sm)" }}>
              <li>
                <a
                  href={buildWhatsAppUrl(SITE.whatsappDefaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 min-h-11 text-white no-underline hover:text-white"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
                  WhatsApp {SITE.phone}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-2 min-h-11 text-white no-underline hover:text-white">
                  <Phone className="w-4 h-4 shrink-0" aria-hidden />
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-2 py-3 text-white/80">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                {SITE.address.street}, {SITE.address.district}, {SITE.address.city}/{SITE.address.state}
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:justify-between gap-2 text-white/65"
          style={{ font: "var(--text-caption)" }}
        >
          <span>
            © {new Date().getFullYear()} {SITE.name} · {SITE.cj}
          </span>
          <span>
            Corretor responsável: {SITE.defaultCorretor.name} · {SITE.defaultCorretor.creci}
          </span>
        </div>
      </Container>
    </footer>
  );
}
