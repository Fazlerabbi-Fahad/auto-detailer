"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useMotionMode } from "@/lib/motion";

/**
 * Lenis wired to the GSAP ticker, ScrollTrigger refreshes after images/fonts load,
 * and a safety net that reveals any [data-anim] element still hidden 3s after it enters view.
 */
export default function MotionRoot() {
  const motion = useMotionMode();

  useEffect(() => {
    if (!motion.smoothScroll) return;
    const lenis = new Lenis({ anchors: { offset: -72 }, lerp: 0.12, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [motion.smoothScroll]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    let t;
    const debounced = () => {
      clearTimeout(t);
      t = setTimeout(refresh, 150);
    };
    const imgs = [...document.images].filter((i) => !i.complete);
    imgs.forEach((i) => i.addEventListener("load", debounced, { once: true }));
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      clearTimeout(t);
      imgs.forEach((i) => i.removeEventListener("load", debounced));
      window.removeEventListener("load", refresh);
    };
  }, []);

  // Fallback: anything still hidden 3 seconds after entering the viewport gets revealed.
  useEffect(() => {
    const timers = new Map();
    const reveal = (el) => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.99 || cs.visibility === "hidden" || el.style.clipPath) {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "opacity,visibility,transform,clipPath" });
      }
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !timers.has(e.target)) {
          timers.set(
            e.target,
            setTimeout(() => reveal(e.target), 3000),
          );
        }
      });
    });
    const observe = () => document.querySelectorAll("[data-anim]").forEach((el) => io.observe(el));
    observe();
    const late = setTimeout(observe, 1000);
    return () => {
      clearTimeout(late);
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
