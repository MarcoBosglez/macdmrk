"use client";

// The shared frame every route renders into: a column that cross-fades
// in on mount, with the content area on top and the dashed "note strip"
// pinned at the bottom. `note` is the mono filename + the "→ ..." line
// spec'd per view in the handoff.
//
// On desktop the column is exactly the stage height and the content
// area scrolls inside itself if a view overflows; on mobile the whole
// <main> scrolls instead, so the column is free to grow. When
// `center`, the content sits in the vertical middle while it fits and
// falls back to top-aligned + scrolling once it doesn't (the `my-auto`
// trick — `justify-center` would clip the overflowing top instead).
export function ViewPane({
  note,
  center = true,
  children,
}: {
  note: { file: string; line: string };
  center?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade flex min-h-full flex-col items-center gap-2.5 py-1.5 md:h-full">
      <div className="flex w-full min-h-0 flex-1 flex-col items-center md:overflow-y-auto">
        <div className={`flex w-full flex-col items-center ${center ? "my-auto" : "flex-1"}`}>
          {children}
        </div>
      </div>
      <div className="flex w-full max-w-[1040px] shrink-0 items-baseline gap-3 rounded-[14px] border border-dashed border-line bg-glass-soft px-3.5 py-2.5 [backdrop-filter:blur(14px)]">
        <span className="shrink-0 font-mono text-[10px] text-muted">{note.file}</span>
        <span className="font-mono text-[12px] leading-relaxed text-dim">{note.line}</span>
      </div>
    </div>
  );
}
