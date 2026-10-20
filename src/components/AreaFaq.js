"use client";

import { useLayoutEffect, useRef, useState } from "react";
import brand from "@/brand.config";
import { gsap, reveal, useMotionMode } from "@/lib/motion";

function faqs(biz) {
  const inCity = biz.hasCity ? `in ${biz.city}` : "in your area";
  return [
    {
      q: "Do you need my water or power?",
      a: `No. ${biz.name} rolls up with a self-contained rig: our own water tank, generator, and spot-free rinse. All we need is room to park next to your car.`,
    },
    {
      q: "How long does a full detail take?",
      a: "About 3 to 4 hours for most sedans, a little longer for large SUVs and trucks. Ceramic coating is a full-day job, so we'll plan around your schedule.",
    },
    {
      q: "What if it rains?",
      a: `We watch the forecast for ${biz.city}. If rain is coming we'll text you the day before to reschedule at no charge, or work under a garage or carport if you have one.`,
    },
    {
      q: "Do you detail at my office?",
      a: `Yes. Plenty of our clients ${inCity} book us for the office parking lot while they work. Just check that your building allows it and tell us where the car is.`,
    },
    {
      q: "How do I pay?",
      a: "Nothing is charged when you book. You pay when the job is done and you're happy with it, by card, Apple Pay, Zelle, or cash.",
    },
    {
      q: "How often should I get a ceramic coating?",
      a: "A pro-grade coating lasts about 3 years with proper care. We recommend a maintenance wash every 4 to 6 weeks to keep it performing.",
    },
  ];
}

export default function AreaFaq({ biz }) {
  const [open, setOpen] = useState(0);
  const root = useRef(null);
  const motion = useMotionMode();
  const areas = brand.serviceAreas?.length ? brand.serviceAreas : [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal("[data-col]", motion, { y: 30, stagger: 0.12 });
    }, root);
    return () => ctx.revert();
  }, [motion.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = faqs(biz);

  return (
    <section ref={root} className="section border-t border-line" aria-labelledby="faq-title">
      <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div data-col>
          <p className="label mb-4 text-muted">Service area</p>
          <h2 className="h2">
            Proudly serving <span className="text-accent-text">{biz.city}</span>{" "}
            <span className="h-light">and nearby areas.</span>
          </h2>
          {areas.length ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {areas.map((a) => (
                <li key={a} className="label rounded-full border border-line px-4 py-2 text-chrome/85">
                  {a}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-8 max-w-[28rem] text-muted">
            Not sure if you&rsquo;re in range? Put your address in the booking form and we&rsquo;ll confirm by text.
          </p>
        </div>

        <div data-col>
          <h2 id="faq-title" className="label mb-4 text-muted">
            Questions
          </h2>
          <ul className="border-t border-line">
            {list.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[1.125rem] font-medium"
                    >
                      {f.q}
                      <span
                        aria-hidden="true"
                        className={`relative h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 text-accent" : ""}`}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                    inert={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[40rem] pb-6 text-muted">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
