import type { Localized } from "@/lib/i18n/dictionaries";

export type ExperienceEntry = {
  period: Localized;
  role: Localized;
  company: string;
  detail?: Localized;
};

export const EXPERIENCE: ExperienceEntry[] = [
  {
    period: { en: "2026 — 2027", es: "2026 — 2027" },
    role: {
      en: "M.S. Computer Science, AI Specialization",
      es: "Maestría en Computación, especialización en IA",
    },
    company: "DigiPen Institute of Technology",
  },
  {
    period: { en: "Apr 2024 — May 2026", es: "abr 2024 — may 2026" },
    role: { en: "Back-End Developer", es: "Desarrollador Back-End" },
    company: "Capgemini",
    detail: {
      en: "Collaborated on a cross-functional team integrating Blue, BBVA's AI assistant, into the bank's large-scale production banking systems. Designed and shipped REST APIs and backend services connecting LLMs, frontend, and databases, ramping up independently on an unfamiliar, high-stakes codebase. Partnered with frontend, data, and ML engineers through code review and Agile ceremonies, and authored technical documentation that shortened ramp-up time for new teammates.",
      es: "Colaboré en un equipo multidisciplinario que integró Blue, el asistente de IA de BBVA, en los sistemas bancarios de producción a gran escala del banco. Diseñé y entregué APIs REST y servicios backend que conectan LLMs, frontend y bases de datos, adaptándome de forma independiente a un código base desconocido y de alto impacto. Colaboré con ingenieros de frontend, datos y ML mediante revisión de código y ceremonias Agile, y redacté documentación técnica que redujo el tiempo de incorporación de nuevos compañeros.",
    },
  },
  {
    period: { en: "2022 — 2024", es: "2022 — 2024" },
    role: { en: "Back-End Intern", es: "Becario Back-End" },
    company: "Scale AI",
    detail: {
      en: "Built TypeScript + Node.js services for large-scale web data collection and automation. Redesigned core workflows for scalability and reliability, cutting processing errors and turnaround time, and built a habit of collaborative code review.",
      es: "Construí servicios en TypeScript + Node.js para la recolección y automatización de datos web a gran escala. Rediseñé flujos de trabajo clave para mejorar escalabilidad y fiabilidad, reduciendo errores de procesamiento y tiempos de entrega, y desarrollé el hábito de la revisión de código colaborativa.",
    },
  },
  {
    period: { en: "Aug 2022", es: "ago 2022" },
    role: { en: "Full-Stack Intern, First Author", es: "Becario Full-Stack, Primer Autor" },
    company: "NDS Cognitive Labs",
    detail: {
      en: "Co-authored a journal publication about dynamic search for AI chatbot retraining. Built a ReactJS web app for dynamic document search, and integrated MongoDB and IBM Watson APIs to improve chatbot retraining and UX.",
      es: "Coautor de una publicación académica sobre búsqueda dinámica para el reentrenamiento de chatbots con IA. Desarrollé una aplicación web en ReactJS para búsqueda dinámica de documentos, e integré las APIs de MongoDB e IBM Watson para mejorar el reentrenamiento y la experiencia del chatbot.",
    },
  },
  {
    period: { en: "2018 — 2023", es: "2018 — 2023" },
    role: {
      en: "B.S. Computer Engineering",
      es: "Ing. en Sistemas Computacionales",
    },
    company: "Tecnológico de Monterrey, CCM",
  },
];
