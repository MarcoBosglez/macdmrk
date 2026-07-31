"use client";

import { useState } from "react";
import Image from "next/image";
import { useSound } from "@/components/providers/sound-provider";
import { ArtWindow } from "@/components/gallery/art-window";
import type { Illustration } from "@/lib/data/illustrations";

// One floating lightbox window that's currently open. `id` is the
// illustration's slug. `z` is its stacking order — whichever window
// was clicked/dragged most recently gets the highest `z` so it visibly
// sits on top of the others, the same way real OS windows work.
export type OpenWindow = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  maximized: boolean;
  z: number;
};

// The gallery grid plus a tiny in-memory "window manager" for the
// floating lightbox windows that open on top of it. Multiple pieces
// can be open (and dragged around) at once, which is why this is
// plain component state rather than routing — a URL can only point at
// one thing at a time, but this view intentionally allows several.
export function ArtGrid({ illustrations }: { illustrations: Illustration[] }) {
  const { playClick } = useSound();
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  // Monotonically increasing counter used purely for z-index — every
  // time a window is opened or focused it claims the next number, so
  // it's guaranteed to render above every window opened before it.
  const [nextZ, setNextZ] = useState(20);

  function openWindow(id: string) {
    playClick();
    const z = nextZ;
    setNextZ(z + 1);
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      // Already open — just bring it to the front instead of opening
      // a duplicate.
      if (existing) return prev.map((w) => (w.id === id ? { ...w, z } : w));
      // Stagger each newly-opened window's starting position slightly
      // so opening several in a row doesn't stack them in an identical
      // spot on top of each other.
      const offset = (prev.length % 5) * 26;
      return [...prev, { id, x: 100 + offset, y: 20 + offset, w: 420, h: 340, maximized: false, z }];
    });
  }

  function closeWindow(id: string) {
    playClick();
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  }

  function focusWindow(id: string) {
    const z = nextZ;
    setNextZ(z + 1);
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z } : w)));
  }

  function moveWindow(id: string, x: number, y: number) {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }

  function toggleMaximize(id: string) {
    playClick();
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }

  return (
    <div className="relative h-full overflow-y-auto p-6 md:p-8">
      <div className="mb-4.5 font-mono text-[13px] text-mint">~/art/ ls -la</div>
      {/* CSS multi-column masonry: each tile sizes to its own image's
          real aspect ratio (via width/height below) instead of a
          fixed, hand-picked height, so nothing gets cropped. */}
      <div className="columns-3 gap-3 md:columns-6 md:gap-3.5">
        {illustrations.map((ill) => (
          <button
            key={ill.slug}
            onClick={() => openWindow(ill.slug)}
            style={{
              background: ill.image
                ? undefined
                : `repeating-linear-gradient(135deg, oklch(60% 0.1 ${ill.hue} / 0.18) 0px, oklch(60% 0.1 ${ill.hue} / 0.18) 12px, var(--panel) 12px, var(--panel) 24px)`,
              aspectRatio: ill.image ? undefined : `${ill.width} / ${ill.height}`,
            }}
            className="relative mb-3 block w-full break-inside-avoid overflow-hidden rounded border border-border p-1.5 text-left transition-transform hover:-translate-y-0.5 md:mb-3.5"
          >
            {ill.image ? (
              <Image
                src={ill.image}
                alt={ill.caption}
                width={ill.width}
                height={ill.height}
                sizes="(max-width: 768px) 33vw, 16vw"
                className="block h-auto w-full rounded"
              />
            ) : null}
            <span className="absolute bottom-1.5 left-1.5 z-10 max-w-[calc(100%-0.75rem)] truncate rounded-sm bg-bg px-1.5 py-0.5 font-mono text-[10px]">
              {ill.caption}
            </span>
          </button>
        ))}
      </div>

      {openWindows.map((w) => {
        const illustration = illustrations.find((i) => i.slug === w.id);
        if (!illustration) return null;
        return (
          <ArtWindow
            key={w.id}
            win={w}
            illustration={illustration}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            onMove={(x, y) => moveWindow(w.id, x, y)}
            onToggleMaximize={() => toggleMaximize(w.id)}
          />
        );
      })}
    </div>
  );
}
