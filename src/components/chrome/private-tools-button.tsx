"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useSound } from "@/components/providers/sound-provider";

// A floating, slightly playful entry point to the private /lift and
// /meal tools — fixed bottom-right (MobileNavBubbles owns bottom-left),
// shown only on the hub so it doesn't follow you around the rest of
// the site.
export function PrivateToolsButton() {
  const pathname = usePathname();
  const { playClick } = useSound();
  const [on, setOn] = useState(false);

  if (pathname !== "/") return null;

  return (
    <Link
      href="/lift"
      onClick={() => playClick("nav")}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      aria-label="Private tools"
      title="Private tools"
      className="hub-motion fixed right-6 bottom-6 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel text-muted shadow-lg"
      style={{
        color: on ? "var(--accent)" : "var(--muted)",
        borderColor: on ? "var(--line-hot)" : "var(--line)",
        transform: on ? "translateY(-3px) rotate(-8deg)" : undefined,
        boxShadow: on
          ? "0 12px 28px -8px var(--accent), 0 0 0 1px var(--line-hot) inset"
          : "0 8px 20px -8px rgba(0,0,0,.35)",
        transition: "transform .25s cubic-bezier(.34,1.56,.64,1), color .2s ease, border-color .2s ease, box-shadow .25s ease",
      }}
    >
      <Lock className="h-[18px] w-[18px] animate-pulse-dot" style={{ animationDuration: "3s" }} />
    </Link>
  );
}
