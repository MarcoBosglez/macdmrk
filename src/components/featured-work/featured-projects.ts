// Content for the homepage "Featured" card — derived from PROJECTS in
// src/lib/data/projects.ts, not edited by hand. To change what shows
// up here, mark a project `featured: true` (or unmark one) there; the
// first 3 featured projects (in PROJECTS order) show up here
// automatically, in sync with the ★ Featured row on /work.

import { PROJECTS } from "@/lib/data/projects";

export type FeaturedCategory = "personal" | "academic" | "professional";

export interface FeaturedProject {
  slug: string;
  name: string;
  category: FeaturedCategory;
  year: string;
  /** One or two sentences — shown in full, no line clamp. */
  description: string;
  /** Where the (fully clickable) card links to. */
  href: string;
  /** Path under /public. Omit to show a placeholder box. */
  image?: { src: string; alt: string };
}

export const featuredProjects: FeaturedProject[] = PROJECTS.filter((p) => p.featured)
  .slice(0, 3)
  .map((p) => ({
    slug: p.slug,
    name: p.title.en,
    category: p.category,
    year: p.years,
    description: p.pitch?.en ?? "",
    href: `/work/${p.slug}`,
    image: p.heroImage ? { src: p.heroImage, alt: p.title.en } : undefined,
  }));
