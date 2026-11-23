"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ViewPane } from "@/components/chrome/view-pane";
import { PresentationCard } from "@/components/qr-card/PresentationCard";
import { PinguChat } from "@/components/hub/pingu-chat";
import FeaturedWork from "@/components/featured-work/FeaturedWork";

export function Hero() {
  const leftRef = useRef<HTMLDivElement>(null);
  const [chatHeight, setChatHeight] = useState<number | null>(null);

  // Pin the chat panel's height to the card + social bar column, measured
  // live — so a growing message list scrolls inside it instead of ever
  // resizing the panel itself.
  useLayoutEffect(() => {
    const el = leftRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const ro = new ResizeObserver((entries) => {
      if (!mq.matches) return;
      const h = entries[0]?.contentRect.height;
      if (h) setChatHeight(Math.round(h));
    });
    function syncForBreakpoint() {
      if (mq.matches) {
        setChatHeight(Math.round(el!.getBoundingClientRect().height));
      } else {
        setChatHeight(null);
      }
    }
    syncForBreakpoint();
    mq.addEventListener("change", syncForBreakpoint);
    ro.observe(el);
    return () => {
      mq.removeEventListener("change", syncForBreakpoint);
      ro.disconnect();
    };
  }, []);

  return (
    <ViewPane>
      {/* A bit more room than the gap-3.5 between the two hub cards —
          Featured now has its own header/rule, so it reads as a
          labeled subsection, not a separate page section. */}
      <div className="flex w-full max-w-[1040px] flex-col gap-[32px]">
        <div className="grid grid-cols-1 items-stretch gap-3.5 md:grid-cols-2">
          {/* Left — presentation card. self-start so this column keeps
              its own natural height instead of being stretched by the
              grid row (which would otherwise feed back into the
              ResizeObserver measurement below). */}
          <div ref={leftRef} className="flex @container flex-col gap-3.5 self-start">
            <PresentationCard />
          </div>

          {/* Right — ask_marco.sh */}
          <div className="flex min-h-0 flex-col">
            <PinguChat height={chatHeight ?? undefined} />
          </div>
        </div>

        <FeaturedWork allWorkHref="/work" />
      </div>
    </ViewPane>
  );
}
