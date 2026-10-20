"use client";

import { useLayoutEffect, useRef } from "react";
import Photo from "./Photo";
import FitText from "./FitText";
import { gsap, useMotionMode } from "@/lib/motion";

export default function Hero({ biz }) {
  const root = useRef(null);
  const motion = useMotionMode();

  const words = biz.name.split(" ");
  const longest = Math.max(...words.map((w) => w.length), 4);
  const total = biz.name.length + 1;
  // First-paint estimate (server-rendered); FitText then measures and fine-tunes.
  const firstPaintSize = `min(clamp(3rem, 9vw, 8.5rem), calc((min(100vw, 1440px) - 2 * var(--page-x)) / ${(longest * 0.64).toFixed(2)}), calc(3 * (min(100vw, 1440px) - 2 * var(--page-x)) / ${(total * 0.6).toFixed(2)}))`;

  useLayoutEffect(() => {
    if (!motion.animate) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-line]", { yPercent: 110, duration: motion.d(1.1), stagger: 0.1 })
        .from("[data-fade]", { opacity: 0, y: motion.y(20), duration: motion.d(0.9), stagger: 0.08, ease: "power3.out" }, "-=0.7");
      gsap.fromTo("[data-hero-img]", { scale: 1 }, { scale: 1.06, duration: 16, ease: "none" });
      if (motion.parallax) {
        gsap.to("[data-hero-media]", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, root);
    return () => ctx.revert();
  }, [motion.animate, motion.parallax]); // eslint-disable-line react-hooks/exhaustive-deps

  const trust = ["Fully insured", "We bring water & power", "5-star rated", `Serving ${biz.city}`];

  return (
    <section id="top" ref={root} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden" aria-labelledby="hero-title">
      <div data-hero-media className="absolute inset-0 -z-10">
        <div data-hero-img className="absolute inset-0 will-change-transform">
          <Photo id="hero" sizes="100vw" priority quality={60} note={false} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,14,0.55)_0%,rgba(11,12,14,0.2)_30%,rgba(11,12,14,0.75)_70%,#0B0C0E_100%)] lg:bg-[linear-gradient(90deg,rgba(11,12,14,0.92)_0%,rgba(11,12,14,0.7)_38%,rgba(11,12,14,0.1)_75%),linear-gradient(180deg,transparent_70%,#0B0C0E_100%)]" />
      </div>

      <div className="wrap flex flex-1 flex-col justify-end pb-8 pt-28 lg:pb-12">
        <div className="max-w-[1180px]">
          <p data-fade className="label mb-5 text-chrome/90">
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-accent align-middle" aria-hidden="true" />
            Mobile detailing in {biz.city}
          </p>
          <h1 id="hero-title" className="h1">
            <span className="mask">
              <span data-line className="block">
                <FitText maxLines={3} min={28} style={{ fontSize: firstPaintSize }}>
                  {biz.name}.
                </FitText>
              </span>
            </span>
            <span className="mask mt-3">
              <span data-line className="h-light block text-[0.42em] leading-[1.02] text-chrome/95 sm:text-[0.38em]">
                Showroom shine, in your driveway.
              </span>
            </span>
          </h1>
          <p data-fade className="mt-6 max-w-[34rem] text-[1.0625rem] text-chrome/85 sm:text-lg">
            We come to your home or office anywhere in {biz.city}. Book in under a minute.
          </p>
          <div data-fade className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#book" className="btn btn-accent px-7 text-base">
              Book a detail
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </a>
            <a href="#packages" className="inline-flex min-h-11 items-center underline decoration-line decoration-1 underline-offset-[6px] hover:decoration-chrome">
              See packages
            </a>
          </div>
        </div>
        <ul data-fade className="label mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-line/80 pt-5 text-chrome/80 lg:mt-16">
          {trust.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
