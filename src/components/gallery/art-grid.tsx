"use client";

import { useState } from "react";
import Image from "next/image";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { ViewPane } from "@/components/chrome/view-pane";
import { ArtWindow } from "@/components/gallery/art-window";
import { IgIcon } from "@/components/chrome/link-icons";
import { LINKS } from "@/lib/data/links";
import type { Illustration } from "@/lib/data/illustrations";

// One floating lightbox window currently open. `id` is the slug; `z` is
// the stacking order — most-recently-touched window gets the highest.
export type OpenWindow = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  maximized: boolean;
  z: number;
};

const MAX_IMAGE_W = 560;
const MAX_IMAGE_H = 420;
const MIN_IMAGE_W = 260;
const MIN_IMAGE_H = 200;
const CHROME_W = 40;
const CHROME_H = 151;

// "No two hovers alike" — each frame picks a transform from this cycle
// by its index in the grid.
const ART_HOVERS = [
  "translateY(-7px)",
  "rotate(2.6deg)",
  "scale(1.07)",
  "translateX(9px)",
  "rotate(-2.6deg) scale(1.03)",
  "translateY(-4px) scale(1.04)",
];

function windowSizeFor(illustration: Illustration | undefined) {
  if (!illustration) return { w: 420, h: 340 };
  const ratio = illustration.width / illustration.height;
  let imageW = MAX_IMAGE_W;
  let imageH = imageW / ratio;
  if (imageH > MAX_IMAGE_H) {
    imageH = MAX_IMAGE_H;
    imageW = imageH * ratio;
  }
  imageW = Math.max(imageW, MIN_IMAGE_W);
  imageH = Math.max(imageH, MIN_IMAGE_H);
  return { w: Math.round(imageW + CHROME_W), h: Math.round(imageH + CHROME_H) };
}

function ArtFrame({
  illustration,
  index,
  onOpen,
}: {
  illustration: Illustration;
  index: number;
  onOpen: () => void;
}) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      className="mb-3.5 block w-full break-inside-avoid rounded-[18px] border bg-glass p-2 text-left [backdrop-filter:blur(18px)]"
      style={{
        borderColor: on ? "var(--line-hot)" : "var(--line)",
        transform: on ? ART_HOVERS[index % ART_HOVERS.length] : "none",
        boxShadow: on ? "0 16px 34px rgba(0,0,0,.26)" : "none",
        transition:
          "transform .24s cubic-bezier(.2,.8,.3,1), border-color .18s ease, box-shadow .22s ease",
      }}
    >
      <div className="overflow-hidden rounded-[12px]">
        <Image
          src={illustration.image!}
          alt={illustration.caption}
          width={illustration.width}
          height={illustration.height}
          sizes="(max-width: 768px) 45vw, 22vw"
          className="block h-auto w-full"
          style={{ filter: on ? "saturate(1.35)" : "none", transition: "filter .22s ease" }}
        />
      </div>
      <div className="flex justify-between gap-2 px-1 pt-1.5">
        <span className="truncate font-mono text-[10px] text-ink">{illustration.caption}</span>
        <span className="shrink-0 font-mono text-[10px] text-muted">{illustration.medium}</span>
      </div>
    </button>
  );
}

export function ArtGrid({ illustrations }: { illustrations: Illustration[] }) {
  const { playClick } = useSound();
  const { t } = useLocale();
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [nextZ, setNextZ] = useState(20);

  function openWindow(id: string) {
    playClick("open");
    const { w, h } = windowSizeFor(illustrations.find((i) => i.slug === id));
    const z = nextZ;
    setNextZ(z + 1);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    setOpenWindows((prev) => {
      const existing = prev.find((win) => win.id === id);
      if (existing) return prev.map((win) => (win.id === id ? { ...win, z } : win));
      if (isMobile) return [...prev, { id, x: 0, y: 0, w, h, maximized: true, z }];
      const offset = (prev.length % 5) * 26;
      const maxX = Math.max(16, window.innerWidth - w - 16);
      const maxY = Math.max(16, window.innerHeight - h - 16);
      const x = Math.min(220 + offset, maxX);
      const y = Math.min(140 + offset, maxY);
      return [...prev, { id, x, y, w, h, maximized: false, z }];
    });
  }

  function closeWindow(id: string) {
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
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  }

  return (
    <ViewPane center={false} note={{ file: "mediums.txt", line: t.gallery.note }}>
      <div className="flex w-full max-w-[1040px] flex-1 flex-col gap-3 md:min-h-0">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
              {t.gallery.eyebrow}
            </span>
            <span className="font-mono text-[11px] text-muted">
              {illustrations.length} {t.gallery.countJoiner}
            </span>
          </div>
          <a
            href={LINKS.instagramArt}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick("nav")}
            aria-label="Instagram — art account"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-line-hot hover:text-accent"
          >
            <IgIcon className="h-3.5 w-3.5" />
            @macdmrk
          </a>
        </div>

        <div className="min-h-0 flex-1 md:overflow-y-auto">
          <div className="columns-2 gap-3.5 md:columns-4">
            {illustrations.map((ill, i) => (
              <ArtFrame
                key={ill.slug}
                illustration={ill}
                index={i}
                onOpen={() => openWindow(ill.slug)}
              />
            ))}
          </div>
        </div>
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
    </ViewPane>
  );
}
