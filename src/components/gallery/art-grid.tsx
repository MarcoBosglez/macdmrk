"use client";

import { useEffect, useMemo, useState } from "react";
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
// by its stable index in the full illustration list, so a piece keeps
// the same personality no matter how the grid is filtered.
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

// Two columns below md, four above. A media-query listener rather than a
// CSS `columns` masonry: the frames' hover transforms (rotate / scale /
// slide) get clipped at a real multicolumn boundary, but a plain flex
// column of blocks lets them lift freely.
function useColumnCount() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setCols(mq.matches ? 4 : 2);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return cols;
}

// Greedy shortest-column packing, using each image's real aspect ratio
// as its relative height so columns end up roughly level.
function packColumns<T extends { width: number; height: number }>(
  items: T[],
  cols: number
): T[][] {
  const columns: T[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  for (const item of items) {
    let shortest = 0;
    for (let c = 1; c < cols; c++) if (heights[c] < heights[shortest]) shortest = c;
    columns[shortest].push(item);
    heights[shortest] += item.height / item.width;
  }
  return columns;
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
      className="relative block w-full rounded-[18px] border bg-glass p-2 text-left [backdrop-filter:blur(18px)]"
      style={{
        borderColor: on ? "var(--line-hot)" : "var(--line)",
        transform: on ? ART_HOVERS[index % ART_HOVERS.length] : "none",
        boxShadow: on ? "0 16px 34px rgba(0,0,0,.26)" : "none",
        // Lift above neighbouring frames while transformed so a rotate
        // or scale never appears to be sliced by the next one.
        zIndex: on ? 10 : 1,
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
  const [medium, setMedium] = useState<string>("all");
  const cols = useColumnCount();

  // Distinct mediums present, most-common first. The filter row only
  // shows once more than one medium is actually in use.
  const mediums = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ill of illustrations) counts.set(ill.medium, (counts.get(ill.medium) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => m);
  }, [illustrations]);

  const shown = useMemo(
    () => (medium === "all" ? illustrations : illustrations.filter((i) => i.medium === medium)),
    [illustrations, medium]
  );

  const columns = useMemo(() => packColumns(shown, cols), [shown, cols]);
  // Stable per-piece index for the hover-transform cycle.
  const indexOf = useMemo(() => {
    const m = new Map(illustrations.map((ill, i) => [ill.slug, i]));
    return (slug: string) => m.get(slug) ?? 0;
  }, [illustrations]);

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
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
              {t.gallery.eyebrow}
            </span>
            <span className="font-mono text-[11px] text-muted">
              {shown.length} {t.gallery.countJoiner}
            </span>
          </div>
          <a
            href={LINKS.instagramArt}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick("nav")}
            aria-label="Instagram — art account"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-[transform,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-hot hover:text-accent"
          >
            <IgIcon className="h-3.5 w-3.5" />
            @macdmrk
          </a>
        </div>

        {mediums.length > 1 ? (
          <div className="flex shrink-0 flex-wrap gap-1.5">
            {["all", ...mediums].map((m) => {
              const active = m === medium;
              return (
                <button
                  key={m}
                  onClick={() => {
                    playClick("nav");
                    setMedium(m);
                  }}
                  aria-pressed={active}
                  className="rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
                  style={{
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "var(--bg)" : "var(--dim)",
                    borderColor: active ? "var(--accent)" : "var(--line)",
                  }}
                >
                  {m === "all" ? t.gallery.filterAll : m}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 md:overflow-y-auto">
          {/* key on the filter so the fade replays when it changes; the
              px padding gives the hover transforms room so nothing is
              clipped by the scroll container's edge. */}
          <div key={medium} className="animate-fade flex gap-3.5 px-3 pb-4">
            {columns.map((col, ci) => (
              <div key={ci} className="flex min-w-0 flex-1 flex-col gap-3.5">
                {col.map((ill) => (
                  <ArtFrame
                    key={ill.slug}
                    illustration={ill}
                    index={indexOf(ill.slug)}
                    onOpen={() => openWindow(ill.slug)}
                  />
                ))}
              </div>
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
