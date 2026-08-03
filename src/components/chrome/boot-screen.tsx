"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const BOOT_KEY = "macdmrk-booted";

const BOOT_LINES = [
  "macdmrk terminal v2026.1",
  "initializing display ......... OK",
  "loading assets ................ OK",
  "mounting /home/marco .......... OK",
];

const LINE_INTERVAL_MS = 220;
const SCAN_OPEN_MS = 400;
const HOLD_AFTER_LINES_MS = 550;

// A one-time "CRT power-on" boot animation that plays the first time a
// visitor loads the site in a given browser tab. A tiny inline script
// in layout.tsx (see the `skip-boot` class + matching CSS rule in
// globals.css) hides this element instantly via CSS the moment it's
// painted on repeat loads — before React even hydrates — so returning
// visitors never see a flash of it. This component's own sessionStorage
// check just stops it from running its (invisible) timers in that case.
export function BootScreen() {
  const [visible, setVisible] = useState(true);
  const [linesShown, setLinesShown] = useState(0);
  const [scanOpen, setScanOpen] = useState(false);

  useEffect(() => {
    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem(BOOT_KEY) === "1";
    } catch {
      // sessionStorage can throw in locked-down environments — treat as first boot.
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadyBooted || reduceMotion) {
      setVisible(false);
      return;
    }

    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      // Ignore — worst case the animation replays on the next load.
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setScanOpen(true), 30));
    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setLinesShown(i + 1), SCAN_OPEN_MS + i * LINE_INTERVAL_MS));
    });
    timers.push(
      setTimeout(
        () => setVisible(false),
        SCAN_OPEN_MS + BOOT_LINES.length * LINE_INTERVAL_MS + HOLD_AFTER_LINES_MS
      )
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="boot-screen fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          aria-hidden="true"
        >
          <div
            className="w-full max-w-[420px] origin-center px-6 font-mono text-[13px] text-emerald transition-transform duration-500 ease-out"
            style={{ transform: scanOpen ? "scaleY(1)" : "scaleY(0)" }}
          >
            <div className="space-y-1.5">
              {BOOT_LINES.slice(0, linesShown).map((line) => (
                <div key={line}>{line}</div>
              ))}
              {linesShown >= BOOT_LINES.length && (
                <div className="text-mint">
                  {"> "}
                  <span className="animate-cursor-blink">█</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
