"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { localize } from "@/lib/i18n/dictionaries";
import type { Project } from "@/lib/data/projects";

// Left-hand "file listing" column. project.slug is shown literally
// (it's meant to look like a real directory name) but the category
// tag is translated, since that's genuine descriptive text.
export function ProjectList({
  projects,
  activeSlug,
}: {
  projects: Project[];
  activeSlug: string;
}) {
  const { playClick } = useSound();
  const { locale } = useLocale();

  return (
    <div className="shrink-0 border-b border-border p-5 md:w-[340px] md:overflow-y-auto md:border-r md:border-b-0 md:p-8">
      <div className="mb-3 font-mono text-[13px] text-mint md:mb-4.5">~/work/ ls -la</div>
      <div className="flex flex-col gap-1">
        {projects.map((project) => {
          const active = project.slug === activeSlug;
          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              onClick={() => playClick("pageOpen")}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2.5 transition-colors md:gap-3.5 md:px-3.5 md:py-3",
                active ? "bg-emerald text-bg" : "hover:bg-panel"
              )}
            >
              <span className="font-mono text-[13px] opacity-70">{project.num}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-sm">{project.slug}/</span>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px]",
                  active ? "border-bg text-bg" : "border-emerald text-emerald"
                )}
              >
                {localize(project.category, locale)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
