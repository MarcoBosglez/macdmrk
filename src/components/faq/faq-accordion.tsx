"use client";

import { useState } from "react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { localize } from "@/lib/i18n/dictionaries";
import { FAQS } from "@/lib/data/faqs";

export function FaqAccordion() {
  const { playClick } = useSound();
  const { locale, t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10">
      <div className="mb-4.5 max-w-[720px] font-mono text-[13px] text-mint">~/ cat faq.txt</div>
      <div className="max-w-[720px]">
        {FAQS.map((faq, i) => {
          const open = openIndex === i;
          return (
            // faq.q.en is used as the key (rather than the whole
            // object) since it's stable across renders and unique
            // within this list.
            <div key={faq.q.en} className="border-b border-border py-4">
              <button
                onClick={() => {
                  playClick();
                  setOpenIndex(open ? null : i);
                }}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-mono text-sm font-bold text-emerald">
                  {t.faq.questionPrefix} {localize(faq.q, locale)}
                </span>
                <span
                  className={`inline-block shrink-0 text-muted transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {open && (
                <div className="mt-2.5 text-sm leading-relaxed text-muted">
                  {t.faq.answerPrefix} {localize(faq.a, locale)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
