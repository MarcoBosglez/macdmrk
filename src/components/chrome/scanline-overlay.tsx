// The CRT scanline effect layered over the whole page — thin
// horizontal lines plus a soft corner vignette, fixed above every
// other layer (noise overlay, boot screen, window chrome) so it reads
// as glass in front of the entire screen rather than part of the
// background. Actual gradients live in globals.css (.scanline-overlay).
export function ScanlineOverlay() {
  return <div className="scanline-overlay" aria-hidden="true" />;
}
