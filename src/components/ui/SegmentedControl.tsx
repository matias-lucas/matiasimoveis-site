interface SegmentedOption {
  value: string;
  label: string;
  /** Classe Tailwind aplicada à pílula desta opção quando marcada, ex.:
   *  "peer-checked:bg-brand-secondary". Padrão: DEFAULT_ACTIVE (vermelho) —
   *  passe isso explicitamente sempre que as opções tiverem cor semântica
   *  própria (ex.: Locação = azul, Venda = vermelho; ver DESIGN.md). */
  activeClassName?: string;
}

interface SegmentedControlProps {
  name: string;
  options: SegmentedOption[];
  defaultValue?: string;
}

const DEFAULT_ACTIVE = "peer-checked:bg-brand-primary peer-checked:text-white";

export function SegmentedControl({ name, options, defaultValue }: SegmentedControlProps) {
  return (
    <div className="self-start inline-flex bg-bg-sunken rounded-pill p-1 gap-1 font-display">
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            defaultChecked={option.value === defaultValue}
            className="peer sr-only"
          />
          <span
            className={`block px-[22px] py-[9px] rounded-pill text-text-2 transition-colors duration-150 ease-out peer-focus-visible:shadow-focus ${option.activeClassName ?? DEFAULT_ACTIVE}`}
            style={{ font: "var(--text-label)" }}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
