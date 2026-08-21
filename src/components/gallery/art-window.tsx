"use client";

import { useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "motion/react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import type { Illustration } from "@/lib/data/illustrations";
import type { OpenWindow } from "@/components/gallery/art-grid";

// One floating, draggable "window" showing a single gallery piece.
// Dragging is done by hand with pointer events rather than a library:
// on pointer-down over the header we record how far the cursor is from
// the window's top-left corner (the "offset"), then on every
// pointer-move we tell the parent (ArtGrid) the new top-left position
// — cursor position minus that same offset — so the window follows the
// cursor instead of snapping its corner to it.
export function ArtWindow({
  win,
  illustration,
  onClose,
  onFocus,
  onMove,
  onToggleMaximize,
}: {
  win: OpenWindow;
  illustration: Illustration;
  onClose: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onToggleMaximize: () => void;
}) {
  const { playClick } = useSound();
  const { t } = useLocale();
  const dragState = useRef<{ offsetX: number; offsetY: number } | null>(null);

  const onHeaderPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (win.maximized) return;
      onFocus();
      dragState.current = { offsetX: e.clientX - win.x, offsetY: e.clientY - win.y };
      // Pointer capture keeps move/up events targeting this header even
      // if the cursor drags outside the window's bounds mid-drag.
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [win.maximized, win.x, win.y, onFocus]
  );

  const onHeaderPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragState.current) return;
      onMove(e.clientX - dragState.current.offsetX, e.clientY - dragState.current.offsetY);
    },
    [onMove]
  );

  const onHeaderPointerUp = useCallback(() => {
    dragState.current = null;
  }, []);

  // Shared between both layouts below — only the outer wrapper (and
  // where it renders) differs between a normal floating window and a
  // maximized one.
  const chrome = (
    <>
      <div
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        className={`flex shrink-0 items-center justify-between border-b border-border bg-bg px-3.5 py-2.5 select-none ${
          win.maximized ? "cursor-default" : "cursor-move"
        }`}
      >
        <span className="font-mono text-xs">{illustration.caption}</span>
        <div className="flex items-center gap-3.5">
          <button
            // Stops the pointerdown from reaching the header's own
            // handler above — otherwise it calls setPointerCapture on
            // the header (meant for title-bar dragging) and that
            // redirects this button's click away before it can fire.
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              playClick(win.maximized ? "minimize" : "maximize");
              onToggleMaximize();
            }}
            aria-label={win.maximized ? "Restore" : "Maximize"}
            title={win.maximized ? "Restore" : "Maximize"}
            className="text-muted hover:text-emerald"
          >
            {win.maximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              playClick("close");
              onClose();
            }}
            className="font-mono text-xs text-muted transition-transform hover:scale-115 hover:text-emerald"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-auto p-5">
        {/* object-contain (not cover) so the whole picture stays
            visible at its real proportions — this is the "real size"
            view, cropping belongs to the grid thumbnail, not here. */}
        <div className="relative mb-4 min-h-20 flex-1 overflow-hidden rounded bg-bg">
          {illustration.image ? (
            <Image
              src={illustration.image}
              alt={illustration.caption}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, oklch(65% 0.16 ${illustration.hue}), oklch(55% 0.16 ${
                  illustration.hue + 40
                }))`,
              }}
            />
          )}
        </div>
        <div className="mb-1.5 shrink-0 font-mono text-sm"># {illustration.caption}</div>
        {illustration.description ? (
          <p className="mb-1.5 shrink-0 text-[13px] leading-relaxed text-muted">
            {illustration.description}
          </p>
        ) : null}
        <div className="shrink-0 font-mono text-[11px] text-muted">{t.gallery.dragHint}</div>
      </div>
    </>
  );

  // Both maximized and normal windows portal straight to document.body
  // and use fixed (viewport) positioning rather than rendering inline
  // inside the gallery grid. A normal window used to be absolutely
  // positioned inside the grid's own scrolling pane, which clipped it
  // the moment a drag carried it past that pane's edges — you couldn't
  // pull it out over the top bar or the nav. Being a body-level sibling
  // like the maximized view already was removes that boundary entirely
  // (see win.x/win.y's viewport-space starting offsets in art-grid.tsx,
  // chosen to clear the top bar and nav sidebar on open). It's also why
  // maximized windows can sit above the global scanline overlay
  // (z-index 110) — nested inside AppWindow's own stacking context
  // (z-10) they couldn't, no matter their own z-index.
  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: win.maximized ? 0.98 : 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: win.maximized ? 0.16 : 0.18, ease: "easeOut" }}
      onPointerDownCapture={onFocus}
      className={
        win.maximized
          ? "fixed inset-0 z-[120] flex flex-col overflow-hidden border border-border bg-panel"
          : "fixed flex flex-col overflow-hidden rounded-lg border border-border bg-panel shadow-2xl"
      }
      style={
        win.maximized
          ? undefined
          : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }
      }
    >
      {chrome}
    </motion.div>,
    document.body
  );
}
