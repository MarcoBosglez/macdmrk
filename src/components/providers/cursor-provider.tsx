"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

// Normalized pointer X (0 = left edge, 1 = right), throttled to one
// update per animation frame. The hub's kinetic name reads it to warp
// each letter toward the cursor.
const CursorContext = createContext<number>(0.5);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [mx, setMx] = useState(0.5);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
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
