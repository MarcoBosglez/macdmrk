// The faint animated grain texture layered over the window background.
// Actual styling/animation lives in globals.css (.noise-overlay) —
// this component just gives it a name so it can be dropped in
// wherever the effect is needed instead of repeating the class.
export function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}
