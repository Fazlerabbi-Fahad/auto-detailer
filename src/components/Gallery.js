"use client";

import { useLayoutEffect, useRef } from "react";
import Photo from "./Photo";
import { gsap, reveal, useMotionMode } from "@/lib/motion";

const SHOTS = [
  { id: "galPolisher", cap: "Paint correction", w: "w-[78vw] sm:w-[46vw] lg:w-[34vw]", ar: "aspect-[4/3]" },
  { id: "galFoam", cap: "Foam pre-soak", w: "w-[60vw] sm:w-[30vw] lg:w-[22vw]", ar: "aspect-[3/4]" },
  { id: "galWheel", cap: "Wheels & tires", w: "w-[78vw] sm:w-[46vw] lg:w-[34vw]", ar: "aspect-[4/3]" },
  { id: "galInterior", cap: "Interior detail", w: "w-[78vw] sm:w-[46vw] lg:w-[34vw]", ar: "aspect-[4/3]" },
  { id: "galHandwash", cap: "Two-bucket hand wash", w: "w-[60vw] sm:w-[30vw] lg:w-[22vw]", ar: "aspect-[3/4]" },
  { id: "galFinished", cap: "Finished", w: "w-[78vw] sm:w-[46vw] lg:w-[34vw]", ar: "aspect-[4/3]" },
];

export default function Gallery({ biz }) {
  const root = useRef(null);
  const strip = useRef(null);
  const motion = useMotionMode();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal("[data-head]", motion, { y: 30 });
      if (!motion.animate) return;
      gsap.utils.toArray("[data-shot]").forEach((el, i) => {
        el.setAttribute("data-anim", "");
        gsap.fromTo(
          el,
          { clipPath: "inset(12% 12% 12% 12% round 20px)", opacity: 0.2 },
          {
            clipPath: "inset(0% 0% 0% 0% round 20px)",
            opacity: 1,
            duration: motion.d(1.2),
            delay: Math.min(i, 3) * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: strip.current, start: "top 80%", once: true },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [motion.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mouse drag-to-scroll (touch already scrolls natively).
  useLayoutEffect(() => {
    const el = strip.current;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const onDown = (e) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
      el.style.cursor = "";
    };
    const onClick = (e) => moved && e.preventDefault();
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <section ref={root} className="section border-t border-line" aria-labelledby="gallery-title">
      <div className="wrap flex items-end justify-between gap-6">
        <div data-head>
          <p className="label mb-4 text-muted">Gallery</p>
          <h2 id="gallery-title" className="h2 max-w-[16ch]">
            Recent work <span className="h-light">around {biz.city}</span>
          </h2>
        </div>
        <p className="label hidden text-muted md:block" aria-hidden="true">
          Drag &rarr;
        </p>
      </div>
      <div
        ref={strip}
        tabIndex={0}
        role="region"
        aria-label="Gallery of recent work, scrolls sideways"
        data-lenis-prevent-wheel=""
        className="no-scrollbar mt-12 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[var(--page-x)] pb-2 [scroll-padding-inline:var(--page-x)] min-[1440px]:px-[calc((100vw-1440px)/2+var(--page-x))]"
      >
        {SHOTS.map((s) => (
          <figure key={s.id} className={`shrink-0 snap-start ${s.w}`}>
            <div data-shot className={`relative overflow-hidden rounded-[1.25rem] bg-graphite ${s.ar}`}>
              <Photo id={s.id} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 46vw, 78vw" className="pointer-events-none" />
            </div>
            <figcaption className="label mt-3 text-muted">{s.cap}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
