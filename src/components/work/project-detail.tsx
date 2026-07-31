"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/locale-provider";
import { localize } from "@/lib/i18n/dictionaries";
import type { Project } from "@/lib/data/projects";

function KeyValueRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex gap-3.5 border-t border-border pt-3 font-mono text-[13px]">
      <span className="w-20 shrink-0 text-muted">{label}</span>
      <span className={accent ? "text-emerald" : undefined}>{value}</span>
    </div>
  );
}

// Right-hand detail panel for whichever project is selected. Tag names
// (Node.js, Go, ...) are proper nouns and stay the same in both
// languages — only the surrounding labels and prose are translated.
export function ProjectDetail({ project }: { project: Project }) {
  const { locale, t } = useLocale();

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
      <div className="font-mono text-xl font-bold md:text-[22px]">
        {localize(project.title, locale)}
      </div>
      <p className="text-sm leading-relaxed text-muted">{localize(project.desc, locale)}</p>
      <KeyValueRow label={t.work.categoryLabel} value={localize(project.category, locale)} />
      <KeyValueRow label={t.work.stackLabel} value={project.tags.join(", ")} />
      <KeyValueRow
        label={t.work.statusLabel}
        value={localize(project.status, locale)}
        accent
      />
    </div>
  );
}
