# macdmrk

Marco Bosquez's personal portfolio — a terminal/desktop-OS themed site split between the professional side (work, about, contact) and a gallery of illustrations, with a bilingual (English/Spanish) toggle.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** — theme tokens live in `src/app/globals.css` (`@theme` block)
- **shadcn/ui** — primitives in `src/components/ui/`
- **Motion** (Framer Motion) — window open/close and mobile nav animations
- **three.js** — the 3D avatar and penguin easter egg on the home page, hand-built rather than via `@react-three/fiber` (that library conflicts with Next's server rendering)
- **next-themes** — dark/light mode, default dark

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build + type-check
npm run lint    # ESLint
```

## Project structure

```
src/
  app/                 # one folder per route (Next.js App Router)
    layout.tsx         # shared chrome: window frame, top bar, providers
    page.tsx           # home page (hero)
    work/, gallery/, about/, faq/, contact/

  components/
    chrome/             # top bar, bordered window frame, mobile nav, language toggle
    providers/          # theme, sound, and locale context providers
    hub/, work/, gallery/, about/, faq/, contact/   # per-section UI
    ui/                 # shadcn/ui primitives

  lib/
    data/                # placeholder content (projects, FAQs, experience) — edit these to add real content
    i18n/                # EN/ES dictionary + Locale type
    three/               # 3D scene builders + the mount/render hook
    utils.ts
```

## Content

Placeholder project, illustration, FAQ, and experience data lives in `src/lib/data/`. Swap in real content there — each entry is typed, so TypeScript will flag anything missing.

## Language

The whole site is translated via `src/lib/i18n/dictionaries.ts`. Terminal-style text (`whoami`, `work.exe`, `ls -la`, fake filenames) is intentionally left untranslated — it's meant to read as literal shell output in either language. To add a string, add it to the `Dictionary` type and both the `en` and `es` objects; to add a third language, add it to the `Locale` type and `DICTIONARIES`.

## Note on the design

The visual design and illustrations are original human work — AI tools were only used to help write the code (see the disclaimer on the About page).
