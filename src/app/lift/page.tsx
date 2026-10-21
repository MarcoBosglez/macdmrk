import type { Metadata } from "next";
import { UnlockGate } from "@/components/tools/unlock-gate";
import { LiftLogApp } from "@/components/tools/lift-log-app";

// Private tool, not part of the portfolio — kept out of search and off
// the nav (see src/lib/data/nav.ts).
export const metadata: Metadata = {
  title: "Lift Log",
  robots: { index: false, follow: false },
};

export default function LiftPage() {
  return (
    <UnlockGate>
      <LiftLogApp />
    </UnlockGate>
  );
}
