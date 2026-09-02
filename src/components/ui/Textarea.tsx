import { clsx } from "clsx";

interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  label?: string;
}

export function Textarea({ label, id, className, ...rest }: TextareaProps) {
  const textareaId = id ?? rest.name;
  return (
    <label htmlFor={textareaId} className="flex flex-col gap-1.5 font-body">
      {label && (
        <span className="text-text-1" style={{ font: "var(--text-label)" }}>
          {label}
        </span>
      )}
      <textarea
        id={textareaId}
        className={clsx(
          "border border-border-1 rounded-md p-3 text-text-1 placeholder:text-text-3 resize-y outline-none transition-shadow duration-150 ease-out focus:border-border-focus focus:shadow-focus",
          className
        )}
        style={{ font: "var(--text-body-md)" }}
        {...rest}
      />
    </label>
  );
}
