"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { SwitchEyeMusicControl, SwitchEyeName } from "@/components/hub/switch-eye";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { LINKS } from "@/lib/data/links";
import { SocialBar } from "./SocialBar";
import s from "./presentation-card.module.css";

// Content ported 1:1 from the reference's "L" flip card — see
// card-reference/qr-presentation-cards.html. This is the hub's main
// "who am I" card (not a modal/popup) — it replaced the old plain
// about-card + a separate QR-button overlay.
const CHIPS = ["4+ Years Back-End", "M.S.C.S", "AI", "LLM"];
const ROLE_TEXT = "Software Engineer · Seattle, WA";
const INTRO_TEXT = "Hi! I'm Marco, Software Engineer in Washington. Currently doing an M.S.CS program @ Digipen My hometown is Mexico City!! I also draw :)";

function useReducedMotion() {
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

// A single <path> of 1x1 squares, one per dark module — same technique
// the reference's own mockup QR uses. `qrcode`'s `create()` is a pure,
// synchronous computation (no network/canvas), safe to memoize.
function useQrPath(url: string) {
  return useMemo(() => {
    const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
    const { size, data } = qr.modules;
    let d = "";
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (data[row * size + col]) d += `M${col} ${row}h1v1h-1z`;
      }
    }
    return { d, size };
  }, [url]);
}

export function PresentationCard() {
  const { t } = useLocale();
  const { playClick } = useSound();
  const reducedMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const nameId = useId();
  const url = LINKS.site;
  const qr = useQrPath(url);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // backface-visibility only hides a face visually — its buttons stay
  // in the tab order and are still clickable unless something else
  // takes them out, so whichever face isn't showing gets `inert`
  // (removes it from both focus and the a11y tree). Set as a DOM
  // property via ref rather than a JSX prop: older @types/react don't
  // all know the `inert` attribute yet.
  useEffect(() => {
    if (frontRef.current) (frontRef.current as HTMLElement & { inert: boolean }).inert = flipped;
    if (backRef.current) (backRef.current as HTMLElement & { inert: boolean }).inert = !flipped;
  }, [flipped]);

  function toggleFlip() {
    playClick("cardFlip");
    setFlipped((f) => !f);
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Marco Bosquez", url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      // Share sheet dismissed, or clipboard blocked — no-op either way.
    }
  }

  const qrGraphic = (
    <span className={s.qrCol}>
      <span className={s.qrBox}>
        <svg
          viewBox={`0 0 ${qr.size} ${qr.size}`}
          role="img"
          aria-label={`QR code that opens ${url}`}
          shapeRendering="crispEdges"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <rect width={qr.size} height={qr.size} fill="#effff4" />
          <path d={qr.d} fill="#062012" />
        </svg>
      </span>
    </span>
  );

  return (
    <div className={s.scope}>
      <div className={s.flipWrap}>
        {/* The whole card flips on click now (no dedicated flip button)
            — the eyes and the music-pause control stop their own
            clicks from bubbling up to this, since they do something
            else entirely. */}
        <div
          className={`${s.flip} ${flipped && !reducedMotion ? s.flipped : ""}`}
          style={flipped && reducedMotion ? { transform: "rotateY(180deg)" } : undefined}
          role="group"
          aria-labelledby={nameId}
          onClick={toggleFlip}
        >
          <div ref={frontRef} className={`${s.card} ${s.front} ${s.face}`}>
            <div className={s.frontLeft}>
              <span className={s.kicker}>
                <span>(01) {t.hub.eyebrow}</span>
                <SwitchEyeMusicControl />
              </span>
              <div className={s.nameWrap}>
                <SwitchEyeName id={nameId} />
              </div>
              <span className={s.role}>{ROLE_TEXT}</span>
            </div>
            {qrGraphic}
            <span className={s.chipsRow}>
              {CHIPS.map((chip, i) => (
                <span key={chip} className={`${s.chip} ${i === 0 ? s.chipSolid : ""}`}>
                  {chip}
                </span>
              ))}
            </span>
          </div>

          <div ref={backRef} className={`${s.card} ${s.back} ${s.face}`}>
            <span className={s.sm}>(02) in one breath</span>
            <span className={s.intro}>{INTRO_TEXT}</span>
          </div>
        </div>
      </div>

      <div className={s.shareRow}>
        <button type="button" className={s.shareBtn} onClick={handleShare}>
          share link ↗
        </button>
      </div>

      <SocialBar />
    </div>
  );
}
