import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Matias Imóveis — Itaberaí/GO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Lida uma vez, em module scope, igual ao exemplo dos docs do Next para
// assets locais (o arquivo não depende de dados de request).
const logoData = await readFile(join(process.cwd(), "public/images/logo-wordmark.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          background: "#161430",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={420} height={90} />
        <div style={{ display: "flex", color: "#faf7f2", fontSize: 36 }}>
          Imóveis em Itaberaí/GO e região
        </div>
      </div>
    ),
    { ...size }
  );
}
