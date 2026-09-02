import { Check } from "lucide-react";
import { clsx } from "clsx";

interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  label: string;
}

export function Checkbox({ label, id, className, ...rest }: CheckboxProps) {
  const inputId = id ?? rest.name;
  return (
    <label
      htmlFor={inputId}
      className={clsx("group inline-flex items-center gap-2 cursor-pointer font-body", className)}
    >
      <input id={inputId} type="checkbox" className="sr-only" {...rest} />
      <span className="flex items-center justify-center w-5 h-5 rounded-md border border-border-2 bg-bg-surface transition-colors duration-100 ease-out group-has-checked:bg-brand-secondary group-has-checked:border-brand-secondary group-has-[:focus-visible]:shadow-focus">
        <Check className="w-3.5 h-3.5 text-white opacity-0 group-has-checked:opacity-100" />
      </span>
      <span className="text-text-1" style={{ font: "var(--text-body-md)" }}>
        {label}
      </span>
    </label>
  );
}
