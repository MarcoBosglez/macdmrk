// Short, page-specific tips for the PageGuide bubble (see
// src/components/page-guide). Keyed by route — a dynamic route is
// written the same way Next.js names its segment, e.g. "/work/[slug]",
// and PageGuide matches that pattern against the live pathname. A
// route with no entry here just renders nothing.
export type TipTag = "welcome" | "how-to" | "tip";
export type Tip = { tag: TipTag; text: string };

export const pageTips: Record<string, Tip[]> = {
  "/": [
    { tag: "welcome", text: "This is my hub: who I am, a terminal you can type in, and my featured work." },
    { tag: "how-to", text: "Type help in the terminal to see what it can do." },
    { tag: "how-to", text: "Featured cards open the full case study." },
  ],
  "/work": [
    { tag: "how-to", text: "Filter by personal, academic or professional." },
    { tag: "how-to", text: "Open any card for the full story: why, how and the outcome." },
  ],
  "/work/[slug]": [
    { tag: "how-to", text: "Use the project menu at the top to jump between projects." },
    { tag: "tip", text: "Short on time? Read the three cards under \"the story in 30 seconds\"." },
  ],
  "/about": [
    { tag: "how-to", text: "This page covers my experience, stack, and where to find me elsewhere." },
  ],
  "/gallery": [
    { tag: "tip", text: "Click any piece to see it larger." },
  ],
  "/contact": [
    { tag: "how-to", text: "Email is the fastest way to reach me. I reply within a day or two." },
  ],
};
