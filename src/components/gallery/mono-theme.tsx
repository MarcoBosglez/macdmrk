"use client";

import { useEffect } from "react";

// Section color swaps the site's green palette
// for a near-monochrome one while it's open, via a class on <html> (so
// it reaches the aurora/chrome bar too, not just this page's own
// markup) — see `html.theme-mono` in globals.css
export function MonoTheme() {
  useEffect(() => {
    document.documentElement.classList.add("theme-mono");
    return () => document.documentElement.classList.remove("theme-mono");
  }, []);

  return null;
}
