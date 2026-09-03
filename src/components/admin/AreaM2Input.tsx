"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

interface AreaM2InputProps {
  name: string;
  label: ReactNode;
  defaultValue?: number | string;
  placeholder?: string;
  variant?: "inline" | "segmented";
}

export function AreaM2Input({ name, label, defaultValue, placeholder, variant = "inline" }: AreaM2InputProps) {
  const [value, setValue] = useState(defaultValue === undefined || defaultValue === "" ? "" : String(defaultValue));

  function formatOnCommit() {
    if (value === "") return;
    const n = Number(value);
    if (Number.isFinite(n)) setValue(n.toFixed(2));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
  }

  const inputId = name;

  if (variant === "segmented") {
    return (
      <label htmlFor={inputId} className="flex flex-col gap-1.5 font-body">
        <span className="text-text-1" style={{ font: "var(--text-label)" }}>
          {label}
        </span>
        <div className="flex items-stretch h-11 bg-bg-surface border border-border-1 rounded-md transition-shadow duration-150 ease-out focus-within:border-border-focus focus-within:shadow-focus overflow-hidden">
          <input
            id={inputId}
            name={name}
            type="number"
            min={0}
            step="0.01"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={formatOnCommit}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 px-3.5 border-none outline-none bg-transparent text-text-1 placeholder:text-text-3"
            style={{ font: "var(--text-body-md)" }}
          />
          <span
            className="shrink-0 flex items-center px-3 border-l border-border-1 bg-bg-sunken text-text-2"
            style={{ font: "var(--text-caption)" }}
          >
            m²
          </span>
        </div>
      </label>
    );
  }

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5 font-body">
      <span className="text-text-1" style={{ font: "var(--text-label)" }}>
        {label}
      </span>
      <div className="flex items-center gap-2 h-11 pl-3.5 pr-3 bg-bg-surface border border-border-1 rounded-md transition-shadow duration-150 ease-out focus-within:border-border-focus focus-within:shadow-focus">
        <input
          id={inputId}
          name={name}
          type="number"
          min={0}
          step="0.01"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={formatOnCommit}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 border-none outline-none bg-transparent text-text-1 placeholder:text-text-3"
          style={{ font: "var(--text-body-md)" }}
        />
        <span className="shrink-0 text-text-3" style={{ font: "var(--text-body-sm)" }}>
          m²
        </span>
      </div>
    </label>
  );
}
