import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProblemState } from "@/components/layout/ProblemState";

/**
 * 404 de URLs que não casam com nenhuma rota (ex.: /qualquer-coisa). Fica
 * fora do grupo (site), então repõe o menu e o rodapé por conta própria —
 * antes aparecia a página crua do Next, em inglês e sem navegação.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ProblemState code="Erro 404" title="Página não encontrada">
          O endereço pode estar errado ou a página mudou de lugar.
        </ProblemState>
      </main>
      <Footer />
    </>
  );
}
