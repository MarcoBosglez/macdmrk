import { redirect } from "next/navigation";
import { PROJECTS } from "@/lib/data/projects";

// "/work" on its own doesn't have anything to show — the actual page
// (work/[slug]/page.tsx) needs a specific project selected. Rather
// than duplicate that UI here, just bounce to the first project so
// "/work" always lands somewhere real.
export default function WorkPage() {
  redirect(`/work/${PROJECTS[0].slug}`);
}
