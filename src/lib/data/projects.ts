import type { Localized } from "@/lib/i18n/dictionaries";

// "Story first" case-study redesign (2026-11). Every content field below
// is optional: omit it and its section on /work/<slug> just doesn't
// render — no empty chrome, no "TODO" filler unless you put one there
// yourself. Only the identity/listing fields (slug, category, title,
// kindLabel, years, startYear, tags) are required, since /work's grid
// and the hub's Featured row read those for every project regardless
// of how filled-in its case study is.
//
// Copy formatting: prose fields go through components/work/rich-text.tsx,
// so `\n` starts a paragraph, "- " starts a bullet, URLs become links, and
// ASCII reactions like <3 get coloured.

export type ProjectCategory = "personal" | "academic" | "professional";

export type Project = {
  slug: string;
  // Filter group on /work; "featured" is a separate flag below, not a
  // category of its own — a featured project still needs a real one.
  category: ProjectCategory;
  // Shows in the ★ Featured row at the top of /work (first featured
  // project gets the big lead card, the next two get the side cards).
  featured?: boolean;
  title: Localized;
  // Short type label shown on /work's grid cards, e.g. "AWS Tooling".
  kindLabel: Localized;
  years: string;
  // Drives sort order on /work (newest first) — `years` is just display
  // text ("2024 — now") and isn't reliably parseable, so this is the
  // actual sortable value. Use the project's start year.
  startYear: number;
  // Repo/code link — not every project has one.
  url?: string;
  // Separate live-demo link — also optional; most projects will only
  // have one of `url`/`demoUrl` or neither, and that's fine.
  demoUrl?: string;
  heroImage?: string;
  /** Stack/theme chips — shown in the facts row and as "#tag" chips. */
  tags: string[];

  // One sentence under the title (and the one-liner used on /work's
  // cards and the prev/next pager).
  pitch?: Localized;
  // "The story in 30 seconds" — three short beats shown as cards right
  // under the facts row.
  tldr?: { problem: Localized; built: Localized; result: Localized };

  role?: Localized;
  timeline?: Localized;
  team?: Localized;
  status?: Localized;

  why?: {
    /** A full sentence, not a label — e.g. "Release campaigns needed…" */
    headline: Localized;
    body: Localized;
    before?: Localized;
    goal?: Localized;
    /** Path under /public. */
    image?: string;
  };
  did?: {
    headline: Localized;
    bullets: { en: string[]; es: string[] };
    image?: string;
  };
  how?: {
    headline: Localized;
    steps: { en: string[]; es: string[] };
    image?: string;
  };
  challenges?: {
    headline: Localized;
    items: { problem: Localized; fix: Localized }[];
  };
  outcome?: {
    headline: Localized;
    body: Localized;
    stats?: { value: string; label: Localized }[];
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "web-portfolio",
    category: "personal",
    featured: true,
    title: { en: "Web Portfolio", es: "Portafolio Web" },
    kindLabel: { en: "Web Portfolio", es: "Portafolio Web" },
    url: "https://github.com/MarcoBosglez/macdmrk",
    demoUrl: "https://macdmrk.vercel.app",
    years: "2026",
    startYear: 2024,
    heroImage: "/work/web-portfolio.webp",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
    pitch: {
      en: "An interactive web-portfolio and personal hub made with Next.js",
      es: "",
    },
    tldr: {
      problem: {
        en: "I'm a software engineer who also makes digital art, and most portfolio formats make you pick one identity to lead with.",
        es: "",
      },
      built: {
        en: "A hand-built Next.js site — bilingual, theme-switching, with draggable gallery windows and custom UI sounds — that I designed, illustrated, and developed solo.",
        es: "",
      },
      result: {
        en: "One link for the engineering and the art — and a site recruiters and advisors actually read closely enough to give detailed feedback on.",
        es: "",
      },
    },
    role: { en: "designer + developer", es: "diseñador + desarrollador" },
    timeline: { en: "Jul 2024 — now", es: "jul 2024 — ahora" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "shipped, iterating", es: "lanzado, en iteración" },
    why: {
      headline: {
        en: "I wanted one place that showed both my engineering career and my art, without picking a side.",
        es: "",
      },
      body: {
        en: "I started my web portfolio back in 2020 while I was doing my undergrad in Mexico City. For a while I have been looking for a way to express myself as a software engineer and digital artist. My career is in tech but I've always appreciated and had love for art. Showcasing a profile like that is tricky as it requires I balance both my professional journey and my main hobby.",
        es: "",
      },
      goal: { en: "Creating a web hub that represented my personality.", es: "" },
    },
    did: {
      headline: {
        en: "I designed, illustrated, and built every part of this site myself.",
        es: "",
      },
      bullets: {
        en: [
          "Designed the whole visual language and drew every illustration",
          "Built the site on Next.js with bilingual copy and a theme switch",
          "Wrote the draggable gallery windows and synthesized UI sounds",
        ],
        es: [],
      },
    },
    how: {
      headline: {
        en: "Typed content flows through a Next.js App Router site, styled with Tailwind and animated with Framer Motion.",
        es: "",
      },
      steps: {
        en: [
          "Started in 2020 as a static HTML/CSS copy of my résumé, with very few features or animations.",
          "In 2025, started exploring a modern redesign after a YouTube video by @shar on her own portfolio's design decisions — I especially liked her presentation-card layout.",
          "Built a mood board from similar portfolios, then listed the features I actually wanted: 5 sections, dark/light modes, draggable windows, custom sounds, bilingual copy, a glass-card look.",
          "Still actively adding ideas on the fly — new sections and small, fun experiments as they come.",
        ],
        es: [],
      },
    },
    challenges: {
      headline: { en: "What broke, and how I fixed it.", es: "Qué se rompió, y cómo lo resolví." },
      items: [
        {
          problem: {
            en: "Keeping EN/ES copy in sync without the i18n layer feeling bolted on.",
            es: "Mantener el copy EN/ES sincronizado sin que la capa de i18n se sintiera forzada.",
          },
          fix: {
            en: "[TODO: write the real explanation of how the i18n system evolved and what was painful about it]",
            es: "[TODO: escribir la explicación real de cómo evolucionó el sistema de i18n y qué fue doloroso de resolver]",
          },
        },
      ],
    },
    outcome: {
      headline: { en: "One link for the engineering and the art.", es: "" },
      body: {
        en: "One link for the engineering and the art — and a site recruiters and advisors actually read closely enough to give detailed feedback on.",
        es: "Un solo enlace para la ingeniería y el arte — un sitio que reclutadores y asesores han leído con suficiente detalle como para dar retroalimentación específica.",
      },
      stats: [
        { value: "2", label: { en: "languages, fully parallel", es: "idiomas, en paralelo" } },
        { value: "solo", label: { en: "design + build", es: "diseño + construcción" } },
      ],
    },
  },

  {
    slug: "spotify-banner",
    category: "professional",
    heroImage: "/work/spotify-banner.webp",
    tags: ["HTML", "CSS", "JavaScript", "GitHub"],
    title: { en: "Spotify Banner for ONErpm", es: "Spotify Banner para ONErpm" },
    kindLabel: { en: "Banner Design", es: "Diseño de Banners" },
    url: "https://github.com/MarcoBosglez/banner-interactivo",
    demoUrl: "https://marcobosglez.github.io/banner-interactivo/",
    years: "2025",
    startYear: 2025,
    pitch: {
      en: "High-visibility Spotify promotional banners for music distribution campaigns, with custom scripts and HTML/CSS layouts for the release assets.",
      es: "Banners promocionales de Spotify de alta visibilidad para campañas de distribución musical, con scripts a medida y maquetación HTML/CSS para los assets de lanzamiento.",
    },
    tldr: {
      problem: {
        en: "Release campaigns needed pixel-perfect promo banners fast, and regenerating them by hand for every release didn't scale.",
        es: "Las campañas de lanzamiento necesitaban banners promocionales al pixel y con rapidez, y regenerarlos a mano en cada lanzamiento no escalaba.",
      },
      built: {
        en: "Hand-written HTML/CSS banner templates with helper scripts, so swapping artwork and copy per release didn't mean starting over.",
        es: "Plantillas en HTML/CSS a mano con scripts de apoyo, para que cambiar arte y texto por lanzamiento no significara empezar de cero.",
      },
      result: {
        en: "Reusable promo assets for the label — future releases could be regenerated without a redesign.",
        es: "Assets promocionales reutilizables para el sello — los lanzamientos futuros podían regenerarse sin rediseñar.",
      },
    },
    role: { en: "design + front-end", es: "diseño + front-end" },
    timeline: { en: "2025", es: "2025" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "shipped", es: "lanzado" },
    why: {
      headline: {
        en: "Release campaigns needed pixel-perfect promo banners fast, and redoing them from scratch every time didn't scale.",
        es: "Las campañas de lanzamiento necesitaban banners promocionales al pixel y con rapidez, y rehacerlos desde cero cada vez no escalaba.",
      },
      body: {
        en: "Release campaigns needed pixel-perfect promo banners fast, and regenerating them by hand for every release didn't scale.",
        es: "Las campañas de lanzamiento necesitaban banners promocionales al pixel y con rapidez, y regenerarlos a mano en cada lanzamiento no escalaba.",
      },
      before: { en: "one-off banners, redone from scratch each time", es: "banners aislados, rehechos desde cero cada vez" },
      goal: { en: "reusable promo assets for the label", es: "assets promocionales reutilizables para el sello" },
    },
    did: {
      headline: {
        en: "I owned the banner design end to end, from campaign brief to final assets.",
        es: "Estuve a cargo del diseño del banner de punta a punta, desde el brief de campaña hasta los assets finales.",
      },
      bullets: {
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
      headline: {
        en: "Hand-written HTML/CSS templates, parameterized by a small JS script.",
        es: "Plantillas en HTML/CSS a mano, parametrizadas con un pequeño script en JS.",
      },
      steps: {
        en: [
          "[TODO: what the campaign brief / early layout exploration actually looked like]",
          "[TODO: how the final banner shipped and performed]",
        ],
        es: [
          "[TODO: brief de campaña / exploración inicial de layout]",
          "[TODO: cómo se lanzó y qué tal funcionó el banner final]",
        ],
      },
    },
    challenges: {
      headline: { en: "What broke, and how I fixed it.", es: "Qué se rompió, y cómo lo resolví." },
      items: [
        {
          problem: {
            en: "Pixel-perfect assets on a tight campaign deadline.",
            es: "Assets al pixel con una fecha límite de campaña muy ajustada.",
          },
          fix: {
            en: "[TODO: what actually made this tricky and how it got solved]",
            es: "[TODO: qué fue realmente difícil aquí y cómo se resolvió]",
          },
        },
      ],
    },
    outcome: {
      headline: { en: "Reusable promo assets for the label.", es: "Assets promocionales reutilizables para el sello." },
      body: {
        en: "Reusable promo assets for the label — future releases could be regenerated without a redesign.",
        es: "Assets promocionales reutilizables para el sello — los lanzamientos futuros podían regenerarse sin rediseñar.",
      },
      stats: [{ value: "[TODO]", label: { en: "campaigns shipped", es: "campañas lanzadas" } }],
    },
  },

  {
    slug: "aws-rsh",
    category: "academic",
    featured: true,
    heroImage: "/work/aws-rsh-cover.webp",
    tags: ["Java", "Spring", "Docker", "React"],
    title: { en: "Amazon Recorder System Helper", es: "Amazon Recorder System Helper" },
    kindLabel: { en: "AWS Tooling", es: "Herramientas AWS" },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:6943381454940753920/",
    years: "2022",
    startYear: 2022,
    pitch: {
      en: "A full-stack Amazon Connect extension for audit, training and performance metrics.",
      es: "Una extensión full-stack para Amazon Connect que grababa las interacciones de un call center entre agentes y clientes, para auditoría, capacitación y métricas de desempeño.",
    },
    tldr: {
      problem: {
        en: "Call-center interactions between agents and customers weren't being captured anywhere auditable, which made training and performance review guesswork.",
        es: "Las interacciones del call center entre agentes y clientes no quedaban registradas en ningún lugar auditable, lo que hacía que la capacitación y la evaluación de desempeño fueran una conjetura.",
      },
      built: {
        en: "A Spring + Docker recording service built around Amazon Connect, with a React console for searching and reviewing calls — I led the front-end team that built and shipped it.",
        es: "Un servicio de grabación en Spring + Docker construido alrededor de Amazon Connect, con una consola en React para buscar y revisar llamadas — lideré el equipo de front-end que lo construyó y lanzó.",
      },
      result: {
        en: "Auditable call history for the business — a searchable console the team could actually use for training and review.",
        es: "Historial de llamadas auditable para el negocio — una consola consultable que el equipo realmente pudo usar para capacitación y revisión.",
      },
    },
    role: { en: "front-end team lead", es: "líder de equipo front-end" },
    timeline: { en: "Fall 2022", es: "otoño 2022" },
    team: { en: "4 people", es: "4 personas" },
    status: { en: "shipped", es: "lanzado" },
    why: {
      headline: {
        en: "Call-center interactions weren't captured anywhere auditable, which made training and performance review guesswork.",
        es: "Las interacciones del call center no quedaban registradas en ningún lugar auditable, lo que hacía que la capacitación y la evaluación de desempeño fueran una conjetura.",
      },
      body: {
        en: "Call-center interactions between agents and customers weren't being captured anywhere auditable, which made training and performance review guesswork.",
        es: "Las interacciones del call center entre agentes y clientes no quedaban registradas en ningún lugar auditable, lo que hacía que la capacitación y la evaluación de desempeño fueran una conjetura.",
      },
      before: { en: "no searchable call history", es: "sin historial de llamadas consultable" },
      goal: { en: "auditable call history for the business", es: "historial de llamadas auditable para el negocio" },
    },
    did: {
      headline: {
        en: "I led the front-end team and made the final calls on architecture and deployment.",
        es: "Lideré al equipo de front-end y tomé las decisiones finales de arquitectura y despliegue.",
      },
      bullets: {
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
    },
    how: {
      headline: {
        en: "Amazon Connect streams call events into a Spring service, which the React console searches and plays back.",
        es: "Amazon Connect transmite eventos de llamada a un servicio en Spring, que la consola en React busca y reproduce.",
      },
      steps: {
        en: [
          "[TODO: early architecture planning with the team]",
          "[TODO: splitting the console work across the front-end team]",
          "[TODO: the finished console shipping to the business]",
        ],
        es: [
          "[TODO: planeación de arquitectura inicial con el equipo]",
          "[TODO: cómo se repartió el trabajo de la consola entre el equipo]",
          "[TODO: el lanzamiento de la consola terminada al negocio]",
        ],
      },
    },
    challenges: {
      headline: { en: "What broke, and how I fixed it.", es: "Qué se rompió, y cómo lo resolví." },
      items: [
        {
          problem: {
            en: "Leading a team for the first time, while still writing code myself.",
            es: "Liderar un equipo por primera vez, mientras seguía programando yo mismo.",
          },
          fix: {
            en: "[TODO: what was hard about going from contributor to lead, how work got split up, how the team stayed unblocked]",
            es: "[TODO: qué fue difícil al pasar de colaborador a líder, cómo se repartió el trabajo, cómo se mantuvo al equipo sin bloqueos]",
          },
        },
      ],
    },
    outcome: {
      headline: { en: "Auditable call history for the business.", es: "Historial de llamadas auditable para el negocio." },
      body: {
        en: "Auditable call history for the business — a searchable console the team could actually use for training and review.",
        es: "Historial de llamadas auditable para el negocio — una consola consultable que el equipo realmente pudo usar para capacitación y revisión.",
      },
      stats: [
        { value: "4", label: { en: "person team led", es: "personas en el equipo liderado" } },
        { value: "[TODO]", label: { en: "calls indexed", es: "llamadas indexadas" } },
      ],
    },
  },

  {
    slug: "sentiment-analysis",
    category: "academic",
    featured: true,
    heroImage: "/work/sentiment-analysis-cover.webp",
    tags: ["Machine Learning", "Python", "NLTK", "NLP"],
    title: { en: "ML Sentiment Analysis", es: "Análisis de Sentimiento con ML" },
    kindLabel: { en: "ML Paper", es: "Artículo de ML" },
    url: "https://rcs.cic.ipn.mx/2023_152_12/Development%20of%20a%20Front-End%20with%20Dynamic%20Searches%20for%20Chatbot%20Retraining%20Using%20ReactJS.pdf",
    years: "2023",
    startYear: 2023,
    pitch: {
      en: "NLP study on mental-health tweets: multiclass and multi-label classification of 625 hand-labeled tweets to measure the accuracy of a negative-sentiment model.",
      es: "Un estudio de PLN sobre tuits de salud mental: clasificación multiclase y multietiqueta de 625 tuits etiquetados a mano para medir la precisión de un modelo de sentimiento negativo.",
    },
    tldr: {
      problem: {
        en: "Negative-sentiment models for mental-health text are often evaluated on data that doesn't reflect how people actually phrase distress on social media.",
        es: "Los modelos de sentimiento negativo para texto de salud mental suelen evaluarse con datos que no reflejan cómo la gente expresa realmente el malestar en redes sociales.",
      },
      built: {
        en: "Hand-labeled 625 mental-health tweets, built a Python/NLTK classification pipeline, and measured accuracy well enough to publish the results.",
        es: "Etiqueté a mano 625 tuits de salud mental, construí un pipeline de clasificación en Python/NLTK, y medí la precisión lo suficientemente bien como para publicar los resultados.",
      },
      result: {
        en: "A published NLP accuracy study on mental-health sentiment classification.",
        es: "Un estudio de precisión de PLN publicado sobre clasificación de sentimiento en salud mental.",
      },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2023", es: "2023" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "published", es: "publicado" },
    why: {
      headline: {
        en: "Negative-sentiment models for mental-health text are often evaluated on data that doesn't reflect how people actually phrase distress on social media.",
        es: "Los modelos de sentimiento negativo para texto de salud mental suelen evaluarse con datos que no reflejan cómo la gente expresa realmente el malestar en redes sociales.",
      },
      body: {
        en: "Negative-sentiment models for mental-health text are often evaluated on data that doesn't reflect how people actually phrase distress on social media.",
        es: "Los modelos de sentimiento negativo para texto de salud mental suelen evaluarse con datos que no reflejan cómo la gente expresa realmente el malestar en redes sociales.",
      },
      before: { en: "no hand-verified accuracy baseline", es: "sin una línea base de precisión verificada a mano" },
      goal: { en: "published NLP accuracy study", es: "estudio de precisión de PLN publicado" },
    },
    did: {
      headline: {
        en: "I hand-labeled the full dataset and designed the accuracy evaluation myself.",
        es: "Etiqueté a mano todo el dataset y diseñé yo mismo la evaluación de precisión.",
      },
      bullets: {
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
      headline: {
        en: "A hand-labeled tweet set feeds an NLTK classification pipeline, scored against the labels.",
        es: "Un conjunto de tuits etiquetados a mano alimenta un pipeline de clasificación NLTK, evaluado contra las etiquetas.",
      },
      steps: {
        en: [
          "[TODO: labeling guidelines used and how consistency was checked across the 625 tweets]",
          "[TODO: classification results and what the confusion matrix showed]",
        ],
        es: [
          "[TODO: criterios de etiquetado usados y cómo se verificó la consistencia en los 625 tuits]",
          "[TODO: resultados de clasificación y lo que mostró la matriz de confusión]",
        ],
      },
    },
    challenges: {
      headline: { en: "What broke, and how I fixed it.", es: "Qué se rompió, y cómo lo resolví." },
      items: [
        {
          problem: {
            en: "Hand-labeling 625 tweets consistently, alone.",
            es: "Etiquetar 625 tuits a mano de forma consistente, en solitario.",
          },
          fix: {
            en: "[TODO: labeling guidelines, disagreements with a second labeler if there was one, what was learned]",
            es: "[TODO: criterios de etiquetado, desacuerdos con un segundo etiquetador si lo hubo, qué se aprendió]",
          },
        },
      ],
    },
    outcome: {
      headline: { en: "A published NLP accuracy study.", es: "Un estudio de precisión de PLN publicado." },
      body: {
        en: "A published NLP accuracy study on mental-health sentiment classification.",
        es: "Un estudio de precisión de PLN publicado sobre clasificación de sentimiento en salud mental.",
      },
      stats: [
        { value: "625", label: { en: "tweets hand-labeled", es: "tuits etiquetados a mano" } },
        { value: "[TODO]%", label: { en: "model accuracy", es: "precisión del modelo" } },
      ],
    },
  },

  {
    slug: "rock-em",
    category: "academic",
    featured: false,
    heroImage: "/work/rock-em-cover.webp",
    tags: ["Behavior Trees", "C++", "Game Development", "Game AI"],
    title: { en: "Rock 'Em", es: "Rock 'Em" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2026",
    startYear: 2026,
    pitch: {
      en: "A Game AI simulation project inspired by \"Rock 'Em & Sock 'Em\" for the purpose of using behavior tree logic in game development.",
      es: "Una simulación de IA de juego para el propósito de usar lógica de árboles de comportamiento en el desarrollo de juegos.",
    },
    tldr: {
      problem: { en: "Create NPC AI behavior using techniques learned from a master's level class", es: "[TODO: el problema que explora este proyecto]" },
      built: {
        en: "Developed a Game AI simulation using behavior trees, implemented in C++",
        es: "Desarrolló una simulación de IA de juego usando árboles de comportamiento, implementada en C++.",
      },
      result: { en: "Voted a winner for most fun in class contest", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "published", es: "publicado" },
    why: {
      headline: { en: "In Digipen's MSCS Program during my first semester's class 'AI In Games' taught by Steve Rabin, I was tasked to create a 3D game simulation of techniques learned in class to create NPC behavior that would reflect behavior in videogames", es: "[TODO: por qué existe este proyecto]" },
      body: { en: "Added onto the project a contest where everyone in the class voted for the 4 most 'fun' games. Winners got extra credits as a reward.", es: "[TODO: el problema/motivación real]" },
    },
    did: {
      headline: { en: "Using a custom engine made for the purpose of this class, I worked in the development of this simulation inspired by the old 'Rock `Em Sock `Em' toy game of 90's.", es: "" },
      bullets: { en: ["Designed multiple behavior trees", "Coded game logic as well as blackboard behavior for NPC interactions", "Worked on the NPC models in Blender", "One of the contest winners"], es: [] },
    },
    how: {
      headline: { en: "In the middle of the ring, two boxer NPCs fight while reacting to their oponent's moving, blocking, health indicators for the purpose of 'Rocking' and knocking their opponent out", es: "[TODO: cómo funciona la simulación]" },
      steps: { en: ["Used a blackboard for boxer's blocking & health interactions", "Each boxer has a crowd, both of them doing a wave movement using templates", "Lights & 'knock-out birds' also use templates in various formations"], es: ["[TODO: pasos de construcción]"] },
    },
    challenges: {
      headline: { en: "The most difficult parts of the project were the formations and working with a new custom engine", es: "[TODO: qué se rompió y cómo se resolvió]" },
      items: [
        {
          problem: { en: "New topics", es: "[TODO: un reto real de este proyecto]" },
          fix: { en: "Worked enough", es: "[TODO: cómo se resolvió]" },
        },
      ],
    },
    outcome: {
      headline: { en: "The simulation was presented in front of the whole class and my simulation 'Rock `Em' was voted within the top best projects and won the contest's extra credit price.", es: "[TODO: titular del resultado]" },
      body: { en: "It was a fun academic project that taught me how to use new game AI techniques with fun concepts and industry best practices", es: "[TODO: resumen del resultado]" },
    },
  },

  {
    slug: "steam-dataset-project",
    category: "academic",
    featured: false,
    heroImage: "/work/steam-dataset-cover.webp",
    tags: ["Python", "Polars", "Numpy", "Data Analysis"],
    title: { en: "Steam Data Set Project", es: "steam dataset project" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2026",
    startYear: 2026,
    pitch: { en: "An on-going academic project that takes a 100K Steam Games from HuggingFace.co data set to answer the following question: 'Do people care enough about game support?'", es: "[TODO: una oración de descripción]" },
    tldr: {
      problem: { en: "As a", es: "[TODO: el problema que explora este proyecto]" },
      built: { en: "[TODO: what was built]", es: "[TODO: qué se construyó]" },
      result: { en: "[TODO: the result/takeaway]", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "4-man team", es: "en solitario" },
    status: { en: "in progress", es: "publicado" },
    why: {
      headline: { en: "As a part of the 'Data Analysis' class within Digipen's MSCS Program, in a team of 4 people, we were tasked to look for a dataset with a minimum of 100K entries and look to answer questions using Data Analysis techniques learned from class", es: "[TODO: por qué existe este proyecto]" },
      body: { en: "The motivation for finding the dataset was a shared group interest in videogames", es: "[TODO: el problema/motivación real]" },
    },
    did: {
      headline: { en: "Using Python's Jupyter Notebook and the Polars library for Data Science, we looked through 100K videogames to answer multiple questions. One of them was: 'Does broader game support (languages, platform, modding) lead to better reviews?'", es: "[TODO: qué hice]" },
      bullets: { en: ["The main idea was to pull reviews from the big game catalogue and look for interest in game support as a method for game Developers to see if users care enough about game support to include it in their own games", "More than 194K reviews were pulled from Steam's public API"], es: ["[TODO: contribuciones]"] },
    },
    how: {
      headline: { en: "Multiple milestone project", es: "[TODO: cómo funciona]" },
      steps: { en: ["Collecting 100K data", "Cleaning data", "Create multiple valuable features", "Analyze groups, models, sentiment analysis"], es: ["[TODO: pasos de construcción]"] },
    },
    challenges: {
      headline: { en: "Players do care about game support but do not write reviews about it", es: "[TODO: qué se rompió y cómo se resolvió]" },
      items: [
        {
          problem: { en: "Users do not leave reviews about game support", es: "[TODO: un reto real de este proyecto]" },
          fix: { en: "Used reach as a measurement for games reaching 10+ reviews and measured it against all support levels", es: "[TODO: cómo se resolvió]" },
        },
      ],
    },
    outcome: {
      headline: { en: "Still an ongoing project. Currently in Milestone 2/3", es: "[TODO: titular del resultado]" },
      body: { en: "Will update the outcome with more findings", es: "[TODO: resumen del resultado]" },
    },
  },

  {
    slug: "ufc-mma-prediction-in-progress",
    category: "academic",
    featured: false,
    heroImage: "/work/ufc-mma-prediction-cover.webp",
    tags: ["Python", "Numpy", "Data Science"],
    title: { en: "UFC MMA Prediction", es: "Predicción de UFC MMA" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2026",
    startYear: 2026,
    pitch: { en: "An on-going academic project that takes data from UFC MMA contests and predicts the outcome of fights based on previous fight data", es: "[TODO: una oración de descripción]" },
    tldr: {
      problem: { en: "[TODO: the problem this project explored]", es: "[TODO: el problema que explora este proyecto]" },
      built: { en: "[TODO: what was built]", es: "[TODO: qué se construyó]" },
      result: { en: "[TODO: the result/takeaway]", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "in progress", es: "publicado" },
    why: {
      headline: { en: "[TODO: why this project exists]", es: "[TODO: por qué existe este proyecto]" },
      body: { en: "[TODO: the real problem/motivation]", es: "[TODO: el problema/motivación real]" },
    },
    did: {
      headline: { en: "[TODO: what I did]", es: "[TODO: qué hice]" },
      bullets: { en: ["[TODO: contributions]"], es: ["[TODO: contribuciones]"] },
    },
    how: {
      headline: { en: "[TODO: how it works]", es: "[TODO: cómo funciona]" },
      steps: { en: ["[TODO: build steps]"], es: ["[TODO: pasos de construcción]"] },
    },
    challenges: {
      headline: { en: "[TODO: what broke, and how it got fixed]", es: "[TODO: qué se rompió y cómo se resolvió]" },
      items: [
        {
          problem: { en: "[TODO: a real challenge from this project]", es: "[TODO: un reto real de este proyecto]" },
          fix: { en: "[TODO: how it got solved]", es: "[TODO: cómo se resolvió]" },
        },
      ],
    },
    outcome: {
      headline: { en: "[TODO: outcome headline]", es: "[TODO: titular del resultado]" },
      body: { en: "[TODO: outcome write-up]", es: "[TODO: resumen del resultado]" },
    },
  },

  {
    slug: "a-star-algorithm-pathfinding-in-progress",
    category: "academic",
    featured: false,
    heroImage: "/work/pathfinding-cover.webp",
    tags: ["C++", "A* Algorithm", "Pathfinding", "Game AI"],
    title: { en: "A* Algorithm Pathfinding", es: "Encontrando Caminos con A*" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2026",
    startYear: 2026,
    pitch: { en: "An academic contest for implementing the fastest A* pathfinding algorithm. //Results coming soon", es: "[TODO: una oración de descripción]" },
    tldr: {
      problem: { en: "Implementing a fast A* pathfinding algorithm", es: "[TODO: el problema que explora este proyecto]" },
      built: { en: "Used techniques learned in class & C++ concepts", es: "[TODO: qué se construyó]" },
      result: { en: "Developed and Optimized a ~500ms solution", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "published", es: "publicado" },
    why: {
      headline: { en: "Tasked to create an A* pathfinding algorithm from techniques learned in 'AI in Games' class taught by Steve Rabin. For further inspiration, a contest was held for the 4 fastest pathfinding algorithms", es: "[TODO: por qué existe este proyecto]" },
      body: { en: "Contest still ongoing", es: "[TODO: el problema/motivación real]" },
    },
    did: {
      headline: { en: "[TODO: explain optimization techniques]", es: "[TODO: qué hice]" },
      bullets: { en: ["[TODO: contributions]"], es: ["[TODO: contribuciones]"] },
    },
    how: {
      headline: { en: "[TODO: how it works]", es: "[TODO: cómo funciona]" },
      steps: { en: ["[TODO: build steps]"], es: ["[TODO: pasos de construcción]"] },
    },
    challenges: {
      headline: { en: "[TODO: what broke, and how it got fixed]", es: "[TODO: qué se rompió y cómo se resolvió]" },
      items: [
        {
          problem: { en: "[TODO: a real challenge from this project]", es: "[TODO: un reto real de este proyecto]" },
          fix: { en: "[TODO: how it got solved]", es: "[TODO: cómo se resolvió]" },
        },
      ],
    },
    outcome: {
      headline: { en: "[TODO: outcome headline]", es: "[TODO: titular del resultado]" },
      body: { en: "[TODO: outcome write-up]", es: "[TODO: resumen del resultado]" },
    },
  },

  {
    slug: "urban-mobility",
    category: "academic",
    featured: false,
    heroImage: "/work/urban-mobility-cover.webp",
    tags: ["Behavior Trees", "C++", "Game Development", "Game AI"],
    title: { en: "Urban Mobility", es: "Movilidad Urbana" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2022",
    startYear: 2022,
    pitch: { en: "[TODO: one-sentence pitch]", es: "[TODO: una oración de descripción]" },
    tldr: {
      problem: { en: "[TODO: the problem this project explored]", es: "[TODO: el problema que explora este proyecto]" },
      built: { en: "[TODO: what was built]", es: "[TODO: qué se construyó]" },
      result: { en: "[TODO: the result/takeaway]", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2022", es: "2022" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "published", es: "publicado" },
    why: {
      headline: { en: "[TODO: why this project exists]", es: "[TODO: por qué existe este proyecto]" },
      body: { en: "[TODO: the real problem/motivation]", es: "[TODO: el problema/motivación real]" },
    },
    did: {
      headline: { en: "[TODO: what I did]", es: "[TODO: qué hice]" },
      bullets: { en: ["[TODO: contributions]"], es: ["[TODO: contribuciones]"] },
    },
    how: {
      headline: { en: "[TODO: how it works]", es: "[TODO: cómo funciona]" },
      steps: { en: ["[TODO: build steps]"], es: ["[TODO: pasos de construcción]"] },
    },
    challenges: {
      headline: { en: "[TODO: what broke, and how it got fixed]", es: "[TODO: qué se rompió y cómo se resolvió]" },
      items: [
        {
          problem: { en: "[TODO: a real challenge from this project]", es: "[TODO: un reto real de este proyecto]" },
          fix: { en: "[TODO: how it got solved]", es: "[TODO: cómo se resolvió]" },
        },
      ],
    },
    outcome: {
      headline: { en: "[TODO: outcome headline]", es: "[TODO: titular del resultado]" },
      body: { en: "[TODO: outcome write-up]", es: "[TODO: resumen del resultado]" },
    },
  },

  {
    slug: "nds-cognitive-labs-journal-publication",
    category: "academic",
    featured: false,
    heroImage: "/work/journal-publication-cover.webp",
    tags: ["Behavior Trees", "C++", "Game Development", "Game AI"],
    title: { en: "Journal Publication", es: "Publicación en Revista" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2026",
    startYear: 2022,
    pitch: { en: "[TODO: one-sentence pitch]", es: "[TODO: una oración de descripción]" },
    tldr: {
      problem: { en: "[TODO: the problem this project explored]", es: "[TODO: el problema que explora este proyecto]" },
      built: { en: "[TODO: what was built]", es: "[TODO: qué se construyó]" },
      result: { en: "[TODO: the result/takeaway]", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2022", es: "2022" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "published", es: "publicado" },
    why: {
      headline: { en: "[TODO: why this project exists]", es: "[TODO: por qué existe este proyecto]" },
      body: { en: "[TODO: the real problem/motivation]", es: "[TODO: el problema/motivación real]" },
    },
    did: {
      headline: { en: "[TODO: what I did]", es: "[TODO: qué hice]" },
      bullets: { en: ["[TODO: contributions]"], es: ["[TODO: contribuciones]"] },
    },
    how: {
      headline: { en: "[TODO: how it works]", es: "[TODO: cómo funciona]" },
      steps: { en: ["[TODO: build steps]"], es: ["[TODO: pasos de construcción]"] },
    },
    challenges: {
      headline: { en: "[TODO: what broke, and how it got fixed]", es: "[TODO: qué se rompió y cómo se resolvió]" },
      items: [
        {
          problem: { en: "[TODO: a real challenge from this project]", es: "[TODO: un reto real de este proyecto]" },
          fix: { en: "[TODO: how it got solved]", es: "[TODO: cómo se resolvió]" },
        },
      ],
    },
    outcome: {
      headline: { en: "[TODO: outcome headline]", es: "[TODO: titular del resultado]" },
      body: { en: "[TODO: outcome write-up]", es: "[TODO: resumen del resultado]" },
    },
  },
];
