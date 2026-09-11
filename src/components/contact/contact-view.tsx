"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { ViewPane } from "@/components/chrome/view-pane";
import { IgIcon, InIcon, DocIcon, MailIcon, GhIcon, PhoneIcon } from "@/components/chrome/link-icons";
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

function Meta({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">{label}</span>
      <span className={`font-mono text-[12px] ${accent ? "text-accent" : "text-ink"}`}>{value}</span>
      {sub ? <span className="font-mono text-[10px] text-muted">{sub}</span> : null}
    </div>
  );
}

// One shared hover for every "elsewhere" row — lift + border-hot + wash.
function ElsewhereRow({
  href,
  Icon,
  name,
  descriptor,
}: {
  href: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  name: string;
  descriptor: string;
}) {
  const [on, setOn] = useState(false);
  const { playClick } = useSound();
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => playClick("nav")}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      className="flex items-center gap-3 rounded-[14px] border border-line bg-glass-soft px-3.5 py-3"
      style={{
        background: on ? "var(--wash)" : undefined,
        borderColor: on ? "var(--line-hot)" : "var(--line)",
        transform: on ? "translateY(-3px)" : undefined,
        transition: "background .18s ease, border-color .18s ease, transform .2s cubic-bezier(.2,.8,.3,1)",
      }}
    >
      <Icon className="h-5 w-5 shrink-0 text-accent" />
      <span className="flex flex-col gap-0.5">
        <span className="text-[14px] text-ink" style={{ fontVariationSettings: "'wght' 700" }}>
          {name}
        </span>
        <span className="font-mono text-[11px] text-muted">{descriptor}</span>
      </span>
    </a>
  );
}

export function ContactView() {
  const { t } = useLocale();
  const { playClick } = useSound();
  const clock = useClock();

  return (
    <ViewPane note={{ file: "contact.txt", line: t.contact.note }}>
      <div className="grid w-full max-w-[1000px] items-stretch gap-3.5 md:grid-cols-2">
        {/* Left — intro + mailto button + meta row */}
        <div className="flex flex-col gap-4 rounded-[22px] border border-line bg-glass p-6 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
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

          <a
            href={`mailto:${LINKS.email}`}
            onClick={() => playClick("open")}
            style={{ background: "var(--accent)", color: "var(--bg)" }}
            className="inline-flex items-center gap-2.5 self-start rounded-[14px] px-4 py-2.5 text-[14px] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:[box-shadow:0_12px_26px_rgba(0,0,0,.3)]"
          >
            <MailIcon className="h-4 w-4 shrink-0" />
            <span style={{ fontVariationSettings: "'wght' 700" }}>{LINKS.email}</span>
          </a>

          <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 border-t border-line-soft pt-4">
            <Meta label={t.contact.statusLabel} value={t.contact.statusValue} accent />
            <Meta label={t.contact.localTimeLabel} value={clock} />
            <Meta label={t.contact.replyTimeLabel} value={t.contact.replyTimeValue} />
            <Meta
              label={t.contact.basedInLabel}
              value={t.contact.basedInValue}
              sub={t.contact.basedInSub}
            />
          </div>
        </div>

        {/* Right — elsewhere: every other way to reach him */}
        <div className="flex flex-col gap-2 rounded-[22px] border border-line bg-glass p-4 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]">
          <span className="px-0.5 font-mono text-[10px] tracking-[0.14em] uppercase text-muted">
            {t.contact.elsewhereLabel}
          </span>
          <ElsewhereRow
            href={LINKS.linkedin}
            Icon={InIcon}
            name="LinkedIn"
            descriptor={t.contact.elsewhere.linkedin}
          />
          <ElsewhereRow
            href={LINKS.github}
            Icon={GhIcon}
            name="GitHub"
            descriptor={t.contact.elsewhere.github}
          />
          <ElsewhereRow
            href={LINKS.instagram}
            Icon={IgIcon}
            name="Instagram"
            descriptor={t.contact.elsewhere.instagram}
          />
          <ElsewhereRow
            href={`mailto:${LINKS.altEmail}`}
            Icon={MailIcon}
            name="Alternate email"
            descriptor={t.contact.elsewhere.altEmail}
          />
          <ElsewhereRow
            href={`tel:${LINKS.phone}`}
            Icon={PhoneIcon}
            name="Phone"
            descriptor={t.contact.elsewhere.phone}
          />
          <ElsewhereRow
            href={LINKS.resume}
            Icon={DocIcon}
            name="Résumé"
            descriptor={t.contact.elsewhere.resume}
          />
        </div>
      </div>
    </ViewPane>
  );
}
