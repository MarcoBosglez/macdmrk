// Small visible ownership mark, desktop-only. Bottom-center so it
// doesn't compete with MobileNavBubbles/PageGuide (bottom-left) or
// PrivateToolsButton (bottom-right) — but plenty of page content also
// ends up near the bottom-center at some scroll position or other
// (e.g. /work's own pagination), and this is fixed, so it's always
// there regardless of scroll. z-[1] (MainShell is z-[2], AuroraField
// is z-0) keeps it below any real page content it might land on top
// of, so the two never visually fight — only the empty background
// shows through it. Decorative, non-interactive; the actual terms
// live in /LICENSE.
export function CopyrightMark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[1] hidden -translate-x-1/2 font-mono text-[11px] text-muted/60 md:block"
    >
      © 2026 Marco Bosquez
    </div>
  );
}
