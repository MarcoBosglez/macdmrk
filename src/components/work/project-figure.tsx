"use client";

// A case-study image treated as evidence, not decoration: it keeps its
// real aspect ratio (no object-cover crop), gets a numbered caption
// ("fig. 02 — …") that says what to look at, and opens full size on
// click, so dense screenshots (design canvases, dashboards) stay legible.

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

const BORDER = "var(--line)";
const BORDER_HOT = "var(--acc)";
const BG = "var(--bg)";
const MUTED = "var(--ink2)";
const AMBER = "var(--amber)";
const MONO = "var(--font-jetbrains-mono, ui-monospace, monospace)";
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]";

/**
 * Any image that opens full size on click: an "enlarge" chip on hover and
 * a native <dialog> lightbox (closes on Esc, the backdrop, or the X).
 * `children` is the image as it appears on the page, cropped or not.
 */
export function Enlargeable({
  src,
  alt,
  enlargeLabel,
  closeLabel,
  className = "",
  style,
  children,
}: {
  src: string;
  alt: string;
  enlargeLabel: string;
  closeLabel: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`${enlargeLabel}: ${alt}`}
        className={`group relative block w-full cursor-zoom-in overflow-hidden border transition-colors hover:border-[var(--acc)] ${FOCUS_RING} ${className}`}
        style={{ borderColor: BORDER, background: BG, ...style }}
      >
        {children}
        <span
          className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ borderColor: BORDER_HOT, background: "color-mix(in srgb, var(--bg) 85%, transparent)", color: MUTED }}
          aria-hidden="true"
        >
          <Maximize2 size={11} /> {enlargeLabel}
        </span>
      </button>

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
            style={{ borderColor: BORDER_HOT, background: "color-mix(in srgb, var(--bg) 90%, transparent)", color: MUTED }}
          >
            <X size={15} />
          </button>
        </div>
      </dialog>
    </>
  );
}

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
  return (
    <figure className="flex w-full flex-col gap-2">
      <Enlargeable src={src} alt={alt} enlargeLabel={enlargeLabel} closeLabel={closeLabel} className="rounded-[14px]">
        {/* width/height 0 + width:100%/height:auto = render at the file's
            own aspect ratio instead of cropping into a fixed box. */}
        <Image src={src} alt={alt} width={0} height={0} sizes={sizes} className="block h-auto w-full" />
      </Enlargeable>

      <figcaption className="text-[12px] leading-relaxed" style={{ fontFamily: MONO, color: MUTED }}>
        <span style={{ color: AMBER }}>fig. {num}</span>
        {caption ? <> — {caption}</> : null}
      </figcaption>
    </figure>
  );
}
