"use client";

import { Eye } from "@/components/hub/eye";

// The hub's name — static, always in the accent green (previously this
// warped each letter's variable-font width/weight and lifted it based
// on cursor proximity, but that read as too jittery; simplified down to
// a plain static treatment). The "O"s are still swapped for a pair of
// cursor-tracking eyes — see eye.tsx.
function KineticRow({ word }: { word: string }) {
  return (
    <div className="flex flex-nowrap items-baseline select-none" style={{ lineHeight: 0.9 }}>
      {word.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            fontSize: "clamp(30px, 3.6vw, 46px)",
            letterSpacing: "-0.03em",
            color: "var(--accent)",
            fontVariationSettings: "'wght' 700",
          }}
        >
          {ch === "O" ? (
            <>
              <span className="sr-only">O</span>
              <Eye />
            </>
          ) : (
            ch
          )}
        </span>
      ))}
    </div>
  );
}

export function KineticName() {
  return (
    <div>
      <KineticRow word="MARCO" />
      <KineticRow word="BOSQUEZ" />
    </div>
  );
}
