"use client";

import { useEffect, useRef } from "react";
import { gsap, useMotionMode } from "@/lib/motion";

/** Mono price that counts to its new value when it changes. */
export default function Price({ value, className = "" }) {
  const ref = useRef(null);
  const prev = useRef(value);
  const motion = useMotionMode();

  useEffect(() => {
    const el = ref.current;
    const from = prev.current;
    prev.current = value;
    if (!el || from === value) return;
    if (!motion.animate) {
      el.textContent = `$${value}`;
      return;
    }
    const o = { v: from };
    const tw = gsap.to(o, {
      v: value,
      duration: motion.d(0.6),
      ease: "power3.out",
      onUpdate: () => (el.textContent = `$${Math.round(o.v)}`),
    });
    gsap.fromTo(el, { y: motion.y(-6), opacity: 0.4 }, { y: 0, opacity: 1, duration: motion.d(0.4) });
    return () => tw.kill();
  }, [value, motion.animate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className={`price inline-block ${className}`}>
      ${value}
    </span>
  );
}
