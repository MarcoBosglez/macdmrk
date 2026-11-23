import type { Localized } from "@/lib/i18n/dictionaries";

// Case-study data for /work and /work/<slug>.
//
// Two halves:
//   1. Identity/listing fields (slug, category, featured, title,
//      kindLabel, years, startYear, tags, links, hero, pitch, tldr,
//      facts). These drive /work's grid, the hub's Featured row and the
//      top of each case study. slug/category/title/kindLabel/years/
//      startYear/tags are required; the rest is optional.
//   2. `sections`: the body of the case study, written however the
//      project needs. As many sections as you want, in any order, each
//      with its own name, and each built from a list of blocks (prose,
//      bullets, a timeline, images, code…). Every section gets a
//      numbered label ("02 · implementation") and an entry in the
//      progress bar at the top.
//
// Spanish copy: anywhere below that takes `Copy`, `es` is optional and
// an empty/missing `es` falls back to `en`, so you can write English
// first and translate later.
//
// Prose formatting (any `text` field, see components/work/rich-text.tsx):
// `\n` starts a paragraph, "- " at the start of a line makes a bullet,
// URLs become links, and ASCII reactions like <3 get coloured.
//
// Turning things off without deleting them: put `hidden: true` on a
// section or on a single block.

export type ProjectCategory = "personal" | "academic" | "professional";

/** One piece of copy; `es` is optional and falls back to `en`. */
export type Copy = { en: string; es?: string };
/** A list per language; an empty/missing `es` falls back to `en`. */
export type CopyList = { en: string[]; es?: string[] };

// An image, treated as part of the explanation: it keeps its own
// aspect ratio (no cropping), opens full size on click, and gets a
// numbered caption ("fig. 02 — <caption>"). Say in the caption what the
// reader should notice. `alt` (screen-reader text) defaults to it.
export type ProjectFigure = {
  src: string;
  caption?: Copy;
  alt?: Copy;
};

// The building blocks of a section. Mix and repeat them freely; they
// render top to bottom in the order you list them.
export type ProjectBlock = { hidden?: boolean } & (
  /** Paragraphs of prose. */
  | { type: "text"; text: Copy }
  /** A bullet list. `style`: "check" ✓ (default), "dot" •, "arrow" →, "number" 01. */
  | { type: "bullets"; items: CopyList; title?: Copy; style?: "check" | "dot" | "arrow" | "number" }
  /** Numbered cards in a grid. Good for phases or a short process. */
  | { type: "steps"; items: CopyList; title?: Copy }
  /** A vertical timeline. `when` is shown as-is ("2020", "Spring 2025"). */
  | { type: "timeline"; items: { when: string; text: Copy }[]; title?: Copy }
  /** Red "before" / green "goal" strip. `goal` can be a list (shows as bullets). */
  | { type: "beforeAfter"; before?: Copy; goal?: Copy | CopyList; beforeLabel?: Copy; goalLabel?: Copy }
  /** Problem → fix pairs. */
  | { type: "challenges"; items: { problem: Copy; fix: Copy }[] }
  /** Big numbers with a small label each. */
  | { type: "stats"; items: { value: string; label: Copy }[] }
  /** A full-width image (see ProjectFigure). */
  | ({ type: "figure" } & ProjectFigure)
  /** A highlighted note. `tone`: "note" (blue, default), "win" (green), "warn" (amber). */
  | { type: "callout"; text: Copy; title?: Copy; tone?: "note" | "win" | "warn" }
  /** A code snippet, shown as-is. `file` is a small label above it, e.g. "src/lib/sound.ts". */
  | { type: "code"; code: string; file?: string; caption?: Copy }
  /** A pulled quote. */
  | { type: "quote"; text: Copy; by?: string }
);

export type ProjectSection = {
  /** Short name: the "02 · <label>" tag and its entry in the progress bar. */
  label: Copy;
  /** Optional big heading under the label. */
  headline?: Copy;
  blocks: ProjectBlock[];
  /**
   * Optional image pinned beside the section's blocks on wide screens
   * (stacks under them on phones). Best for tall/square shots. Use a
   * `figure` block instead for wide screenshots.
   */
  aside?: ProjectFigure & { side?: "left" | "right" };
  /** Draws the section on a panel, e.g. to set an outcome apart. */
  panel?: boolean;
  /** Anchor for links (#id). Defaults to the English label, slugified. */
  id?: string;
  hidden?: boolean;
};

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

  // Facts row under the hero.
  role?: Localized;
  timeline?: Localized;
  team?: Localized;
  status?: Localized;

  /** The case study itself, top to bottom. See ProjectSection above. */
  sections?: ProjectSection[];
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
    pitch: { en: "An interactive web-portfolio and personal hub made with Next.js", es: "" },
    role: { en: "designer, developer", es: "diseñador + desarrollador" },
    timeline: { en: "2020 - now", es: "" },
    team: { en: "solo", es: "solo" },
    status: { en: "shipped, iterating", es: "" },
    sections: [
      {
        label: { en: "Needs (Why)", es: "" },
        headline: { en: "Looking for a Personal Hub" },
        blocks: [
          {
            type: "text",
            text: {
              en: "I started my web portfolio in 2020 for an academic project while I was doing my undergrad in Mexico City. \nFor a while I have been looking for a way to express myself as a software engineer and hobbyist digital artist. My career is in tech but I've always appreciated and had love for art.\nAt the same time it seemed like a good opportunity to learn more about web development & design, while also having something that recruiters/employers could look at to get a better idea of who I am and what I do.",
            },
          },
          {
            type: "beforeAfter",
            goal: {
              en: [
                "Reflect my personality into design/content",
                "Practice web development skills",
                "Creating useful content for recruiters",
                "Have fun!",
              ],
            },
          },
          {
            type: "figure",
            src: "/work/web-portfolio-why.jpg",
            caption: { en: "The 2020 version: one static page, basically a résumé with a photo." },
          },
        ],
      },
      {
        label: { en: "Idea" },
        headline: { en: "Initial Design & Project Inspiration" },
        blocks: [
          {
            type: "text",
            text: {
              en: "It started off as a simple academic project in 2020 with a static HTML/CSS website with a simple and design which content was a direct copy of my résumé but kept it in mind for a future project I wanted to keep iterating. During 2020-2024, I explored various online designs as ideas to redesign the website with a modern look. \nA big inspiration for retaking the project after a big gap of time was after watching a YouTube video by user [@Shar](https://www.youtube.com/watch?v=_tWh4cYCTv0) on her own portfolio's design. It went into detail about the process of building her own website (planning, inspirations, mood boards, mock-ups, programming, design & accessability, and deploying). I recognized this process as it was similar to the UX pipeline process of real tech companies (with extra documentation steps) from talking with teammates of previous work experiences. With her design I especially liked her presentation-card layout, as it had a professional look while still reflecting her personality, interests & general vibe.",
            },
          },
          {
            type: "figure",
            src: "/work/web-portfolio-did.png",
            caption: { en: "The design canvas: every section went through several explorations before any code." },
          },
        ],
      },
      {
        label: { en: "Process (How)" },
        headline: { en: "Project Timeline" },
        blocks: [
          {
            type: "text",
            text: {
              en: "I started working on the project after my last work experience at Capgemini (mid 2025) as I had time available. For this project I wanted to document the whole thing, from my mock-up ideas, colors to programming & deploying the app."
            }
          },
           {
            type: "text",
            text: {
              en: "**1. Mood Board**\n - I started off building a mood board of what I wanted the website to feel like and I had a list of ideas that the portfolio must include (5 sections, color modes, draggable windows, custom sounds, bilingual copy, a glass-card look, etc)."
            }
          },
          {
            type: "figure",
            src: "/work/web-portfolio-how.png",
            caption: {
              en: "Where it landed: the current hub, with the presentation card, Pingu chat, and featured work.",
            },
          },
          {
            type: "text",
            text: {
              en: "**2. Mock-ups**\n - As a hobbyist digital artist the look & feel I was looking for depended on me to build the design from. I went for a modern, terminal-like, glass panel look with dark green colors. Working alongside Claude Design for further inspiration on specific components and for easier non-manual measuring of distances, icons, etc. \n - After picking the colors and design inspiration from my moodboard, I listed the tasks in a JIRA board needed to complete the initial stages of the website (ToDo, InProgress, Done)"
            }
          },
          {
            type: "text",
            text: {
              en: "**3. Programming**\n - During the planning stages, I decided con the tech stack for this project which included: React, Next.js.\n - I already had experience with React which made the move easy. Although it may have been overkill to use, I aimed to practice my React skills and it served as inspiration to learn more of it\n - This process was already heavy enough before with me liking other ideas and breaking the already decided design of stuff, for easier of use I got help from Claude code for repetitive tasks and hard-to-find fixes in case any bugs or sizing errors appeared during development. \n - As an artist I know the reputation AI has with generative art and as a programmer I know the cons of vibe coding. So, I made it a task in itself to draw and design every artistic part myself, and learn from all the code Claude writes and learn as much as possible. if I use it, I must use it with a brain and not be lazy."
            }
          },
           {
            type: "text",
            text: {
              en: "**4. Deploying**\n - I decided to deploy my project using Vercel, as it is allowed me to connect and link it with my Github Project and it was an easy platform to ship apps and monitor it."
            }
          },
          {
            type: "steps",
            items: {
              en: [
                "Mood board",
                "Programming",
                "Deploying"
              ],
            },
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: {
          en: "A site that works as a presentation card with fast links, a project archive, an illustrations showcase, and a personal hub",
        },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "I will be adding more content as time goes. Currently thinking of adding more fun features and color themes!",
              es: ".",
            },
          },
          {
            type: "stats",
            items: [
              { value: "2", label: { en: "languages, fully parallel", es: "idiomas, en paralelo" } },
              { value: "solo", label: { en: "design + build", es: "diseño + construcción" } },
            ],
          },
        ],
      },
    ],
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
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "Release campaigns needed pixel-perfect promo banners fast, and redoing them from scratch every time didn't scale.",
          es: "Las campañas de lanzamiento necesitaban banners promocionales al pixel y con rapidez, y rehacerlos desde cero cada vez no escalaba.",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Release campaigns needed pixel-perfect promo banners fast, and regenerating them by hand for every release didn't scale.",
              es: "Las campañas de lanzamiento necesitaban banners promocionales al pixel y con rapidez, y regenerarlos a mano en cada lanzamiento no escalaba.",
            },
          },
          {
            type: "beforeAfter",
            before: {
              en: "one-off banners, redone from scratch each time",
              es: "banners aislados, rehechos desde cero cada vez",
            },
            goal: {
              en: "reusable promo assets for the label",
              es: "assets promocionales reutilizables para el sello",
            },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "I owned the banner design end to end, from campaign brief to final assets.",
          es: "Estuve a cargo del diseño del banner de punta a punta, desde el brief de campaña hasta los assets finales.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
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
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "Hand-written HTML/CSS templates, parameterized by a small JS script.",
          es: "Plantillas en HTML/CSS a mano, parametrizadas con un pequeño script en JS.",
        },
        blocks: [
          {
            type: "steps",
            items: {
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
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "What broke, and how I fixed it.", es: "Qué se rompió, y cómo lo resolví." },
        blocks: [
          {
            type: "challenges",
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
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: {
          en: "Reusable promo assets for the label.",
          es: "Assets promocionales reutilizables para el sello.",
        },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "Reusable promo assets for the label — future releases could be regenerated without a redesign.",
              es: "Assets promocionales reutilizables para el sello — los lanzamientos futuros podían regenerarse sin rediseñar.",
            },
          },
          {
            type: "stats",
            items: [{ value: "[TODO]", label: { en: "campaigns shipped", es: "campañas lanzadas" } }],
          },
        ],
      },
    ],
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
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "Call-center interactions weren't captured anywhere auditable, which made training and performance review guesswork.",
          es: "Las interacciones del call center no quedaban registradas en ningún lugar auditable, lo que hacía que la capacitación y la evaluación de desempeño fueran una conjetura.",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Call-center interactions between agents and customers weren't being captured anywhere auditable, which made training and performance review guesswork.",
              es: "Las interacciones del call center entre agentes y clientes no quedaban registradas en ningún lugar auditable, lo que hacía que la capacitación y la evaluación de desempeño fueran una conjetura.",
            },
          },
          {
            type: "beforeAfter",
            before: { en: "no searchable call history", es: "sin historial de llamadas consultable" },
            goal: {
              en: "auditable call history for the business",
              es: "historial de llamadas auditable para el negocio",
            },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "I led the front-end team and made the final calls on architecture and deployment.",
          es: "Lideré al equipo de front-end y tomé las decisiones finales de arquitectura y despliegue.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
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
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "Amazon Connect streams call events into a Spring service, which the React console searches and plays back.",
          es: "Amazon Connect transmite eventos de llamada a un servicio en Spring, que la consola en React busca y reproduce.",
        },
        blocks: [
          {
            type: "steps",
            items: {
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
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "What broke, and how I fixed it.", es: "Qué se rompió, y cómo lo resolví." },
        blocks: [
          {
            type: "challenges",
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
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: {
          en: "Auditable call history for the business.",
          es: "Historial de llamadas auditable para el negocio.",
        },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "Auditable call history for the business — a searchable console the team could actually use for training and review.",
              es: "Historial de llamadas auditable para el negocio — una consola consultable que el equipo realmente pudo usar para capacitación y revisión.",
            },
          },
          {
            type: "stats",
            items: [
              { value: "4", label: { en: "person team led", es: "personas en el equipo liderado" } },
              { value: "[TODO]", label: { en: "calls indexed", es: "llamadas indexadas" } },
            ],
          },
        ],
      },
    ],
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
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "Negative-sentiment models for mental-health text are often evaluated on data that doesn't reflect how people actually phrase distress on social media.",
          es: "Los modelos de sentimiento negativo para texto de salud mental suelen evaluarse con datos que no reflejan cómo la gente expresa realmente el malestar en redes sociales.",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Negative-sentiment models for mental-health text are often evaluated on data that doesn't reflect how people actually phrase distress on social media.",
              es: "Los modelos de sentimiento negativo para texto de salud mental suelen evaluarse con datos que no reflejan cómo la gente expresa realmente el malestar en redes sociales.",
            },
          },
          {
            type: "beforeAfter",
            before: {
              en: "no hand-verified accuracy baseline",
              es: "sin una línea base de precisión verificada a mano",
            },
            goal: { en: "published NLP accuracy study", es: "estudio de precisión de PLN publicado" },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "I hand-labeled the full dataset and designed the accuracy evaluation myself.",
          es: "Etiqueté a mano todo el dataset y diseñé yo mismo la evaluación de precisión.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
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
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "A hand-labeled tweet set feeds an NLTK classification pipeline, scored against the labels.",
          es: "Un conjunto de tuits etiquetados a mano alimenta un pipeline de clasificación NLTK, evaluado contra las etiquetas.",
        },
        blocks: [
          {
            type: "steps",
            items: {
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
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "What broke, and how I fixed it.", es: "Qué se rompió, y cómo lo resolví." },
        blocks: [
          {
            type: "challenges",
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
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "A published NLP accuracy study.", es: "Un estudio de precisión de PLN publicado." },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "A published NLP accuracy study on mental-health sentiment classification.",
              es: "Un estudio de precisión de PLN publicado sobre clasificación de sentimiento en salud mental.",
            },
          },
          {
            type: "stats",
            items: [
              { value: "625", label: { en: "tweets hand-labeled", es: "tuits etiquetados a mano" } },
              { value: "[TODO]%", label: { en: "model accuracy", es: "precisión del modelo" } },
            ],
          },
        ],
      },
    ],
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
      problem: {
        en: "Create NPC AI behavior using techniques learned from a master's level class",
        es: "[TODO: el problema que explora este proyecto]",
      },
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
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "In Digipen's MSCS Program during my first semester's class 'AI In Games' taught by Steve Rabin, I was tasked to create a 3D game simulation of techniques learned in class to create NPC behavior that would reflect behavior in videogames",
          es: "[TODO: por qué existe este proyecto]",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Added onto the project a contest where everyone in the class voted for the 4 most 'fun' games. Winners got extra credits as a reward.",
              es: "[TODO: el problema/motivación real]",
            },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "Using a custom engine made for the purpose of this class, I worked in the development of this simulation inspired by the old 'Rock `Em Sock `Em' toy game of 90's.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
              en: [
                "Designed multiple behavior trees",
                "Coded game logic as well as blackboard behavior for NPC interactions",
                "Worked on the NPC models in Blender",
                "One of the contest winners",
              ],
            },
          },
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "In the middle of the ring, two boxer NPCs fight while reacting to their oponent's moving, blocking, health indicators for the purpose of 'Rocking' and knocking their opponent out",
          es: "[TODO: cómo funciona la simulación]",
        },
        blocks: [
          {
            type: "steps",
            items: {
              en: [
                "Used a blackboard for boxer's blocking & health interactions",
                "Each boxer has a crowd, both of them doing a wave movement using templates",
                "Lights & 'knock-out birds' also use templates in various formations",
              ],
              es: ["[TODO: pasos de construcción]"],
            },
          },
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: {
          en: "The most difficult parts of the project were the formations and working with a new custom engine",
          es: "[TODO: qué se rompió y cómo se resolvió]",
        },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: { en: "New topics", es: "[TODO: un reto real de este proyecto]" },
                fix: { en: "Worked enough", es: "[TODO: cómo se resolvió]" },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: {
          en: "The simulation was presented in front of the whole class and my simulation 'Rock `Em' was voted within the top best projects and won the contest's extra credit price.",
          es: "[TODO: titular del resultado]",
        },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "It was a fun academic project that taught me how to use new game AI techniques with fun concepts and industry best practices",
              es: "[TODO: resumen del resultado]",
            },
          },
        ],
      },
    ],
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
    pitch: {
      en: "An on-going academic project that takes a 100K Steam Games from HuggingFace.co data set to answer the following question: 'Do people care enough about game support?'",
      es: "[TODO: una oración de descripción]",
    },
    tldr: {
      problem: { en: "As a", es: "[TODO: el problema que explora este proyecto]" },
      built: { en: "[TODO: what was built]", es: "[TODO: qué se construyó]" },
      result: { en: "[TODO: the result/takeaway]", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "4-man team", es: "en solitario" },
    status: { en: "in progress", es: "publicado" },
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "As a part of the 'Data Analysis' class within Digipen's MSCS Program, in a team of 4 people, we were tasked to look for a dataset with a minimum of 100K entries and look to answer questions using Data Analysis techniques learned from class",
          es: "[TODO: por qué existe este proyecto]",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "The motivation for finding the dataset was a shared group interest in videogames",
              es: "[TODO: el problema/motivación real]",
            },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "Using Python's Jupyter Notebook and the Polars library for Data Science, we looked through 100K videogames to answer multiple questions. One of them was: 'Does broader game support (languages, platform, modding) lead to better reviews?'",
          es: "[TODO: qué hice]",
        },
        blocks: [
          {
            type: "bullets",
            items: {
              en: [
                "The main idea was to pull reviews from the big game catalogue and look for interest in game support as a method for game Developers to see if users care enough about game support to include it in their own games",
                "More than 194K reviews were pulled from Steam's public API",
              ],
              es: ["[TODO: contribuciones]"],
            },
          },
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: { en: "Multiple milestone project", es: "[TODO: cómo funciona]" },
        blocks: [
          {
            type: "steps",
            items: {
              en: [
                "Collecting 100K data",
                "Cleaning data",
                "Create multiple valuable features",
                "Analyze groups, models, sentiment analysis",
              ],
              es: ["[TODO: pasos de construcción]"],
            },
          },
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: {
          en: "Players do care about game support but do not write reviews about it",
          es: "[TODO: qué se rompió y cómo se resolvió]",
        },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "Users do not leave reviews about game support",
                  es: "[TODO: un reto real de este proyecto]",
                },
                fix: {
                  en: "Used reach as a measurement for games reaching 10+ reviews and measured it against all support levels",
                  es: "[TODO: cómo se resolvió]",
                },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "Still an ongoing project. Currently in Milestone 2/3", es: "[TODO: titular del resultado]" },
        panel: true,
        blocks: [
          {
            type: "text",
            text: { en: "Will update the outcome with more findings", es: "[TODO: resumen del resultado]" },
          },
        ],
      },
    ],
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
    pitch: {
      en: "An on-going academic project that takes data from UFC MMA contests and predicts the outcome of fights based on previous fight data",
      es: "[TODO: una oración de descripción]",
    },
    tldr: {
      problem: { en: "[TODO: the problem this project explored]", es: "[TODO: el problema que explora este proyecto]" },
      built: { en: "[TODO: what was built]", es: "[TODO: qué se construyó]" },
      result: { en: "[TODO: the result/takeaway]", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "in progress", es: "publicado" },
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: { en: "[TODO: why this project exists]", es: "[TODO: por qué existe este proyecto]" },
        blocks: [
          {
            type: "text",
            text: { en: "[TODO: the real problem/motivation]", es: "[TODO: el problema/motivación real]" },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: { en: "[TODO: what I did]", es: "[TODO: qué hice]" },
        blocks: [{ type: "bullets", items: { en: ["[TODO: contributions]"], es: ["[TODO: contribuciones]"] } }],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: { en: "[TODO: how it works]", es: "[TODO: cómo funciona]" },
        blocks: [{ type: "steps", items: { en: ["[TODO: build steps]"], es: ["[TODO: pasos de construcción]"] } }],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "[TODO: what broke, and how it got fixed]", es: "[TODO: qué se rompió y cómo se resolvió]" },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "[TODO: a real challenge from this project]",
                  es: "[TODO: un reto real de este proyecto]",
                },
                fix: { en: "[TODO: how it got solved]", es: "[TODO: cómo se resolvió]" },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "[TODO: outcome headline]", es: "[TODO: titular del resultado]" },
        panel: true,
        blocks: [{ type: "text", text: { en: "[TODO: outcome write-up]", es: "[TODO: resumen del resultado]" } }],
      },
    ],
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
    pitch: {
      en: "An academic contest for implementing the fastest A* pathfinding algorithm. //Results coming soon",
      es: "[TODO: una oración de descripción]",
    },
    tldr: {
      problem: {
        en: "Implementing a fast A* pathfinding algorithm",
        es: "[TODO: el problema que explora este proyecto]",
      },
      built: { en: "Used techniques learned in class & C++ concepts", es: "[TODO: qué se construyó]" },
      result: { en: "Developed and Optimized a ~500ms solution", es: "[TODO: el resultado]" },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "published", es: "publicado" },
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "Tasked to create an A* pathfinding algorithm from techniques learned in 'AI in Games' class taught by Steve Rabin. For further inspiration, a contest was held for the 4 fastest pathfinding algorithms",
          es: "[TODO: por qué existe este proyecto]",
        },
        blocks: [{ type: "text", text: { en: "Contest still ongoing", es: "[TODO: el problema/motivación real]" } }],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: { en: "[TODO: explain optimization techniques]", es: "[TODO: qué hice]" },
        blocks: [{ type: "bullets", items: { en: ["[TODO: contributions]"], es: ["[TODO: contribuciones]"] } }],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: { en: "[TODO: how it works]", es: "[TODO: cómo funciona]" },
        blocks: [{ type: "steps", items: { en: ["[TODO: build steps]"], es: ["[TODO: pasos de construcción]"] } }],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "[TODO: what broke, and how it got fixed]", es: "[TODO: qué se rompió y cómo se resolvió]" },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "[TODO: a real challenge from this project]",
                  es: "[TODO: un reto real de este proyecto]",
                },
                fix: { en: "[TODO: how it got solved]", es: "[TODO: cómo se resolvió]" },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "[TODO: outcome headline]", es: "[TODO: titular del resultado]" },
        panel: true,
        blocks: [{ type: "text", text: { en: "[TODO: outcome write-up]", es: "[TODO: resumen del resultado]" } }],
      },
    ],
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
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: { en: "[TODO: why this project exists]", es: "[TODO: por qué existe este proyecto]" },
        blocks: [
          {
            type: "text",
            text: { en: "[TODO: the real problem/motivation]", es: "[TODO: el problema/motivación real]" },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: { en: "[TODO: what I did]", es: "[TODO: qué hice]" },
        blocks: [{ type: "bullets", items: { en: ["[TODO: contributions]"], es: ["[TODO: contribuciones]"] } }],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: { en: "[TODO: how it works]", es: "[TODO: cómo funciona]" },
        blocks: [{ type: "steps", items: { en: ["[TODO: build steps]"], es: ["[TODO: pasos de construcción]"] } }],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "[TODO: what broke, and how it got fixed]", es: "[TODO: qué se rompió y cómo se resolvió]" },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "[TODO: a real challenge from this project]",
                  es: "[TODO: un reto real de este proyecto]",
                },
                fix: { en: "[TODO: how it got solved]", es: "[TODO: cómo se resolvió]" },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "[TODO: outcome headline]", es: "[TODO: titular del resultado]" },
        panel: true,
        blocks: [{ type: "text", text: { en: "[TODO: outcome write-up]", es: "[TODO: resumen del resultado]" } }],
      },
    ],
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
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: { en: "[TODO: why this project exists]", es: "[TODO: por qué existe este proyecto]" },
        blocks: [
          {
            type: "text",
            text: { en: "[TODO: the real problem/motivation]", es: "[TODO: el problema/motivación real]" },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: { en: "[TODO: what I did]", es: "[TODO: qué hice]" },
        blocks: [{ type: "bullets", items: { en: ["[TODO: contributions]"], es: ["[TODO: contribuciones]"] } }],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: { en: "[TODO: how it works]", es: "[TODO: cómo funciona]" },
        blocks: [{ type: "steps", items: { en: ["[TODO: build steps]"], es: ["[TODO: pasos de construcción]"] } }],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "[TODO: what broke, and how it got fixed]", es: "[TODO: qué se rompió y cómo se resolvió]" },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "[TODO: a real challenge from this project]",
                  es: "[TODO: un reto real de este proyecto]",
                },
                fix: { en: "[TODO: how it got solved]", es: "[TODO: cómo se resolvió]" },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "[TODO: outcome headline]", es: "[TODO: titular del resultado]" },
        panel: true,
        blocks: [{ type: "text", text: { en: "[TODO: outcome write-up]", es: "[TODO: resumen del resultado]" } }],
      },
    ],
  },
];
