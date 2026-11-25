"use client";

import { createContext, createRef, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import s from "./switch-eye.module.css";

// The O in MARCO and the O in BOSQUEZ, reimagined as a pair of eyes:
// they follow the cursor, wander on their own via Perlin-ish noise when
// nobody's moved the mouse, blink, light up on click, and — once both
// are lit — flip the site to the mint theme and, a beat later, start a
// "music mode" (song on loop, grooving pupils, floating notes). Cursor
// math, noise, and blink all run in one rAF loop that writes straight
// to refs instead of React state, so none of it re-renders the
// component 60 times a second — only infrequent real state changes
// (lit/unlit, music mode) go through React.

type EyeId = "marco" | "bosquez";
const otherEye = (id: EyeId): EyeId => (id === "marco" ? "bosquez" : "marco");

const BPM = 120;
const GROOVE_DURATION = (60 / BPM) * 2; // one swing per two beats
const MUSIC_SRC = "/sounds/alex-morgan-jazz-restaurant-music-563578.mp3";
const MUSIC_VOLUME = 0.35;
const MUSIC_START_DELAY_MS = 250;

const NOTE_SYMBOLS = ["♪", "♫", "♪", "♬"];
const NOTE_COLORS = ["#d7a6ff", "#b98cff", "#e9d2ff", "#a76bff"];
const NOTE_SPAWN_MS = 500;
const NOTE_LIFETIME_MS = 2600;
const NOTE_MAX = 8;

type Note = {
  id: number;
  symbol: string;
  left: number;
  size: number;
  color: string;
  dx: number;
  rot: number;
  duration: number;
};

// ─── Shared state: lit eyes, music mode, and the controls that reach
// in from elsewhere — the pause button (top-right of the kicker row)
// and the chrome bar's light/dark toggle, which force-resets both eyes
// so it never fights with them over the theme. ───────────────────────
type SwitchEyeState = {
  lit: Record<EyeId, boolean>;
  musicMode: boolean;
  reducedMotion: boolean;
  onEyeClick: (id: EyeId) => void;
  reset: () => void;
  stopMusic: () => void;
};

const SwitchEyeContext = createContext<SwitchEyeState | null>(null);

export function useSwitchEye() {
  const ctx = useContext(SwitchEyeContext);
  if (!ctx) throw new Error("useSwitchEye must be used within SwitchEyeProvider");
  return ctx;
}

// Lighting both eyes is also the mint theme's secret switch: once both
// are lit, the site flips to "mint" (restored to whatever was active
// before once either eye goes back off). The light/dark icon in the
// chrome bar always wins over this — it force-resets both eyes when
// clicked, so the two controls never fight (see ChromeBar).
//
// 250ms after the pair completes, "music mode" also kicks in: a song
// loops quietly, the eyes groove instead of tracking the cursor, and
// notes float up from the name. Clicking either eye (or the pause
// button) stops it and turns both eyes back off.
export function SwitchEyeProvider({ children }: { children: React.ReactNode }) {
  const [lit, setLit] = useState<Record<EyeId, boolean>>({ marco: false, bosquez: false });
  const [musicMode, setMusicMode] = useState(false);
  const litRef = useRef(lit);
  useEffect(() => {
    litRef.current = lit;
  }, [lit]);
  const musicModeRef = useRef(musicMode);
  useEffect(() => {
    musicModeRef.current = musicMode;
  }, [musicMode]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  function startMusic() {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      audio.volume = MUSIC_VOLUME;
      audio.preload = "none";
      audioRef.current = audio;
    }
    void audio.play().catch(() => {});
    setMusicMode(true);
  }

  // Stops everything: the song, the pending "about to start" timer, and
  // the lit eyes. Used by the reset button, the pause button, and an
  // eye click while music mode is already playing.
  function stopAll() {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setLit({ marco: false, bosquez: false });
    setMusicMode(false);
  }

  function onEyeClick(id: EyeId) {
    if (musicModeRef.current) {
      stopAll();
      return;
    }
    const completesPair = !lit[id] && lit[otherEye(id)];
    setLit((prev) => ({ ...prev, [id]: !prev[id] }));
    if (completesPair) {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = setTimeout(() => {
        pendingTimerRef.current = null;
        if (litRef.current.marco && litRef.current.bosquez) startMusic();
      }, MUSIC_START_DELAY_MS);
    }
  }

  // Pause (never fully stop/reset) on tab-hide or unmount — resuming is
  // left to an explicit click, same as the initial start.
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) audioRef.current?.pause();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      audioRef.current?.pause();
    };
  }, []);

  const { theme, setTheme } = useTheme();
  const bothLit = lit.marco && lit.bosquez;
  const wasBothLitRef = useRef(false);
  const prevThemeRef = useRef("dark");

  // No click sound here — each eye's own click already plays the
  // switch tap (see Eye's onClick below), including the second click
  // that completes the pair, so adding another play on this
  // transition would double it up.
  useEffect(() => {
    if (bothLit && !wasBothLitRef.current) {
      if (theme && theme !== "mint") prevThemeRef.current = theme;
      setTheme("mint");
    } else if (!bothLit && wasBothLitRef.current) {
      setTheme(prevThemeRef.current);
    }
    wasBothLitRef.current = bothLit;
  }, [bothLit, theme, setTheme]);

  return (
    <SwitchEyeContext.Provider
      value={{ lit, musicMode, reducedMotion, onEyeClick, reset: stopAll, stopMusic: stopAll }}
    >
      {children}
    </SwitchEyeContext.Provider>
  );
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
  const { lit, musicMode, reducedMotion, onEyeClick } = useSwitchEye();
  const { playClick } = useSound();
  const { t } = useLocale();
  const rawId = useId().replace(/:/g, "");
  const clipId = `switch-eye-clip-${rawId}`;
  const isLit = lit[id];
  const grooving = musicMode && !reducedMotion;

  return (
    <button
      ref={refs.root}
      type="button"
      aria-pressed={isLit}
      aria-hidden="false"
      aria-label={musicMode ? t.hub.switchEye.stopMusicLabel : t.hub.switchEye.ariaLabel}
      onClick={(e) => {
        // The presentation card flips on any click inside it — the
        // eyes are the one exception, so their own click must not
        // bubble up to that handler.
        e.stopPropagation();
        playClick("mintSwitch");
        onEyeClick(id);
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
          // Music mode drops the lit glow — the groove itself reads as
          // "activated" now, so the halo would just be visual noise.
          filter:
            isLit && !musicMode
              ? "drop-shadow(0 0 10px color-mix(in srgb, var(--acc) 90%, transparent)) drop-shadow(0 0 24px color-mix(in srgb, var(--acc) 45%, transparent))"
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
          <g
            ref={refs.iris}
            className={grooving ? s.groove : undefined}
            style={grooving ? { animationDuration: `${GROOVE_DURATION}s` } : undefined}
          >
            <circle
              cx={50}
              cy={32}
              r={19}
              fill="var(--eye-ink, var(--acc))"
              stroke="color-mix(in srgb, var(--eye-ink, var(--acc)) 65%, black)"
              strokeWidth={3}
            />
            <circle ref={refs.pupil} className={s.pupil} cx={50} cy={32} r={9} />
            <circle cx={56} cy={25} r={4} fill="#fff" />
          </g>
          <rect ref={refs.lid} x={-2} y={-4} width={104} height={72} className={s.lid} />
        </g>
        {/* Structural outline — separate from the lit-glow filter above,
            which always stays --acc (a glow should read as light,
            regardless of what the outline itself is tuned to). The
            fallback keeps every other use of this component unchanged;
            only a scope that declares --eye-ink (see the presentation
            card, whose own background can coincide with --acc) differs. */}
        <path d={ALMOND} fill="none" stroke="var(--eye-ink, var(--acc))" strokeWidth={5} strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ─── The name, with both eyes wired to one shared motion loop ───────
const NAME_STYLE: React.CSSProperties = {
  fontFamily: "var(--name-font)",
  fontWeight: "var(--namew)" as unknown as number,
  // The min/preferred terms are also var()-driven (defaulting to the
  // hub's own responsive clamp) so a scope that wants an exact fixed
  // size — not a clamp — can force it: set --name-vw to 0vw, and the
  // preferred term collapses to 0, which is always <= the min, so
  // clamp() just returns --name-min. See qr-card's presentation-card
  // for the actual use of this (46px desktop / 52px mobile, no clamp).
  fontSize: "clamp(var(--name-min, 36px), var(--name-vw, 7.5vw), var(--name-size))",
  lineHeight: "var(--name-lh)",
  letterSpacing: "var(--name-ls)",
  textTransform: "uppercase",
  color: "var(--aboutink)",
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

export function SwitchEyeName({ id }: { id?: string } = {}) {
  const { lit, musicMode, reducedMotion } = useSwitchEye();
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
  const musicModeRef = useRef(musicMode);
  useEffect(() => {
    musicModeRef.current = musicMode;
  }, [musicMode]);

  // One rAF loop: cursor tracking (per eye, from its own bounding rect)
  // blended with shared noise-driven wander/saccades/breathing, eased
  // between "actively tracking the mouse" and "idling and looking
  // around" depending on how long it's been since the pointer moved.
  // In music mode this is skipped entirely (track 0, noise 0) — the
  // CSS groove animation (see Eye) owns the iris's transform instead.
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

        if (!musicModeRef.current) {
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
        }

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
  // reads as "on" rather than "resting". Both eyes are always lit
  // during music mode, so this already skips them then too; nothing
  // music-mode-specific needed here. Reduced motion drops this
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

  // Floating notes — spawn one every 500ms for as long as music mode
  // lasts, each removing itself after its own lifetime. Skipped under
  // reduced motion (the music, pause button, and status line still work).
  const [notes, setNotes] = useState<Note[]>([]);
  const noteIdRef = useRef(0);
  useEffect(() => {
    if (!musicMode || reducedMotion) return;
    const interval = setInterval(() => {
      const note: Note = {
        id: noteIdRef.current++,
        symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
        left: 8 + Math.random() * 80,
        size: 14 + Math.random() * 10,
        color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
        dx: (Math.random() * 2 - 1) * 22,
        rot: (Math.random() * 2 - 1) * 18,
        duration: 1.6 + Math.random() * 0.9,
      };
      setNotes((prev) => {
        const next = [...prev, note];
        return next.length > NOTE_MAX ? next.slice(next.length - NOTE_MAX) : next;
      });
      setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== note.id));
      }, NOTE_LIFETIME_MS);
    }, NOTE_SPAWN_MS);
    return () => clearInterval(interval);
  }, [musicMode, reducedMotion]);

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
    <div style={{ position: "relative" }}>
      <div className={s.notesLayer} aria-hidden="true">
        {notes.map((n) => (
          <span
            key={n.id}
            className={s.note}
            style={
              {
                left: `${n.left}%`,
                fontSize: `${n.size}px`,
                color: n.color,
                animationDuration: `${n.duration}s`,
                "--dx": `${n.dx}px`,
                "--r": `${n.rot}deg`,
              } as React.CSSProperties
            }
          >
            {n.symbol}
          </span>
        ))}
      </div>
      <h1 id={id} aria-label="Marco Bosquez" style={NAME_STYLE}>
        <div style={ROW_STYLE} aria-hidden="true">
          {ROW1_TOKENS.map(renderToken)}
        </div>
        <div style={ROW_STYLE} aria-hidden="true">
          {ROW2_TOKENS.map(renderToken)}
        </div>
      </h1>
    </div>
  );
}

// Sits in the card's kicker row while music mode is active — a mini
// equalizer + "PAUSE ❚❚" that stops the song and turns both eyes back
// off.
export function SwitchEyeMusicControl({ className = "" }: { className?: string }) {
  const { musicMode, stopMusic } = useSwitchEye();
  const { t } = useLocale();
  if (!musicMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        // Sits inside the presentation card, which flips on any click
        // inside it — this button's own click must not also trigger that.
        e.stopPropagation();
        stopMusic();
      }}
      aria-label={t.hub.switchEye.pauseMusicLabel}
      className={`${s.musicControl} ${className}`}
    >
      <span className={s.eq} aria-hidden="true">
        <span className={s.eqBar} />
        <span className={s.eqBar} />
        <span className={s.eqBar} />
        <span className={s.eqBar} />
      </span>
      <span className={s.pauseLabel}>PAUSE ❚❚</span>
    </button>
  );
}
