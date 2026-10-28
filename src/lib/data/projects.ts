import type { Localized } from "@/lib/i18n/dictionaries";

// TODO (project-work revamp, "design I" homepage-grid adaptation —
// 2026-10-29):
// - Add more projects here — aim for the full resume's "Major Projects"
//   list plus anything else worth showing. Keep `category: "personal"`
//   to at most 3-4 entries total; everything else should be "academic"
//   or "professional" so the personal work still reads as hand-picked.
// - `featured: true` puts a project in the ★ Featured row at the top
//   of /work — the first featured project gets the big lead card, the
//   next two get the smaller side cards. More than 3 featured just
//   won't all show there (they're still in the full grid below).
// - For every new project, fill in real `stack.usage` numbers, a real
//   `how.diagram`, and at least one real `process` image + `outcome`
//   metric — the TODOs below are scaffolding so the page has something
//   to render; swap them out rather than leaving "TODO" text live.

export type ProjectCategory = "personal" | "academic" | "professional";
export type StackKind = "lang" | "lib" | "tool";

export type StackItem = {
  name: string;
  kind: StackKind;
  /** 0–10, how much of the project leaned on this — drives the [||||    ] bar. */
  usage: number;
};

export type Figure = {
  /** Path under /public. Leave unset to render the dashed TODO placeholder. */
  src?: string;
  alt: Localized;
  caption?: Localized;
};

export type ProcessStep = {
  title: Localized;
  body: Localized;
  image?: Figure;
  beforeAfter?: { before: Figure; after: Figure };
};

export type Challenge = {
  level: "error" | "warn";
  problem: Localized;
  fix: Localized;
};

export type Metric = {
  value: string;
  label: Localized;
};

export type Project = {
  slug: string;
  // Filter group on /work; "featured" is a separate flag below, not a
  // category of its own — a featured project still needs a real one.
  category: ProjectCategory;
  // Shows in the ★ Featured row at the top of /work (first featured
  // project gets the big card, next two get the side cards).
  featured?: boolean;
  title: Localized;
  // Short type label shown on cards, e.g. "AWS Tooling", "ML Paper".
  kindLabel: Localized;
  years: string;
  // Repo/code link — not every project has one.
  url?: string;
  // Separate live-demo link — also optional; most projects will only
  // have one of `url`/`demoUrl` or neither, and that's fine.
  demoUrl?: string;
  image?: string;
  /** Also doubles as the "#theme" chips on the project's own page. */
  tags: string[];

  // One-liner for cards/prev-next; a few sentences for the page itself.
  pitch: Localized;
  tldr: Localized;
  // Optional aside for the personal-story projects (currently just
  // web-portfolio) — rendered as a terminal "// comment" line, not
  // part of the structured case-study sections below.
  backstory?: Localized;

  role: Localized;
  timeline: Localized;
  team: Localized;
  status: Localized;

  stack: StackItem[];

  why: { problem: Localized; before: Localized; goal: Localized };
  contributions: {
    summary: Localized;
    done: { en: string[]; es: string[] };
    others?: { en: string[]; es: string[] };
  };
  how: {
    summary: Localized;
    diagram: { input: Localized; core: Localized; output: Localized };
    code?: { comment: Localized; snippet: string };
  };
  process: ProcessStep[];
  challenges: Challenge[];
  outcome: { metrics: Metric[]; summary: Localized; figure?: Figure };
};

export const PROJECTS: Project[] = [
  {
    slug: "web-portfolio",
    category: "personal",
    featured: true,
    image: "/work/portfolio.PNG",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
    title: { en: "Web Portfolio", es: "Portafolio Web" },
    kindLabel: { en: "Web Portfolio", es: "Portafolio Web" },
    url: "https://github.com/MarcoBosglez/macdmrk",
    demoUrl: "https://macdmrk.vercel.app",
    years: "2024 — now",
    pitch: {
      en: "An interactive personal platform built to show both my Computer Science background and my digital art in one place.",
      es: "Una plataforma personal interactiva, hecha para mostrar mi carrera de Ciencias de la Computación y mi arte digital en un mismo lugar.",
    },
    tldr: {
      en: "A hand-built, bilingual portfolio with a glass/aurora visual language, a draggable illustration gallery, and two private React tools (a lift and meal log) layered on top — designed, illustrated and engineered solo.",
      es: "Un portafolio bilingüe hecho a mano, con un lenguaje visual de vidrio/aurora, una galería de ilustraciones arrastrable, y dos herramientas privadas en React (un registro de pesas y de comidas) construidas encima — diseñado, ilustrado y programado en solitario.",
    },
    // TODO: write the real backstory — when this started, what the very
    // first version looked like, and a couple of the fun/weird moments
    // from building it.
    backstory: {
      en: "TODO — the real story: when I started this, what the very first version looked like, why a hand-made site instead of a template, a couple of fun/weird moments along the way.",
      es: "TODO — la historia real: cuándo empecé esto, cómo se veía la primera versión, por qué un sitio hecho a mano en vez de una plantilla, un par de momentos divertidos/raros en el camino.",
    },
    role: { en: "designer + developer", es: "diseñador + desarrollador" },
    timeline: { en: "Jul 2024 — now", es: "jul 2024 — ahora" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "shipped, iterating", es: "lanzado, en iteración" },
    stack: [
      { name: "typescript", kind: "lang", usage: 9 },
      { name: "next.js", kind: "lib", usage: 9 },
      { name: "tailwind css", kind: "lib", usage: 8 },
      { name: "framer motion", kind: "lib", usage: 6 },
      { name: "three.js", kind: "lib", usage: 3 },
    ],
    why: {
      problem: {
        en: "A resume and a GitHub link don't show how I think visually, and a template site doesn't show how I engineer.",
        es: "Un currículum y un enlace a GitHub no muestran cómo pienso visualmente, y una plantilla no muestra cómo construyo software.",
      },
      before: { en: "scattered links, no single story", es: "enlaces dispersos, sin una historia unificada" },
      goal: { en: "one link for the engineering and the art", es: "un solo enlace para la ingeniería y el arte" },
    },
    contributions: {
      summary: {
        en: "Sole designer, illustrator and developer — owned the project end to end, from the visual language to deployment.",
        es: "Único diseñador, ilustrador y desarrollador — a cargo del proyecto de punta a punta, desde el lenguaje visual hasta el despliegue.",
      },
      done: {
        en: [
          "Designed the whole visual language and drew every illustration",
          "Built the site on Next.js with bilingual copy and a theme switch",
          "Wrote the draggable gallery windows and synthesized UI sounds",
          "Wrote every line of bilingual copy (EN/ES) myself",
        ],
        es: [
          "Diseñé todo el lenguaje visual y dibujé cada ilustración",
          "Construí el sitio en Next.js con copy bilingüe y cambio de tema",
          "Programé las ventanas arrastrables de la galería y los sonidos de UI",
          "Escribí cada línea de copy bilingüe (EN/ES) yo mismo",
        ],
      },
    },
    how: {
      summary: {
        en: "A static Next.js App Router site: a shared aurora/glass shell renders every route, with a small i18n layer and a sound/haptics provider wired through context.",
        es: "Un sitio estático con Next.js App Router: un shell compartido de aurora/vidrio renderiza cada ruta, con una capa de i18n y un proveedor de sonido/haptics conectado vía contexto.",
      },
      diagram: {
        input: { en: "bilingual content (en/es)", es: "contenido bilingüe (en/es)" },
        core: { en: "Next.js App Router + Tailwind", es: "Next.js App Router + Tailwind" },
        output: { en: "static, themeable site", es: "sitio estático y con temas" },
      },
    },
    process: [
      {
        title: { en: "Earliest sketch", es: "Primer boceto" },
        body: {
          en: "TODO — write what the very first layout idea looked like before any code existed.",
          es: "TODO — escribir cómo era la primera idea de layout antes de que existiera código.",
        },
        image: { alt: { en: "earliest wireframe / sketch of the layout", es: "primer wireframe / boceto del layout" } },
      },
      {
        title: { en: "First working version", es: "Primera versión funcional" },
        body: {
          en: "TODO — write what shipped first, before the glass/aurora theme existed.",
          es: "TODO — escribir qué se lanzó primero, antes de que existiera el tema glass/aurora.",
        },
        image: { alt: { en: "first working version, before the glass/aurora theme", es: "primera versión funcional, antes del tema glass/aurora" } },
      },
      {
        title: { en: "Glass/aurora redesign", es: "Rediseño glass/aurora" },
        body: {
          en: "TODO — write about the redesign into the current visual language.",
          es: "TODO — escribir sobre el rediseño hacia el lenguaje visual actual.",
        },
      },
      {
        title: { en: "Current state", es: "Estado actual" },
        body: {
          en: "Still actively iterating — most recently reworked the project-work case-study pages you're reading right now.",
          es: "Sigue en iteración activa — lo más reciente fue rehacer estas páginas de caso de proyecto que estás leyendo ahora mismo.",
        },
        image: { alt: { en: "current state", es: "estado actual" } },
      },
    ],
    challenges: [
      {
        level: "warn",
        problem: {
          en: "Keeping EN/ES copy in sync without the i18n layer feeling bolted on.",
          es: "Mantener el copy EN/ES sincronizado sin que la capa de i18n se sintiera forzada.",
        },
        fix: {
          en: "TODO — write the real explanation of how the i18n system evolved and what was painful about it.",
          es: "TODO — escribir la explicación real de cómo evolucionó el sistema de i18n y qué fue doloroso de resolver.",
        },
      },
    ],
    outcome: {
      metrics: [
        { value: "2", label: { en: "languages, fully parallel", es: "idiomas, en paralelo" } },
        { value: "solo", label: { en: "design + build", es: "diseño + construcción" } },
      ],
      summary: {
        en: "One link for the engineering and the art — and a site recruiters and advisors actually read closely enough to give detailed feedback on.",
        es: "Un solo enlace para la ingeniería y el arte — un sitio que reclutadores y asesores han leído con suficiente detalle como para dar retroalimentación específica.",
      },
    },
  },
  {
    slug: "spotify-banner",
    category: "professional",
    image: "/work/banneronerpm.PNG",
    tags: ["HTML", "CSS", "JavaScript", "GitHub"],
    title: { en: "Spotify Banner for ONErpm", es: "Spotify Banner para ONErpm" },
    kindLabel: { en: "Banner Design", es: "Diseño de Banners" },
    url: "https://github.com/MarcoBosglez/banner-interactivo",
    years: "2021",
    pitch: {
      en: "High-visibility Spotify promotional banners for music distribution campaigns, with custom scripts and HTML/CSS layouts for the release assets.",
      es: "Banners promocionales de Spotify de alta visibilidad para campañas de distribución musical, con scripts a medida y maquetación HTML/CSS para los assets de lanzamiento.",
    },
    tldr: {
      en: "Hand-written HTML/CSS banner layouts for ONErpm release campaigns, with helper scripts so the team could regenerate assets for future releases without redoing the design work.",
      es: "Maquetación de banners en HTML/CSS a mano para campañas de lanzamiento de ONErpm, con scripts de apoyo para que el equipo regenerara assets en lanzamientos futuros sin rehacer el diseño.",
    },
    role: { en: "design + front-end", es: "diseño + front-end" },
    timeline: { en: "2021", es: "2021" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "shipped", es: "lanzado" },
    stack: [
      { name: "html", kind: "lang", usage: 8 },
      { name: "css", kind: "lang", usage: 8 },
      { name: "javascript", kind: "lang", usage: 5 },
    ],
    why: {
      problem: {
        en: "Release campaigns needed pixel-perfect promo banners fast, and regenerating them by hand for every release didn't scale.",
        es: "Las campañas de lanzamiento necesitaban banners promocionales al pixel y con rapidez, y regenerarlos a mano en cada lanzamiento no escalaba.",
      },
      before: { en: "one-off banners, redone from scratch each time", es: "banners aislados, rehechos desde cero cada vez" },
      goal: { en: "reusable promo assets for the label", es: "assets promocionales reutilizables para el sello" },
    },
    contributions: {
      summary: {
        en: "Owned the banner design end to end, from campaign brief to final assets.",
        es: "A cargo del diseño del banner de punta a punta, desde el brief de campaña hasta los assets finales.",
      },
      done: {
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
    },
    how: {
      summary: {
        en: "Hand-written HTML/CSS templates parameterized by a small JS script, so swapping artwork and copy per release didn't mean starting over.",
        es: "Plantillas en HTML/CSS a mano parametrizadas con un pequeño script en JS, para que cambiar arte y texto por lanzamiento no significara empezar de cero.",
      },
      diagram: {
        input: { en: "campaign brief + artwork", es: "brief de campaña + arte" },
        core: { en: "HTML/CSS templates + JS script", es: "plantillas HTML/CSS + script JS" },
        output: { en: "release-ready banner assets", es: "assets de banner listos para lanzamiento" },
      },
    },
    process: [
      {
        title: { en: "Campaign brief", es: "Brief de campaña" },
        body: {
          en: "TODO — write what the brief/early layout exploration actually looked like.",
          es: "TODO — escribir cómo fue el brief / la exploración inicial de layout.",
        },
        image: { alt: { en: "campaign brief / early layout", es: "brief de campaña / layout inicial" } },
      },
      {
        title: { en: "Final banner in use", es: "Banner final en uso" },
        body: {
          en: "TODO — write about the final banner shipping and how it performed.",
          es: "TODO — escribir sobre el lanzamiento del banner final y su desempeño.",
        },
        image: { alt: { en: "final banner in use", es: "banner final en uso" } },
      },
    ],
    challenges: [
      {
        level: "warn",
        problem: {
          en: "Pixel-perfect assets on a tight campaign deadline.",
          es: "Assets al pixel con una fecha límite de campaña muy ajustada.",
        },
        fix: {
          en: "TODO — write what actually made this tricky and how it got solved.",
          es: "TODO — escribir qué fue realmente difícil aquí y cómo se resolvió.",
        },
      },
    ],
    outcome: {
      metrics: [
        { value: "TODO", label: { en: "campaigns shipped", es: "campañas lanzadas" } },
      ],
      summary: {
        en: "Reusable promo assets for the label — future releases could be regenerated without a redesign.",
        es: "Assets promocionales reutilizables para el sello — los lanzamientos futuros podían regenerarse sin rediseñar.",
      },
    },
  },
  {
    slug: "aws-rsh",
    category: "academic",
    featured: true,
    image: "/work/rsh.PNG",
    tags: ["Java", "Spring", "Docker", "React"],
    title: { en: "Amazon Recorder System Helper", es: "Amazon Recorder System Helper" },
    kindLabel: { en: "AWS Tooling", es: "Herramientas AWS" },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:6943381454940753920/",
    years: "2022",
    pitch: {
      en: "A full-stack extension for Amazon Connect that recorded call-center interactions between agents and customers, for audit, training and performance metrics.",
      es: "Una extensión full-stack para Amazon Connect que grababa las interacciones de un call center entre agentes y clientes, para auditoría, capacitación y métricas de desempeño.",
    },
    tldr: {
      en: "A Spring + Docker recording service built around Amazon Connect, with a React console for searching and reviewing calls — I led the front-end team that built and shipped it.",
      es: "Un servicio de grabación en Spring + Docker construido alrededor de Amazon Connect, con una consola en React para buscar y revisar llamadas — lideré el equipo de front-end que lo construyó y lanzó.",
    },
    role: { en: "front-end team lead", es: "líder de equipo front-end" },
    timeline: { en: "Fall 2022", es: "otoño 2022" },
    team: { en: "4 people", es: "4 personas" },
    status: { en: "shipped", es: "lanzado" },
    stack: [
      { name: "java", kind: "lang", usage: 7 },
      { name: "spring", kind: "lib", usage: 7 },
      { name: "react", kind: "lib", usage: 6 },
      { name: "docker", kind: "tool", usage: 5 },
    ],
    why: {
      problem: {
        en: "Call-center interactions between agents and customers weren't being captured anywhere auditable, which made training and performance review guesswork.",
        es: "Las interacciones del call center entre agentes y clientes no quedaban registradas en ningún lugar auditable, lo que hacía que la capacitación y la evaluación de desempeño fueran una conjetura.",
      },
      before: { en: "no searchable call history", es: "sin historial de llamadas consultable" },
      goal: { en: "auditable call history for the business", es: "historial de llamadas auditable para el negocio" },
    },
    contributions: {
      summary: {
        en: "Led the front-end team — split up the work, kept everyone unblocked, and checked in regularly on progress; made the final calls on front-end architecture and the Docker-based deployment.",
        es: "Lideré al equipo de front-end — repartí el trabajo, mantuve a todos sin bloqueos, y di seguimiento regular al avance; tomé las decisiones finales de arquitectura front-end y del despliegue basado en Docker.",
      },
      done: {
        en: [
          "Led the front-end team — split up the work, kept everyone unblocked, and checked in regularly on progress",
          "Reviewed teammates' pull requests and kept the React console consistent across contributors",
          "Made the final calls on front-end architecture and the Docker-based deployment",
        ],
        es: [
          "Lideré al equipo de front-end — repartí el trabajo, mantuve a todos sin bloqueos, y di seguimiento regular al avance",
          "Revisé los pull requests del equipo y mantuve la consola de React consistente entre colaboradores",
          "Tomé las decisiones finales de arquitectura front-end y del despliegue basado en Docker",
        ],
      },
      others: {
        en: ["Back-end teammates built the Spring recording service this console talks to"],
        es: ["Compañeros de back-end construyeron el servicio de grabación en Spring con el que habla esta consola"],
      },
    },
    how: {
      summary: {
        en: "Amazon Connect streams call events into a Spring service, which persists them for the React console to search and play back.",
        es: "Amazon Connect transmite eventos de llamada a un servicio en Spring, que los persiste para que la consola en React los busque y reproduzca.",
      },
      diagram: {
        input: { en: "Amazon Connect call events", es: "eventos de llamada de Amazon Connect" },
        core: { en: "Spring recording service (Docker)", es: "servicio de grabación en Spring (Docker)" },
        output: { en: "React console — search & review", es: "consola React — búsqueda y revisión" },
      },
    },
    process: [
      {
        title: { en: "Architecture sketch", es: "Boceto de arquitectura" },
        body: {
          en: "TODO — write about the early architecture planning with the team.",
          es: "TODO — escribir sobre la planeación de arquitectura inicial con el equipo.",
        },
        image: { alt: { en: "early architecture sketch", es: "boceto de arquitectura inicial" } },
      },
      {
        title: { en: "React console mid-build", es: "Consola de React a medio construir" },
        body: {
          en: "TODO — write about splitting the console work across the front-end team.",
          es: "TODO — escribir sobre cómo se repartió el trabajo de la consola entre el equipo de front-end.",
        },
        image: { alt: { en: "React console mid-build", es: "consola de React a medio construir" } },
      },
      {
        title: { en: "Final console in use", es: "Consola final en uso" },
        body: {
          en: "TODO — write about the finished console shipping to the business.",
          es: "TODO — escribir sobre el lanzamiento de la consola terminada al negocio.",
        },
        image: { alt: { en: "final console in use", es: "consola final en uso" } },
      },
    ],
    challenges: [
      {
        level: "warn",
        problem: {
          en: "Leading a team for the first time, while still writing code myself.",
          es: "Liderar un equipo por primera vez, mientras seguía programando yo mismo.",
        },
        fix: {
          en: "TODO — write the real story: what was hard about going from contributor to lead, how work got split up, how you kept the team unblocked.",
          es: "TODO — escribir la historia real: qué fue difícil al pasar de colaborador a líder, cómo se repartió el trabajo, cómo se mantuvo al equipo sin bloqueos.",
        },
      },
    ],
    outcome: {
      metrics: [
        { value: "4", label: { en: "person team led", es: "personas en el equipo liderado" } },
        { value: "TODO", label: { en: "calls indexed", es: "llamadas indexadas" } },
      ],
      summary: {
        en: "Auditable call history for the business — a searchable console the team could actually use for training and review.",
        es: "Historial de llamadas auditable para el negocio — una consola consultable que el equipo realmente pudo usar para capacitación y revisión.",
      },
    },
  },
  {
    slug: "sentiment-analysis",
    category: "academic",
    featured: true,
    image: "/work/ml_article.PNG",
    tags: ["Machine Learning", "Python", "NLTK", "NLP"],
    title: { en: "ML Sentiment Analysis", es: "Análisis de Sentimiento con ML" },
    kindLabel: { en: "ML Paper", es: "Artículo de ML" },
    url: "https://rcs.cic.ipn.mx/2023_152_12/Development%20of%20a%20Front-End%20with%20Dynamic%20Searches%20for%20Chatbot%20Retraining%20Using%20ReactJS.pdf",
    years: "2023",
    pitch: {
      en: "An NLP study on mental-health tweets: multiclass and multi-label classification of 625 hand-labeled tweets to measure the accuracy of a negative-sentiment model.",
      es: "Un estudio de PLN sobre tuits de salud mental: clasificación multiclase y multietiqueta de 625 tuits etiquetados a mano para medir la precisión de un modelo de sentimiento negativo.",
    },
    tldr: {
      en: "Hand-labeled 625 mental-health tweets, built a Python/NLTK classification pipeline, and measured accuracy well enough to publish the results.",
      es: "Etiqueté a mano 625 tuits de salud mental, construí un pipeline de clasificación en Python/NLTK, y medí la precisión lo suficientemente bien como para publicar los resultados.",
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2023", es: "2023" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "published", es: "publicado" },
    stack: [
      { name: "python", kind: "lang", usage: 8 },
      { name: "nltk", kind: "lib", usage: 7 },
    ],
    why: {
      problem: {
        en: "Negative-sentiment models for mental-health text are often evaluated on data that doesn't reflect how people actually phrase distress on social media.",
        es: "Los modelos de sentimiento negativo para texto de salud mental suelen evaluarse con datos que no reflejan cómo la gente expresa realmente el malestar en redes sociales.",
      },
      before: { en: "no hand-verified accuracy baseline", es: "sin una línea base de precisión verificada a mano" },
      goal: { en: "published NLP accuracy study", es: "estudio de precisión de PLN publicado" },
    },
    contributions: {
      summary: {
        en: "Hand-labeled the entire 625-tweet dataset myself and designed and ran the accuracy evaluation the paper's results are based on.",
        es: "Etiqueté a mano todo el dataset de 625 tuits y diseñé y ejecuté la evaluación de precisión en la que se basan los resultados del artículo.",
      },
      done: {
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
    },
    how: {
      summary: {
        en: "A hand-labeled tweet set feeds an NLTK-based classification pipeline, which outputs multiclass/multi-label predictions scored against the labels.",
        es: "Un conjunto de tuits etiquetados a mano alimenta un pipeline de clasificación basado en NLTK, que genera predicciones multiclase/multietiqueta evaluadas contra las etiquetas.",
      },
      diagram: {
        input: { en: "625 hand-labeled tweets", es: "625 tuits etiquetados a mano" },
        core: { en: "NLTK classification pipeline", es: "pipeline de clasificación NLTK" },
        output: { en: "accuracy study / publication", es: "estudio de precisión / publicación" },
      },
    },
    process: [
      {
        title: { en: "Labeling the dataset", es: "Etiquetar el dataset" },
        body: {
          en: "TODO — write about the labeling guidelines used and how consistency was checked across the 625 tweets.",
          es: "TODO — escribir sobre los criterios de etiquetado usados y cómo se verificó la consistencia en los 625 tuits.",
        },
        image: { alt: { en: "labeling spreadsheet / early dataset", es: "hoja de etiquetado / dataset inicial" } },
      },
      {
        title: { en: "Model results", es: "Resultados del modelo" },
        body: {
          en: "TODO — write about the classification results and what the confusion matrix showed.",
          es: "TODO — escribir sobre los resultados de clasificación y lo que mostró la matriz de confusión.",
        },
        image: { alt: { en: "model results / confusion matrix", es: "resultados del modelo / matriz de confusión" } },
      },
    ],
    challenges: [
      {
        level: "warn",
        problem: {
          en: "Hand-labeling 625 tweets consistently, alone.",
          es: "Etiquetar 625 tuits a mano de forma consistente, en solitario.",
        },
        fix: {
          en: "TODO — write the real story: labeling guidelines, disagreements with a second labeler if there was one, what was learned.",
          es: "TODO — escribir la historia real: criterios de etiquetado, desacuerdos con un segundo etiquetador si lo hubo, qué se aprendió.",
        },
      },
    ],
    outcome: {
      metrics: [
        { value: "625", label: { en: "tweets hand-labeled", es: "tuits etiquetados a mano" } },
        { value: "TODO%", label: { en: "model accuracy", es: "precisión del modelo" } },
      ],
      summary: {
        en: "A published NLP accuracy study on mental-health sentiment classification.",
        es: "Un estudio de precisión de PLN publicado sobre clasificación de sentimiento en salud mental.",
      },
    },
  },
];
