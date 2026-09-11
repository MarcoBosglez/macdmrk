import type { Localized } from "@/lib/i18n/dictionaries";

export type Project = {
  slug: string;
  tags: string[];
  title: Localized;
  category: Localized;
  years: string;
  role: Localized;
  problem: Localized;
  did: { en: string[]; es: string[] };
  outcome: Localized;
  url?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "web-portfolio",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
    title: { en: "Web Portfolio", es: "Portafolio Web" },
    category: { en: "Web Portfolio", es: "Portafolio Web" },
    url: "https://github.com/MarcoBosglez/macdmrk",
    years: "2024 — now",
    role: { en: "designer + developer", es: "diseñador + desarrollador" },
    problem: {
       en: "An interactive personal platform built to show both my Computer Science background and my digital art in one place.",
      es: "Una plataforma personal interactiva, hecha para mostrar mi carrera de Ciencias de la Computación y mi arte digital en un mismo lugar.",
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
    tags: ["HTML", "CSS", "JavaScript", "GitHub"],
    title: {
      en: "Spotify Banner for ONErpm",
      es: "Spotify Banner para ONErpm",
    },
    category: { en: "Banner Design", es: "Diseño de Banners" },
    url: "https://github.com/MarcoBosglez/banner-interactivo",
    years: "2021",
    role: { en: "design + front-end", es: "diseño + front-end" },
    problem: {
      en: "High-visibility Spotify promotional banners for music distribution campaigns, with custom scripts and HTML/CSS layouts for the release assets.",
      es: "Banners promocionales de Spotify de alta visibilidad para campañas de distribución musical, con scripts a medida y maquetación HTML/CSS para los assets de lanzamiento.",
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
    tags: ["Java", "Spring", "Docker", "React"],
    title: {
      en: "Amazon Recorder System Helper",
      es: "Amazon Recorder System Helper",
    },
    category: { en: "AWS Tooling", es: "Herramientas AWS" },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:6943381454940753920/",
    years: "2022",
    role: { en: "full-stack developer", es: "desarrollador full-stack" },
    problem: {
      en: "A full-stack extension for Amazon Connect that recorded call-center interactions between agents and customers, for audit, training and performance metrics.",
      es: "Una extensión full-stack para Amazon Connect que grababa las interacciones de un call center entre agentes y clientes, para auditoría, capacitación y métricas de desempeño.",
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
    tags: ["Machine Learning", "Python", "NLTK", "NLP"],
    title: {
      en: "ML Sentiment Analysis",
      es: "Análisis de Sentimiento con ML",
    },
    category: { en: "ML Paper", es: "Artículo de ML" },
    url: "https://rcs.cic.ipn.mx/2023_152_12/Development%20of%20a%20Front-End%20with%20Dynamic%20Searches%20for%20Chatbot%20Retraining%20Using%20ReactJS.pdf",
    years: "2023",
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    problem: {
      en: "An NLP study on mental-health tweets: multiclass and multi-label classification of 625 hand-labeled tweets to measure the accuracy of a negative-sentiment model.",
      es: "Un estudio de PLN sobre tuits de salud mental: clasificación multiclase y multietiqueta de 625 tuits etiquetados a mano para medir la precisión de un modelo de sentimiento negativo.",
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
