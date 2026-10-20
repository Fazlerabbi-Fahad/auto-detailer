"use client";

import { useLayoutEffect, useRef } from "react";
import brand from "@/brand.config";
import { gsap, reveal, useMotionMode } from "@/lib/motion";

export default function AddOns() {
  const root = useRef(null);
  const motion = useMotionMode();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => reveal("[data-chip]", motion, { trigger: root.current, y: 20, stagger: 0.05 }), root);
    return () => ctx.revert();
  }, [motion.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={root} className="pb-[var(--section-y)]" aria-labelledby="addons-title">
      <div className="wrap">
        <div className="rounded-[1.25rem] border border-line p-6 sm:p-8 lg:flex lg:items-center lg:gap-12">
          <div className="mb-6 shrink-0 lg:mb-0 lg:w-64">
            <h2 id="addons-title" className="font-display text-[1.75rem] font-bold leading-none tracking-[-0.02em]">
              Add-ons
            </h2>
            <p className="mt-2 text-[0.9375rem] text-muted">Stack onto any package.</p>
          </div>
          <ul className="grid flex-1 grid-cols-1 gap-2 min-[420px]:grid-cols-2 md:grid-cols-3">
            {brand.addOns.map((a) => (
              <li
                key={a.id}
                data-chip
                className="flex min-h-12 items-center justify-between gap-3 rounded-full border border-line bg-graphite px-5 py-2"
              >
                <span className="text-[0.9375rem]">{a.name}</span>
                <span className="price text-[0.9375rem]">+${a.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
