"use client";

import { useEffect, useState } from "react";

const BOOT_KEY = "macdmrk-booted";

const BOOT_LINES = [
  "boot: mark_os v2.4",
  "checking hardware... OK",
  "mounting /dev/engineering... OK",
  "mounting /dev/illustration... OK",
  "loading modules: work, gallery, about, faq, contact",
  "starting session as marco_",
];

const TOTAL_CHARS = BOOT_LINES.reduce((sum, line) => sum + line.length, 0);

const CHAR_MS = 8;
const LINE_PAUSE_MS = 40;
const CLOSE_DELAY_MS = 350;
// Time from `closing` (text starts fading, flash pulse starts playing)
// to `snapOpen` (the reveal starts its scaleY snap). Set to roughly the
// flash's own animation length (see .boot-flash in globals.css) so the
// flash has already fully faded back out before the snap starts —
// otherwise the two overlapping reads as a cross-fade instead of a
// clean cut.
const FLASH_MS = 200;
// Must match .boot-reveal's transition-duration in globals.css.
const SNAP_MS = 220;

// A one-time boot animation that plays the first time a visitor loads
// the site in a given browser tab: BOOT_LINES type themselves out
// character by character with a live progress bar, then the screen
// does a "channel change" — a quick flash, then a bordered panel snaps
// open (scaleY 0 → 1) rather than smoothly growing. That panel is
// ALWAYS sized and positioned exactly like the real window frame (see
// .boot-reveal in globals.css, which mirrors layout.tsx's own
// `p-3 md:p-7` inset at the same breakpoint) — nothing here computes or
// guesses that geometry, so there's no risk of the two drifting apart.
// By the time this component unmounts, the panel is pixel-identical to
// the real frame sitting behind it, so the swap is seamless.
//
// A tiny inline script in layout.tsx (see the `skip-boot` class +
// matching CSS rule in globals.css) hides this element instantly via
// CSS the moment it's painted on repeat loads — before React even
// hydrates — so returning visitors never see a flash of it. This
// component's own sessionStorage check just stops it from running its
// (invisible) timers in that case.
export function BootScreen() {
  const [visible, setVisible] = useState(true);
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [closing, setClosing] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);

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
    let li = 0;
    let ci = 0;

    function typeNext() {
      if (li >= BOOT_LINES.length) {
        timers.push(setTimeout(() => setClosing(true), CLOSE_DELAY_MS));
        timers.push(setTimeout(() => setSnapOpen(true), CLOSE_DELAY_MS + FLASH_MS));
        // No separate fade for the real page underneath, and no pause
        // after the snap either — the instant the panel finishes
        // snapping open, this overlay unmounts. By then the panel
        // already looks pixel-identical to the real frame, so the cut
        // reads as seamless rather than an abrupt pop.
        timers.push(setTimeout(() => setVisible(false), CLOSE_DELAY_MS + FLASH_MS + SNAP_MS));
        return;
      }
      const full = BOOT_LINES[li];
      if (ci <= full.length) {
        setCurrentLine(full.slice(0, ci));
        ci++;
        timers.push(setTimeout(typeNext, CHAR_MS));
      } else {
        setLines((prev) => [...prev, full]);
        setCurrentLine("");
        li++;
        ci = 0;
        timers.push(setTimeout(typeNext, LINE_PAUSE_MS));
      }
    }
    typeNext();

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!visible) return null;

  const typedChars = lines.reduce((sum, line) => sum + line.length, 0) + currentLine.length;
  const progress = Math.min(100, Math.round((typedChars / TOTAL_CHARS) * 100));

  return (
    <div className="boot-screen fixed inset-0 z-[100] overflow-hidden bg-bg" aria-hidden="true">
      <div
        className="absolute top-6 left-6 max-w-[calc(100vw-48px)] font-mono text-[14px] leading-[1.8] text-mint md:top-[60px] md:left-[60px] md:max-w-[calc(100vw-120px)]"
        style={{ opacity: closing ? 0 : 1, transition: "opacity 0.2s ease" }}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line}
          </div>
        ))}
        <div className="whitespace-pre">
          {currentLine}
          <span className="animate-cursor-blink">▌</span>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <div className="h-1.5 w-[50vw] max-w-[220px] overflow-hidden rounded-full border border-mint/40 bg-panel">
            <div
              className="h-full bg-mint"
              style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
            />
          </div>
          <span className="text-[11px] text-muted">{progress}%</span>
        </div>
      </div>

      {/* The "channel change" reveal panel — see .boot-reveal in
          globals.css for why its geometry is never computed here. */}
      <div className={`boot-reveal${snapOpen ? " boot-reveal-open" : ""}`} />

      {/* A quick brightness pulse — the "tube flickering on" moment —
          that fully plays out and fades back to nothing BEFORE the
          reveal panel starts its snap (see FLASH_MS above). A single
          self-contained keyframe animation rather than a JS-driven
          opacity transition, so it can't end up overlapping with the
          snap and blending into a cross-fade. */}
      {closing && (
        <div className="boot-flash pointer-events-none absolute inset-0 bg-mint" />
      )}
    </div>
  );
}
