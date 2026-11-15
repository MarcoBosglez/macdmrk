"use client";

import { createContext, createRef, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import s from "./switch-eye.module.css";

// The O in MARCO and the O in BOSQUEZ, reimagined as a pair of eyes:
// they follow the cursor, wander on their own via Perlin-ish noise when
// nobody's moved the mouse, blink, and light up on click — lighting
// both unlocks the résumé link. Everything heavy (cursor math, noise,
// blink) runs in one rAF loop that writes straight to refs instead of
// React state, so none of it re-renders the component 60 times a
// second — only the lit/unlit toggle (a real, infrequent state change)
// goes through React.

type EyeId = "marco" | "bosquez";

// ─── Lit state, shared between the eyes and the reset button that
// lives elsewhere in the card (top-right corner) ─────────────────────
type SwitchEyeState = {
  lit: Record<EyeId, boolean>;
  toggle: (id: EyeId) => void;
  reset: () => void;
};

const SwitchEyeContext = createContext<SwitchEyeState | null>(null);

export function useSwitchEye() {
  const ctx = useContext(SwitchEyeContext);
  if (!ctx) throw new Error("useSwitchEye must be used within SwitchEyeProvider");
  return ctx;
}

export function SwitchEyeProvider({ children }: { children: React.ReactNode }) {
  const [lit, setLit] = useState<Record<EyeId, boolean>>({ marco: false, bosquez: false });
  const toggle = (id: EyeId) => setLit((prev) => ({ ...prev, [id]: !prev[id] }));
  const reset = () => setLit({ marco: false, bosquez: false });
  return <SwitchEyeContext.Provider value={{ lit, toggle, reset }}>{children}</SwitchEyeContext.Provider>;
}

// ─── Tiny seeded 1D gradient noise (permutation + quintic fade) ──────
// Seeded so it's deterministic rather than reaching for Math.random —
// doesn't matter for correctness here (this never touches SSR output),
// just keeps the pattern reproducible between reloads.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PERM = (() => {
  const rand = mulberry32(1337);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return p.concat(p);
})();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);
const grad = (hash: number, x: number) => ((hash & 1) === 0 ? x : -x);

function noise1D(x: number) {
  const xi = Math.floor(x) & 255;
  const xf = x - Math.floor(x);
  const u = fade(xf);
  return lerp(grad(PERM[xi], xf), grad(PERM[xi + 1], xf - 1), u);
}

const fbm = (t: number) => noise1D(t) * 0.7 + noise1D(2.3 * t + 17) * 0.3;

// ─── The eye itself ───────────────────────────────────────────────
// A rounded almond, eyeball + iris/pupil/glint + a lid that slides down
// from the hinge at the top to blink, clipped to the almond shape, plus
// a thick outline drawn on top.
const ALMOND = "M4 32 Q50 -10 96 32 Q50 74 4 32 Z";

type EyeRefs = {
  root: React.RefObject<HTMLButtonElement | null>;
  iris: React.RefObject<SVGGElement | null>;
  pupil: React.RefObject<SVGCircleElement | null>;
  lid: React.RefObject<SVGRectElement | null>;
};

function createEyeRefs(): EyeRefs {
  return {
    root: createRef<HTMLButtonElement>(),
    iris: createRef<SVGGElement>(),
    pupil: createRef<SVGCircleElement>(),
    lid: createRef<SVGRectElement>(),
  };
}

function Eye({ id, refs }: { id: EyeId; refs: EyeRefs }) {
  const { lit, toggle } = useSwitchEye();
  const { playClick } = useSound();
  const { t } = useLocale();
  const rawId = useId().replace(/:/g, "");
  const clipId = `switch-eye-clip-${rawId}`;
  const isLit = lit[id];

  return (
    <button
      ref={refs.root}
      type="button"
      aria-pressed={isLit}
      aria-hidden="false"
      aria-label={t.hub.switchEye.ariaLabel}
      onClick={() => {
        playClick("toggle");
        toggle(id);
      }}
      className={s.eyeBtn}
    >
      <svg
        viewBox="0 0 100 64"
        aria-hidden="true"
        style={{
          width: "0.98em",
          height: "0.64em",
          margin: "0 0.03em",
          overflow: "visible",
          filter: isLit
            ? "drop-shadow(0 0 10px rgba(125,255,168,.9)) drop-shadow(0 0 24px rgba(125,255,168,.45))"
            : "none",
          transition: "filter .3s",
        }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={ALMOND} />
          </clipPath>
        </defs>
        <path d={ALMOND} fill="#effff4" />
        <g clipPath={`url(#${clipId})`}>
          <g ref={refs.iris}>
            <circle cx={50} cy={32} r={19} fill="#7dffa8" stroke="#1f9a55" strokeWidth={3} />
            <circle ref={refs.pupil} className={s.pupil} cx={50} cy={32} r={9} />
            <circle cx={56} cy={25} r={4} fill="#fff" />
          </g>
          <rect ref={refs.lid} x={-2} y={-4} width={104} height={72} className={s.lid} />
        </g>
        <path d={ALMOND} fill="none" stroke="#7dffa8" strokeWidth={5} strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ─── The name, with both eyes wired to one shared motion loop ───────
const NAME_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-archivo)",
  fontWeight: 900,
  fontVariationSettings: "'wght' 900",
  fontSize: "clamp(44px, 12vw, 64px)",
  lineHeight: 0.86,
  letterSpacing: "-0.055em",
  textTransform: "uppercase",
  color: "var(--accent)",
  margin: 0,
};

const ROW_STYLE: React.CSSProperties = { display: "flex", alignItems: "center", whiteSpace: "nowrap" };

// Every glyph in the name (plus each eye, riding along with its row) is
// its own token so the wave can offset them individually, phase-shifted
// by position — that's what makes it read as a ripple rather than the
// whole word bobbing as one rigid block.
type Token = { kind: "letter"; ch: string } | { kind: "eye"; id: EyeId };
const ROW1_TOKENS: Token[] = [
  { kind: "letter", ch: "M" },
  { kind: "letter", ch: "A" },
  { kind: "letter", ch: "R" },
  { kind: "letter", ch: "C" },
  { kind: "eye", id: "marco" },
];
const ROW2_TOKENS: Token[] = [
  { kind: "letter", ch: "B" },
  { kind: "eye", id: "bosquez" },
  { kind: "letter", ch: "S" },
  { kind: "letter", ch: "Q" },
  { kind: "letter", ch: "U" },
  { kind: "letter", ch: "E" },
  { kind: "letter", ch: "Z" },
];
const WAVE_TOKEN_COUNT = ROW1_TOKENS.length + ROW2_TOKENS.length;

// Continuous ambient motion, not gated behind any visitor input — so,
// like the idle wander, it's skipped entirely under reduced motion. A
// sine wave carries the actual ripple (so it reads clearly as a wave
// traveling across the letters); perlin noise is layered on top only
// for organic texture, at a much smaller amplitude than the sine.
const WAVE_SPEED = 0.7;
const WAVE_PHASE_STEP = 0.75;
const WAVE_AMPLITUDE = 3;
const WAVE_NOISE_AMPLITUDE = 0.8;

export function SwitchEyeName() {
  const { lit } = useSwitchEye();
  const { t } = useLocale();
  const marcoRefs = useMemo(createEyeRefs, []);
  const bosquezRefs = useMemo(createEyeRefs, []);
  const waveRefs = useMemo(
    () => Array.from({ length: WAVE_TOKEN_COUNT }, () => createRef<HTMLSpanElement>()),
    [],
  );
  const litRef = useRef(lit);
  useEffect(() => {
    litRef.current = lit;
  }, [lit]);

  // One rAF loop: cursor tracking (per eye, from its own bounding rect)
  // blended with shared noise-driven wander/saccades/breathing, eased
  // between "actively tracking the mouse" and "idling and looking
  // around" depending on how long it's been since the pointer moved.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const eyes: { id: EyeId; refs: EyeRefs }[] = [
      { id: "marco", refs: marcoRefs },
      { id: "bosquez", refs: bosquezRefs },
    ];

    const pointerRef: { current: { x: number; y: number } | null } = { current: null };
    const motion = {
      track: 1,
      wander: 0.22,
      saccade: { x: 0, y: 0 },
      saccadeTarget: { x: 0, y: 0 },
      nextSaccadeAt: 0,
      lastMoveAt: 0,
    };

    function onPointerMove(e: PointerEvent) {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      motion.lastMoveAt = performance.now();
    }
    // Cursor following stays under reduced motion — it's driven by the
    // visitor's own input, not autoplay. Only the noise/saccade/idle
    // wander below (motion with no trigger from the visitor) is skipped.
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = 0;
    function tick() {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const t = now / 1000;

      let driftX = 0;
      let driftY = 0;
      let pupilBreath = 0;

      if (!reduced) {
        const idle = now - motion.lastMoveAt > 1800;
        if (idle) {
          motion.track += (0.25 - motion.track) * 0.02;
          motion.wander += (1.5 - motion.wander) * 0.03;
        } else {
          motion.track += (1 - motion.track) * 0.2;
          motion.wander += (0.22 - motion.wander) * 0.2;
        }

        if (now >= motion.nextSaccadeAt) {
          const amp = idle ? 1 : 0.35;
          motion.saccadeTarget = { x: (Math.random() * 2 - 1) * amp, y: (Math.random() * 2 - 1) * amp };
          motion.nextSaccadeAt = now + 500 + Math.random() * 1700;
        }
        motion.saccade.x += (motion.saccadeTarget.x - motion.saccade.x) * 0.35;
        motion.saccade.y += (motion.saccadeTarget.y - motion.saccade.y) * 0.35;

        driftX = fbm(t * 0.45) * 0.55 + motion.saccade.x * 0.45;
        driftY = fbm(t * 0.4 + 40) * 0.5 + motion.saccade.y * 0.5;
        pupilBreath = fbm(t * 0.25 + 90);
      } else {
        motion.track = 1;
        motion.wander = 0;
      }

      for (const { id, refs } of eyes) {
        const rootEl = refs.root.current;
        const irisEl = refs.iris.current;
        const pupilEl = refs.pupil.current;
        if (!rootEl || !irisEl || !pupilEl) continue;

        const rect = rootEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let cursorX = 0;
        let cursorY = 0;
        const p = pointerRef.current;
        if (p) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, dist / 220);
          cursorX = (dx / dist) * k;
          cursorY = (dy / dist) * k;
        }

        const x = cursorX * motion.track * 17 + driftX * motion.wander * 7;
        const y = cursorY * motion.track * 9 + driftY * motion.wander * 4;
        irisEl.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;

        const baseRadius = litRef.current[id] ? 14 : 9;
        pupilEl.setAttribute("r", (baseRadius + pupilBreath * 1.8).toFixed(2));
      }

      for (let i = 0; i < waveRefs.length; i++) {
        const el = waveRefs[i].current;
        if (!el) continue;
        if (reduced) {
          el.style.transform = "";
          continue;
        }
        const wave =
          Math.sin(t * WAVE_SPEED + i * WAVE_PHASE_STEP) * WAVE_AMPLITUDE +
          fbm(t * 0.5 + i * 0.6) * WAVE_NOISE_AMPLITUDE;
        el.style.transform = `translateY(${wave.toFixed(2)}px)`;
      }
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [marcoRefs, bosquezRefs, waveRefs]);

  // Both eyes blink together at random — a lit eye stays open, since it
  // reads as "on" rather than "resting". Reduced motion drops this
  // entirely (it's autoplay motion with no visitor trigger behind it).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const eyes: { id: EyeId; refs: EyeRefs }[] = [
      { id: "marco", refs: marcoRefs },
      { id: "bosquez", refs: bosquezRefs },
    ];
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    function schedule() {
      const delay = 2600 + Math.random() * 2600;
      timer = setTimeout(() => {
        if (cancelled) return;
        for (const { id, refs } of eyes) {
          if (litRef.current[id]) continue;
          const lid = refs.lid.current;
          if (!lid) continue;
          lid.style.transform = "scaleY(1)";
          setTimeout(() => {
            if (!cancelled) lid.style.transform = "scaleY(0)";
          }, 140);
        }
        schedule();
      }, delay);
    }
    schedule();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [marcoRefs, bosquezRefs]);

  const litCount = Number(lit.marco) + Number(lit.bosquez);

  let tokenIndex = 0;
  function renderToken(token: Token) {
    const i = tokenIndex++;
    const ref = waveRefs[i];
    const wrapStyle: React.CSSProperties = { display: "inline-block" };
    if (token.kind === "letter") {
      return (
        <span key={i} ref={ref} style={wrapStyle}>
          {token.ch}
        </span>
      );
    }
    const refs = token.id === "marco" ? marcoRefs : bosquezRefs;
    return (
      <span key={i} ref={ref} style={wrapStyle}>
        <Eye id={token.id} refs={refs} />
      </span>
    );
  }

  return (
    <div>
      <h1 aria-label="Marco Bosquez" style={NAME_STYLE}>
        <div style={ROW_STYLE} aria-hidden="true">
          {ROW1_TOKENS.map(renderToken)}
        </div>
        <div style={ROW_STYLE} aria-hidden="true">
          {ROW2_TOKENS.map(renderToken)}
        </div>
      </h1>
      <div aria-live="polite" className="mt-1.5 font-mono text-[12px] text-dim">
        {litCount === 0 && t.hub.switchEye.none}
        {litCount === 1 && t.hub.switchEye.one}
        {litCount === 2 && (
          <>
            {t.hub.switchEye.unlocked}{" "}
            <a href="/resume.pdf" download className={s.resumeLink}>
              {t.hub.switchEye.resumeLabel}
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export function SwitchEyeReset({ className = "" }: { className?: string }) {
  const { reset } = useSwitchEye();
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={reset}
      className={`font-mono text-[11px] text-muted transition-colors hover:text-accent ${className}`}
    >
      {t.hub.switchEye.reset}
    </button>
  );
}
