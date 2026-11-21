"use client";

import Link from "next/link";
import { BotOff } from "lucide-react";
import { useSound } from "@/components/providers/sound-provider";
import { ViewPane } from "@/components/chrome/view-pane";
import { CoverPortrait } from "./CoverPortrait";
import { ReceiptExperience } from "@/components/experience/ReceiptExperience";

const CTA =
  "flex items-center justify-center rounded-[14px] border border-line bg-glass-soft px-4 py-2.5 font-mono text-[13px] text-ink transition-[transform,background,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-hot hover:bg-wash";

export function AboutContent({ coverPhotoReady }: { coverPhotoReady: boolean }) {
  const { playClick } = useSound();

  return (
    <ViewPane>
      <div className="flex w-full max-w-[1000px] flex-col gap-1.5">
        <div className="grid items-center gap-3.5 md:grid-cols-2">
          <CoverPortrait photoReady={coverPhotoReady} />
          <ReceiptExperience />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/contact" onClick={() => playClick("nav")} className={CTA}>
            get in touch →
          </Link>
          <Link href="/work" onClick={() => playClick("nav")} className={CTA}>
            check out my project work →
          </Link>
        </div>

        <div className="mt-10 flex items-start gap-2.5 rounded-[14px] border border-dashed border-line px-3 py-2.5">
          <BotOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <p className="font-mono text-[11px] leading-relaxed text-muted">
            AI usage only to assist to code generation.
          </p>
        </div>
      </div>
    </ViewPane>
  );
}
