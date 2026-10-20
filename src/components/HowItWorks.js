"use client";

import { useLayoutEffect, useRef } from "react";
import brand from "@/brand.config";
import Photo from "./Photo";
import { gsap, reveal, useMotionMode } from "@/lib/motion";

export default function HowItWorks({ biz }) {
  const root = useRef(null);
  const motion = useMotionMode();

  const steps = [
    { n: "01", title: "Book online in a minute", body: "Pick a package, a day, and a time window. No phone tag." },
    {
      n: "02",
      title: `We arrive at your home or office in ${biz.city}`,
      body: "With our own water and power. You don't lift a finger or a hose.",
    },
    { n: "03", title: "Walk out to a showroom-clean car", body: "We do a final walk-around with you before we leave." },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (!motion.full) {
          reveal("[data-step]", motion, { trigger: "[data-steps]", y: 30, stagger: 0.12 });
          return;
        }
        // Inactive steps are dimmed with color (still AA contrast), never with opacity.
        const stepsEls = gsap.utils.toArray("[data-step]");
        const setActive = (n) => stepsEls.forEach((el, i) => el.toggleAttribute("data-dim", i !== n));
        setActive(0);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (st) => setActive(Math.min(stepsEls.length - 1, Math.floor(st.progress * stepsEls.length))),
          },
        });
        tl.fromTo("[data-progress]", { scaleY: 0 }, { scaleY: 1, duration: 3 }, 0);
        tl.fromTo("[data-how-img]", { scale: 1.12 }, { scale: 1, duration: 3 }, 0);
        return () => stepsEls.forEach((el) => el.removeAttribute("data-dim"));
      });
      mm.add("(max-width: 1023px)", () => {
        reveal("[data-step]", motion, { trigger: "[data-steps]", y: 30, stagger: 0.12 });
      });
    }, root);
    return () => ctx.revert();
  }, [motion.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="how" ref={root} className="border-t border-line" aria-labelledby="how-title">
      <div data-pin className="lg:flex lg:min-h-[100svh] lg:items-center">
        <div className="wrap section grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="flex flex-col">
            <p className="label mb-4 text-muted">How it works</p>
            <h2 id="how-title" className="h2">
              We come <span className="h-light">to you.</span>
            </h2>
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-line lg:block">
              <div data-how-img className="absolute inset-0">
                <Photo id="detailer" sizes="(min-width: 1024px) 40vw, 100vw" note={false} />
              </div>
              {brand.showPhotoNotes ? <span className="photo-note">Your photos go here</span> : null}
            </div>
          </div>

          <div data-steps className="relative flex flex-col justify-center">
            <div className="absolute bottom-2 left-0 top-2 hidden w-0.5 rounded-full bg-line lg:block" aria-hidden="true">
              <div data-progress className="h-full w-full origin-top rounded-full bg-accent" />
            </div>
            <ol className="flex flex-col gap-10 lg:gap-16 lg:pl-12">
              {steps.map((s) => (
                <li key={s.n} data-step className="group grid grid-cols-[auto_1fr] gap-x-6">
                  <span className="font-mono text-[2.5rem] font-medium leading-none text-accent-text transition-colors duration-500 group-data-[dim]:text-muted lg:text-[3.25rem]">
                    {s.n}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-[1.5rem] font-bold leading-[1.1] tracking-[-0.02em] transition-colors duration-500 group-data-[dim]:text-muted lg:text-[2rem]">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-[30rem] text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
