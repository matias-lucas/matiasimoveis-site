import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-bg-inverse text-text-on-inverse py-10 px-8 font-body">
      <div
        className="mx-auto flex flex-wrap gap-8 justify-between"
        style={{ maxWidth: "var(--container-max)" }}
      >
        <div>
          <Image
            src="/images/logo.png"
            alt={SITE.name}
            width={160}
            height={50}
            className="h-8 w-auto mb-3 brightness-0 invert"
          />
          <p className="max-w-[280px] opacity-80" style={{ font: "var(--text-body-sm)" }}>
            {SITE.address.street} — {SITE.address.district}, {SITE.address.city}/
            {SITE.address.state}
          </p>
        </div>

        {FOOTER_LINKS.map((column) => (
          <div key={column.heading} className="flex flex-col gap-2">
            <span className="opacity-60" style={{ font: "var(--text-label)" }}>
              {column.heading}
            </span>
            {column.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white no-underline opacity-90 hover:opacity-100"
                style={{ font: "var(--text-body-sm)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div
        className="text-center mt-8 pt-5 border-t border-white/15 opacity-60"
        style={{ font: "var(--text-caption)" }}
      >
        © {new Date().getFullYear()} {SITE.name} · {SITE.cj} · Todos os direitos reservados.
      </div>
    </footer>
  );
}
