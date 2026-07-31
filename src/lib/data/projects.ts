import type { Localized } from "@/lib/i18n/dictionaries";

export type Project = {
  slug: string;
  num: string;
  tags: string[];
  title: Localized;
  category: Localized;
  desc: Localized;
  status: Localized;
  // Path under /public, e.g. "/projects/web-portfolio.png". Omit to
  // fall back to the "// preview.png" placeholder.
  image?: string;
  // CSS object-position for that image, e.g. "top" or "center 20%".
  // The preview box is short and wide, so a plain center crop often
  // cuts off the part of a tall screenshot that actually matters —
  // this lets each project pick what stays in frame. Defaults to "center".
  focus?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "web-portfolio",
    num: "01",
    tags: ["NextJS", "TSX", "Tailwind CSS"],
    title: { en: "Web Portfolio", es: "Portfolio Web" },
    category: { en: "Web Design / Digital Hub", es: "Desarrollo Web / Hub Digital" },
    desc: {
      en: "Developing an interactive personal platform designed to showcase both my Computer Science background and Digital Art",
      es: "Desarrollando plataforma interactiva, diseñada para mostrar mi carrera de Ciencias de Computación y Arte Digital.",
    },
    status: { en: "active development", es: "desarrollo activo" },
    image: "/work/portfolio.PNG",
    focus: "top",
  },
  {
    slug: "spotify-banner",
    num: "02",
    tags: ["HTML", "CSS", "Github"],
    title: { en: "Spotify Banner Design for ONErpm", es: "Diseño de Spotify Banner para ONErpm" },
    category: { en: "Banner Design", es: "Diseño de Banners" },
    desc: {
      en: "Created high-visibility Spotify promotional banners for music distribution campaigns. Developed custom scripts and HTML/CSS layouts to support digital release assets.",
      es: "Creé un banner promocional de Spotify de alta-visibilidad para campañas de distribución musical. Scripts customizables y diseño HTML/CSS",
    },
    status: { en: "shipped", es: "publicado" },
    image: "/work/banneronerpm.PNG",
  },
  {
    slug: "aws-recording-system",
    num: "03",
    tags: ["Java", "Spring", "Docker", "ReactJS"],
    title: { en: "Amazon Recorder System Helper", es: "Amazon Recorder System Helper" },
    category: { en: "Tooling", es: "Herramientas" },
    desc: {
      en: "Full-stack project that works as an extension for Amazon Connect. This web service was used to record all interactions between call center employees and customers to provide business insights and performance metrics for audit and training purposes.",
      es: "Proyecto full-stack que funciona como una extensión de Amazon Connect. Este servicio web es usado para grabar llamados e interacciones de un call center con empleados y usuarios, esto provee análisis de negocio y metricas para revisión y propósitos de entrenamiento.",
    },
    status: { en: "shipped", es: "publicado" },
    image: "/work/rsh.PNG",
    focus: "top",
  },
  {
    slug: "sentiment-analysis",
    num: "04",
    tags: ["Machine Learning", "Python", "NLTK"],
    title: { en: "ML Sentiment Analysis Project", es: "Proyecto de ML, Analisis Sentimental" },
    category: { en: "Machine Learning Article", es: "Artículo de Machine Learning" },
    desc: {
      en: "An application of Natural Language Processing based on mental health tweets. Applying multiclass and multi-label classification of 625 manually labeled tweets to identify the accuracy of our negative sentiment model.",
      es: "Una aplicación de procesamiento de lenguaje natural basada en tuits sobre salud mental. Se aplica una clasificación multiclase y multietiqueta a 625 tuits etiquetados manualmente para determinar la precisión de nuestro modelo de sentimiento negativo.",
    },
    status: { en: "shipped", es: "publicado" },
    image: "/work/ml_article.PNG",
    focus: "top",
  },
];
