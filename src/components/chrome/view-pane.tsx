"use client";

// The frame every route renders into: a fade-in column with the view
// content on top and the dashed "note strip" pinned below. `center`
// vertically centres the content while it fits, then falls back to
// top-aligned + scroll (the `my-auto` trick — `justify-center` would
// clip the overflowing top).
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
