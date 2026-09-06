"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

// One normalized pointer X (0 at the left edge of the viewport, 1 at
// the right), rAF-throttled so it updates at most once per frame. The
// hub's kinetic name is the main consumer — each letter reads this to
// decide how far to warp its width/weight. Cheap to keep global: it
// only ever holds a single number.
const CursorContext = createContext<number>(0.5);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [mx, setMx] = useState(0.5);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: PointerEvent) {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setMx(e.clientX / window.innerWidth);
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <CursorContext.Provider value={mx}>{children}</CursorContext.Provider>;
}

export function useCursorX() {
  return useContext(CursorContext);
}
