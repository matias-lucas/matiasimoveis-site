import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.ComponentPropsWithoutRef<"select">, "children"> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export function Select({
  label,
  options,
  placeholder,
  id,
  className,
  containerClassName,
  ...rest
}: SelectProps) {
  const selectId = id ?? rest.name;
  return (
    <label htmlFor={selectId} className={clsx("flex flex-col gap-1.5 font-body", containerClassName)}>
      {label && (
        <span className="text-text-1" style={{ font: "var(--text-label)" }}>
          {label}
        </span>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          className={clsx(
            "appearance-none w-full h-11 pl-3.5 pr-9 bg-bg-surface border border-border-1 rounded-md text-text-1 cursor-pointer transition-shadow duration-150 ease-out focus:border-border-focus focus:shadow-focus focus:outline-none",
            className
          )}
          style={{ font: "var(--text-body-md)" }}
          defaultValue=""
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 w-4 h-4 text-text-2 pointer-events-none" />
      </div>
    </label>
  );
}
