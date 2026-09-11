# macdmrk

Marco Bosquez's personal portfolio. Five views (hub · work · gallery · about · contact) with a bilingual (English/Spanish) toggle, synthesized UI sounds, and draggable gallery windows.

## Stack

**Framework**
- **Next.js 15** (App Router) + TypeScript, **React 18**

**Styling**
- **Tailwind CSS v4** — design tokens (`--bg --ink --dim --muted --accent --glass --line --panel …`) live in `src/app/globals.css`, light on `:root` and dark under `.dark`, exposed as utilities via the `@theme inline` block
- **Archivo** (variable `wdth` + `wght`, loaded via `next/font`) for the kinetic type; **JetBrains Mono** for meta text
- **shadcn/ui** — primitives in `src/components/ui/`, built on Radix (`@radix-ui/react-slot`) + `class-variance-authority`
- `clsx` + `tailwind-merge` — power the `cn()` helper in `src/lib/utils.ts`
- **lucide-react** — icon set (brand + monoline marks are inline SVG in `src/components/chrome/`)

**Animation**
- **Motion** (Framer Motion's successor) — gallery window open/close; the aurora drift, view cross-fade, kinetic type, blinking cursor and typewriter are plain CSS/JS, gated behind `prefers-reduced-motion`

**3D**
- **three.js** — hand-built rather than via `@react-three/fiber` (that library conflicts with Next's server rendering) — drives the penguin easter egg on the hub, mounted through a small custom hook (`src/lib/three/use-three-stage.ts`)

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
    layout.tsx         # shell: aurora field + chrome bar + stage + providers
    page.tsx           # hub (hero)
    work/, gallery/, about/, contact/

  components/
    chrome/             # chrome bar, aurora field, shared ViewPane, mobile nav, icons
    providers/          # theme, sound, locale, and cursor (normalized pointer X) providers
    hub/, work/, gallery/, about/, contact/   # per-section UI
    ui/                 # shadcn/ui primitives

  lib/
    data/                # content: projects, illustrations, experience, links
    i18n/                # EN/ES dictionary + Locale type
    three/               # penguin scene builder + the mount/render hook
    utils.ts
```

## Content

Project, illustration, experience and link data lives in `src/lib/data/`.

## Language

The whole site is translated via `src/lib/i18n/dictionaries/`. Terminal-style text (`~/marco`, fake filenames like `today.log` / `shipped.log` / `readme.md`) is intentionally left untranslated — it's meant to read as literal shell output in either language. To add a string, add it to the `Dictionary` type and both the `en` and `es` objects; to add a third language, add it to the `Locale` type and `DICTIONARIES`.

## Note on the design

The visual design and illustrations are original human work — AI tools were only used to help write the code (see the disclaimer on the About page).
