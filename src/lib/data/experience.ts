import type { Localized } from "@/lib/i18n/dictionaries";

export type ExperienceEntry = {
  period: Localized;
  role: Localized;
  company: string; // proper noun — identical in every language
};

export const EXPERIENCE: ExperienceEntry[] = [
  {
    period: { en: "2024 — 2026", es: "2024 — 2026" },
    role: { en: "Backend Developer", es: "Desarrollador Backend" },
    company: "BBVA & Capgemini",
  },
  {
    period: { en: "2022 — 2024", es: "2022 — 2024" },
    role: { en: "Parse Engineer", es: "Ingeniero Parse" },
    company: "Scale AI",
  },
  {
    period: { en: "2022 - 2022", es: "2022 - 2022" },
    role: { en: "Intern", es: "Becario" },
    company: "NDS Cognitive Labs",
  },
];
