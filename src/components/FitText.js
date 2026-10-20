"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Measures and steps the font size so the text never overflows its box.
 * mode "wrap": words may wrap between words (never mid-word), at most `maxLines` lines.
 * mode "line": single line, scaled to fill the box width edge to edge.
 * Re-fits on resize and after web fonts load.
 */
export default function FitText({ as: Tag = "span", mode = "wrap", maxLines = 3, max, min = 16, wrapBelow = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null);

  useIso(() => {
    const el = ref.current;
    if (!el) return;
    const box = el.parentElement;
    let raf;

    const fit = () => {
      el.style.fontSize = "";
      el.style.textWrap = "";
      const cssMax = max ?? parseFloat(getComputedStyle(el).fontSize);
      const width = box.clientWidth;
      if (!width) return;

      if (mode === "line") {
        el.style.whiteSpace = "nowrap";
        el.style.fontSize = "100px";
        el.style.display = "inline-block";
        const w = el.getBoundingClientRect().width;
        el.style.display = "block";
        const size = Math.min(cssMax, (100 * width) / w) * 0.995;
        // Very long names on narrow screens: wrap onto balanced lines instead of shrinking to nothing.
        if (size >= wrapBelow) {
          el.style.fontSize = `${size}px`;
          return;
        }
        el.style.whiteSpace = "normal";
        el.style.textWrap = "balance";
      }

      let size = mode === "line" ? Math.min(cssMax, wrapBelow * 1.6) : cssMax;
      for (let i = 0; i < 60; i++) {
        el.style.fontSize = `${size}px`;
        const lh = parseFloat(getComputedStyle(el).lineHeight) || size;
        const lines = Math.round(el.offsetHeight / lh);
        if ((el.scrollWidth <= el.clientWidth + 1 && lines <= maxLines) || size <= min) break;
        size = Math.max(min, size * 0.94);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };

    fit();
    document.fonts?.ready.then(schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(box);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [mode, maxLines, max, min, wrapBelow, children]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: "block", overflowWrap: "normal", wordBreak: "keep-all", hyphens: "none", ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
