"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import brand from "@/brand.config";
import images from "@/lib/images";
import { gsap, ScrollTrigger, reveal, useMotionMode } from "@/lib/motion";

const PAIRS = [
  { id: "interior", label: "Interior", before: "baInteriorBefore", after: "baInteriorAfter" },
  { id: "paint", label: "Paint", before: "baPaintBefore", after: "baPaintAfter" },
];

export default function BeforeAfter() {
  const [tab, setTab] = useState(0);
  const [pos, setPos] = useState(50);
  const root = useRef(null);
  const frame = useRef(null);
  const dragging = useRef(false);
  const swept = useRef(false);
  const sweep = useRef(null);
  const motion = useMotionMode();

  const setFromX = useCallback((clientX) => {
    const r = frame.current.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, p)));
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal("[data-head]", motion, { y: 30 });
      reveal(frame.current, motion, { y: 40 });
      if (!motion.animate) return;
      ScrollTrigger.create({
        trigger: frame.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          if (swept.current || dragging.current) return;
          swept.current = true;
          const o = { p: 50 };
          sweep.current = gsap
            .timeline({ delay: 0.3, onUpdate: () => setPos(o.p) })
            .to(o, { p: 78, duration: motion.d(0.8), ease: "power2.inOut" })
            .to(o, { p: 24, duration: motion.d(1.1), ease: "power2.inOut" })
            .to(o, { p: 50, duration: motion.d(0.8), ease: "power2.inOut" });
        },
      });
    }, root);
    return () => ctx.revert();
  }, [motion.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopSweep = () => {
    swept.current = true;
    sweep.current?.kill();
  };

  const onPointerDown = (e) => {
    dragging.current = true;
    stopSweep();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromX(e.clientX);
  };
  const onPointerMove = (e) => dragging.current && setFromX(e.clientX);
  const onPointerUp = () => (dragging.current = false);

  const onKey = (e) => {
    const step = e.shiftKey ? 10 : 2;
    let n = pos;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") n = pos - step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") n = pos + step;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = 100;
    else if (e.key === "PageDown") n = pos - 10;
    else if (e.key === "PageUp") n = pos + 10;
    else return;
    e.preventDefault();
    setPos(Math.min(100, Math.max(0, n)));
  };

  const pair = PAIRS[tab];
  const before = images[pair.before];
  const after = images[pair.after];

  return (
    <section id="results" ref={root} className="section border-t border-line" aria-labelledby="results-title">
      <div className="wrap">
        <div data-head className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label mb-4 text-muted">Results</p>
            <h2 id="results-title" className="h2">
              Drag to see <span className="h-light">the difference.</span>
            </h2>
          </div>
          <div role="tablist" aria-label="Before and after examples" className="flex gap-2">
            {PAIRS.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                id={`ba-tab-${p.id}`}
                aria-selected={tab === i}
                aria-controls="ba-panel"
                tabIndex={tab === i ? 0 : -1}
                onClick={() => {
                  setTab(i);
                  setPos(50);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + PAIRS.length) % PAIRS.length;
                    setTab(n);
                    setPos(50);
                    document.getElementById(`ba-tab-${PAIRS[n].id}`)?.focus();
                  }
                }}
                className={`min-h-11 rounded-full border px-5 text-[0.9375rem] font-medium transition-colors ${
                  tab === i ? "border-accent bg-accent text-accent-ink" : "border-line text-chrome/85 hover:border-muted"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div
          id="ba-panel"
          role="tabpanel"
          aria-labelledby={`ba-tab-${pair.id}`}
          ref={frame}
          className="relative mt-10 aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-[1.25rem] border border-line bg-graphite sm:aspect-[16/9]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <Image key={after.src} src={after.src} alt={after.alt} fill sizes="(min-width: 1440px) 1300px, 100vw" className="object-cover" draggable={false} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Image key={before.src} src={before.src} alt={before.alt} fill sizes="(min-width: 1440px) 1300px, 100vw" className="object-cover" draggable={false} />
          </div>

          <span className="label absolute left-4 top-4 z-[3] rounded-full bg-asphalt/75 px-3 py-1.5 backdrop-blur">Before</span>
          <span className="label absolute right-4 top-4 z-[3] rounded-full bg-accent px-3 py-1.5 text-accent-ink">After</span>
          {brand.showPhotoNotes ? (
            <>
              <span className="photo-note !left-3 !right-auto">Your photos go here</span>
              <span className="photo-note">Your photos go here</span>
            </>
          ) : null}

          <div className="absolute inset-y-0 z-[4] w-0" style={{ left: `${pos}%` }}>
            <div className="absolute inset-y-0 -left-px w-0.5 bg-chrome/90 shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
            <div
              role="slider"
              tabIndex={0}
              aria-label={`${pair.label} before and after comparison`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)}% before`}
              onKeyDown={onKey}
              onFocus={stopSweep}
              className="absolute left-0 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-chrome/40 bg-asphalt/70 backdrop-blur-md"
            >
              <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true">
                <path d="M6 1L1 6l5 5M16 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[0.9375rem] text-muted">Drag, swipe, or use the arrow keys.</p>
      </div>
    </section>
  );
}
