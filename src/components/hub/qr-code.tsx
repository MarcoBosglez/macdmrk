"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { QrIcon } from "@/components/chrome/link-icons";
import { useSound } from "@/components/providers/sound-provider";
import { LINKS } from "@/lib/data/links";

// A QR pointing at the live site. The path was generated once for
// LINKS.site; regenerate with:
//   npx qrcode -t svg -e M -q 1 "https://macdmrk.vercel.app"
// and paste the new `d`. `currentColor` lets it follow the theme.
const QR_PATH =
  "M1 1.5h7m3 0h1m5 0h1m1 0h7M1 2.5h1m5 0h1m2 0h3m2 0h2m2 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h3m2 0h4m1 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h2m4 0h1m1 0h1m1 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m1 0h1m1 0h1m2 0h1m1 0h1m2 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h3m5 0h1M1 9.5h1m1 0h5m2 0h1m1 0h4m3 0h5M4 10.5h1m1 0h1m1 0h1m2 0h2m7 0h1m3 0h1M2 11.5h1m1 0h1m2 0h1m1 0h6m1 0h2m1 0h2m1 0h1m1 0h2M3 12.5h1m1 0h1m3 0h2m1 0h1m2 0h1m2 0h4m3 0h1M7 13.5h1m5 0h3m2 0h2m1 0h1m1 0h3M1 14.5h1m1 0h1m4 0h1m2 0h1m1 0h1m3 0h1m2 0h1m1 0h1m1 0h1M1 15.5h1m1 0h2m1 0h3m2 0h1m1 0h1m1 0h2m2 0h4m1 0h2M1 16.5h1m4 0h1m1 0h3m2 0h1m1 0h1m2 0h1m1 0h2m3 0h1M1 17.5h1m1 0h2m2 0h4m3 0h8m1 0h1M9 18.5h1m1 0h2m1 0h1m2 0h1m3 0h2M1 19.5h7m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M1 20.5h1m5 0h1m1 0h1m3 0h1m3 0h1m3 0h2M1 21.5h1m1 0h3m1 0h1m1 0h1m4 0h1m1 0h6m1 0h1M1 22.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m3 0h2m1 0h5M1 23.5h1m1 0h3m1 0h1m1 0h3m2 0h2m1 0h1m4 0h2m1 0h1M1 24.5h1m5 0h1m2 0h1m2 0h1m2 0h7m2 0h1M1 25.5h7m1 0h1m3 0h3m3 0h7";

const GLASS_BTN =
  "rounded-[16px] bg-glass [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]";

function QrGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 27 27" shapeRendering="crispEdges" className={className}>
      <path stroke="currentColor" strokeWidth={1} d={QR_PATH} />
    </svg>
  );
}

function QrOverlay({ onClose }: { onClose: () => void }) {
  const { playClick } = useSound();

  function close() {
    playClick("close");
    onClose();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="animate-fade fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 [backdrop-filter:blur(6px)]"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="QR code to this page"
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center gap-4 rounded-[22px] border border-line bg-panel p-7 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-hot hover:text-accent"
        >
          ✕
        </button>
        <a
          href={LINKS.site}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open this site"
          className="group block h-[220px] w-[220px] rounded-[14px] border border-line bg-bg p-4 transition-colors hover:border-line-hot"
        >
          <QrGlyph className="block h-full w-full text-ink transition-colors group-hover:text-accent" />
        </a>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted">
            scan → open this page
          </span>
          <span className="font-mono text-[10px] text-dim">
            {LINKS.site.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    </div>
  );
}

// A glass button matching the social row — tap it to blow the QR up
// into a centred overlay, big enough to actually scan off the screen.
// Dismisses on backdrop click, the close button, or Escape.
export function QrCodeButton() {
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { playClick } = useSound();

  useEffect(() => setMounted(true), []);

  return (
    <>
      <button
        type="button"
        title="Scan this page"
        aria-label="Show a scannable QR code for this page"
        onClick={() => {
          playClick("open");
          setOpen(true);
        }}
        onMouseEnter={() => setOn(true)}
        onMouseLeave={() => setOn(false)}
        onFocus={() => setOn(true)}
        onBlur={() => setOn(false)}
        className={`hub-motion flex h-12 w-12 shrink-0 items-center justify-center ${GLASS_BTN}`}
        style={{
          border: `1px solid ${on ? "var(--line-hot)" : "var(--line)"}`,
          background: on ? "var(--wash)" : undefined,
          transform: on ? "translateY(-3px)" : undefined,
          transition:
            "transform .2s cubic-bezier(.2,.8,.3,1), border-color .18s ease, background .18s ease, box-shadow .22s ease",
        }}
      >
        <QrIcon className="h-[21px] w-[21px] text-accent" strokeWidth={1.9} />
      </button>

      {open && mounted ? createPortal(<QrOverlay onClose={() => setOpen(false)} />, document.body) : null}
    </>
  );
}
