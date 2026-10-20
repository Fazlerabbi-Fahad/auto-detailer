"use client";

import { useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import brand from "@/brand.config";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

function resolve(prefersReduced) {
  const setting = brand.motion?.respectReducedMotion || "off";
  let mode = "full";
  if (prefersReduced && setting === "soften") mode = "soft";
  if (prefersReduced && setting === "strict") mode = "none";
  return {
    mode,
    full: mode === "full",
    animate: mode !== "none",
    parallax: mode === "full",
    smoothScroll: mode === "full",
    // duration multiplier
    d: (s) => (mode === "soft" ? s * 0.6 : s),
    // travel distance in px, capped at 24px when softened
    y: (px) => (mode === "soft" ? Math.sign(px) * Math.min(Math.abs(px), 24) : px),
  };
}

/**
 * The only place that reads prefers-reduced-motion. Every animated component uses this.
 */
export function useMotionMode() {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return resolve(reduced);
}

/**
 * Fade/rise reveal on scroll. Call inside gsap.context(). Hidden state is set by GSAP only,
 * never by CSS, so if JS fails the content is simply visible.
 */
export function reveal(targets, motion, { trigger, y = 40, stagger = 0.08, start = "top 85%", duration = 0.9 } = {}) {
  if (!motion.animate) return;
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;
  els.forEach((el) => el.setAttribute("data-anim", ""));
  return gsap.from(els, {
    opacity: 0,
    y: motion.y(y),
    duration: motion.d(duration),
    ease: "power3.out",
    stagger,
    scrollTrigger: { trigger: trigger || els[0], start, once: true },
  });
}

/** Scroll smoothly (via Lenis when it is running) to an element id. */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
