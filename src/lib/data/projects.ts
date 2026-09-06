import type { Localized } from "@/lib/i18n/dictionaries";

export type Project = {
  slug: string;
  num: string;
  tags: string[];
  title: Localized;
  category: Localized;
  desc: Localized;
  status: Localized;
  statusTone?: "green" | "blue" | "red";
  image?: string;
  focus?: string;
  url?: string;

  // ── Fields the "glass kinetic" work view needs ────────────────────
  // years is a bare range string ("2024 — now"), identical in both
  // languages. Everything else is prose, so it's Localized.
  years: string;
  role: Localized;
  team: Localized;
  // One-line statement of the problem the project set out to solve.
  problem: Localized;
  // Exactly three "→" bullets — keep that shape.
  did: { en: string[]; es: string[] };
  // Short result line, shown in accent mono.
  outcome: Localized;
};

// NOTE: role / team / problem / did / outcome below are DRAFTS derived
// from each project's existing description — Marco should refine them.
export const PROJECTS: Project[] = [
  {
    slug: "web-portfolio",
    num: "01",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
    title: { en: "Web Portfolio", es: "Portafolio Web" },
    category: { en: "Web Portfolio", es: "Portafolio Web" },
    desc: {
      en: "An interactive personal platform built to show both my Computer Science background and my digital art in one place.",
      es: "Una plataforma personal interactiva, hecha para mostrar mi carrera de Ciencias de la Computación y mi arte digital en un mismo lugar.",
    },
    status: { en: "active development", es: "desarrollo activo" },
    statusTone: "blue",
    focus: "top",
    url: "https://github.com/MarcoBosglez/macdmrk",
    years: "2024 — now",
    role: { en: "designer + developer", es: "diseñador + desarrollador" },
    team: { en: "solo", es: "en solitario" },
    problem: {
      en: "A résumé says I write software; it can't show that I also draw. I needed one place that carries both without picking a side.",
      es: "Un CV dice que escribo software; no puede mostrar que también dibujo. Necesitaba un lugar que cargue ambas cosas sin elegir un lado.",
    },
    did: {
      en: [
        "Designed the whole visual language and drew every illustration",
        "Built the site on Next.js with bilingual copy and a theme switch",
        "Wrote the draggable gallery windows and synthesized UI sounds",
      ],
      es: [
        "Diseñé todo el lenguaje visual y dibujé cada ilustración",
        "Construí el sitio en Next.js con copy bilingüe y cambio de tema",
        "Programé las ventanas arrastrables de la galería y los sonidos de UI",
      ],
    },
    outcome: {
      en: "one link for the engineering and the art",
      es: "un solo enlace para la ingeniería y el arte",
    },
  },
  {
    slug: "spotify-banner",
    num: "02",
    tags: ["HTML", "CSS", "JavaScript", "GitHub"],
    title: {
      en: "Spotify Banner for ONErpm",
      es: "Spotify Banner para ONErpm",
    },
    category: { en: "Banner Design", es: "Diseño de Banners" },
    desc: {
      en: "High-visibility Spotify promotional banners for music distribution campaigns, with custom scripts and HTML/CSS layouts for the release assets.",
      es: "Banners promocionales de Spotify de alta visibilidad para campañas de distribución musical, con scripts a medida y maquetación HTML/CSS para los assets de lanzamiento.",
    },
    status: { en: "shipped", es: "publicado" },
    url: "https://github.com/MarcoBosglez/banner-interactivo",
    years: "2021",
    role: { en: "design + front-end", es: "diseño + front-end" },
    team: { en: "with the ONErpm team", es: "con el equipo de ONErpm" },
    problem: {
      en: "Release campaigns needed promo banners that looked sharp and could be re-skinned fast for each new artist.",
      es: "Las campañas de lanzamiento necesitaban banners promocionales que se vieran bien y se pudieran re-adaptar rápido para cada artista.",
    },
    did: {
      en: [
        "Designed the banner layouts to campaign spec",
        "Built them in hand-written HTML/CSS for pixel control",
        "Wrote helper scripts so assets could be regenerated per release",
      ],
      es: [
        "Diseñé la maquetación de los banners según el brief de campaña",
        "Los construí en HTML/CSS a mano para control al pixel",
        "Escribí scripts de apoyo para regenerar los assets por lanzamiento",
      ],
    },
    outcome: {
      en: "reusable promo assets for the label",
      es: "assets promocionales reutilizables para el sello",
    },
  },
  {
    slug: "aws-rsh",
    num: "03",
    tags: ["Java", "Spring", "Docker", "React"],
    title: {
      en: "Amazon Recorder System Helper",
      es: "Amazon Recorder System Helper",
    },
    category: { en: "AWS Tooling", es: "Herramientas AWS" },
    desc: {
      en: "A full-stack extension for Amazon Connect that recorded call-center interactions between agents and customers, for audit, training and performance metrics.",
      es: "Una extensión full-stack para Amazon Connect que grababa las interacciones de un call center entre agentes y clientes, para auditoría, capacitación y métricas de desempeño.",
    },
    status: { en: "shipped", es: "publicado" },
    focus: "top",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:6943381454940753920/",
    years: "2022",
    role: { en: "full-stack developer", es: "desarrollador full-stack" },
    team: { en: "team of 4", es: "equipo de 4" },
    problem: {
      en: "The call center had no reliable way to capture and review agent–customer calls for audits and training.",
      es: "El call center no tenía forma confiable de capturar y revisar las llamadas agente–cliente para auditorías y capacitación.",
    },
    did: {
      en: [
        "Built the recording service around Amazon Connect on Spring",
        "Containerized it with Docker for deployment",
        "Wrote the React console for searching and reviewing calls",
      ],
      es: [
        "Construí el servicio de grabación sobre Amazon Connect con Spring",
        "Lo contenericé con Docker para el despliegue",
        "Programé la consola en React para buscar y revisar llamadas",
      ],
    },
    outcome: {
      en: "auditable call history for the business",
      es: "historial de llamadas auditable para el negocio",
    },
  },
  {
    slug: "sentiment-analysis",
    num: "04",
    tags: ["Machine Learning", "Python", "NLTK", "NLP"],
    title: {
      en: "ML Sentiment Analysis",
      es: "Análisis de Sentimiento con ML",
    },
    category: { en: "ML Paper", es: "Artículo de ML" },
    desc: {
      en: "An NLP study on mental-health tweets: multiclass and multi-label classification of 625 hand-labeled tweets to measure the accuracy of a negative-sentiment model.",
      es: "Un estudio de PLN sobre tuits de salud mental: clasificación multiclase y multietiqueta de 625 tuits etiquetados a mano para medir la precisión de un modelo de sentimiento negativo.",
    },
    status: { en: "published", es: "publicado" },
    focus: "top",
    url: "https://rcs.cic.ipn.mx/2023_152_12/Development%20of%20a%20Front-End%20with%20Dynamic%20Searches%20for%20Chatbot%20Retraining%20Using%20ReactJS.pdf",
    years: "2023",
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    team: { en: "university team", es: "equipo universitario" },
    problem: {
      en: "We wanted to know how well a model could pick out negative sentiment in short, messy mental-health tweets.",
      es: "Queríamos saber qué tan bien un modelo podía detectar sentimiento negativo en tuits cortos y desordenados sobre salud mental.",
    },
    did: {
      en: [
        "Hand-labeled 625 tweets for multiclass and multi-label training",
        "Built the classification pipeline in Python with NLTK",
        "Measured accuracy and wrote up the results for publication",
      ],
      es: [
        "Etiqueté a mano 625 tuits para entrenamiento multiclase y multietiqueta",
        "Construí el pipeline de clasificación en Python con NLTK",
        "Medí la precisión y redacté los resultados para publicación",
      ],
    },
    outcome: {
      en: "published NLP accuracy study",
      es: "estudio de precisión de PLN publicado",
    },
  },
];
