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
      en: "M.S. Computer Science",
      es: "Maestría en Computación",
    },
    company: "DigiPen Institute of Technology",
  },
  {
    period: { en: "2024 — 2026", es: "2024 — 2026" },
    role: { en: "Backend Developer", es: "Desarrollador Backend" },
    company: "BBVA México · Capgemini",
    detail: {
      en: "Backend developer on the cross-functional team that integrated Blue, BBVA's AI assistant, into the bank's large-scale systems — building and maintaining the APIs and services connecting the LLMs, frontend, and databases. Staffed on-site with BBVA México through Capgemini.",
      es: "Desarrollador backend en el equipo multidisciplinario que integró Blue, el asistente de IA de BBVA, en los sistemas a gran escala del banco — construyendo y manteniendo las APIs y servicios que conectan los LLMs, el frontend y las bases de datos. Asignado en sitio con BBVA México a través de Capgemini.",
    },
  },
  {
    period: { en: "2022 — 2024", es: "2022 — 2024" },
    role: { en: "Parse Engineer", es: "Ingeniero Parse" },
    company: "Scale AI",
    detail: {
      en: "Built web-scraping systems that pulled product data from e-commerce sites to train machine-learning models — robust Node.js, Puppeteer and TypeScript scripts and automated workflows for reliable extraction across websites, APIs, and other online sources.",
      es: "Construí sistemas de web scraping que extraían datos de productos de sitios de e-commerce para entrenar modelos de machine learning — scripts y flujos automatizados en Node.js, Puppeteer y TypeScript para una extracción confiable desde sitios web, APIs y otros repositorios en línea.",
    },
  },
  {
    period: { en: "2022", es: "2022" },
    role: { en: "Intern", es: "Becario" },
    company: "NDS Cognitive Labs",
    detail: {
      en: "Built a ReactJS web app for dynamic document search, and worked with the front-end team on the \"Virtual Assistant Management Platform\" — a tool for re-training chatbots.",
      es: "Desarrollé una aplicación web en ReactJS para búsqueda dinámica de documentos, y colaboré con el equipo de front-end en la \"Plataforma de Gestión de Asistentes Virtuales\", una herramienta para reentrenar chatbots.",
    },
  },
  {
    period: { en: "2018 — 2022", es: "2018 — 2022" },
    role: {
      en: "B.S. Computer Science",
      es: "Ing. en Sistemas Computacionales",
    },
    company: "Tecnológico de Monterrey, CCM",
  },
];
