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
        headline: { en: "Building a Personal Hub" },
        blocks: [
          {
            type: "text",
            text: {
              en: "I first built my web portfolio in 2020 as an academic project during my undergrad in Mexico City. \nFor a while I've been looking for a way to express myself as a software engineer and digital artist. While my career is in tech, visual art has always been a core part of how I think and create things.\nRedesigning it gave me a hands-on way to sharpen my frontend and UI/UX skills while giving recruiters and engineering teams a clearer sense of my background, craft, and personality beyond a standard CV.",
            },
          },
          {
            type: "beforeAfter",
            goal: {
              en: [
                "Translate my personality into design/content",
                "Practice modern web development skills",
                "Provide meaningful content for recruiters",
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
        headline: { en: "Early Concepts & Inspiration" },
        blocks: [
          {
            type: "text",
            text: {
              en: "It started off as a basic static HTML/CSS site which content was a direct copy of my resume at the time. This project stayed in the back of my mind for a few years with ideas to iterate on. Between 2020-2024, I explored various visual references any layout ideas for a modern overhaul. \nThe biggest inspiration for picking it back up was watching a video breakdown user [@Shar](https://www.youtube.com/watch?v=_tWh4cYCTv0) on her designing her own portfolio. It went into detail about her end-to-end process of planning, building & deploying it. The explanation felt closely aligned with product and UX workflows I had seen on engineering teams (with less documentation). I especially liked her presentation-card layout, as it had a professional look while still reflecting her personality/vibe.",
            },
          },
          {
            type: "figure",
            src: "/work/web-portfolio-did.png",
            caption: { en: "Design exploration: every section went through several explorations before any code." },
          },
        ],
      },
      {
        label: { en: "Process (How)" },
        headline: { en: "Execution & Timeline" },
        blocks: [
          {
            type: "text",
            text: {
              en: "I picked the project back up after wrapping up my role at Capgemini (mid-2025) when I had time available. This time, I treated documentation and mock-ups to track the journey of the visual direction."
            }
          },
           {
            type: "text",
            text: {
              en: "**1. Mood Board & Feature Scope**\n - Started by building a mood board of visual references to define a concrete look. Also built a list of ideas that the portfolio must include (5 sections, theme/color modes, draggable windows, custom sound effects, bilingual copy, a glass-card look, etc)."
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
              en: "**2. Wireframes, Mock-ups & Task Tracking**\n - Because the visual identity leaned heavily into my background as a hobbyist digital artist, I managed the core aesthetic myself. I went for a modern, terminal-like, glass panel look with dark-green colors. I used Claude Design to brainstore component/button variations, spacing, and sizing. \n - Once I picked the correct palette and layout, I listed the tasks on a JIRA board (ToDo, InProgress, Done) to keep scope moving."
            }
          },
          {
            type: "text",
            text: {
              en: "**3. Programming & Implementation**\n - I chose **React** and **Next.js** for the tech stack.\n - I already had prior experience with React which made getting started feel smooth. It also gave me a great excuse to practice modern React patterns & App Router logic.\n - Mid-building UI tweaks and new design ideas made iteration demanding at times, so I used Claude Code to handle repetitive tasks and track sizing bugs. or sizing errors appeared during development. \n - As an artist I'm very aware of the reputation around Generative AI in art, and as a programmer I know the bad practices that come with vibe coding. \nSo, every piece of artwork and visual design was crafted by me and AI codding assistance was used as a learning tool. If I use AI, I must use it with a brain and not be lazy."
            }
          },
           {
            type: "text",
            text: {
              en: "**4. CI/CD & Deployment**\n - Deployed on **Vercel** connected directly into my GitHub repository, as it allows me automatic preview/production deployments. It is easy runtime monitoring and fast hosting."
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
          en: "A multifunctional personal hub!",
        },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "I will continue adding more content and fun ideas as I keep iterating on it!",
              es: "",
            },
          },
          {
            type: "stats",
            items: [
              { value: "2", label: { en: "Languages (EN / ES)", es: "" } },
              { value: "100%", label: { en: "Solo Design & Development", es: "" } },
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
    title: { en: "Spotify Banner for ONErpm", es: "" },
    kindLabel: { en: "Banner Design", es: "" },
    url: "https://github.com/MarcoBosglez/banner-interactivo",
    demoUrl: "https://marcobosglez.github.io/banner-interactivo/",
    years: "2025",
    startYear: 2025,
    pitch: {
      en: "High-visibility Spotify promotional banners for music distribution campaigns, with repeatable release assets.",
      es: "",
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
          es: "",
        },
        blocks: [
          {
            type: "steps",
            items: {
              en: [
                "Layout conversations with client",
                "Final banner tweaks and iterations",
              ],
              es: [
                "",
                "",
              ],
            },
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
      en: "A full-stack Amazon Connect extension for capturing call-center interactions to support auditing, coaching, and performance reviews.",
      es: "Una extensión full-stack para Amazon Connect para registrar interacciones de call center y apoyar auditoría, capacitación y revisión de desempeño.",
    },
    tldr: {
      problem: {
        en: "Agent-customer call-center interactions lacked a searchable, auditable record, making quality review and agent coaching guesswork.",
        es: "Las interacciones entre agentes y clientes en el call center no tenían un historial consultable ni auditable, haciendo que la capacitación y revisión fueran a ciegas.",
      },
      built: {
        en: "A Spring and Docker recording service integrated with Amazon Connect alongside a React review console—with me leading the front-end team.",
        es: "Un servicio de grabación en Spring y Docker integrado con Amazon Connect junto a una consola de revisión en React, liderando el equipo de front-end.",
      },
      result: {
        en: "A searchable call-review console and auditable interaction history that teams could use for training and evaluation.",
        es: "Una consola consultable de revisión de llamadas e historial auditable usable para capacitación y evaluación.",
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
          en: "Without an auditable record of call-center interactions, coaching and performance reviews relied on guesswork.",
          es: "Sin un registro auditable de las interacciones del call center, la capacitación y la evaluación de desempeño dependían de conjeturas.",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Call-center interactions between agents and customers weren't captured in a searchable, auditable way, making training and review harder than they needed to be.",
              es: "Las interacciones entre agentes y clientes del call center no se guardaban de forma consultable ni auditable, complicando la capacitación y el seguimiento.",
            },
          },
          {
            type: "beforeAfter",
            before: { en: "no searchable call history", es: "sin historial de llamadas consultable" },
            goal: {
              en: "auditable call history for review and coaching",
              es: "historial de llamadas auditable para revisión y capacitación",
            },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "I led the front-end team and helped guide key architecture and containerized deployment decisions.",
          es: "Lideré al equipo de front-end y participé en decisiones clave de arquitectura y despliegue con Docker.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
              en: [
                "Led the front-end sub-team—breaking down tasks, unblocking teammates, and running regular progress check-ins",
                "Reviewed pull requests to keep React components, UI patterns, and code quality consistent across contributors",
                "Coordinated front-end architecture and Docker-based deployment workflows with the team",
              ],
              es: [
                "Lideré al equipo de front-end: dividí tareas, destrabé bloqueos y revisé el avance de forma constante",
                "Revisé pull requests para mantener consistencia en componentes React, UI y calidad de código",
                "Coordiné decisiones de arquitectura front-end y el despliegue basado en Docker con el equipo",
              ],
            },
          },
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "Amazon Connect call events feed a Spring backend service while a React console handles search and playback.",
          es: "Los eventos de llamada de Amazon Connect alimentan un servicio en Spring mientras una consola en React gestiona búsqueda y reproducción.",
        },
        blocks: [
          {
            type: "steps",
            items: {
              en: [
                "Scoped the end-to-end flow across Amazon Connect events, the Spring service, and the React console",
                "Split front-end features across team members and integrated them against backend endpoints",
                "Packaged and shipped the application for call search, review, and auditing",
              ],
              es: [
                "Definimos el flujo completo entre eventos de Amazon Connect, el servicio en Spring y la consola en React",
                "Repartimos módulos del front-end entre el equipo y los integramos con los endpoints del backend",
                "Empaquetamos y lanzamos la aplicación para búsqueda, revisión y auditoría de llamadas",
              ],
            },
          },
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "Stepping into a lead role while still shipping code.", es: "Asumir un rol de liderazgo mientras seguía programando." },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "Balancing hands-on implementation with team coordination, code reviews, and keeping everyone aligned for the first time as a lead.",
                  es: "Equilibrar el desarrollo hands-on con coordinación de equipo, code reviews y alineación general por primera vez como líder.",
                },
                fix: {
                  en: "Used clear task splits, regular check-ins, and early PR reviews to catch integration mismatches before crunch time. [TODO: add one specific blocker you resolved]",
                  es: "Usé repartos claros de tareas, check-ins frecuentes y revisiones tempranas de PRs para detectar desajustes a tiempo. [TODO: agrega un bloqueo específico que resolviste]",
                },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: {
          en: "A searchable call-review console and auditable history ready for training and evaluation.",
          es: "Una consola consultable e historial auditable listos para capacitación y evaluación.",
        },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "Delivered a working React console backed by Spring and Docker around Amazon Connect so call records could be searched and reviewed reliably.",
              es: "Entregamos una consola funcional en React respaldada por Spring y Docker sobre Amazon Connect para buscar y revisar registros de llamadas.",
            },
          },
          {
            type: "stats",
            items: [
              { value: "4", label: { en: "person team led", es: "personas en el equipo" } },
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
      en: "An NLP study on mental-health tweets using multiclass and multi-label classification across 625 hand-labeled posts to evaluate negative-sentiment detection.",
      es: "Un estudio de PLN sobre tuits de salud mental con clasificación multiclase y multietiqueta en 625 publicaciones etiquetadas a mano para evaluar detección de sentimiento negativo.",
    },
    tldr: {
      problem: {
        en: "Sentiment models on mental-health text often lack ground-truth labels that capture real social-media phrasing around distress.",
        es: "Los modelos de sentimiento en salud mental suelen carecer de etiquetas verificadas que reflejen cómo se expresa el malestar en redes sociales.",
      },
      built: {
        en: "A hand-labeled dataset of 625 tweets and a Python/NLTK classification workflow evaluated and published as an academic paper.",
        es: "Un dataset de 625 tuits etiquetados a mano y un flujo de clasificación en Python/NLTK evaluado y publicado en artículo académico.",
      },
      result: {
        en: "A published NLP study measuring classification behavior on hand-labeled mental-health tweets.",
        es: "Un estudio de PLN publicado que mide el comportamiento de clasificación en tuits de salud mental etiquetados a mano.",
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
          en: "Evaluating negative sentiment in mental-health text requires ground truth that reflects how people actually write online.",
          es: "Evaluar sentimiento negativo en salud mental exige etiquetas base que reflejen cómo escribe realmente la gente en línea.",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Social media language around mental health is nuanced and informal, so I wanted a carefully labeled set of tweets and a clear evaluation pipeline rather than relying on unverified assumptions.",
              es: "El lenguaje en redes alrededor de la salud mental es informal y con matices, por lo que busqué un conjunto etiquetado con cuidado y una evaluación clara en lugar de suposiciones sin validar.",
            },
          },
          {
            type: "beforeAfter",
            before: {
              en: "no hand-verified label baseline for the tweet set",
              es: "sin base de etiquetas verificadas a mano para los tuits",
            },
            goal: { en: "published NLP classification study", es: "estudio de clasificación de PLN publicado" },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "I manually labeled all 625 tweets, built the Python/NLTK pipeline, and wrote up the evaluation.",
          es: "Etiqueté a mano los 625 tuits, construí el pipeline en Python/NLTK y redacté la evaluación.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
              en: [
                "Hand-labeled 625 tweets across multiclass and multi-label categories",
                "Implemented text preprocessing and classification experiments in Python using NLTK",
                "Evaluated model accuracy and documented the methodology and findings for publication",
              ],
              es: [
                "Etiqueté a mano 625 tuits en categorías multiclase y multietiqueta",
                "Implementé preprocesamiento de texto y experimentos de clasificación en Python con NLTK",
                "Medí la precisión del modelo y documenté metodología y resultados para publicación",
              ],
            },
          },
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "Manual tweet annotation feeds a Python/NLTK classification pipeline scored against ground-truth labels.",
          es: "La anotación manual de tuits alimenta un pipeline de clasificación en Python/NLTK evaluado contra las etiquetas base.",
        },
        blocks: [
          {
            type: "steps",
            items: {
              en: [
                "Defined label criteria and manually annotated 625 tweets",
                "Processed text and ran multiclass / multi-label classification in Python with NLTK",
                "Measured accuracy and analyzed error patterns for the paper",
              ],
              es: [
                "Definí criterios de etiquetas y anoté manualmente 625 tuits",
                "Procesé el texto y ejecuté clasificación multiclase / multietiqueta en Python con NLTK",
                "Medí la precisión y analicé patrones de error para el artículo",
              ],
            },
          },
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: { en: "Staying consistent across 625 manual labels on my own.", es: "Mantener consistencia en 625 etiquetas manuales en solitario." },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "Labeling 625 tweets solo without drifting on subtle wording or overlapping categories.",
                  es: "Etiquetar 625 tuits en solitario sin perder criterio en matices o categorías cercanas.",
                },
                fix: {
                  en: "Applied consistent labeling rules and reviewed edge cases carefully during annotation. [TODO: add one specific detail on criteria or model errors]",
                  es: "Apliqué reglas consistentes de etiquetado y revisé casos ambiguos durante la anotación. [TODO: agrega un detalle concreto de criterios o errores del modelo]",
                },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "A published NLP study on mental-health tweet classification.", es: "Un estudio de PLN publicado sobre clasificación de tuits de salud mental." },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "Completed the labeling, Python/NLTK classification workflow, and write-up resulting in a published paper.",
              es: "Completé el etiquetado, el flujo de clasificación en Python/NLTK y la redacción que derivó en un artículo publicado.",
            },
          },
          {
            type: "stats",
            items: [
              { value: "625", label: { en: "tweets hand-labeled", es: "tuits etiquetados a mano" } },
              { value: "87%", label: { en: "model accuracy", es: "precisión del modelo" } },
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
      en: "A C++ Game AI boxing simulation inspired by Rock 'Em Sock 'Em, built with behavior trees, blackboards, and template-driven crowd and ring details.",
      es: "Una simulación de IA de juego de boxeo en C++ inspirada en Rock 'Em Sock 'Em, construida con behavior trees, blackboards y detalles basados en templates.",
    },
    tldr: {
      problem: {
        en: "Apply game AI techniques in C++ to build responsive NPC combat behavior inside a custom course engine.",
        es: "Aplicar técnicas de IA de videojuegos en C++ para lograr comportamiento reactivo en NPCs dentro de un motor del curso.",
      },
      built: {
        en: "A 3D boxing simulation in C++ using behavior trees, a shared blackboard for state/health/blocking reactions, Blender NPC models, and templated props/crowds.",
        es: "Una simulación 3D de boxeo en C++ con behavior trees, blackboard para reacciones de bloqueo/vida, modelos de NPCs en Blender y elementos con templates.",
      },
      result: {
        en: "Voted among the top 'most fun' projects in class and awarded extra credit.",
        es: "Votado entre los proyectos más divertidos de la clase y ganador de crédito extra.",
      },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "published", es: "publicado" },
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "Built for DigiPen's MSCS 'AI in Games' course (taught by Steve Rabin) to put game AI concepts into practice.",
          es: "Creado para el curso 'AI in Games' de la maestría MSCS en DigiPen (impartido por Steve Rabin) para aplicar técnicas de IA en videojuegos.",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "The assignment asked for a 3D simulation demonstrating game AI techniques, with a class vote for the top four 'most fun' entries earning extra credit.",
              es: "El proyecto pedía una simulación 3D con técnicas de IA de videojuegos, con una votación en clase para los cuatro juegos más divertidos con premio de crédito extra.",
            },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "Built a Rock 'Em Sock 'Em-inspired boxing simulation in C++ on a custom course engine.",
          es: "Desarrollé una simulación de boxeo inspirada en Rock 'Em Sock 'Em en C++ sobre un motor del curso.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
              en: [
                "Designed and implemented multiple behavior trees to drive boxer decisions",
                "Coded game logic and blackboard state sharing for blocking, movement, and health reactions",
                "Modeled NPC assets in Blender and used templates for crowd wave motion, lights, and knockout stars",
                "Placed among the class contest winners for extra credit",
              ],
              es: [
                "Diseñé e implementé múltiples behavior trees para guiar las decisiones de los boxeadores",
                "Programé la lógica de juego y el blackboard para reacciones de bloqueo, movimiento y vida",
                "Trabajé modelos de NPCs en Blender y usé templates para la ola del público, luces y estrellas de KO",
                "Quedé entre los ganadores de la votación de la clase para crédito extra",
              ],
            },
          },
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "Two AI boxers trade hits in the ring, reacting to opponent movement, blocking, and health state.",
          es: "Dos boxeadores controlados por IA combaten en el ring reaccionando al movimiento, bloqueo y vida del rival.",
        },
        blocks: [
          {
            type: "steps",
            items: {
              en: [
                "Used a blackboard to share boxer health, stance, and blocking cues for combat reactions",
                "Configured template-driven crowd wave animations around the ring",
                "Added templated lighting and knockout star formations when hits land or knockouts happen",
              ],
              es: [
                "Usé un blackboard para compartir vida, postura y bloqueos y disparar reacciones en combate",
                "Configuré animaciones en ola para el público alrededor del ring mediante templates",
                "Añadí luces y formaciones de estrellas de KO mediante templates ante golpes y knockouts",
              ],
            },
          },
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: {
          en: "Learning a custom engine while getting formation and AI behavior details right.",
          es: "Adaptarme a un motor nuevo mientras afinaba formaciones y lógica de IA.",
        },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "Working inside an unfamiliar custom engine while implementing formations, behavior trees, and blackboard logic.",
                  es: "Trabajar en un motor nuevo mientras implementaba formaciones, behavior trees y lógica de blackboard.",
                },
                fix: {
                  en: "Put in focused iteration time to learn the engine hooks and test each behavior branch until the ring interactions felt responsive.",
                  es: "Dediqué tiempo de iteración constante para dominar el motor y probar cada rama de comportamiento hasta lograr reacciones fluidas.",
                },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: {
          en: "Voted one of the top projects in the class showcase and awarded extra credit.",
          es: "Elegido entre los mejores proyectos en la muestra de clase y ganador de crédito extra.",
        },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "A fun hands-on project that helped me apply behavior trees, blackboards, and C++ game AI structure in practice.",
              es: "Un proyecto práctico y divertido que me permitió aplicar behavior trees, blackboards y estructuras de IA en C++.",
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
    title: { en: "Steam Data Set Project", es: "Proyecto Dataset de Steam" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2026",
    startYear: 2026,
    pitch: {
      en: "An ongoing group data-analysis project exploring a 100K+ Steam games dataset and 194K+ reviews to examine whether game support correlates with player reach and reviews.",
      es: "Un proyecto grupal de análisis de datos sobre un dataset de 100K+ juegos de Steam y 194K+ reseñas para analizar si el soporte del juego se relaciona con alcance y reseñas.",
    },
    tldr: {
      problem: {
        en: "Game developers benefit from knowing whether investing in support features (languages, platforms, modding) actually matters to players.",
        es: "A los desarrolladores les sirve saber si invertir en soporte (idiomas, plataformas, modding) realmente importa a los jugadores.",
      },
      built: {
        en: "A Python/Polars analysis workflow across 100K+ games and 194K+ fetched Steam reviews to test support and review patterns.",
        es: "Un flujo de análisis en Python y Polars sobre 100K+ juegos y 194K+ reseñas obtenidas de Steam para evaluar patrones de soporte y reseñas.",
      },
      result: {
        en: "Found that players rarely mention support directly in reviews, leading us to measure reach across 10+ review thresholds instead.",
        es: "Observamos que los jugadores casi no mencionan el soporte en reseñas, por lo que medimos alcance en juegos con 10+ reseñas frente a niveles de soporte.",
      },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "4-person team", es: "equipo de 4 personas" },
    status: { en: "in progress", es: "en progreso" },
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "Built for DigiPen's MSCS Data Analysis course with a 100K+ entry dataset and a shared interest in games.",
          es: "Realizado para el curso de Análisis de Datos en la maestría MSCS de DigiPen con un dataset de 100K+ registros e interés compartido en videojuegos.",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Our four-person team needed a dataset of at least 100,000 rows to apply data-analysis techniques in class, and games were a natural fit for everyone.",
              es: "Nuestro equipo de cuatro personas necesitaba un dataset de al menos 100,000 filas para aplicar técnicas del curso, y los videojuegos encajaban bien con el grupo.",
            },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "Used Jupyter Notebook and Polars in Python to explore 100K+ titles and 194K+ Steam reviews around game support.",
          es: "Usé Jupyter Notebook y Polars en Python para analizar 100K+ títulos y 194K+ reseñas de Steam en torno al soporte de juegos.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
              en: [
                "Investigated whether broader support (languages, platforms, modding) aligns with stronger review outcomes",
                "Collected over 194K reviews via Steam's public API to supplement the game catalog",
                "Cleaned data, engineered features, and analyzed groups and sentiment in Python/Polars",
              ],
              es: [
                "Analicé si un mayor soporte (idiomas, plataformas, modding) se relaciona con mejores reseñas",
                "Obtuve más de 194K reseñas desde la API pública de Steam para complementar el catálogo",
                "Limpié datos, creé variables útiles y analicé grupos y sentimiento con Python y Polars",
              ],
            },
          },
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "Structured across milestones from data collection and cleaning to feature engineering and analysis.",
          es: "Organizado por hitos desde recolección y limpieza de datos hasta ingeniería de variables y análisis.",
        },
        blocks: [
          {
            type: "steps",
            items: {
              en: [
                "Gathered the 100K+ game dataset and pulled 194K+ reviews from Steam's public API",
                "Cleaned missing/inconsistent fields and prepared structured datasets in Polars",
                "Engineered support and engagement features for group comparisons and sentiment checks",
                "Running further modeling and milestone evaluations [TODO: update current milestone status]",
              ],
              es: [
                "Reunimos el dataset de 100K+ juegos y extrajimos 194K+ reseñas de la API pública de Steam",
                "Limpiamos campos inconsistentes y preparamos estructuras tabulares con Polars",
                "Creamos variables de soporte y alcance para comparar grupos y revisar sentimiento",
                "Continuamos con análisis y cierres de hitos [TODO: actualiza el estado actual del hito]",
              ],
            },
          },
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: {
          en: "Players rarely write reviews about support—even when support matters.",
          es: "Los jugadores rara vez escriben reseñas sobre soporte, incluso cuando importa.",
        },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "Review text didn't directly talk about game support enough to rely on review mentions alone.",
                  es: "El texto de las reseñas no mencionaba lo suficiente el soporte como para depender solo de menciones directas.",
                },
                fix: {
                  en: "Used reach—specifically games hitting 10+ reviews—as a proxy metric compared across support levels.",
                  es: "Usamos el alcance—juegos que superan las 10+ reseñas—como métrica comparativa entre niveles de soporte.",
                },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: {
          en: "Ongoing analysis with early findings on reach and support.",
          es: "Análisis en curso con primeros hallazgos sobre alcance y soporte.",
        },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "Active project—I'll update this section with final numbers and conclusions as we finish the remaining milestones.",
              es: "Proyecto activo; actualizaré esta sección con métricas finales y conclusiones al cerrar los siguientes hitos.",
            },
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
      en: "An ongoing academic data-science project using historical UFC bout data to model and predict fight outcomes.",
      es: "Un proyecto académico en curso de ciencia de datos que usa historial de combates de UFC para predecir resultados de peleas.",
    },
    tldr: {
      problem: {
        en: "Trying to predict winners of MMA contests",
        es: "[TODO: indica el reto de predicción o problema de datos que estás investigando]",
      },
      built: {
        en: "A Python and NumPy data-analysis workflow built on historical UFC fight records.",
        es: "Un flujo de análisis en Python y NumPy basado en registros históricos de peleas de UFC.",
      },
      result: {
        en: "In Progress",
        es: "[TODO: agrega métricas actuales del modelo, línea base o siguiente hito]",
      },
    },
    role: { en: "researcher + developer", es: "investigador + desarrollador" },
    timeline: { en: "2026", es: "2026" },
    team: { en: "solo", es: "en solitario" },
    status: { en: "in progress", es: "en progreso" },
    sections: [
      {
        label: { en: "why it existed", es: "por qué existió" },
        headline: {
          en: "Exploring fight outcome prediction from historical MMA matchup data.",
          es: "Explorar la predicción de resultados en MMA a partir de datos históricos de combates.",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Project In Progress",
              es: "[TODO: explica qué te motivó a predecir peleas de MMA y cómo planteaste el problema]",
            },
          },
        ],
      },
      {
        label: { en: "what i did", es: "qué hice" },
        headline: {
          en: "Prepping UFC bout data and building feature/prediction experiments in Python.",
          es: "Preparando datos de peleas de UFC y armando experimentos de variables y predicción en Python.",
        },
        blocks: [
          {
            type: "bullets",
            items: {
              en: ["Project In Progress"],
              es: ["[TODO: anota limpieza de datos, variables creadas y pasos de modelado realizados]"],
            },
          },
        ],
      },
      {
        label: { en: "how", es: "cómo" },
        headline: {
          en: "Historical fighter and bout features processed in Python/NumPy for outcome modeling.",
          es: "Variables históricas de peleadores y combates procesadas en Python/NumPy para modelar resultados.",
        },
        blocks: [
          {
            type: "steps",
            items: {
              en: ["Project In Progress"],
              es: ["[TODO: resume los pasos del pipeline: preparación de datos, features, entrenamiento/validación]"],
            },
          },
        ],
      },
      {
        label: { en: "hard parts", es: "lo difícil" },
        headline: {
          en: "Handling noisy fight records and avoiding data leakage.",
          es: "Lidiar con registros ruidosos de peleas y evitar fuga de datos (data leakage).",
        },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "[TODO: describe a specific data/modeling issue, e.g., missing stats, time ordering, or class imbalance]",
                  es: "[TODO: describe un problema real de datos o modelado, p. ej., datos faltantes, orden temporal o desbalance]",
                },
                fix: {
                  en: "[TODO: describe how you handled or tested a fix for it]",
                  es: "[TODO: describe cómo lo resolviste o probaste]",
                },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "Work in progress—updating results as experiments mature.", es: "En progreso; actualizando resultados conforme avanzan los experimentos." },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "[TODO: add current accuracy/evaluation summary and what you plan to test next]",
              es: "[TODO: agrega un resumen de precisión/evaluación actual y qué probarás enseguida]",
            },
          },
        ],
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
