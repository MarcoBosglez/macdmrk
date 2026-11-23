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
  // `size` caps the width: "full" (default) for wide screenshots,
  // "medium" / "small" for square or tall ones that would fill the screen.
  | ({ type: "figure"; size?: "full" | "medium" | "small" } & ProjectFigure)
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
  // true = left out of the site entirely (/work, featured cards, the
  // project switcher, and its own /work/<slug> page). The entry stays
  // here so it's ready to flip back on.
  hidden?: boolean;
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

const ALL_PROJECTS: Project[] = [
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
          en: "Client Contact",
          es: "",
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "Music Distribution company [OneRPM](https://onerpm.com/) approached me to work to design and implement an HTML/CSS/JS banner for one of their recent Spotify campagins. The purpose was to allow Spotify users to interact with the banner in a way they could select an optiom from the custom banner and redirect them to a Spotify custom playlist made by OneRPM.",
              es: ".",
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
          en: "Design & Implementation",
          es: "",
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
          en: "Shipped Product",
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
    tags: ["React", "Material UI", "Java", "Spring", "Docker"],
    title: { en: "Amazon Recorder System Helper", es: "Amazon Recorder System Helper" },
    kindLabel: { en: "AWS Tooling", es: "Herramientas AWS" },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:6943381454940753920/",
    years: "2022",
    startYear: 2022,
    pitch: {
      en: "A full-stack Amazon Connect extension my whole class built for Amazon Mexico, so call centers could keep track of every call.",
      es: "",
    },
    tldr: {
      problem: {
        en: "Amazon Mexico brought a real brief to our class: find new ideas for Amazon Connect, the platform call centers use to handle their calls.",
        es: "",
      },
      built: {
        en: "A full-stack extension to make, record and review calls, plus an FAQ that agents could check mid-call. I led the 5-person front-end team.",
        es: "",
      },
      result: {
        en: "We delivered it, Amazon Mexico really liked it, and we filmed a commercial-style demo of the product.",
        es: "",
      },
    },
    role: { en: "front-end team lead", es: "líder de equipo front-end" },
    timeline: { en: "2022", es: "2022" },
    team: { en: "~25-person class (5 on front-end)", es: "" },
    status: { en: "delivered", es: "" },
    sections: [
      {
        label: { en: "Needs (Why)" },
        headline: { en: "A Real Client in a Classroom" },
        blocks: [
          {
            type: "text",
            text: {
              en: "In 2022, during one of my last semesters of undergrad at **Tec de Monterrey (ITESM)** in Mexico City, people from Amazon Mexico came to one of my classes to assign us a project. They were looking for fresh ideas for **Amazon Connect**, the platform call centers use to handle all of their calls, recordings, etc.\nThe twist was that the whole class was the team. We simulated a real company: every group owned its own part of the product and we had to communicate constantly to deliver it. Looking back, it was pretty close to the project pipelines I later worked in on real teams.",
            },
          },
          {
            type: "beforeAfter",
            goal: {
              en: [
                "Give Amazon Mexico new ideas for Amazon Connect",
                "Build a full-stack product as one class-sized company",
                "Practice working across teams like on a real project",
              ],
            },
          },
        ],
      },
      {
        label: { en: "Idea" },
        headline: { en: "Keeping Track of Every Call" },
        blocks: [
          {
            type: "text",
            text: {
              en: "As a class, we decided to build a full-stack extension that captures call-center interactions, so a call center can actually keep track of its calls and use them for audits, coaching and performance reviews.\nWe looked at other products in the space for reference and pitched our own ideas on top. Basically: what features would a product like this need to feel complete?",
            },
          },
          {
            type: "bullets",
            title: { en: "What it could do" },
            style: "check",
            items: {
              en: [
                "Make and record calls through an API",
                "Keep a history of calls for audits, coaching and performance reviews",
                "An FAQ section backed by a database, so agents could quickly answer the questions callers asked",
              ],
            },
          },
        ],
      },
      {
        label: { en: "Team" },
        headline: { en: "A Whole Class as One Company" },
        blocks: [
          {
            type: "text",
            text: {
              en: "The class, about 25 of us, was split into a **database** team, a **backend** team and a **front-end** team. I was assigned to the front-end group, five of us, though in practice we worked as a front-end/back-end mix to get things connected.\nAlong the way my teammates agreed to make me the leader of the group. Being responsible came naturally to me and I had the skills to keep the team moving, so I took it on.",
            },
          },
          {
            type: "callout",
            tone: "note",
            title: { en: "My role" },
            text: {
              en: "Front-end team lead: assigning tasks and keeping our group in sync with the database and backend teams. On the code side, I personally built the app's layout and navigation, the main page and the FAQ page.",
            },
          },
        ],
      },
      {
        label: { en: "Process (How)" },
        headline: { en: "Execution & Teamwork" },
        blocks: [
          {
            type: "text",
            text: {
              en: "**1. Aligning With the Other Teams**\n - Worked with people from the database and backend groups to agree on what the project needed and to put together its architecture before building.",
            },
          },
          {
            type: "text",
            text: {
              en: "**2. Picking the Layout**\n - We had a lot of ideas for how the app should be laid out. In the end I made the call to go forward with my design: the style that was popular at the time, a big navigation menu on the left, where clicking a section swaps the main panel on the right to that section.",
            },
          },
          {
            type: "text",
            text: {
              en: "**3. Building the UI**\n - Used **Material UI** for **React** as our base of components, so we started from pieces that already worked and followed modern UI patterns.\n - I personally built that layout and its navigation, plus the **main page** and the **FAQ page**. The rest of the team built their sections on top of it.",
            },
          },
          {
            type: "text",
            text: {
              en: "**4. Leading the Front-end Team**\n - Split the work into tasks and assigned them across the five of us, then kept checking in until everything was connected to the backend and database.",
            },
          },
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "The hardest part wasn't the code. It was keeping a whole class aligned, and coming up with ideas that would actually give users a better experience.",
                },
                fix: {
                  en: "We kept talking with the other teams constantly and looked at how other products solved the same problems before deciding on our own approach.",
                },
              },
            ],
          },
          {
            type: "steps",
            items: {
              en: ["Brief from Amazon Mexico", "Architecture across teams", "Layout & UI", "Demo"],
            },
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "Amazon Mexico Liked It!" },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "We finished it! The end product looked like a real, simple platform where users could make and record calls, with an FAQ for agents to lean on during calls. Amazon Mexico really liked it, and we filmed a demo that works like a commercial for the product. It's on my LinkedIn.",
            },
          },
          {
            type: "stats",
            items: [
              { value: "~25", label: { en: "Classmates working as one company" } },
              { value: "3", label: { en: "Teams (database, backend, front-end)" } },
              { value: "5", label: { en: "Person front-end team I led" } },
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
    tags: ["Python", "NLTK", "NLP", "Bag of Words"],
    title: { en: "ML Sentiment Analysis", es: "Análisis de Sentimiento con ML" },
    kindLabel: { en: "NLP Study", es: "Estudio de PLN" },
    years: "2023",
    startYear: 2023,
    pitch: {
      en: "A university NLP study on mental-health tweets: 625 hand-labeled tweets and a model trained to tell positive from negative.",
      es: "",
    },
    tldr: {
      problem: {
        en: "How many people talk about mental health on social media, and is that conversation more positive or negative?",
        es: "",
      },
      built: {
        en: "A hand-labeled set of 625 mental-health tweets and a bag-of-words model (Python/NLTK) trained to classify them, benchmarked against another model.",
        es: "",
      },
      result: {
        en: "Roughly 70–80% accuracy for such a small dataset, and a clear lesson: more and better data would have made it better.",
        es: "",
      },
    },
    role: { en: "developer + data collection", es: "desarrollador + recolección de datos" },
    timeline: { en: "2023", es: "2023" },
    team: { en: "5 people", es: "5 personas" },
    status: { en: "completed", es: "completado" },
    sections: [
      {
        label: { en: "Needs (Why)" },
        headline: { en: "Why Mental Health Tweets?" },
        blocks: [
          {
            type: "text",
            text: {
              en: "This was one of the main projects from my time at university, and honestly a fun one. For our class we had to find a big dataset (or scrape one ourselves) and run an NLP study on it.\nWe landed on a dataset with a huge list of tweets from **2018–2019** about pretty much everything: football, news, whatever people were talking about. Out of all those topics, we decided to focus on mental health.",
            },
          },
          {
            type: "beforeAfter",
            goalLabel: { en: "questions", es: "preguntas" },
            goal: {
              en: [
                "How many people actually talk about mental health?",
                "Is the sentiment around mental health more positive or negative?",
                "Can a model detect these tweets and classify them as positive or negative?",
              ],
            },
          },
        ],
      },
      {
        label: { en: "Data" },
        headline: { en: "From Thousands of Tweets to 625" },
        blocks: [
          {
            type: "text",
            text: {
              en: "First we filtered the dataset for words we could tie to mental health, like **\"health\"**, **\"depression\"**, **\"happiness\"**, **\"meds\"** and others.\nThen came the slow part: we went through the results by hand and ended up with **625 tweets**, each one read and labeled by a person. I personally did a lot of this labeling.",
            },
          },
          {
            type: "bullets",
            title: { en: "Labels we used" },
            style: "dot",
            items: {
              en: ["Positive", "Negative", "Depressed", "Happy", "…plus a few other classification labels"],
            },
          },
        ],
      },
      {
        label: { en: "Process (How)" },
        headline: { en: "Building & Training the Model" },
        blocks: [
          {
            type: "text",
            text: {
              en: "**1. Filtering**\n - Narrowed the full tweet dataset down to tweets with mental-health keywords.",
            },
          },
          {
            type: "text",
            text: {
              en: "**2. Hand-Labeling**\n - Read and labeled each of the 625 tweets, so the model had real human judgment to learn from.",
            },
          },
          {
            type: "text",
            text: {
              en: "**3. Training the Model**\n - Used **Python** and **NLTK** with a **bag-of-words** approach: each tweet becomes a count of the words in it, and those words get identified as positive or negative.\n - On top of that, we built and trained a model to classify the tweets.",
            },
          },
          {
            type: "text",
            text: {
              en: "**4. Benchmarking**\n - Compared our model against another model to see how it held up.",
            },
          },
          {
            type: "callout",
            tone: "note",
            title: { en: "My role" },
            text: {
              en: "One of the main developers and data collection people: I did a big part of the labeling and also worked on building and training the model.",
            },
          },
          {
            type: "steps",
            items: {
              en: ["Find a dataset", "Filter", "Hand-label", "Train", "Benchmark"],
            },
          },
        ],
      },
      {
        label: { en: "Lessons" },
        headline: { en: "What Held the Model Back" },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "625 tweets was too little. With that few examples, further training didn't push the accuracy very far.",
                },
                fix: {
                  en: "Next time: a much larger set of tweets to train on.",
                },
              },
              {
                problem: {
                  en: "Our data could have been better. Keyword filtering pulls in a lot of noise, and mental-health language is subtle.",
                },
                fix: {
                  en: "Cleaner, more carefully selected data would likely matter as much as the model itself.",
                },
              },
            ],
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "A Nice Accuracy, With Room to Grow" },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "Even with a small dataset, we got a nice accuracy, somewhere around 70–80%. When we benchmarked it against another model, ours could have been better, but that comparison is exactly what showed us where the data was holding it back.",
            },
          },
          {
            type: "stats",
            items: [
              { value: "625", label: { en: "Tweets labeled by hand" } },
              { value: "~70–80%", label: { en: "Model accuracy" } },
              { value: "5", label: { en: "Person team" } },
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
    tags: ["C++", "Behavior Trees", "Game AI", "DirectX", "Blender"],
    title: { en: "Rock 'Em", es: "Rock 'Em" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2026",
    startYear: 2026,
    pitch: {
      en: "A boxing match fought entirely by AI: two behavior-tree boxers, a crowd of 96 fans, moving spotlights and cartoon KO birds. Nothing is scripted.",
      es: "",
    },
    tldr: {
      problem: {
        en: "Build a 3D simulation for DigiPen's AI for Games course that puts game AI techniques into practice.",
        es: "",
      },
      built: {
        en: "A Rock 'Em Sock 'Em-inspired boxing match in C++ where 5 behavior trees drive the boxers, the crowd, the lights and the KO birds.",
        es: "",
      },
      result: {
        en: "Voted one of the top 4 most fun projects in the class, winning the extra credit contest.",
        es: "",
      },
    },
    role: { en: "developer", es: "desarrollador" },
    timeline: { en: "2026 · ~40 hours", es: "2026 · ~40 horas" },
    team: { en: "solo", es: "solo" },
    status: { en: "completed", es: "completado" },
    sections: [
      {
        label: { en: "Needs (Why)" },
        headline: { en: "Boxing Robots, Run by AI" },
        blocks: [
          {
            type: "text",
            text: {
              en: "This was a project for the **AI for Games** course in my Master's at DigiPen, taught by Steve Rabin. The assignment: build a 3D simulation that shows off game AI techniques.\nI went with a boxing match inspired by the classic **Rock 'Em Sock 'Em Robots** toy. The catch I gave myself was that nothing is scripted. Every punch, block, retreat and victory dance had to come from the agents' own decisions.",
            },
          },
          {
            type: "beforeAfter",
            goal: {
              en: [
                "Put behavior trees and blackboards into practice",
                "Make fights that play out differently every time",
                "Have the whole arena react to the match, not just the boxers",
              ],
            },
          },
        ],
      },
      {
        label: { en: "The Match" },
        headline: { en: "Two Boxers, One Ring, ~100 Fans" },
        blocks: [
          {
            type: "text",
            text: {
              en: "Two NPC boxers, Red and Blue, fight each other while the rest of the arena reacts to how the match is going.",
            },
          },
          {
            type: "bullets",
            style: "check",
            items: {
              en: [
                "**Two AI boxers** that punch, block, step in and back off, and do a victory dance when they win",
                "**96 spectators** on tiered red and blue bleachers. They wave during the fight, and at the end the winning side cheers while the losing side sits still",
                "**115 ring lights** that follow a leader around a square path, then switch to the winner's color",
                "**KO birds**: a V formation of birds that circles the knocked-out boxer, cartoon-style",
              ],
            },
          },
        ],
      },
      {
        label: { en: "Process (How)" },
        headline: { en: "Building the Behavior Trees" },
        blocks: [
          {
            type: "text",
            text: {
              en: "**1. Behavior Trees**\n - Built **5 trees** (Red Boxer, Blue Boxer, Boxing Crowd, Lights, KO Birds) out of about **25 custom nodes**.\n - **Control flow:** Selector, Sequencer, Parallel Sequencer, and a Random Selector that lets the boxers pick a different punch combo each time, so fights don't feel repetitive.\n - **Decorators:** health checks, enemy-health checks, win/lose/match-over checks, delays and repeaters.\n - **Leaf actions:** left/right punch, block, step forward/back, die, victory dance, cheer, wave and the light patterns.",
            },
          },
          {
            type: "text",
            text: {
              en: "**2. Blackboard Data**\n - Each agent stores its own health, stamina, blocking state and formation slot.\n - Other agents can read that data, which is how a boxer knows its opponent is down.",
            },
          },
          {
            type: "text",
            text: {
              en: "**3. Combat Logic**\n - Punches check range against the closest opponent and cost stamina.\n - A blocked hit does a third of the damage, and hits and blocks play different sounds.\n - The boxer's model switches between idle, punch and block poses.",
            },
          },
          {
            type: "text",
            text: {
              en: "**4. Formation Movement (extra credit)**\n - The ring lights follow a leader around the ring, and the KO birds fly in a wedge formation around the fallen boxer.",
            },
          },
          {
            type: "steps",
            items: {
              en: ["Behavior trees", "Blackboard", "Combat", "Crowd & lights", "KO birds"],
            },
          },
        ],
      },
      {
        label: { en: "Lessons" },
        headline: { en: "My First Custom Engine" },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "This was my first time working in a custom C++ engine (the course's Rabin Engine, built on DirectX) instead of Unity. No visual editor and no live debugging.",
                },
                fix: {
                  en: "I positioned models, tuned movement and converted assets by hand. I modeled the boxers myself in **Blender**, exported them to FBX and converted them into the engine's DirectX format, plus WAV audio for punches, blocks, swooshes and crowd ambience.",
                },
              },
            ],
          },
          {
            type: "callout",
            tone: "win",
            title: { en: "What I learned" },
            text: {
              en: "Doing everything by hand taught me a lot about how AI decision structures actually run under the hood.",
            },
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "Top 4 Most Fun in Class!" },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "The final match runs entirely on its own: the boxers fight, the crowd reacts, the lights crown the winner and the birds circle whoever got knocked out.\nThe class voted it one of the **top 4 most fun projects**, which won the extra credit contest.",
            },
          },
          {
            type: "stats",
            items: [
              { value: "Top 4", label: { en: "Most fun, by class vote" } },
              { value: "5", label: { en: "Behavior trees" } },
              { value: "~25", label: { en: "Custom nodes" } },
              { value: "96", label: { en: "Spectators reacting" } },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "steam-dataset-project",
    category: "academic",
    featured: false,
    hidden: true,
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
    hidden: true,
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
    slug: "a-star-pathfinding",
    category: "academic",
    featured: false,
    heroImage: "/work/pathfinding-cover.webp",
    tags: ["C++20", "A* Algorithm", "Pathfinding", "Game AI"],
    title: { en: "A* Pathfinding", es: "Pathfinding con A*" },
    kindLabel: { en: "Master's Project", es: "Proyecto de Maestría" },
    years: "2026",
    startYear: 2026,
    pitch: {
      en: "A high-performance A* pathfinder on 2D grid maps, tuned until it ran about 3x faster than the instructor's reference solution.",
      es: "",
    },
    tldr: {
      problem: {
        en: "Build a fast A* pathfinder for DigiPen's AI for Games course.",
        es: "",
      },
      built: {
        en: "A C++ grid pathfinder with selectable heuristics, path straightening and curve smoothing, plus a stack of speed optimizations.",
        es: "",
      },
      result: {
        en: "About 0.74 ms per search on average, versus about 2.2 ms for the reference solution: roughly 3x faster.",
        es: "",
      },
    },
    role: { en: "developer", es: "desarrollador" },
    timeline: { en: "2026 · ~30 hours", es: "2026 · ~30 horas" },
    team: { en: "solo", es: "solo" },
    status: { en: "completed", es: "completado" },
    sections: [
      {
        label: { en: "Needs (Why)" },
        headline: { en: "Finding the Fastest Path" },
        blocks: [
          {
            type: "text",
            text: {
              en: "Another project for the **AI for Games** course at DigiPen, taught by Steve Rabin. We had to build an A* pathfinder using the techniques from class, and speed was part of the challenge.\nSo the goal wasn't just a path that works. It was a path that works, looks natural, and gets found as fast as possible.",
            },
          },
          {
            type: "beforeAfter",
            goal: {
              en: [
                "Find correct, natural-looking paths on 2D grid maps",
                "Make it as fast as possible",
                "Beat the instructor's reference solution",
              ],
            },
          },
        ],
      },
      {
        label: { en: "Pathfinder" },
        headline: { en: "What It Does" },
        blocks: [
          {
            type: "text",
            text: {
              en: "It runs **A* search** with 8-directional movement and no cutting corners past walls. I tested it on the course's map suites, including large game-style maps.",
            },
          },
          {
            type: "bullets",
            title: { en: "Heuristics you can switch between" },
            style: "dot",
            items: {
              en: [
                "Octile, Manhattan, Chebyshev and Euclidean",
                "An intentionally inconsistent heuristic, for testing",
                "A heuristic weight that trades path quality for speed",
              ],
            },
          },
          {
            type: "bullets",
            title: { en: "Making paths look natural" },
            style: "arrow",
            items: {
              en: [
                "**Rubberbanding** removes unnecessary waypoints wherever a straight line is clear of walls",
                "**Catmull-Rom spline smoothing** turns jagged grid paths into natural curves",
                "Extra points are added back between waypoints that end up too far apart, so smoothing stays accurate after rubberbanding",
              ],
            },
          },
          {
            type: "callout",
            tone: "note",
            title: { en: "Debugging" },
            text: {
              en: "A visual debug mode in the Rabin Engine colors the open and closed lists on the grid, and a single-step mode lets you watch the search one step at a time.",
            },
          },
        ],
      },
      {
        label: { en: "Process (How)" },
        headline: { en: "Making It ~3x Faster" },
        blocks: [
          {
            type: "text",
            text: {
              en: "Once it worked, the rest was speed. None of these change what A* does. They change how the data is stored and accessed.",
            },
          },
          {
            type: "text",
            text: {
              en: "**1. Bucket Priority Queue**\n - Used buckets instead of a binary heap, so pushing a node takes constant time.",
            },
          },
          {
            type: "text",
            text: {
              en: "**2. Search IDs**\n - Instead of resetting the whole grid between searches, each search gets an ID, so starting a new one costs almost nothing.",
            },
          },
          {
            type: "text",
            text: {
              en: "**3. Precomputed Neighbor Bitmasks**\n - Each cell stores which of its 8 moves are legal, calculated once when the map loads (using C++20's <bit> header and std::countr_zero).",
            },
          },
          {
            type: "text",
            text: {
              en: "**4. Direction-Based Pruning**\n - Skips neighbors that can't be part of a shorter path, based on the direction the search arrived from.",
            },
          },
          {
            type: "text",
            text: {
              en: "**5. Compact, Cache-Friendly Nodes**\n - 16-byte nodes in one flat, pre-allocated array, with memory reused between searches.\n - Plus a fast path for the Octile heuristic that skips the function-pointer call.",
            },
          },
        ],
      },
      {
        label: { en: "Lessons" },
        headline: { en: "Data Layout Matters" },
        blocks: [
          {
            type: "callout",
            tone: "win",
            title: { en: "What I learned" },
            text: {
              en: "How much data layout and memory access matter for speed. The same algorithm got about 3x faster through data-structure choices alone.",
            },
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "About 3x Faster Than the Reference" },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "On the course benchmark, my pathfinder averaged about **0.74 ms** per search, against about **2.2 ms** for the instructor's reference solution.",
            },
          },
          {
            type: "stats",
            items: [
              { value: "~0.74 ms", label: { en: "Average per search" } },
              { value: "~2.2 ms", label: { en: "Reference solution" } },
              { value: "~3x", label: { en: "Faster" } },
              { value: "~30h", label: { en: "Of work" } },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "urban-mobility",
    category: "academic",
    featured: false,
    heroImage: "/work/urban-mobility-cover.webp",
    tags: ["Python", "Mesa", "Unity", "C#", "IBM Cloud"],
    title: { en: "Urban Mobility", es: "Movilidad Urbana" },
    kindLabel: { en: "Multi-Agent Simulation", es: "Simulación Multiagente" },
    years: "2021",
    startYear: 2021,
    pitch: {
      en: "A Unity-based multi-agent simulation of an intersection, with smart traffic lights and autonomous cars looking for parking.",
      es: "",
    },
    tldr: {
      problem: {
        en: "Too many cars in Mexico's cities, and a lot of them just circling around looking for a place to park.",
        es: "",
      },
      built: {
        en: "A multi-agent model in Python (Mesa) streamed through an IBM Cloud server into a 3D Unity simulation. I took ownership of the project and built most of it.",
        es: "",
      },
      result: {
        en: "Cars and traffic lights that act on their own, and parking lots that only let cars in when there's space.",
        es: "",
      },
    },
    role: { en: "lead developer", es: "desarrollador líder" },
    timeline: { en: "Nov 2021 · 5 weeks", es: "nov 2021 · 5 semanas" },
    team: { en: "3 people", es: "3 personas" },
    status: { en: "completed", es: "completado" },
    sections: [
      {
        label: { en: "Needs (Why)" },
        headline: { en: "Too Many Cars, Not Enough Parking" },
        aside: {
          src: "/work/urban-mobility-unity-city.webp",
          side: "right",
          caption: { en: "The city we built: a top-down view of the intersection, and the 3D scene with its two parking garages." },
          alt: { en: "Top-down and 3D views of the Unity city intersection with parks, trees and parking garages" },
        },
        blocks: [
          {
            type: "text",
            text: {
              en: "A fun, smaller project from my undergrad at **Tec de Monterrey**: a 5-week block where we got our first real look at AI, agents and simulations.\nThe challenge was **urban mobility**: the ability to get from one place to another, which is key to a city's economy, social development and its people's quality of life. For a long time, owning a car was seen as a sign of progress. That isn't true anymore. The growth and overuse of cars has huge economic, environmental and social costs in Mexico: more traffic, more accidents, more smog. In Mexico City alone, the kilometers driven by cars tripled from 103 million in 1990 to 339 million in 2010.",
            },
          },
          {
            type: "beforeAfter",
            goal: {
              en: [
                "Reduce traffic by controlling and assigning the available parking spots in an area of the city",
                "Stop cars from driving in circles looking for a place to park",
                "Show it as a graphic simulation of a multi-agent system",
              ],
            },
          },
        ],
      },
      {
        label: { en: "Idea" },
        headline: { en: "Agents vs. Environment" },
        blocks: [
          {
            type: "text",
            text: {
              en: "We modeled the city with **5 elements**. Two of them are **agents**: they're autonomous and make their own decisions. The other three are part of the **environment** that the agents move through.\nCars and traffic lights don't depend on each other, but the traffic lights' signals change how the cars behave.",
            },
          },
          {
            type: "bullets",
            title: { en: "Agents" },
            style: "check",
            items: {
              en: [
                "**Cars** check their surroundings to decide where to go, and look for a nearby parking lot with space",
                "**Traffic lights** watch the movement and activity at the intersection and cycle on their own",
              ],
            },
          },
          {
            type: "bullets",
            title: { en: "Environment" },
            style: "dot",
            items: {
              en: [
                "**Roads**, each with the directions you can drive in",
                "**Walls** that block the way",
                "**Parking lots** that check their capacity before letting a car in",
              ],
            },
          },
        ],
        aside: {
          src: "/work/urban-mobility-code.webp",
          side: "right",
          caption: { en: "The environment in code: roads with their directions, walls, and parking lots that track their own capacity." },
          alt: { en: "Python code defining Road, Wall and ParkingLot agent classes with Mesa" },
        },
      },
      {
        label: { en: "Process (How)" },
        headline: { en: "From a 2D Grid to a 3D City" },
        blocks: [
          {
            type: "text",
            text: {
              en: "**1. Planning**\n - Started with a class diagram and an interaction-protocol diagram to map out how cars, traffic lights, roads, walls and parking lots talk to each other.\n - Managed the project's tasks with **Jira** boards and a **Gantt** chart to keep the 5 weeks on track.",
            },
          },
          {
            type: "figure",
            src: "/work/urban-mobility-plan.webp",
            caption: { en: "The plan: 13 tasks across November 2021, from the first diagrams to the final presentation." },
            alt: { en: "Gantt chart of the project's tasks and their status across November 2021" },
          },
          {
            type: "text",
            text: {
              en: "**2. The Model in Python + Mesa**\n - We imported the **Mesa** package to build the agent simulation. It gives you a grid to place and move every agent and environment element on. We picked it because it's simple to use and it's what we were used to from class.\n - My teammates wrote the Python side. Before going 3D, we ran everything as a 2D grid: blue circles for cars, red/green for traffic lights, black walls, white roads, and orange or purple parking lots depending on whether they had space left.",
            },
          },
          {
            type: "figure",
            src: "/work/urban-mobility-mesa-grid.webp",
            size: "small",
            caption: { en: "The 2D Mesa version: cars (blue) waiting at a traffic light, with two parking lots (orange) that still have space." },
            alt: { en: "Mesa grid simulation with black walls, a white crossroads, blue car agents, traffic lights and orange parking lots" },
          },
          {
            type: "text",
            text: {
              en: "**3. A Server on IBM Cloud**\n - Deployed the Python model as a **Cloud Foundry** app on **IBM Cloud**. Every step, it sends the cars' new positions as JSON.\n - I worked on the API calls that connect Unity to that server.",
            },
          },
          {
            type: "text",
            text: {
              en: "**4. The 3D City in Unity**\n - **Unity** receives those coordinates and moves the cars through a 3D intersection. We chose it because, with animations, it takes the simulation to another level of realism and shows the cars parking much better.\n - I designed the environment, mixing downloaded assets with models made in ProBuilder, plus lighting and textures for realism.\n - I also wrote the function that creates all the agents in the scene, and set up the whole Unity project.",
            },
          },
          {
            type: "figure",
            src: "/work/urban-mobility-unity-editor.webp",
            size: "medium",
            caption: { en: "The scene in the Unity editor: the intersection, two parking garages, and the cars waiting to spawn." },
            alt: { en: "Unity editor showing the 3D intersection scene and its hierarchy of roads, parking garages and cars" },
          },
          {
            type: "callout",
            tone: "note",
            title: { en: "My role" },
            text: {
              en: "Lead developer. I took ownership of the whole project and honestly did most of it: the environment design, the function that creates all the agents, the whole Unity project, and the API calls with IBM Cloud. The only part I didn't touch was the Python model, which my teammates handled.",
            },
          },
          {
            type: "steps",
            items: {
              en: ["Diagrams & plan", "Mesa model", "IBM Cloud server", "Unity simulation"],
            },
          },
        ],
      },
      {
        label: { en: "Lessons" },
        headline: { en: "What I'd Do Differently" },
        blocks: [
          {
            type: "challenges",
            items: [
              {
                problem: {
                  en: "Cars pick a random direction at intersections, and the whole simulation is controlled only from Mesa.",
                },
                fix: {
                  en: "A node/graph-based version would give much better movement and make room for real route optimization, and it would be more efficient in both memory and run time.",
                },
              },
            ],
          },
          {
            type: "callout",
            tone: "win",
            title: { en: "What I learned" },
            text: {
              en: "How agents interact with their environment, how to deploy a simulation's logic to a server and show it in a graphic environment, and the basics of optimization algorithms. I was hoping to go deeper, but 5 weeks only covers the fundamentals, and it got me interested in the area.",
            },
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "A Little City That Runs Itself" },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "The simulation turned out the way we wanted: cars drive and look for parking on their own, traffic lights manage the intersection, and parking lots only let cars in when there's space. You can also change the streets and add more elements, and it keeps working. A small project, but a fun mix of my gaming and AI interests.",
            },
          },
          {
            type: "figure",
            src: "/work/urban-mobility-cars.webp",
            caption: { en: "The final simulation: cars driving through the intersection toward the parking garages." },
            alt: { en: "3D Unity simulation with blue and yellow cars driving through a city intersection" },
          },
          {
            type: "stats",
            items: [
              { value: "2", label: { en: "Types of agents" } },
              { value: "5", label: { en: "Elements in the city" } },
              { value: "5", label: { en: "Weeks" } },
              { value: "3", label: { en: "Person team" } },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "nds-cognitive-labs-journal-publication",
    category: "professional",
    featured: false,
    heroImage: "/work/journal-publication-cover.webp",
    tags: ["React", "Material UI", "Axios", "MongoDB", "IBM Watson"],
    title: { en: "Chatbot Retraining Platform", es: "Plataforma de Reentrenamiento de Chatbots" },
    kindLabel: { en: "Journal Publication", es: "Publicación en Revista" },
    url: "https://rcs.cic.ipn.mx/2023_152_12/Development%20of%20a%20Front-End%20with%20Dynamic%20Searches%20for%20Chatbot%20Retraining%20Using%20ReactJS.pdf",
    years: "2022 – 2023",
    startYear: 2022,
    pitch: {
      en: "A React front-end with dynamic search for retraining an IBM Watson chatbot, built during my internship at NDS Cognitive Labs and published in a journal.",
      es: "",
    },
    tldr: {
      problem: {
        en: "Retraining a chatbot means managing hundreds of intents and entities, and finding the right one quickly.",
        es: "",
      },
      built: {
        en: "A ReactJS web app with dynamic search for intents, entities and suggestions, connected to MongoDB and IBM Watson.",
        es: "",
      },
      result: {
        en: "Co-authored a journal publication about it in Research in Computing Science (2023).",
        es: "",
      },
    },
    role: { en: "front-end developer + co-author", es: "desarrollador front-end + coautor" },
    timeline: { en: "Aug – Dec 2022", es: "ago – dic 2022" },
    team: { en: "7 students (2 on front-end)", es: "7 estudiantes (2 en front-end)" },
    status: { en: "published", es: "publicado" },
    sections: [
      {
        label: { en: "Needs (Why)" },
        headline: { en: "A Real Internship, a Real Chatbot" },
        blocks: [
          {
            type: "text",
            text: {
              en: "In August 2022, Tec de Monterrey and **NDS Cognitive Labs** (a cognitive computing company in Mexico and the US) opened professional internships to give students real work experience. Each student was matched to an \"experience\" based on their profile, and I landed on **Experience 3: Virtual Assistant Management Platform**, a Natural Language Processing platform.\nThe idea: a chatbot built with **IBM Watson** answers customers' questions. To answer well, it needs to be trained on **intents** (the verbs and actions a user wants to do) and **entities** (the nouns: objects, places, things related to the business). Our job was the platform to manage all of that.",
            },
          },
          {
            type: "beforeAfter",
            goal: {
              en: [
                "Create, edit, view, delete and search intents and entities in one place",
                "Use that data to retrain the IBM Watson chatbot",
                "Make it work from a computer or a phone",
              ],
            },
          },
        ],
      },
      {
        label: { en: "Team" },
        headline: { en: "7 Students, 2 on Front-End" },
        blocks: [
          {
            type: "text",
            text: {
              en: "Seven students from Tec took part. The work was split into a **back-end team** of 5 (Python, Flask and MongoDB) and a **front-end team** of 2 (ReactJS).\nI was on the front-end team with one teammate. We were picked because of our previous experience with **React**, and since we also knew Python and MongoDB, we got to collaborate with the back-end team too. Before building, the leaders had us take MongoDB's official courses to understand the database behind the platform.",
            },
          },
          {
            type: "callout",
            tone: "note",
            title: { en: "My role" },
            text: {
              en: "Front-end developer: building the views for intents, entities and suggestions in React, and connecting them to the back-end's endpoints. Then co-author of the journal article about it.",
            },
          },
        ],
      },
      {
        label: { en: "Process (How)" },
        headline: { en: "Building the Front-End" },
        blocks: [
          {
            type: "text",
            text: {
              en: "**1. Starting From a Base Platform**\n - We got a base platform with the components already defined, ready to be made functional. We tested it first, simulating how end users would move through it.\n - Our work: the creation, editing, viewing and deletion screens, in ReactJS, using the endpoints the back-end team built to bring in the data.",
            },
          },
          {
            type: "text",
            text: {
              en: "**2. Working Like a Real Team**\n - Weekly meetings on Google Meet to show progress and plan the next features, plus weekly logs to keep a record of everything.\n - Our project leader reviewed our work, and we jumped on video calls whenever we needed help.\n - The front-end lived in a **GitLab** repo, and we worked on our own branch for the intents, entities and suggestions views.\n - To move fast, we each took different components so they'd get up and running quickly, and teamed up whenever a problem needed both of us.",
            },
          },
          {
            type: "text",
            text: {
              en: "**3. The Dynamic Search Bar**\n - Built a search bar component that ended up in most of the platform's views: intents, entities, suggestions and requests.\n - It calls a **GET** endpoint in **Flask** with **Axios**, stores the list of intents or entities from **MongoDB** in **useState**, and filters it as you type with **useEffect**, using components from **Material UI**.\n - Pagination updates with every search, so only a limited number of results render at a time.\n - In the suggestions view, a dropdown lets you show only intents, only entities, or both.",
            },
          },
          {
            type: "steps",
            items: {
              en: ["MongoDB courses", "Base platform", "CRUD screens", "Dynamic search", "Journal article"],
            },
          },
        ],
      },
      {
        label: { en: "Lessons" },
        headline: { en: "From Data to a Better Chatbot" },
        blocks: [
          {
            type: "callout",
            tone: "win",
            title: { en: "Why the search mattered" },
            text: {
              en: "Searching intents and entities by name means you get to the one you need fast, and from there you can do anything with it: edit it, view its details, create new ones or delete it from the database. Less time looking for information, more time actually improving the chatbot.",
            },
          },
        ],
      },
      {
        label: { en: "outcome", es: "resultado" },
        headline: { en: "Published in a Journal!" },
        panel: true,
        blocks: [
          {
            type: "text",
            text: {
              en: "We built a platform (still in progress when the internship ended) for creating, editing, viewing, linking and deleting intents, entities and suggestions, the data used to retrain the chatbot.\nI co-authored an article about it, **\"Development of a Front-End with Dynamic Searches for Chatbot Retraining Using ReactJS\"**, published in **Research in Computing Science** (vol. 152, no. 12, 2023). [Read the paper](https://rcs.cic.ipn.mx/2023_152_12/Development%20of%20a%20Front-End%20with%20Dynamic%20Searches%20for%20Chatbot%20Retraining%20Using%20ReactJS.pdf).",
            },
          },
          {
            type: "stats",
            items: [
              { value: "336", label: { en: "Intents in the workspace" } },
              { value: "124", label: { en: "Entities in the workspace" } },
              { value: "5", label: { en: "Co-authors" } },
              { value: "2023", label: { en: "Published" } },
            ],
          },
        ],
      },
    ],
  },
];

// Everything the site renders. Filtering here (not in each page) means a
// hidden project can't leak into /work, featured cards, the switcher or
// generateStaticParams.
export const PROJECTS: Project[] = ALL_PROJECTS.filter((p) => !p.hidden);
