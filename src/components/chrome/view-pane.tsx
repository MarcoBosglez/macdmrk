"use client";

// The frame every route renders into: a fade-in column. `center`
// vertically centres the content while it fits, then falls back to
// top-aligned + scroll (the `my-auto` trick — `justify-center` would
// clip the overflowing top).
export function ViewPane({
  center = true,
  children,
}: {
  center?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade flex min-h-full flex-col items-center py-1.5 md:h-full">
      <div className="flex w-full min-h-0 flex-1 flex-col items-center md:overflow-y-auto">
        <div className={`flex w-full flex-col items-center ${center ? "my-auto" : "flex-1"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
