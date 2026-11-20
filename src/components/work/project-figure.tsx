"use client";

// A case-study image treated as evidence, not decoration: it keeps its
// real aspect ratio (no object-cover crop), gets a numbered caption
// ("fig. 02 — …") that says what to look at, and opens full size on
// click, so dense screenshots (design canvases, dashboards) stay legible.

import { useRef } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

const BORDER = "#2b5a3f";
const BORDER_HOT = "#3e7a57";
const BG = "#0a1a12";
const MUTED = "#8fae9c";
const AMBER = "#ffb347";
const MONO = "var(--font-jetbrains-mono, ui-monospace, monospace)";
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dffa8]";

export function ProjectFigure({
  src,
  alt,
  num,
  caption,
  sizes,
  enlargeLabel,
  closeLabel,
}: {
  src: string;
  alt: string;
  /** Figure number shown before the caption, e.g. "02". */
  num: string;
  caption?: string;
  sizes: string;
  enlargeLabel: string;
  closeLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <figure className="flex w-full flex-col gap-2">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`${enlargeLabel}: ${alt}`}
        className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-[14px] border transition-colors hover:border-[#3e7a57] ${FOCUS_RING}`}
        style={{ borderColor: BORDER, background: BG }}
      >
        {/* width/height 0 + width:100%/height:auto = render at the file's
            own aspect ratio instead of cropping into a fixed box. */}
        <Image src={src} alt={alt} width={0} height={0} sizes={sizes} className="block h-auto w-full" />
        <span
          className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ borderColor: BORDER_HOT, background: "rgba(10,26,18,0.85)", color: MUTED }}
          aria-hidden="true"
        >
          <Maximize2 size={11} /> {enlargeLabel}
        </span>
      </button>

      <figcaption className="text-[12px] leading-relaxed" style={{ fontFamily: MONO, color: MUTED }}>
        <span style={{ color: AMBER }}>fig. {num}</span>
        {caption ? <> — {caption}</> : null}
      </figcaption>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        // Clicking the backdrop (the dialog element itself, outside the
        // image) closes it; Esc is handled natively.
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85"
      >
        <div className="relative flex items-center justify-center p-4" onClick={() => dialogRef.current?.close()}>
          <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto max-h-[90vh] w-auto max-w-[95vw] rounded-[10px] border object-contain"
            style={{ borderColor: BORDER }}
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={closeLabel}
            className={`absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border ${FOCUS_RING}`}
            style={{ borderColor: BORDER_HOT, background: "rgba(10,26,18,0.9)", color: MUTED }}
          >
            <X size={15} />
          </button>
        </div>
      </dialog>
    </figure>
  );
}
