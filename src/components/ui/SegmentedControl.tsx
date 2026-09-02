interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  name: string;
  options: SegmentedOption[];
  defaultValue?: string;
  /** Tailwind class applied to the checked pill's background, e.g. "peer-checked:bg-brand-primary". */
  activeClassName?: string;
}

const DEFAULT_ACTIVE = "peer-checked:bg-brand-primary peer-checked:text-white";

export function SegmentedControl({
  name,
  options,
  defaultValue,
  activeClassName = DEFAULT_ACTIVE,
}: SegmentedControlProps) {
  return (
    <div className="inline-flex bg-bg-sunken rounded-pill p-1 gap-1 font-display">
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
            className={`block px-[22px] py-[9px] rounded-pill text-text-2 transition-colors duration-150 ease-out peer-focus-visible:shadow-focus ${activeClassName}`}
            style={{ font: "var(--text-label)" }}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
