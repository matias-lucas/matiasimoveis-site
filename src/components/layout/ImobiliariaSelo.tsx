import Image from "next/image";
import { SITE } from "@/lib/site";
import logoMark from "../../../public/images/logo-mark.png";

/**
 * Quem atende quando o contato é com a própria imobiliária: toda a locação e
 * a venda sem corretor próprio (dono, 28/09). O telefone/WhatsApp do site é
 * o da imobiliária, não o de um corretor.
 */
export function ImobiliariaSelo({ size = 56, detail = `Imobiliária · ${SITE.cj}` }: { size?: number; detail?: string }) {
  return (
    <div className="flex items-center gap-3 text-text-2" style={{ font: "var(--text-body-sm)" }}>
      <span
        className="flex shrink-0 items-center justify-center rounded-full border border-border-1 bg-white"
        style={{ width: size, height: size }}
      >
        <Image src={logoMark} alt="" width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} />
      </span>
      <div className="min-w-0">
        <div className="text-text-1" style={{ font: "700 16px/1.3 var(--font-display)" }}>
          {SITE.name}
        </div>
        {detail}
      </div>
    </div>
  );
}
