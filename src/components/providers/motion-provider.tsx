"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Whether the site's motion (aurora drift, floaty shapes, the startup
// intro, the cursor-reactive name, blinking cursors, view fades) should
// run. Follows the OS `prefers-reduced-motion` by default, but the
// chrome-bar toggle lets anyone force it on or off; the choice is
// remembered. The resolved state is also mirrored onto
// <html data-motion="on|off"> so globals.css can gate the CSS-only
// pieces. A pre-paint script in layout.tsx sets that attribute before
// first paint so nothing flashes.

const KEY = "mb-motion";

type MotionContextValue = { motionOn: boolean; toggle: () => void };
const MotionContext = createContext<MotionContextValue>({ motionOn: true, toggle: () => {} });

function initialMotionOn(): boolean {
  if (typeof document === "undefined") return true; // SSR — assume on
  return document.documentElement.dataset.motion !== "off";
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [motionOn, setMotionOn] = useState<boolean>(initialMotionOn);

  // Resolve on mount (in case the pre-paint script didn't run) and keep
  // tracking the OS setting while there's no explicit stored choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resolve = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(KEY);
      } catch {
        /* storage blocked */
      }
      setMotionOn(stored === null ? !mq.matches : stored === "1");
    };
    resolve();
    mq.addEventListener("change", resolve);
    return () => mq.removeEventListener("change", resolve);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motionOn ? "on" : "off";
  }, [motionOn]);

  const toggle = () =>
    setMotionOn((v) => {
      const next = !v;
      try {
        localStorage.setItem(KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });

  return <MotionContext.Provider value={{ motionOn, toggle }}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}
