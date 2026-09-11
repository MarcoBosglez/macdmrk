"use client";

import { useEffect, useState } from "react";

// Feature-scoped only — the site otherwise always animates by default
// (no global toggle). Used by the hub's QR/social bar/pingu chat to
// skip their own hover transforms, bounce, blink and typewriter.
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
