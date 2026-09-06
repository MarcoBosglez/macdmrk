"use client";

import { useCursorX } from "@/components/providers/cursor-provider";

// The hub's cursor-reactive name. Each row is one <span> per letter;
// every letter measures how close the pointer's normalized X is to its
// own position along the row and warps its variable-font width/weight
// (and lifts slightly, and flips to accent) by that amount. Nothing
// here animates size — only `font-variation-settings` + transform, so
// it stays cheap on every pointer frame.
const AMP = 0.85; // "playful" — 0.5 calm, 1.25 wild

function KineticRow({ word, offset }: { word: string; offset: number }) {
  const mx = useCursorX();
  const n = word.length;

  return (
    <div className="flex flex-nowrap select-none" style={{ lineHeight: 0.9 }}>
      {word.split("").map((ch, i) => {
        const pos = n === 1 ? 0.5 : (i + offset) / (n - 1 + offset * 2);
        const d = Math.min(1, Math.abs(pos - mx) * 2.2);
        const near = 1 - d;
        return (
          <span
            key={i}
            style={{
              fontSize: "clamp(30px, 3.6vw, 46px)",
              letterSpacing: "-0.03em",
              color: near > 0.7 ? "var(--accent)" : "var(--ink)",
              fontVariationSettings: `'wdth' ${(78 + near * AMP * 44).toFixed(1)}, 'wght' ${(
                420 +
                near * AMP * 460
              ).toFixed(0)}`,
              transform: `translateY(${(-near * AMP * 4).toFixed(2)}px)`,
              transition:
                "font-variation-settings .18s ease, color .18s ease, transform .18s ease",
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}

export function KineticName() {
  return (
    <div>
      <KineticRow word="MARCO" offset={0} />
      <KineticRow word="BOSQUEZ" offset={1} />
    </div>
  );
}
