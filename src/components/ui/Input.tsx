import type { ReactNode } from "react";
import { clsx } from "clsx";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  icon?: ReactNode;
  containerClassName?: string;
}

export function Input({ label, icon, id, className, containerClassName, ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <label htmlFor={inputId} className={clsx("flex flex-col gap-1.5 font-body", containerClassName)}>
      {label && (
        <span className="text-text-1" style={{ font: "var(--text-label)" }}>
          {label}
        </span>
      )}
      <div className="flex items-center gap-2 h-11 px-3.5 bg-bg-surface border border-border-1 rounded-md transition-shadow duration-150 ease-out focus-within:border-border-focus focus-within:shadow-focus">
        {icon}
        <input
          id={inputId}
          className={clsx(
            "flex-1 min-w-0 border-none outline-none bg-transparent text-text-1 placeholder:text-text-3",
            className
          )}
          style={{ font: "var(--text-body-md)" }}
          {...rest}
        />
      </div>
    </label>
  );
}
