import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { Container } from "@/components/layout/Container";
import { ImovelCard } from "@/components/imovel/ImovelCard";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { searchHref } from "@/lib/search-params";
import type { Imovel, ImovelPurpose } from "@/lib/types";

interface ListingShowcaseProps {
  purpose: ImovelPurpose;
  title: string;
  imoveis: Imovel[];
  total: number;
}

const COLUMNS_LG = 4;

// Classes literais (o Tailwind só gera o que aparece escrito no código).
const LG_SPAN: Record<number, string> = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3" };

/**
 * Vitrine de uma finalidade na Home. Sempre fecha as linhas da grade: quando
 * há menos imóveis que colunas, o quadro "Não achou?" ocupa as colunas que
 * sobram, em vez de deixar um card órfão numa linha quase vazia (antes: 4
 * destaques numa grade de 3 colunas — review 28/09). No celular vira uma
 * fileira com rolagem lateral, com o próximo card aparecendo pela metade.
 */
export function ListingShowcase({ purpose, title, imoveis, total }: ListingShowcaseProps) {
  const n = imoveis.length;
  const lgRemainder = n % COLUMNS_LG === 0 ? 0 : COLUMNS_LG - (n % COLUMNS_LG);
  const smRemainder = n % 2;
  const allHref = searchHref({ purpose });
  const noun = purpose === "locacao" ? "para alugar" : "à venda";

  return (
    <section className="py-12 lg:py-16" aria-labelledby={`vitrine-${purpose}`}>
      <Container>
        <div className="flex items-end justify-between gap-4 mb-5">
          <h2 id={`vitrine-${purpose}`} className="text-text-1" style={{ font: "var(--text-display-md)" }}>
            {title}
          </h2>
          {total > 0 && (
            <Link
              href={allHref}
              className="inline-flex items-center gap-1.5 shrink-0 text-red-600 no-underline hover:text-red-700 whitespace-nowrap"
              style={{ font: "700 16px/1 var(--font-display)" }}
            >
              Ver todos ({total})
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          )}
        </div>

        <ul className="snap-row flex gap-4 overflow-x-auto -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {imoveis.map((imovel) => (
            <li key={imovel.id} className="w-[80%] shrink-0 sm:w-auto flex">
              <ImovelCard imovel={imovel} />
            </li>
          ))}
          {(n === 0 || lgRemainder > 0 || smRemainder > 0) && (
            <li
              className={clsx(
                "w-[80%] shrink-0 sm:w-auto flex",
                n === 0 ? "sm:col-span-2 lg:col-span-4" : smRemainder === 0 ? "sm:hidden lg:flex" : "sm:col-span-1",
                n > 0 && (lgRemainder > 0 ? LG_SPAN[lgRemainder] : "lg:hidden")
              )}
            >
              <div className="flex flex-col justify-center gap-4 w-full rounded-xl bg-bg-inverse text-white p-6 lg:p-8">
                <p style={{ font: "var(--text-display-sm)" }}>
                  {n === 0 ? `Nenhum imóvel ${noun} no momento.` : "Não achou o que procura?"}
                </p>
                <p className="text-white/80 max-w-md" style={{ font: "var(--text-body-sm)" }}>
                  Conte o que você precisa. Avisamos pelo WhatsApp quando entrar um imóvel {noun} do seu jeito.
                </p>
                <WhatsAppLink
                  message={`Olá! Estou procurando um imóvel ${noun} em Itaberaí. Pode me avisar quando surgir algo?`}
                  className="self-start"
                >
                  Avise-me pelo WhatsApp
                </WhatsAppLink>
              </div>
            </li>
          )}
        </ul>
      </Container>
    </section>
  );
}
