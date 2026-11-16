"use client";

import { useEffect, useState } from "react";

// Same tokens as project-page.tsx — reads the active 4-theme palette.
const BORDER = "var(--line)";
const DIM = "var(--ink2)";
const MUTED = "var(--ink2)";
const ACCENT = "var(--acc)";

// Scroll-spy for the case-study sections, drawn as a segmented
// progress bar — each section gets an equal-width tick that fills in
// as you scroll past it, with its label below. The page's own scroll
// container is tagged with [data-project-scroll] (not the window —
// on desktop the window never scrolls here, see MainShell's
// md:overflow-hidden), so this looks that up as the observer root
// instead of assuming document-level scroll. `topOffset` is the top
// bar's measured height, passed down by the page — it varies (the bar
// wraps to two rows on narrow screens), so a hardcoded offset would
// drift out of sync with it.
export function ProgressNav({
  sections,
  topOffset,
}: {
  sections: { id: string; label: string }[];
  topOffset: number;
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-project-scroll]");
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActive(top.target.id);
      },
      { root, rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  const activeIndex = sections.findIndex((s) => s.id === active);

  return (
    <nav
      aria-label="Section progress"
      className="sticky z-10 mx-auto flex w-full max-w-[1100px] rounded-[16px] border px-4 py-3 md:px-6"
      style={{
        top: topOffset,
        borderColor: BORDER,
        background: "color-mix(in srgb, var(--bg) 92%, transparent)",
        backdropFilter: "blur(16px)",
      }}
    >
      {sections.map((s, i) => {
        const passed = i <= activeIndex;
        const isActive = i === activeIndex;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={isActive ? "true" : undefined}
            className="flex min-w-0 flex-1 flex-col gap-2 pr-2"
          >
            <span className="block h-[3px] w-full rounded-full transition-colors" style={{ background: passed ? ACCENT : BORDER }} />
            <span
              className="truncate font-mono text-[10px] tracking-[0.06em] uppercase"
              style={{ color: isActive ? ACCENT : passed ? DIM : MUTED, fontWeight: isActive ? 700 : 500 }}
            >
              {String(i + 1).padStart(2, "0")} {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
