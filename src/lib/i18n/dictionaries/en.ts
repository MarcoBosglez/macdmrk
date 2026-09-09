import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    home: "hub",
    about: "about",
    work: "work",
    gallery: "gallery",
    contact: "contact",
  },
  chrome: {
    openToWork: "open to work",
  },
  toggles: {
    mute: "mute",
    unmute: "unmute",
    light: "light",
    dark: "dark",
    loading: "...",
  },
  hub: {
    eyebrow: "who am i",
    role: "Software Engineer & Digital Illustrator",
    location: "Based in Seattle, WA · from Mexico City <3",
    bio: "",
    chips: ["Cloud Management", "Web Development", "Illustration", "Art"],
    log: [
  "[09:14] studied AI coursework",
  "[11:30] committed 47 files",
  "[16:40] spotted a thrift store on the way home",
  "[21:55] sketched some portraits",
    ],
    note: "→ new design! hover anything. i made this site to be interactive and fun to use",
  },
  work: {
    eyebrow: "selected work",
    range: "2020 — 2026",
    whatIDid: "what i did",
    outcomeLabel: "outcome",
    linkHint: "open the project in a new tab",
    note: "→ all my previous & current personal projects in one list",
  },
  gallery: {
    eyebrow: "gallery",
    countJoiner: "shown",
    filterAll: "all",
    dragHint: "drag the title bar to move · maximize for full resolution",
    note: "→ all my digital art! filter between styles",
  },
  about: {
    eyebrow: "about",
    lead: "Hi! I'm a Software Engineer & Hobbyist Digital Artist. Currently pursing my M.S. in Computer Science at Digipen Institute of Technology!",
    leadAccent: "M.S. in Computer Science",
    nowLabel: "now",
    now: "M.S. Computer Science at DigiPen",
    stackLabel: "stack",
    stack: "TypeScript · Python · React · Node · LLM integration",
    elsewhereLabel: "elsewhere",
    experienceLabel: "experience",
    listeningLabel: "on repeat",
    interestsLabel: "off the clock",
    interests: "videogames · drawing · mixed martial arts",
    quirk: "// my favorite color is green if you can't tell",
    photoPlaceholder: "[ photo of me ]",
    disclaimer:
      "AI usage only to assist to code generation.",
    note: "→ my experience & socials!",
  },
  contact: {
    eyebrow: "contact",
    // DRAFT — Marco to refine.
    lead: "Contact Me",
    blurb:
      "Tell me what you're building or what you want drawn. I answer within a day or two.",
    statusLabel: "status",
    statusValue: "open to work",
    localTimeLabel: "local time",
    replyTimeLabel: "reply time",
    replyTimeValue: "~24–48h",
    elsewhereLabel: "elsewhere",
    elsewhere: {
      instagram: "@marcobglz",
      linkedin: "marco-bosquez",
      resume: "current version",
    },
    // DRAFT
    briefs: [
      "→ backend / infra / LLM",
      "→ illustration or cover commission",
      "→ tooling for an art or game team",
    ],
    note: "→ contact me!",
  },
  notFound: {
    title: "404",
    description: "This page doesn't exist — the file was moved, deleted, or never here.",
    cta: "→ back home",
  },
  errorPage: {
    title: "something broke",
    description: "An unexpected error occurred. You can try again, or head back home.",
    retry: "→ try again",
    cta: "→ back home",
  },
};
