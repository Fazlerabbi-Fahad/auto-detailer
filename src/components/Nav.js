"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, scrollToId, useMotionMode } from "@/lib/motion";

const LINKS = [
  { href: "#packages", label: "Packages" },
  { href: "#results", label: "Results" },
  { href: "#how", label: "How it works" },
  { href: "#book", label: "Book" },
];

export default function Nav({ biz }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const motion = useMotionMode();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const lenis = window.__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const items = menuRef.current?.querySelectorAll("[data-menu-item]");
    if (motion.animate && items) {
      gsap.fromTo(
        items,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: motion.d(0.7), ease: "power4.out", stagger: 0.06 },
      );
    }
    menuRef.current?.querySelector("a,button")?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      btnRef.current?.focus();
    };
  }, [open, motion.animate]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToId(href.slice(1)), 60);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 -mb-[72px] h-[72px] transition-[background-color,backdrop-filter,border-color] duration-300 ${
          scrolled ? "border-b border-line bg-graphite/80 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Main" className="wrap flex h-full items-center justify-between gap-4">
          <a
            href="#top"
            className={`font-display max-w-[68vw] font-bold leading-[1.05] tracking-[-0.01em] sm:max-w-[38vw] lg:max-w-[28vw] ${
              biz.name.length > 24 ? "line-clamp-3 text-[0.875rem] lg:text-[1rem]" : "line-clamp-2 text-[1.0625rem] lg:text-[1.25rem]"
            }`}
          >
            {biz.name}
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] text-chrome/85 hover:text-chrome">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            {biz.phone ? (
              <a href={`tel:+1${biz.phone}`} className="label hidden min-h-11 items-center px-3 text-chrome/90 hover:text-chrome md:inline-flex">
                {biz.phoneDisplay}
              </a>
            ) : null}
            <a href="#book" className="btn btn-accent hidden sm:inline-flex">
              Book now
            </a>
            <button
              ref={btnRef}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
                <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {open ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[70] flex flex-col bg-asphalt"
        >
          <div className="wrap flex h-[72px] items-center justify-between">
            <span className="font-display line-clamp-2 max-w-[70vw] text-[1.0625rem] font-bold leading-[1.05]">{biz.name}</span>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <ul className="wrap mt-8 flex flex-1 flex-col gap-2">
            {LINKS.map((l, i) => (
              <li key={l.href} className="overflow-hidden">
                <a
                  data-menu-item
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className="font-display flex items-baseline gap-4 py-2 text-[2.75rem] font-bold leading-none tracking-[-0.03em]"
                >
                  <span className="label text-muted">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="wrap flex flex-col gap-3 pb-[max(2rem,env(safe-area-inset-bottom))]">
            {biz.phone ? (
              <a href={`tel:+1${biz.phone}`} className="btn btn-ghost font-mono">
                Call {biz.phoneDisplay}
              </a>
            ) : null}
            <a href="#book" onClick={(e) => go(e, "#book")} className="btn btn-accent">
              Book now
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
