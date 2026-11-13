"use client";

import { useEffect, useRef } from "react";
import { useEyeTarget } from "@/components/providers/cursor-provider";

// A capital "O" standing in as a tiny interactive eye — the pupil
// tracks the mouse on desktop, or the phone's tilt on touch devices
// (via deviceorientation, see cursor-provider). Sized in `em` so it
// scales with the kinetic name's own responsive font-size, and colored
// via currentColor so it inherits the same cursor-proximity color/
// transition the surrounding letters already animate.
//
// Real pointer data always wins when it's available — not gated on
// `pointerFine`, since that can misreport (devtools device-emulation
// mode, some trackpad/OS combos) and would otherwise strand the pupil
// dead-center forever with no mouse coordinates and no tilt sensor to
// fall back on. Tilt only kicks in once there's truly no pointer yet.
// Likewise this only skips the CSS easing under prefers-reduced-motion
// (an instant snap instead of a smoothed follow) rather than freezing
// the pupil outright — it's cursor-driven interactivity, not autoplay
// motion, so it should still track.
export function Eye() {
  const eyeRef = useRef<HTMLSpanElement>(null);
  const pupilRef = useRef<HTMLSpanElement>(null);
  const { pointer, tilt } = useEyeTarget();
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const eyeEl = eyeRef.current;
    const pupilEl = pupilRef.current;
    if (!eyeEl || !pupilEl) return;

    const rect = eyeEl.getBoundingClientRect();
    const maxDistance = rect.width / 2 - pupilEl.offsetWidth / 2 - 2;
    if (maxDistance <= 0) return;

    let x = 0;
    let y = 0;

    if (pointer) {
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      const deltaX = pointer.x - eyeCenterX;
      const deltaY = pointer.y - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);
      x = Math.cos(angle) * distance;
      y = Math.sin(angle) * distance;
    } else {
      x = tilt.x * maxDistance;
      y = tilt.y * maxDistance;
    }

    pupilEl.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    pupilEl.style.transition = reducedMotion.current ? "none" : "transform 0.1s ease-out";
  }, [pointer, tilt]);

  return (
    <span
      ref={eyeRef}
      aria-hidden="true"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "0.72em",
        height: "0.72em",
        boxSizing: "border-box",
        borderRadius: "50%",
        border: "0.06em solid currentColor",
        transform: "translateY(-0.12em)",
      }}
    >
      <span
        ref={pupilRef}
        style={{
          width: "0.3em",
          height: "0.3em",
          borderRadius: "50%",
          background: "currentColor",
        }}
      />
    </span>
  );
}
