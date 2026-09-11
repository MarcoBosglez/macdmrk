"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { ViewPane } from "@/components/chrome/view-pane";
import { KineticName } from "@/components/hub/kinetic-name";
import { QrCode } from "@/components/hub/qr-code";
import { SocialBar } from "@/components/hub/social-bar";
import { PinguChat } from "@/components/hub/pingu-chat";

const PANEL_GLASS =
  "rounded-[22px] border border-line bg-glass [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]";

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
    <ViewPane note={{ file: "start_here.txt", line: t.hub.note }}>
      <div className="grid w-full max-w-[1040px] items-stretch gap-3.5 md:grid-cols-2">
        {/* Left — presentation card + social bar. self-start so this
            column keeps its own natural height instead of being
            stretched by the grid row (which would otherwise feed back
            into the ResizeObserver measurement below). */}
        <div ref={leftRef} className="flex flex-col gap-3.5 self-start">
          <div className={`flex flex-col gap-3.5 p-6 ${PANEL_GLASS}`}>
            <div className="flex items-center gap-5">
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
                  {t.hub.eyebrow}
                </span>
                <div className="mt-1">
                  <KineticName />
                  <div className="mt-3 font-mono text-[15px] text-dim">{t.hub.role}</div>
                  <div className="mt-1.5 font-mono text-[13px] text-muted">{t.hub.location}</div>
                </div>
              </div>
              <div className="hidden md:block">
                <QrCode />
              </div>
            </div>
            <div className="h-px" style={{ background: "var(--line-hot)", opacity: 0.7 }} />
            {t.hub.bio ? <p className="text-[13px] leading-relaxed text-dim">{t.hub.bio}</p> : null}
            <div className="mt-auto flex flex-wrap gap-2">
              {t.hub.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-line px-2.5 py-1.5 font-mono text-[11px] text-dim transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-wash"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <SocialBar />
          <div className="flex justify-center md:hidden">
            <QrCode />
          </div>
        </div>

        {/* Right — ask_marco.sh */}
        <div className="flex min-h-0 flex-col">
          <PinguChat height={chatHeight ?? undefined} />
        </div>
      </div>
    </ViewPane>
  );
}
