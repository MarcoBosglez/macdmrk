import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/data/projects";
import { AppWindow } from "@/components/chrome/app-window";
import { ProjectList } from "@/components/work/project-list";
import { ProjectDetail } from "@/components/work/project-detail";

// Tells Next.js every possible /work/<slug> URL up front, so each
// project page is pre-built as static HTML at build time instead of
// being rendered on-demand per visit.
export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

// Any slug not listed above is a hard 404 (renders app/not-found.tsx)
// rather than being rendered on demand — the project list is fixed, so
// there's no such thing as a valid unknown project URL.
export const dynamicParams = false;

export default async function WorkProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <AppWindow title="work.exe">
      <div className="flex flex-col md:h-full md:flex-row">
        <ProjectList projects={PROJECTS} activeSlug={slug} />
        <ProjectDetail project={project} />
      </div>
    </AppWindow>
  );
}
