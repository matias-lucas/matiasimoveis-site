import { ProblemState } from "@/components/layout/ProblemState";

export default function NotFound() {
  return (
    <ProblemState code="Erro 404" title="Este imóvel ou página não está mais aqui">
      O anúncio pode ter sido vendido, alugado ou retirado do ar. Veja os imóveis disponíveis ou fale com a gente.
    </ProblemState>
  );
}
