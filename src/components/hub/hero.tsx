"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { ViewPane } from "@/components/chrome/view-pane";
import { SwitchEyeName, SwitchEyeProvider, SwitchEyeReset } from "@/components/hub/switch-eye";
import { SocialBar } from "@/components/hub/social-bar";
import { PinguChat } from "@/components/hub/pingu-chat";
import FeaturedWork from "@/components/featured-work/FeaturedWork";
import s from "./hero.module.css";

export function Hero() {
  const { t } = useLocale();
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
          {/* Left — presentation card + social bar. self-start so this
              column keeps its own natural height instead of being
              stretched by the grid row (which would otherwise feed back
              into the ResizeObserver measurement below). */}
          <div ref={leftRef} className="flex @container flex-col gap-3.5 self-start">
            <SwitchEyeProvider>
              <div className={`relative flex flex-col gap-3.5 p-6 ${s.aboutCard}`}>
                <SwitchEyeReset className="absolute top-4 right-4" />
                <div>
                  <span className={`font-mono uppercase ${s.eyebrow}`}>{t.hub.eyebrow}</span>
                  <div className="mt-1">
                    <SwitchEyeName />
                    <div className={`font-mono ${s.role}`}>{t.hub.role}</div>
                    <div className={`font-mono ${s.location}`}>{t.hub.location}</div>
                  </div>
                </div>
                <div className="h-px" style={{ background: "var(--line-hot)", opacity: 0.7 }} />
                {t.hub.bio ? <p className={`text-[13px] leading-relaxed ${s.bio}`}>{t.hub.bio}</p> : null}
                <div className="mt-auto flex flex-wrap gap-2">
                  {t.hub.chips.map((chip) => (
                    <span
                      key={chip}
                      className={`rounded-full border font-mono text-[11px] transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-wash ${s.chip}`}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </SwitchEyeProvider>
            <SocialBar />
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
