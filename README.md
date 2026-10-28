# macdmrk

Marco Bosquez's personal portfolio — a bilingual (English/Spanish) site with a hub, project case studies, an illustration gallery, and a contact page.

## Stack

- **Framework** — Next.js 15 (App Router), TypeScript, React 18
- **Styling** — Tailwind CSS v4 — design tokens in `src/app/globals.css`, light/dark via `.dark`
- **Type** — Archivo (variable font, via `next/font`) for display text, JetBrains Mono for terminal-style text
- **Animation** — Motion (Framer Motion's successor); ambient effects (aurora drift, kinetic type, cursor) are plain CSS/JS, gated behind `prefers-reduced-motion`
- **Icons** — lucide-react
- **Gallery** — hand-built lightbox (React Portals + Motion); `image-size` reads each image's dimensions at build time so the grid never shifts on load
- **Sound** — every UI sound is synthesized on the fly with the Web Audio API — no audio files, no library
- **Theming** — next-themes (dark/light, default dark)

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

## Structure

```
src/
  app/            # routes — hub (/), work, gallery, about, contact
  components/     # chrome bar, providers (theme/sound/locale), per-section UI
  lib/
    data/         # projects, illustrations, experience, links
    i18n/         # EN/ES dictionaries
```

## Language

Fully bilingual via `src/lib/i18n/dictionaries/`. Terminal-style text (fake filenames, shell prompts) is left untranslated on purpose — it's meant to read as literal output in either language. To add a string, add it to the `Dictionary` type plus both the `en` and `es` objects; to add a language, extend `Locale` and `DICTIONARIES`.

## Note on the design

The visual design and illustrations are original human work — AI tools were only used to help write the code (see the disclaimer on the About page).
