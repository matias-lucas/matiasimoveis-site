import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: `Como a ${SITE.name} trata os dados de quem visita o site.`,
};

export default function PrivacidadePage() {
  return (
    <Container className="py-16 !max-w-[720px]">
      <h1
        className="text-text-1 mb-6"
        style={{ font: "var(--text-display-md)", fontFamily: "var(--font-display)" }}
      >
        Política de privacidade
      </h1>

      <div className="flex flex-col gap-5 text-text-2" style={{ font: "var(--text-body-md)" }}>
        <p>
          Aqui explicamos, de forma direta, o que acontece com as informações de quem visita
          este site. Não usamos termos jurídicos genéricos — só o que realmente fazemos.
        </p>

        <div>
          <h2 className="text-text-1 mb-2" style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}>
            Formulários (Anuncie seu imóvel e Contato)
          </h2>
          <p>
            Quando você preenche um desses formulários e clica em &quot;Falar no WhatsApp&quot; ou
            &quot;Enviar mensagem&quot;, nós não guardamos nada no nosso servidor. O que
            acontece é: montamos uma mensagem com o que você escreveu e abrimos o WhatsApp para
            você enviá-la diretamente para nós. A partir daí, a conversa acontece no WhatsApp,
            sujeita à política de privacidade do próprio WhatsApp/Meta — não à nossa.
          </p>
        </div>

        <div>
          <h2 className="text-text-1 mb-2" style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}>
            Visitas ao site
          </h2>
          <p>
            Usamos o Vercel Analytics para entender, de forma agregada e anônima, quantas
            pessoas visitam o site e quais páginas são mais acessadas. Essa ferramenta não usa
            cookies de rastreamento nem identifica você individualmente.
          </p>
        </div>

        <div>
          <h2 className="text-text-1 mb-2" style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}>
            Mapa na página de Contato
          </h2>
          <p>
            A página de Contato mostra um mapa do Google. Ao carregá-lo, o Google recebe seu
            endereço IP e pode usar cookies próprios, conforme a política de privacidade do
            Google — não a nossa.
          </p>
        </div>

        <div>
          <h2 className="text-text-1 mb-2" style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}>
            Dúvidas
          </h2>
          <p>
            Se tiver qualquer dúvida sobre como tratamos essas informações, fale com a gente
            pelo e-mail{" "}
            <a href={`mailto:${SITE.email}`} className="text-red-600 underline">
              {SITE.email}
            </a>{" "}
            ou pelo telefone {SITE.phone}.
          </p>
        </div>
      </div>
    </Container>
  );
}
