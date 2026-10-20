"use client";

import { useLayoutEffect, useRef } from "react";
import brand from "@/brand.config";
import Photo from "./Photo";
import Price from "./Price";
import SizeToggle from "./SizeToggle";
import { useBooking } from "./BookingContext";
import { gsap, reveal, useMotionMode } from "@/lib/motion";

export default function Packages() {
  const { size, setSize, bookPackage } = useBooking();
  const root = useRef(null);
  const motion = useMotionMode();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal("[data-head]", motion, { y: 30 });
      reveal("[data-card]", motion, { trigger: "[data-grid]", y: 60, stagger: 0.1 });
    }, root);
    return () => ctx.revert();
  }, [motion.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="packages" ref={root} className="section relative" aria-labelledby="packages-title">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div data-head>
            <p className="label mb-4 text-muted">Packages &amp; pricing</p>
            <h2 id="packages-title" className="h2 max-w-[14ch]">
              Pick your shine. <span className="h-light text-muted">Prices up front.</span>
            </h2>
          </div>
          <div data-head className="flex flex-col gap-3 lg:items-end">
            <span className="label text-muted" id="size-label">
              Your vehicle
            </span>
            <SizeToggle value={size} onChange={setSize} id="pkg-size" label="Vehicle size for package prices" />
          </div>
        </div>

        <ul data-grid className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {brand.packages.map((p) => (
            <li
              key={p.id}
              data-card
              className={`group relative flex flex-col overflow-hidden rounded-[1.25rem] border bg-graphite ${
                p.popular ? "border-accent shadow-[0_30px_80px_-40px_var(--accent)]" : "border-line"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Photo
                  id={p.image}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
                />
                {p.popular ? (
                  <span className="label absolute left-3 top-3 z-[3] rounded-full bg-accent px-3 py-1.5 text-accent-ink">Most popular</span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[1.625rem] font-bold leading-[1.05] tracking-[-0.02em] xl:min-h-[2.1em]">{p.name}</h3>
                  <span className="label mt-1.5 shrink-0 text-muted">{p.duration}</span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <Price value={p.prices[size]} className="text-[2.75rem] leading-none tracking-[-0.03em]" />
                  <span className="label text-muted">
                    {brand.vehicleSizes.find((s) => s.id === size)?.label}
                  </span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-line pt-5 text-[0.9375rem] text-chrome/85">
                  {p.includes.map((line) => (
                    <li key={line} className="flex gap-3">
                      <svg className="mt-[0.45em] shrink-0 text-accent" width="12" height="10" viewBox="0 0 12 10" aria-hidden="true">
                        <path d="M1 5l3.5 3.5L11 1" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      {line}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => bookPackage(p.id, size)}
                  className={`btn mt-7 w-full ${p.popular ? "btn-accent" : "btn-ghost hover:bg-chrome hover:text-asphalt"}`}
                  aria-label={`Book ${p.name}`}
                >
                  Book this
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="label mt-6 text-muted">Sample prices. Final quote confirmed before we start.</p>
      </div>
    </section>
  );
}
