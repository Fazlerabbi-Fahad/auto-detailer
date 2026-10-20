"use client";

import { useEffect, useState } from "react";

export default function ConceptBar({ name }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("concept-bar-hidden") === "1") setOpen(false);
    } catch {}
  }, []);

  if (!open) return null;

  return (
    <div role="region" aria-label="About this concept site" className="relative z-[60] border-b border-line bg-graphite text-chrome">
      <div className="wrap flex min-h-11 items-center gap-3 py-1.5 pr-1">
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <p className="min-w-0 flex-1 text-[0.8125rem] leading-snug">
          Concept site made for <strong className="font-medium">{name}</strong>.{" "}
          <span className="text-muted">Your photos, prices, and reviews go here.</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            try {
              sessionStorage.setItem("concept-bar-hidden", "1");
            } catch {}
          }}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted hover:text-chrome"
          aria-label="Dismiss concept notice"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
