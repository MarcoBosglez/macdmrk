// The slow aurora field behind everything: three big blurred blobs,
// each drifting on its own long ease-in-out loop, plus a faint 56px
// grid. Pure decoration — fixed, behind the stage, no pointer events.
// The float animations are gated by prefers-reduced-motion in
// globals.css (via the [data-aurora-blob] hook).
export function AuroraField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        data-aurora-blob
        className="absolute rounded-full"
        style={{
          width: "48vw",
          height: "48vw",
          left: "-8vw",
          top: "-12vh",
          background: "radial-gradient(circle, var(--blob-a), transparent 68%)",
          filter: "blur(30px)",
          animation: "floatA 22s ease-in-out infinite",
        }}
      />
      <div
        data-aurora-blob
        className="absolute rounded-full"
        style={{
          width: "40vw",
          height: "40vw",
          right: "-6vw",
          top: "24vh",
          background: "radial-gradient(circle, var(--blob-b), transparent 68%)",
          filter: "blur(34px)",
          animation: "floatB 28s ease-in-out infinite",
        }}
      />
      <div
        data-aurora-blob
        className="absolute rounded-full"
        style={{
          width: "34vw",
          height: "34vw",
          left: "32vw",
          bottom: "-14vh",
          background: "radial-gradient(circle, var(--blob-c), transparent 70%)",
          filter: "blur(30px)",
          animation: "floatC 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}
