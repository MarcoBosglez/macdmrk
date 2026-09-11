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

// One floating, draggable "window" for a single gallery piece. Drag is
// hand-rolled: on pointer-down over the header we record the cursor's
// offset from the window's top-left, then each pointer-move reports
// (cursor - offset) back to ArtGrid as the new position.
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
      // keeps move/up events on the header even when the drag leaves it
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

  // Same inner content for both the floating and maximized layouts;
  // only the outer wrapper below differs.
  const chrome = (
    <>
      <div
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        className={`flex shrink-0 items-center justify-between border-b border-line bg-glass-soft px-3.5 py-2.5 select-none ${
          win.maximized ? "cursor-default" : "cursor-move"
        }`}
      >
        <span className="font-mono text-xs">{illustration.caption}</span>
        <div className="flex items-center gap-3.5">
          <button
            // don't let the header start a drag from this button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              playClick(win.maximized ? "minimize" : "maximize");
              onToggleMaximize();
            }}
            aria-label={win.maximized ? "Restore" : "Maximize"}
            title={win.maximized ? "Restore" : "Maximize"}
            className="text-muted hover:text-accent"
          >
            {win.maximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              playClick("close");
              onClose();
            }}
            className="font-mono text-xs text-muted transition-transform hover:scale-115 hover:text-accent"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-auto p-5">
        {/* object-contain: show the whole piece, uncropped */}
        <div className="relative mb-4 min-h-20 flex-1 overflow-hidden rounded-[12px] bg-bg">
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
        <div className="shrink-0 font-mono text-[12px] text-muted">{t.gallery.dragHint}</div>
      </div>
    </>
  );

  // Portal to <body> with fixed positioning so a drag can carry the
  // window anywhere on screen without the gallery's scroll pane
  // clipping it. win.x/win.y are viewport coordinates (see art-grid).
  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: win.maximized ? 0.98 : 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: win.maximized ? 0.16 : 0.18, ease: "easeOut" }}
      onPointerDownCapture={onFocus}
      className={
        win.maximized
          ? "fixed inset-0 z-[120] flex flex-col overflow-hidden border border-line bg-panel [backdrop-filter:blur(22px)_saturate(1.2)]"
          : "fixed flex flex-col overflow-hidden rounded-[18px] border border-line bg-panel [backdrop-filter:blur(22px)_saturate(1.2)] [box-shadow:var(--shadow)]"
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
