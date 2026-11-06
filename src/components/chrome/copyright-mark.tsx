// Small visible ownership mark, desktop-only (mobile's bottom-left
// corner is MobileNavBubbles' spot — see that component). Decorative,
// non-interactive; the actual terms live in /LICENSE.
export function CopyrightMark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 left-6 z-30 hidden font-mono text-[11px] text-muted/60 md:block"
    >
      © 2026 Marco Bosquez
    </div>
  );
}
