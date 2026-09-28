import { Star, Eye, EyeOff } from "lucide-react";

/**
 * Destaque e Visível/Oculto no cadastro, no mesmo lugar e com o mesmo visual
 * das ações instantâneas da edição (ImovelQuickActions) — antes o cadastro
 * tinha um checkbox "Exibir na home" escondido na aba Características e a
 * edição uma estrela, e um não refletia o outro. Aqui ainda não existe
 * property_id, então são checkboxes nativos que vão no submit (createImovel).
 * Novo imóvel já sai Visível por padrão (pedido do dono, 28/09).
 */
export function CadastroToggles() {
  return (
    <div className="flex items-center gap-2">
      <label
        title="Destacar na home"
        className="flex items-center justify-center w-11 h-11 rounded-md border cursor-pointer transition-colors duration-150 ease-out bg-transparent border-border-2 text-text-3 hover:text-text-1 has-checked:bg-amber-100 has-checked:border-amber-500 has-checked:text-amber-500 has-focus-visible:shadow-focus"
      >
        <input type="checkbox" name="featured" aria-label="Destacar na home" className="peer sr-only" />
        <Star className="w-4 h-4 peer-checked:fill-current" />
      </label>

      <label
        className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-md border border-transparent cursor-pointer transition-colors duration-150 ease-out hover:opacity-80 bg-status-warning-bg text-status-warning-fg has-checked:bg-status-success-bg has-checked:text-status-success-fg has-focus-visible:shadow-focus"
        style={{ font: "var(--text-body-sm)" }}
      >
        <input type="checkbox" name="published" defaultChecked aria-label="Visível no site" className="peer sr-only" />
        <Eye className="w-4 h-4 hidden peer-checked:block" />
        <EyeOff className="w-4 h-4 peer-checked:hidden" />
        <span className="hidden peer-checked:inline">Visível</span>
        <span className="peer-checked:hidden">Oculto</span>
      </label>
    </div>
  );
}
