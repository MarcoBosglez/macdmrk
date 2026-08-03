# macdmrk

Marco Bosquez's personal portfolio — a terminal/desktop-OS themed site split between the professional side (work, about, contact) and a gallery of illustrations, with a bilingual (English/Spanish) toggle.

## Stack

**Framework**
- **Next.js 15** (App Router) + TypeScript, **React 18**

**Styling**
- **Tailwind CSS v4** — theme tokens live in `src/app/globals.css` (`@theme` block)
- **shadcn/ui** — primitives in `src/components/ui/`, built on Radix (`@radix-ui/react-slot`) + `class-variance-authority` for variants
- `clsx` + `tailwind-merge` — power the `cn()` class-merging helper in `src/lib/utils.ts`
- **lucide-react** — icon set

**Animation**
- **Motion** (Framer Motion's successor) — window open/close, the gallery lightbox, mobile nav, and the boot screen

**3D**
- **three.js** — hand-built rather than via `@react-three/fiber` (that library conflicts with Next's server rendering) — drives the hero avatar and the penguin easter egg, mounted through a small custom hook (`src/lib/three/use-three-stage.ts`)

**Sound**
- No library — every UI sound (nav clicks, window open/close, the penguin's honk) is synthesized on the fly with the native **Web Audio API** in `src/components/providers/sound-provider.tsx`

**Gallery**
- No lightbox library either — the fullscreen art windows are hand-built with React Portals (`createPortal`) + Motion for the open/close animation. Image dimensions are read from disk at build time via **image-size**, so the grid can lay out without shifting once images load.

**Theming**
- **next-themes** — dark/light mode, default dark

**Backend / infra**
- **Resend** — sends contact form emails
- **Upstash Ratelimit** + **Upstash Redis** — rate-limits contact form submissions
- **Cloudflare Turnstile** — CAPTCHA on the contact form (called directly via `fetch`, not an npm package)

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
