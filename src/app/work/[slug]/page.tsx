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
      <div className="flex h-full flex-col md:flex-row">
        <ProjectList projects={PROJECTS} activeSlug={slug} />
        <ProjectDetail project={project} />
      </div>
    </AppWindow>
  );
}
