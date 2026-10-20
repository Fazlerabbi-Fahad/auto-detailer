"use client";

import { useRef } from "react";
import brand from "@/brand.config";

/** Radio group styled as a segmented control (arrow keys move between options). */
export default function SizeToggle({ value, onChange, label = "Vehicle size", id = "size" }) {
  const refs = useRef([]);
  const sizes = brand.vehicleSizes;
  const idx = Math.max(0, sizes.findIndex((s) => s.id === value));

  const onKey = (e) => {
    let n = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (idx + 1) % sizes.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (idx - 1 + sizes.length) % sizes.length;
    else return;
    e.preventDefault();
    onChange(sizes[n].id);
    refs.current[n]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      id={id}
      className="relative inline-grid w-full grid-cols-3 rounded-full border border-line bg-graphite p-1 sm:w-auto"
      onKeyDown={onKey}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-1 top-1 rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{ width: `calc((100% - 0.5rem) / ${sizes.length})`, left: "0.25rem", transform: `translateX(${idx * 100}%)` }}
      />
      {sizes.map((s, i) => {
        const on = s.id === value;
        return (
          <button
            key={s.id}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(s.id)}
            className={`relative z-10 min-h-11 whitespace-nowrap rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-300 sm:px-6 ${
              on ? "text-accent-ink" : "text-chrome/80 hover:text-chrome"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
