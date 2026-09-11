"use client";

import { useEffect, useState } from "react";

// The once-per-tab intro veil. The letter-by-letter assembly and fade
// are all CSS (.startup-veil* in globals.css) driven by the staggered
// animation-delay set below; this component just decides whether to
// play and unmounts the veil when it's done.
const KEY = "mb-booted";
const DURATION_MS = 2600;
const ROWS = ["MARCO", "BOSQUEZ"];

export function StartupAnimation() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem(KEY) === "1";
      if (!alreadyBooted) sessionStorage.setItem(KEY, "1");
    } catch {
      // storage blocked — treat as a first visit
    }
    if (alreadyBooted) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setDone(true), DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  // One running index across both rows so the accent wave sweeps the
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
