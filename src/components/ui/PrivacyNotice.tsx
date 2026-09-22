import Link from "next/link";

/**
 * Aviso de privacidade compartilhado por ContactForm e SellForm: informa que o
 * envio abre o WhatsApp (sem armazenar dados) e linka a política de privacidade.
 * text-text-2/text-red-600 (não text-text-3/text-brand-primary) por contraste —
 * mesma falha de AA já documentada em Button.tsx:39-42 (auditoria da Etapa 8).
 */
export function PrivacyNotice() {
  return (
    <p className="text-text-2" style={{ font: "var(--text-caption)" }}>
      Ao enviar, você será direcionado ao WhatsApp — não guardamos seus dados. Veja nossa{" "}
      <Link href="/privacidade" className="text-red-600 underline">
        política de privacidade
      </Link>
      .
    </p>
  );
}
