"use client";

import { useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  name: string;
  label: ReactNode;
  defaultValue?: number | string;
  min?: number;
  size?: "compact" | "bold";
}

export function QuantityStepper({ name, label, defaultValue, min = 0, size = "compact" }: QuantityStepperProps) {
  const [value, setValue] = useState(() => {
    const n = Number(defaultValue);
    return Number.isFinite(n) ? n : min;
  });

  function step(delta: number) {
    setValue((v) => Math.max(min, v + delta));
  }

  if (size === "bold") {
    return (
      <div className="flex flex-col gap-1.5 font-body">
        <span className="pf-field-icon text-text-1 inline-flex items-center gap-1.5" style={{ font: "var(--text-label)" }}>
          {label}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Diminuir"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-border-2 text-text-2 hover:border-brand-secondary hover:text-brand-secondary transition-colors duration-150 ease-out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            name={name}
            min={min}
            value={value}
            onChange={(e) => setValue(e.target.value === "" ? min : Number(e.target.value))}
            className="w-12 text-center border-none outline-none bg-transparent text-text-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
          />
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Aumentar"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-brand-secondary bg-brand-secondary text-white hover:bg-brand-secondary-hover transition-colors duration-150 ease-out"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="flex flex-col gap-1.5 font-body">
      <span className="pf-field-icon text-text-1 inline-flex items-center gap-1.5" style={{ font: "var(--text-label)" }}>
        {label}
      </span>
      <div className="flex items-center gap-1 h-11 pl-1.5 pr-1.5 bg-bg-surface border border-border-1 rounded-md transition-shadow duration-150 ease-out focus-within:border-border-focus focus-within:shadow-focus">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Diminuir"
          className="inline-flex items-center justify-center w-7 h-7 rounded text-text-2 hover:bg-bg-sunken hover:text-text-1 transition-colors duration-150 ease-out shrink-0"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          name={name}
          min={min}
          value={value}
          onChange={(e) => setValue(e.target.value === "" ? min : Number(e.target.value))}
          className="flex-1 min-w-0 text-center border-none outline-none bg-transparent text-text-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style={{ font: "var(--text-body-md)" }}
        />
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Aumentar"
          className="inline-flex items-center justify-center w-7 h-7 rounded text-text-2 hover:bg-bg-sunken hover:text-text-1 transition-colors duration-150 ease-out shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </label>
  );
}
