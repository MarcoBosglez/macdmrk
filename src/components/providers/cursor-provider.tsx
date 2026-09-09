"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/providers/motion-provider";

// One normalized pointer X (0 at the left edge of the viewport, 1 at
// the right), rAF-throttled so it updates at most once per frame. The
// hub's kinetic name is the main consumer — each letter reads this to
// decide how far to warp its width/weight. Cheap to keep global: it
// only ever holds a single number. Parked at 0.5 (centre) while motion
// is off.
const CursorContext = createContext<number>(0.5);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [mx, setMx] = useState(0.5);
  const rafRef = useRef<number | null>(null);
  const { motionOn } = useMotion();

  useEffect(() => {
    if (!motionOn) {
      setMx(0.5);
      return;
    }

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
  }, [motionOn]);

  return <CursorContext.Provider value={mx}>{children}</CursorContext.Provider>;
}

export function useCursorX() {
  return useContext(CursorContext);
}
