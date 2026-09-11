"use client";

import { useEffect, useRef } from "react";

// Little shapes that tumble in 3D and drift around the viewport behind
// the glass panels (z-1); the cursor scatters them by proximity. Hand-
// rolled rAF physics in 2D screen space, 3D is CSS transforms. The
// layer is pointer-transparent and desktop-only.

const COUNT = 6;
const FRICTION = 0.985; // how fast a shove decays
const WALL_DAMP = 0.82;
const HIT_RADIUS = 120; // cursor proximity that disturbs a shape
const MAX_SPEED = 18;
const MIN_DRIFT = 0.45; // shapes never fully stop
const FRAME = 1000 / 60;

type Shape = "ring" | "triangle" | "diamond" | "cross" | "star" | "wave";
const SHAPES: Shape[] = ["ring", "triangle", "diamond", "cross", "star", "wave"];

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;
  pos: HTMLDivElement | null;
  spin: HTMLDivElement | null;
};

function ShapeSvg({ shape }: { shape: Shape }) {
  const c = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-full w-full",
  };
  switch (shape) {
    case "ring":
      return (
        <svg {...c}>
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
    case "triangle":
      return (
        <svg {...c}>
          <path d="M12 3.5 L20.5 19.5 L3.5 19.5 Z" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...c}>
          <path d="M12 2.5 L21.5 12 L12 21.5 L2.5 12 Z" />
        </svg>
      );
    case "cross":
      return (
        <svg {...c}>
          <path d="M12 3.5 V20.5 M3.5 12 H20.5" />
        </svg>
      );
    case "star":
      return (
        <svg {...c}>
          <path d="M12 2.5 l2.7 5.9 6.5 .8 -4.8 4.4 1.2 6.4 -5.8 -3.2 -5.8 3.2 1.2 -6.4 -4.8 -4.4 6.5 -.8 Z" />
        </svg>
      );
    case "wave":
      return (
        <svg {...c}>
          <path d="M2.5 14 q3.5 -7 7 0 t7 0 t7 0" />
        </svg>
      );
  }
}

export function FloatyField() {
  const bodies = useRef<Body[]>(SHAPES.map(blankBody));
  const rafRef = useRef<number | null>(null);
  const cursor = useRef({ x: -999, y: -999, px: -999, py: -999 });

  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    // Randomise every shape's size, position, velocity and spin.
    for (const b of bodies.current) {
      b.r = 26 + Math.random() * 16;
      b.x = b.r + Math.random() * (W - 2 * b.r);
      b.y = 100 + Math.random() * Math.max(140, H - 220 - 2 * b.r);
      const a = Math.random() * Math.PI * 2;
      b.vx = Math.cos(a) * 1.2;
      b.vy = Math.sin(a) * 1.2;
      b.rx = Math.random() * 360;
      b.ry = Math.random() * 360;
      b.rz = Math.random() * 360;
      b.vrx = (Math.random() - 0.5) * 1.4;
      b.vry = (Math.random() - 0.5) * 1.4;
      b.vrz = (Math.random() - 0.5) * 1;
      if (b.pos) {
        b.pos.style.width = `${b.r * 2}px`;
        b.pos.style.height = `${b.r * 2}px`;
      }
    }

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
    };
    const onMove = (e: PointerEvent) => {
      cursor.current.x = e.clientX;
      cursor.current.y = e.clientY;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });

    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(3, (now - last) / FRAME) || 1;
      last = now;

      const cur = cursor.current;
      const cursorSpeed = Math.hypot(cur.x - cur.px, cur.y - cur.py);
      const list = bodies.current;

      for (let i = 0; i < list.length; i++) {
        const b = list[i];

        // Cursor shove: push away from the pointer, harder the closer
        // and the faster it's moving.
        if (cur.x > -900) {
          const dx = b.x - cur.x;
          const dy = b.y - cur.y;
          const d = Math.hypot(dx, dy);
          if (d < HIT_RADIUS && d > 0.01) {
            const force = ((HIT_RADIUS - d) / HIT_RADIUS) * (0.7 + cursorSpeed * 0.16);
            b.vx += (dx / d) * force;
            b.vy += (dy / d) * force;
            b.vrx += (Math.random() - 0.5) * force * 0.7;
            b.vry += (Math.random() - 0.5) * force * 0.7;
          }
        }

        // Friction, but never let a shape fully stop.
        b.vx = clamp(b.vx * FRICTION, -MAX_SPEED, MAX_SPEED);
        b.vy = clamp(b.vy * FRICTION, -MAX_SPEED, MAX_SPEED);
        const sp = Math.hypot(b.vx, b.vy);
        if (sp < MIN_DRIFT) {
          const a = sp > 0.001 ? Math.atan2(b.vy, b.vx) : Math.random() * Math.PI * 2;
          b.vx = Math.cos(a) * MIN_DRIFT;
          b.vy = Math.sin(a) * MIN_DRIFT;
        }
        // Move, then bounce off the viewport edges.
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.x < b.r) {
          b.x = b.r;
          b.vx = Math.abs(b.vx) * WALL_DAMP;
        } else if (b.x > W - b.r) {
          b.x = W - b.r;
          b.vx = -Math.abs(b.vx) * WALL_DAMP;
        }
        if (b.y < b.r) {
          b.y = b.r;
          b.vy = Math.abs(b.vy) * WALL_DAMP;
        } else if (b.y > H - b.r) {
          b.y = H - b.r;
          b.vy = -Math.abs(b.vy) * WALL_DAMP;
        }

        // Spin eases back toward a slow idle tumble after a hit.
        b.vrx += (0.3 * Math.sign(b.vrx || 1) - b.vrx) * 0.01;
        b.vry += (0.36 * Math.sign(b.vry || 1) - b.vry) * 0.01;
        b.rx += b.vrx * dt;
        b.ry += b.vry * dt;
        b.rz += b.vrz * dt;

        // Elastic collisions with the other shapes.
        for (let j = i + 1; j < list.length; j++) {
          const o = list[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d = Math.hypot(dx, dy);
          const min = b.r + o.r;
          if (d > 0 && d < min) {
            const nx = dx / d;
            const ny = dy / d;
            const overlap = (min - d) / 2;
            b.x -= nx * overlap;
            b.y -= ny * overlap;
            o.x += nx * overlap;
            o.y += ny * overlap;
            const p = (b.vx - o.vx) * nx + (b.vy - o.vy) * ny;
            if (p > 0) {
              b.vx -= p * nx;
              b.vy -= p * ny;
              o.vx += p * nx;
              o.vy += p * ny;
            }
          }
        }

        // Write straight to the DOM — no React re-render per frame.
        if (b.pos) b.pos.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
        if (b.spin)
          b.spin.style.transform = `rotateX(${b.rx}deg) rotateY(${b.ry}deg) rotateZ(${b.rz}deg)`;
      }

      cur.px = cur.x;
      cur.py = cur.y;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    // Pause the loop while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (rafRef.current == null) {
        last = performance.now();
        rafRef.current = requestAnimationFrame(step);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="floaty-field pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden md:block"
      style={{ perspective: "1000px" }}
    >
      {SHAPES.map((shape, i) => (
        // `pos` is moved by the loop; `spin` is rotated. Two copies of
        // the shape offset in Z give it a bit of 3D thickness.
        <div
          key={i}
          ref={(el) => {
            bodies.current[i].pos = el;
          }}
          className="absolute top-0 left-0 text-accent [filter:drop-shadow(0_0_5px_currentColor)]"
          style={{ width: 52, height: 52, willChange: "transform" }}
        >
          <div
            ref={(el) => {
              bodies.current[i].spin = el;
            }}
            className="relative h-full w-full [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 opacity-70 [transform:translateZ(8px)]">
              <ShapeSvg shape={shape} />
            </div>
            <div className="absolute inset-0 opacity-35 [transform:translateZ(-8px)]">
              <ShapeSvg shape={shape} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function blankBody(): Body {
  return {
    x: 0, y: 0, vx: 0, vy: 0, r: 26,
    rx: 0, ry: 0, rz: 0, vrx: 0, vry: 0, vrz: 0,
    pos: null, spin: null,
  };
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
