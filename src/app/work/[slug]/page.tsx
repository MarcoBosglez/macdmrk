import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/data/projects";
import { ProjectPage } from "@/components/work/project-page";

// Every /work/<slug> is pre-built as static HTML at build time — each
// project's own dedicated page, not the work browser (that's /work).
export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

// Any slug not listed above is a hard 404 — the project list is fixed.
export const dynamicParams = false;

export default async function WorkProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return <ProjectPage project={project} projects={PROJECTS} />;
}
