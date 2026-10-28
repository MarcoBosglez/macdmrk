// Content for the homepage "Featured" card. Edit freely.
// Order = display order (01, 02, 03). Mirrors the same 3 projects
// marked `featured: true` in src/lib/data/projects.ts, so the two
// "featured" picks stay in sync — update both if you change one.

export type FeaturedCategory = "personal" | "academic" | "professional";

export interface FeaturedProject {
  slug: string;
  name: string;
  category: FeaturedCategory;
  year: string;
  /** One or two sentences — shown in full, no line clamp. */
  description: string;
  /** Where "learn more" goes */
  href: string;
  /** GitHub link. Omit to hide the code button. */
  repoUrl?: string;
  /** Path under /public. Omit to show a placeholder box. */
  image?: { src: string; alt: string };
  /** Shown as a joined "a · b · c" line. Omit to hide it. */
  stack?: string[];
}

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "web-portfolio",
    name: "Web Portfolio",
    category: "personal",
    year: "2024 — now",
    description:
      "An interactive personal platform built to show both my Computer Science background and my digital art in one place.",
    href: "/work/web-portfolio",
    repoUrl: "https://github.com/MarcoBosglez/macdmrk",
    image: { src: "/work/portfolio.PNG", alt: "Web Portfolio" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "aws-rsh",
    name: "Amazon Recorder System Helper",
    category: "academic",
    year: "2022",
    description:
      "A full-stack extension for Amazon Connect that recorded call-center interactions between agents and customers, for audit, training and performance metrics.",
    href: "/work/aws-rsh",
    // Not a public repo — omitted on purpose (the LinkedIn post isn't source code).
    image: { src: "/work/rsh.PNG", alt: "Amazon Recorder System Helper" },
    stack: ["Java", "Spring", "Docker", "React"],
  },
  {
    slug: "sentiment-analysis",
    name: "ML Sentiment Analysis",
    category: "academic",
    year: "2023",
    description:
      "An NLP study on mental-health tweets: multiclass and multi-label classification of 625 hand-labeled tweets to measure the accuracy of a negative-sentiment model.",
    href: "/work/sentiment-analysis",
    // Published paper, not a repo — omitted on purpose.
    image: { src: "/work/ml_article.PNG", alt: "ML Sentiment Analysis" },
    stack: ["Python", "NLTK"],
  },
];
