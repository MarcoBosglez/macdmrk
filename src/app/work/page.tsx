import { redirect } from "next/navigation";
import { PROJECTS } from "@/lib/data/projects";

// The work view always needs a project selected, so "/work" just
// redirects to the first one.
export default function WorkPage() {
  redirect(`/work/${PROJECTS[0].slug}`);
}
