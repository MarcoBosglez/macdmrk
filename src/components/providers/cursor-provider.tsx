"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type Pointer = { x: number; y: number };
// Normalized device-tilt delta from wherever the phone was held when
// orientation data first arrived, each axis clamped to -1..1.
type Tilt = { x: number; y: number };

type CursorState = {
  // Normalized pointer X (0 = left edge, 1 = right) — the hub's kinetic
  // name reads this to warp each letter toward the cursor.
  mx: number;
  // Raw viewport pixel coordinates of the last pointer move, or null
  // before the first one — the "O" eyes use this on desktop.
  pointer: Pointer | null;
  tilt: Tilt;
  // True when the primary input is mouse-like (desktop). False on
  // touch, where the eyes fall back to device tilt instead.
  pointerFine: boolean;
};

const DEFAULT_STATE: CursorState = { mx: 0.5, pointer: null, tilt: { x: 0, y: 0 }, pointerFine: true };

const CursorContext = createContext<CursorState>(DEFAULT_STATE);

// iOS 13+ gates deviceorientation behind an explicit permission prompt
// that can only be requested from inside a user-gesture handler —
// there's no dedicated "enable motion" button in this design, so the
// very first tap/touch anywhere on the page quietly requests it once.
// Denied, unsupported, or desktop just leaves the eyes centered /
// mouse-driven, never an error.
function requestMotionPermissionOnce() {
  const DOE = window.DeviceOrientationEvent as unknown as
    | { requestPermission?: () => Promise<"granted" | "denied"> }
    | undefined;
  if (typeof DOE?.requestPermission === "function") {
    DOE.requestPermission().catch(() => {});
  }
}

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [mx, setMx] = useState(0.5);
  const [pointer, setPointer] = useState<Pointer | null>(null);
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });
  const [pointerFine, setPointerFine] = useState(true);
  const rafRef = useRef<number | null>(null);
  const pendingPointer = useRef<Pointer | null>(null);
  const baselineRef = useRef<{ beta: number; gamma: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setPointerFine(mq.matches);
    const onChange = () => setPointerFine(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pendingPointer.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const p = pendingPointer.current;
        if (!p) return;
        setMx(p.x / window.innerWidth);
        setPointer(p);
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Calibrates to whatever angle the phone happens to be held at
    // when the first reading arrives, rather than assuming a fixed
    // "neutral" beta/gamma — those vary a lot by device and how
    // someone's actually holding their phone.
    function onOrientation(e: DeviceOrientationEvent) {
      if (e.beta == null || e.gamma == null) return;
      if (!baselineRef.current) baselineRef.current = { beta: e.beta, gamma: e.gamma };
      const dBeta = e.beta - baselineRef.current.beta;
      const dGamma = e.gamma - baselineRef.current.gamma;
      setTilt({ x: clamp(dGamma / 24), y: clamp(dBeta / 24) });
    }

    window.addEventListener("deviceorientation", onOrientation);
    document.addEventListener("touchend", requestMotionPermissionOnce, { once: true });
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      document.removeEventListener("touchend", requestMotionPermissionOnce);
    };
  }, []);

  return <CursorContext.Provider value={{ mx, pointer, tilt, pointerFine }}>{children}</CursorContext.Provider>;
}

export function useCursorX() {
  return useContext(CursorContext).mx;
}

// What the "O" eyes should look toward: a raw pointer position on
// desktop, or a normalized tilt direction on touch devices.
export function useEyeTarget() {
  const { pointer, tilt, pointerFine } = useContext(CursorContext);
  return { pointer, tilt, pointerFine };
}
