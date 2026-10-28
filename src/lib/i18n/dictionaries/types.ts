// Supporting two languages (english, spanish)
// TODO: Add italian when I'm fluent with it
export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

// Small helper variable type for english/spanish descriptions
export type Localized = { en: string; es: string };

export function localize(value: Localized, locale: Locale): string {
  return value[locale];
}

// Dictionary of all translatable texts/objects.
export type Dictionary = {
  nav: {
    home: string;
    about: string;
    work: string;
    gallery: string;
    contact: string;
  };
  chrome: {
    openToWork: string;
  };
  hub: {
    eyebrow: string;
    role: string;
    location: string;
    bio: string;
    chips: string[];
    // The "→ ..." line in the start_here.txt note
    note: string;
  };
  work: {
    eyebrow: string;
    range: string;
    whyLabel: string;
    whatIDid: string;
    outcomeLabel: string;
    roleLabel: string;
    linkHint: string;
    viewProject: string;
    viewCode: string;
    learnMore: string;
    backToWork: string;
    note: string;
    // TODO: these are new (project-work revamp from advisor feedback) —
    // double check the wording reads well once real content is in.
    contributionsLabel: string;
    challengesLabel: string;
    processLabel: string;
    filterAll: string;
    kindFeatured: string;
    kindPersonal: string;
    kindAcademic: string;
    kindProfessional: string;
    processTodo: string;
    challengesToggle: string;
    // TODO: "design D" case-study adaptation — new labels for the
    // richer /work/<slug> layout (meta grid, stack table, diagram).
    tldrLabel: string;
    backstoryLabel: string;
    timelineLabel: string;
    teamLabel: string;
    statusLabel: string;
    stackLabel: string;
    themeLabel: string;
    inputLabel: string;
    coreLabel: string;
    outputLabel: string;
    beforeLabel: string;
    goalLabel: string;
    fixLabel: string;
    allProjects: string;
    tocLabel: string;
    cmdLabel: string;
    typeLabel: string;
    usageLabel: string;
    // TODO: "design I" /work homepage-grid adaptation (featured row +
    // filtered, paginated grid) — double check wording once more
    // projects are added and pagination actually kicks in.
    allWorkLabel: string;
    projectsSuffix: string;
    rangeOf: string;
    noProjectsYet: string;
    prevPageLabel: string;
    nextPageLabel: string;
    pageLabel: string;
  };
  gallery: {
    eyebrow: string;
    countJoiner: string;
    filterAll: string;
    dragHint: string;
    note: string;
  };
  about: {
    eyebrow: string;
    greeting: string;
    lead: string;
    leadAccent: string;
    stackLabel: string;
    stackChips: string[];
    elsewhereCta: string;
    experienceLabel: string;
    interestsLabel: string;
    interests: string;
    quirk: string;
    disclaimer: string;
    workCta: string;
    note: string;
  };
  contact: {
    eyebrow: string;
    lead: string;
    blurb: string;
    statusLabel: string;
    statusValue: string;
    localTimeLabel: string;
    replyTimeLabel: string;
    replyTimeValue: string;
    basedInLabel: string;
    basedInValue: string;
    basedInSub: string;
    elsewhereLabel: string;
    elsewhere: {
      linkedin: string;
      github: string;
      instagram: string;
      altEmail: string;
      phone: string;
      resume: string;
    };
    note: string;
  };
  notFound: {
    title: string;
    description: string;
    cta: string;
  };
  errorPage: {
    title: string;
    description: string;
    retry: string;
    cta: string;
  };
};
