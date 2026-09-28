import { SERVICES } from "@/lib/services";

/** Os 3 serviços (Home e Empresa): mesmo visual nas duas páginas — antes
 * cada uma tinha um (números 01/02/03 vs ícones centralizados). */
export function ServicesList() {
  return (
    <ul className="flex flex-col divide-y divide-border-1 border-y border-border-1">
      {SERVICES.map(({ icon: Icon, title, description }) => (
        <li key={title} className="flex gap-4 py-5">
          <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-red-50 text-red-600">
            <Icon className="w-6 h-6" aria-hidden />
          </span>
          <span>
            <span className="block text-text-1" style={{ font: "var(--text-display-sm)" }}>
              {title}
            </span>
            <span className="block mt-1 text-text-2" style={{ font: "var(--text-body-sm)" }}>
              {description}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
