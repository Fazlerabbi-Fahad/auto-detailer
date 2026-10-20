"use client";

import { useEffect, useState } from "react";

/** Mobile-only bar: appears after the hero, hides while #book is on screen. */
export default function StickyBar({ biz }) {
  const [pastHero, setPastHero] = useState(false);
  const [atBook, setAtBook] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const book = document.getElementById("book");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === book) setAtBook(e.isIntersecting);
      });
    });
    if (hero) io.observe(hero);
    if (book) io.observe(book);
    return () => io.disconnect();
  }, []);

  const show = pastHero && !atBook;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-graphite/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      inert={!show}
    >
      <div className="flex gap-2">
        <a href="#book" className="btn btn-accent flex-1">
          Book now
        </a>
        {biz.phone ? (
          <a href={`sms:+1${biz.phone}`} className="btn btn-ghost w-14 !px-0" aria-label={`Text ${biz.name} at ${biz.phoneDisplay}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 5h16v11H9l-5 4V5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : null}
      </div>
    </div>
  );
}
