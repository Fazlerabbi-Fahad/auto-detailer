"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, reveal, useMotionMode } from "@/lib/motion";

// Placeholder reviews. Generic first names, not tied to real people, always labeled as samples.
const REVIEWS = [
  {
    quote: "Booked on my lunch break, came out to a car that looked better than the day I bought it. They didn't even need my hose.",
    name: "Marcus",
    area: "Northside",
  },
  {
    quote: "Two kids and a golden retriever. I honestly thought the back seat was a lost cause. It wasn't.",
    name: "Jenna",
    area: "Lakeview",
  },
  {
    quote: "Got the ceramic coating in the spring. Every rainstorm since, the water just rolls off. Worth every dollar.",
    name: "Daniel",
    area: "Westgate",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 text-accent" role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <path fill="currentColor" d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const root = useRef(null);
  const motion = useMotionMode();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal("[data-head]", motion, { y: 30 });
      reveal("[data-review]", motion, { trigger: "[data-reviews]", y: 50, stagger: 0.1 });
    }, root);
    return () => ctx.revert();
  }, [motion.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={root} className="section border-t border-line grain" aria-labelledby="reviews-title">
      <div className="wrap">
        <div data-head className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label mb-4 text-muted">Reviews</p>
            <h2 id="reviews-title" className="h2">
              Five stars, <span className="h-light">driveway by driveway.</span>
            </h2>
          </div>
        </div>
        <ul data-reviews className="mt-12 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.name} data-review className="flex flex-col rounded-[1.25rem] border border-line bg-graphite p-7">
              <p className="label mb-6 self-start rounded-full border border-dashed border-line px-3 py-1.5 text-[0.6875rem] normal-case tracking-[0.04em] text-muted">
                Sample review: your Google reviews go here
              </p>
              <Stars />
              <blockquote className="mt-5 flex-1 text-[1.125rem] leading-[1.55] text-chrome">&ldquo;{r.quote}&rdquo;</blockquote>
              <p className="mt-6 border-t border-line pt-4">
                <span className="font-medium">{r.name}</span>
                <span className="label ml-3 text-muted">{r.area}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
