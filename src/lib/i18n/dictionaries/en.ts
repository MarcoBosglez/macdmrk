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
    bio: "I'm a versatile Software Engineer specializing in full-stack development, handling everything from database architecture, backend services, to frontend user interfaces. Currently pursing my M.S. in Computer Science at Digipen Institute of Technology!",
    chips: ["TypeScript", "Python", "Clip Studio Paint"],
    log: [
      "[09:14] shipped   llm gateway endpoints",
      "[16:40] spotted   thrift store",
      "[21:55] sketched  portrait study",
    ],
    note: "→ everything lives one click away. hover anything — nothing behaves the same twice.",
  },
  work: {
    eyebrow: "selected work",
    range: "2020 — 2026",
    whatIDid: "what i did",
    outcomeLabel: "outcome",
    linkHint: "open the project in a new tab",
    note: "→ hover a title to read the whole story: the problem, my part in it, what came out.",
  },
  gallery: {
    eyebrow: "gallery",
    countJoiner: "shown",
    filterAll: "all",
    dragHint: "drag the title bar to move · maximize for full resolution",
    note: "→ ink · gouache · digital. every frame reacts its own way.",
  },
  about: {
    eyebrow: "about",
    // DRAFT — Marco to refine.
    lead: "Software by trade, pictures by compulsion. The engineering keeps the art honest; the art keeps the engineering interesting.",
    leadAccent: "pictures by compulsion",
    nowLabel: "now",
    // DRAFT
    now: "M.S. Computer Science at DigiPen · taking commissions",
    stackLabel: "stack",
    stack: "TypeScript · Python · React · Node · Postgres · LLM integration",
    elsewhereLabel: "elsewhere",
    experienceLabel: "experience",
    listeningLabel: "on repeat",
    interestsLabel: "off the clock",
    interests: "videogames · drawing · tacos · martial arts · combat-sports superfan",
    quirk: "// trains martial arts, still loses sparring to the penguin",
    photoPlaceholder: "[ photo of me ]",
    disclaimer:
      "Every visual aspect of this portfolio — its design, illustrations, and layout — was made by me. AI tools were used only to assist with software development and code generation.",
    note: "→ years of backend. sketchbook since forever. both branches, one repo.",
  },
  contact: {
    eyebrow: "contact",
    // DRAFT — Marco to refine.
    lead: "Commissions open. Engineering roles too.",
    blurb:
      "Tell me what you're building or what you want drawn. I answer within a day or two.",
    statusLabel: "status",
    statusValue: "open to work",
    localTimeLabel: "local time",
    replyTimeLabel: "reply time",
    replyTimeValue: "~24–48h",
    elsewhereLabel: "elsewhere",
    elsewhere: {
      instagram: "@marcobglz — the drawings",
      linkedin: "marco-bosquez — the work history",
      resume: "pdf — one page",
    },
    // DRAFT
    briefs: [
      "→ backend / infra / LLM contract",
      "→ illustration or cover commission",
      "→ tooling for an art or game team",
    ],
    note: "→ the clearer the brief, the faster the reply. tell me the shape of the thing.",
    form: {
      heading: "~/ ./send_message.sh",
      nameLabel: "NAME",
      namePlaceholder: "Your name",
      emailLabel: "EMAIL",
      emailPlaceholder: "you@example.com",
      messageLabel: "MESSAGE",
      messagePlaceholder: "What's up?",
      send: "→ send",
      sending: "sending...",
      success: "Message sent — I'll get back to you soon.",
      genericError: "Something went wrong. Please try again.",
      captchaRequired: "Please complete the CAPTCHA.",
      captchaLoading: "loading captcha...",
    },
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
