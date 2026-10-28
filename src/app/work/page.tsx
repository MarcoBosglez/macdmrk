import { PROJECTS } from "@/lib/data/projects";
import { WorkView } from "@/components/work/work-view";

export default function WorkPage() {
  return <WorkView projects={PROJECTS} />;
}
