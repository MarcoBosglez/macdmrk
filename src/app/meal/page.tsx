import type { Metadata } from "next";
import { UnlockGate } from "@/components/tools/unlock-gate";
import { MealLogApp } from "@/components/tools/meal-log-app";

// Private tool, not part of the portfolio — kept out of search and off
// the nav (see src/lib/data/nav.ts).
export const metadata: Metadata = {
  title: "Meal Log",
  robots: { index: false, follow: false },
};

export default function MealPage() {
  return (
    <UnlockGate>
      <MealLogApp />
    </UnlockGate>
  );
}
