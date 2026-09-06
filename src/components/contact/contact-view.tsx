"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { ViewPane } from "@/components/chrome/view-pane";
import { ContactForm } from "@/components/contact/contact-form";
import { IgIcon, InIcon, DocIcon } from "@/components/chrome/link-icons";
import { LINKS } from "@/lib/data/links";

function useClock() {
  const [clock, setClock] = useState("--:--");
  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

function Meta({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted">{label}</span>
      <span className={`font-mono text-[11px] ${accent ? "text-accent" : "text-ink"}`}>{value}</span>
    </div>
  );
}

function ElsewhereRow({
  href,
  Icon,
  name,
  descriptor,
  hover,
}: {
  href: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  name: string;
  descriptor: string;
  hover: string;
}) {
  const [on, setOn] = useState(false);
  const { playClick } = useSound();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => playClick("nav")}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      className="flex items-center gap-3 rounded-[14px] border border-line bg-glass-soft px-3.5 py-3"
      style={{
        background: on ? "var(--wash)" : undefined,
        transform: on ? hover : "none",
        transition: "background .18s ease, transform .2s cubic-bezier(.2,.8,.3,1)",
      }}
    >
      <Icon className="h-5 w-5 shrink-0 text-accent" />
      <span className="flex flex-col gap-0.5">
        <span className="text-[14px] text-ink" style={{ fontVariationSettings: "'wght' 700" }}>
          {name}
        </span>
        <span className="font-mono text-[10px] text-muted">{descriptor}</span>
      </span>
    </a>
  );
}

export function ContactView() {
  const { t } = useLocale();
  const clock = useClock();

  return (
    <ViewPane note={{ file: "briefs.txt", line: t.contact.note }}>
      <div className="grid w-full max-w-[1000px] items-stretch gap-3.5 md:grid-cols-2">
        {/* Left — intro + working form + meta row */}
        <div className="flex flex-col gap-4 rounded-[22px] border border-line bg-glass p-6 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]">
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent">
            {t.contact.eyebrow}
          </span>
          <p
            className="text-ink"
            style={{
              fontSize: "clamp(20px, 2.6vw, 32px)",
              fontVariationSettings: "'wght' 600",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {t.contact.lead}
          </p>
          <p className="text-[13px] leading-relaxed text-dim">{t.contact.blurb}</p>

          <ContactForm />

          <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 border-t border-line-soft pt-4">
            <Meta label={t.contact.statusLabel} value={t.contact.statusValue} accent />
            <Meta label={t.contact.localTimeLabel} value={clock} />
            <Meta label={t.contact.replyTimeLabel} value={t.contact.replyTimeValue} />
          </div>
        </div>

        {/* Right — elsewhere rows + good_briefs.txt */}
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-2 rounded-[22px] border border-line bg-glass p-4 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]">
            <span className="px-0.5 font-mono text-[9px] tracking-[0.14em] uppercase text-muted">
              {t.contact.elsewhereLabel}
            </span>
            <ElsewhereRow
              href={LINKS.instagram}
              Icon={IgIcon}
              name="Instagram"
              descriptor={t.contact.elsewhere.instagram}
              hover="translateX(6px)"
            />
            <ElsewhereRow
              href={LINKS.linkedin}
              Icon={InIcon}
              name="LinkedIn"
              descriptor={t.contact.elsewhere.linkedin}
              hover="scale(1.02)"
            />
            <ElsewhereRow
              href={LINKS.resume}
              Icon={DocIcon}
              name="Résumé"
              descriptor={t.contact.elsewhere.resume}
              hover="rotate(-1.4deg)"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-[22px] border border-line bg-panel px-4 py-3.5 [backdrop-filter:blur(22px)] [box-shadow:var(--shadow)]">
            <span className="font-mono text-[9px] text-muted">good_briefs.txt</span>
            <div className="font-mono text-[11px] leading-[1.8] text-dim">
              {t.contact.briefs.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ViewPane>
  );
}
