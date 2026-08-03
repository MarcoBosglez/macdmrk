"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { localize } from "@/lib/i18n/dictionaries";
import type { Project } from "@/lib/data/projects";

const TONE_CLASSES = {
  green: "text-emerald",
  blue: "text-blue-500 dark:text-blue-400",
  red: "text-destructive",
} as const;

function KeyValueRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: keyof typeof TONE_CLASSES;
}) {
  return (
    <div className="flex gap-3.5 border-t border-border pt-3 font-mono text-[13px]">
      <span className="w-20 shrink-0 text-muted">{label}</span>
      <span className={tone ? TONE_CLASSES[tone] : undefined}>{value}</span>
    </div>
  );
}

// Right-hand detail panel for whichever project is selected. Tag names
// (Node.js, Go, ...) are proper nouns and stay the same in both
// languages — only the surrounding labels and prose are translated.
export function ProjectDetail({ project }: { project: Project }) {
  const { locale, t } = useLocale();
  const { playClick } = useSound();

  return (
    <div className="flex max-w-[640px] flex-col gap-3 overflow-y-auto p-6 md:p-10">
      <div className="relative flex h-[110px] items-center justify-center overflow-hidden rounded border border-dashed border-border font-mono text-xs text-muted">
        {project.image ? (
          <Image
            src={project.image}
            alt={localize(project.title, locale)}
            fill
            sizes="640px"
            className="object-cover"
          />
        ) : (
          t.work.previewPlaceholder
        )}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="font-mono text-xl font-bold md:text-[22px]">
          {localize(project.title, locale)}
        </div>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick("nav")}
            aria-label="Open project in a new tab"
            className="shrink-0 rounded-full border border-border p-1.5 text-muted transition-colors hover:border-emerald hover:text-emerald"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
      {project.url ? (
        <div className="-mt-2 font-mono text-[11px] text-muted">{t.work.linkHint}</div>
      ) : null}
      <p className="text-sm leading-relaxed text-muted">{localize(project.desc, locale)}</p>
      <KeyValueRow label={t.work.categoryLabel} value={localize(project.category, locale)} />
      <KeyValueRow label={t.work.stackLabel} value={project.tags.join(", ")} />
      <KeyValueRow
        label={t.work.statusLabel}
        value={localize(project.status, locale)}
        tone={project.statusTone ?? "green"}
      />
    </div>
  );
}
