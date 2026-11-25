"use client";

import { useId, useState } from "react";

// A small themed label that appears above an icon-only button/link on
// hover or keyboard focus — so a visitor can tell what a bare icon
// does (which social network, that it's a PDF download, etc.) before
// committing to the click. Reads the site's own tokens, so it matches
// whichever theme is active without any extra wiring.
//
// No cloneElement/prop-merging onto the child: a plain wrapping <span>
// already receives mouseenter/mouseleave for a hovered descendant (DOM
// bubbling), and React's onFocus/onBlur are implemented on top of the
// bubbling focusin/focusout events, so they fire here too. The child
// keeps its own aria-label/title as the real accessible name; this is
// a purely visual layer on top.
export function IconTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[8px] border border-line bg-panel px-2.5 py-1 font-mono text-[11px] text-ink transition-opacity duration-150 [backdrop-filter:blur(12px)] [box-shadow:var(--shadow)]"
        style={{ opacity: show ? 1 : 0 }}
      >
        {label}
      </span>
    </span>
  );
}
