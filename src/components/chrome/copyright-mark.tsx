// Small visible ownership mark, desktop-only. Bottom-center so it
// doesn't compete with MobileNavBubbles/PageGuide (bottom-left) or
// PrivateToolsButton (bottom-right). Decorative, non-interactive; the
// actual terms live in /LICENSE.
export function CopyrightMark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 font-mono text-[11px] text-muted/60 md:block"
    >
      © 2026 Marco Bosquez
    </div>
  );
}
