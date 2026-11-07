// Content for the About page's receipt-styled experience section.
// Newest first — edit freely.

export type Role = {
  id: string;
  type: "work" | "edu";
  role: string;
  org: string;
  dates: string;
  notes: string[];
};

export const EXPERIENCE: Role[] = [
  {
    id: "digipen",
    type: "edu",
    role: "M.S. Computer Science, AI",
    org: "DigiPen Institute of Technology",
    dates: "2026–2027",
    notes: ["AI specialization", "[focus / key courses]"],
  },
  {
    id: "capgemini",
    type: "work",
    role: "Back-End Developer",
    org: "Capgemini",
    dates: "Apr 2024–May 2026",
    notes: [
      "Built backend services connecting Blue (BBVA's AI assistant) to prod",
      "Partnered cross-functionally via code review + Agile ceremonies",
    ],
  },
  {
    id: "scale-ai",
    type: "work",
    role: "Back-End Intern",
    org: "Scale AI",
    dates: "2022–2024",
    notes: [
      "Built TS + Node.js services for large-scale web data collection",
      "Redesigned workflows, cutting processing errors + turnaround time",
    ],
  },
  {
    id: "nds-cognitive-labs",
    type: "work",
    role: "Full-Stack Intern, First Author",
    org: "NDS Cognitive Labs",
    dates: "Aug 2022",
    notes: [
      "First author on a journal paper",
      "Built a ReactJS app integrating MongoDB + IBM Watson APIs",
    ],
  },
  {
    id: "tec-de-monterrey",
    type: "edu",
    role: "B.S. Computer Engineering",
    org: "Tecnológico de Monterrey, CCM",
    dates: "2018–2023",
    notes: ["[project, award or focus area]"],
  },
];
