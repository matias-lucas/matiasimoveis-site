import { ImageResponse } from "next/og";
import { getImovelBySlug } from "@/lib/queries";
import { KIND_LABELS } from "@/lib/imovel-kind-categories";
import { formatPrice } from "@/lib/format";

export const alt = "Foto do imóvel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

// Imagem OG por imóvel: foto de capa (se houver) + selo de finalidade +
// preço + título, nas cores da marca. Usa a fonte padrão do sistema (sem
// fetch de fonte externa) de propósito — ver nota da Task 3 no plano.
export default async function Image({ params }: Props) {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#161430",
            color: "#faf7f2",
            fontSize: 48,
          }}
        >
          Matias Imóveis
        </div>
      ),
      { ...size }
    );
  }

  const kindLabel =
    imovel.kind === "outros" && imovel.kindOther ? imovel.kindOther : KIND_LABELS[imovel.kind];
  const price = formatPrice(imovel.price, imovel.purpose);
  const badgeLabel = imovel.purpose === "locacao" ? "Locação" : "Venda";
  const badgeColor = imovel.purpose === "locacao" ? "#413e8c" : "#e6383d";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          background: "#161430",
        }}
      >
        {imovel.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imovel.coverImage}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(22,20,48,0.15) 0%, rgba(22,20,48,0.92) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: 64, gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: badgeColor,
              color: "#ffffff",
              padding: "8px 20px",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {badgeLabel}
          </div>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 56, fontWeight: 700, maxWidth: 1000 }}>
            {kindLabel} em {imovel.neighborhood}, {imovel.city}/{imovel.state}
          </div>
          <div style={{ display: "flex", color: "#faf7f2", fontSize: 44, fontWeight: 700 }}>{price}</div>
          <div style={{ display: "flex", color: "#e9e2d6", fontSize: 28 }}>Matias Imóveis · CJ-40079</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
