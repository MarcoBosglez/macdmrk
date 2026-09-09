"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { ViewPane } from "@/components/chrome/view-pane";
import { KineticName } from "@/components/hub/kinetic-name";
import { IgIcon, InIcon, MailIcon, DocIcon } from "@/components/chrome/link-icons";
import { LINKS, LINK_VALUES } from "@/lib/data/links";

const PANEL_GLASS =
  "rounded-[22px] border border-line bg-glass [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]";

const TILE_VALUE_BASE: React.CSSProperties = {
  fontSize: "15px",
  color: "var(--ink)",
  lineHeight: 1.1,
  fontVariationSettings: "'wdth' 88, 'wght' 600",
  transition: "font-variation-settings .22s ease, letter-spacing .22s ease",
};

type TileProps = {
  href: string;
  external?: boolean;
  Icon: (p: { className?: string }) => React.ReactElement;
  label: string;
  value: string;
  hoverStyle: React.CSSProperties;
  hoverValueStyle: React.CSSProperties;
};

// Each hub link tile carries its own hover "personality" (the design's
// no-two-hovers-alike rule): lift, slide, glow-ring, tilt.
function LinkTile({ href, external, Icon, label, value, hoverStyle, hoverValueStyle }: TileProps) {
  const [on, setOn] = useState(false);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      className="flex min-w-0 flex-col gap-1 rounded-[14px] bg-glass-soft px-3.5 py-3"
      style={{
        border: `1px solid ${on ? "var(--line-hot)" : "var(--line)"}`,
        transition:
          "transform .2s cubic-bezier(.2,.8,.3,1), border-color .18s ease, background .18s ease, box-shadow .22s ease",
        ...(on ? hoverStyle : {}),
      }}
    >
      <span className="flex items-center gap-2 text-accent">
        <Icon className="h-[15px] w-[15px]" />
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase">{label}</span>
      </span>
      <span
        className="min-w-0 break-words"
        style={{ ...TILE_VALUE_BASE, ...(on ? hoverValueStyle : {}) }}
      >
        {value}
      </span>
    </a>
  );
}

// The today.log typewriter panel.
function TodayLog({ lines }: { lines: string[] }) {
  const full = lines.join("\n");
  const [typed, setTyped] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let i = 0;
    const step = () => {
      i++;
      setTyped(full.slice(0, i));
      if (i <= full.length) timer.current = setTimeout(step, 26);
    };
    step();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [full]);

  return (
    <div className="flex min-h-[140px] flex-1 flex-col gap-1.5 overflow-hidden rounded-[22px] border border-line bg-panel px-4 py-3.5 [backdrop-filter:blur(22px)] [box-shadow:var(--shadow)]">
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-line-hot" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="ml-1.5 font-mono text-[10px] text-muted">today.log</span>
      </div>
      <div className="font-mono text-[12px] leading-[1.75] whitespace-pre-wrap text-dim">
        {typed}
        <span className="animate-blink text-accent">▌</span>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useLocale();

  return (
    <ViewPane note={{ file: "start_here.txt", line: t.hub.note }}>
        <div className="grid w-full max-w-[1040px] items-stretch gap-3.5 md:grid-cols-2">
          {/* Left — presentation card */}
          <div className={`flex flex-col gap-3.5 p-6 ${PANEL_GLASS}`}>
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
              {t.hub.eyebrow}
            </span>
            <div>
              <KineticName />
              <div className="mt-3 font-mono text-[15px] text-dim">{t.hub.role}</div>
              <div className="mt-1.5 font-mono text-[13px] text-muted">{t.hub.location}</div>
            </div>
            <div className="h-px bg-line-soft" />
            {t.hub.bio ? (
              <p className="text-[13px] leading-relaxed text-dim">{t.hub.bio}</p>
            ) : null}
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

          {/* Right — link tiles + today.log */}
          <div className="flex min-w-0 flex-col gap-3.5">
            <div className={`grid grid-cols-2 gap-2 p-4 ${PANEL_GLASS}`}>
              <LinkTile
                href={LINKS.instagram}
                external
                Icon={IgIcon}
                label="instagram"
                value={LINK_VALUES.instagram}
                hoverStyle={{
                  transform: "translateY(-6px) scale(1.02)",
                  boxShadow: "0 14px 30px rgba(0,0,0,.28)",
                }}
                hoverValueStyle={{ fontVariationSettings: "'wdth' 116, 'wght' 800" }}
              />
              <LinkTile
                href={LINKS.linkedin}
                external
                Icon={InIcon}
                label="linkedin"
                value={LINK_VALUES.linkedin}
                hoverStyle={{ transform: "translateX(7px)", background: "var(--wash)" }}
                hoverValueStyle={{ letterSpacing: "0.05em" }}
              />
              <LinkTile
                href={`mailto:${LINKS.email}`}
                Icon={MailIcon}
                label="email"
                value="get in touch"
                hoverStyle={{ boxShadow: "0 0 0 3px var(--wash)", transform: "scale(1.015)" }}
                hoverValueStyle={{ fontVariationSettings: "'wdth' 62, 'wght' 860" }}
              />
              <LinkTile
                href={LINKS.resume}
                external
                Icon={DocIcon}
                label="résumé"
                value="download pdf"
                hoverStyle={{ transform: "rotate(-2.2deg)" }}
                hoverValueStyle={{
                  letterSpacing: "-0.02em",
                  fontVariationSettings: "'wdth' 120, 'wght' 500",
                }}
              />
            </div>
            <TodayLog lines={t.hub.log} />
          </div>
        </div>
    </ViewPane>
  );
}
