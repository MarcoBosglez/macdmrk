"use client";

import { useEffect, useState } from "react";

// Plays once per tab session: the name assembles letter by letter — each
// glyph snaps from wide+heavy to its rest width/weight while a short
// accent wave washes across, driven purely by the staggered CSS
// animation-delay below — then the veil fades to reveal the hub. All of
// the choreography lives in globals.css (.startup-veil*); this component
// only decides whether to play and unmounts the overlay when it's done.
const KEY = "mb-booted";
const DURATION_MS = 2600;
const ROWS = ["MARCO", "BOSQUEZ"];

export function StartupAnimation() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem(KEY) === "1";
    } catch {
      // sessionStorage can throw in locked-down contexts — treat as first visit.
    }
    // `data-motion` is resolved before paint by the script in layout.tsx
    // (OS setting + the user's saved override).
    const motionOff = document.documentElement.dataset.motion === "off";

    if (alreadyBooted || motionOff) {
      setDone(true);
      return;
    }

    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      // Ignore — worst case the intro replays on the next load.
    }
    const t = setTimeout(() => setDone(true), DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  // Continuous index across both rows so the accent wave sweeps the
  // whole name, not each row from scratch.
  let letter = 0;

  return (
    <div className="startup-veil" aria-hidden="true">
      <div className="startup-veil__name">
        {ROWS.map((row) => (
          <div className="startup-veil__row" key={row}>
            {row.split("").map((ch, i) => (
              <span key={i} style={{ animationDelay: `${letter++ * 72}ms` }}>
                {ch}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
