# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

This is a Next.js 16 personal portfolio site using the App Router, React 19, Tailwind CSS v4, and Framer Motion. The aesthetic is "Editorial Gallery" — high-end magazine typography meets clean engineering.

### Layout & Pages

- `app/layout.tsx` — Root layout. Mounts two global client components (`<Cursor />` and `<KeyWatcher />`) that apply to every page. Loads three fonts via `next/font/google`: Geist Sans (`--font-geist-sans`), Geist Mono (`--font-geist-mono`), and Boska (`--font-boska`).
- `app/page.tsx` — Main page. Asymmetrical split-screen: sticky left column (intro/links) and scrollable right column (experience, R&D projects, featured projects). Outer container is `max-w-[1600px] mx-auto` — use this on all pages.
- `app/about/page.tsx` — Stub. Intended as a single-column editorial reading experience.
- `app/fun/page.tsx` — Stub. Intended for masonry grids (`columns-1 md:columns-2 lg:columns-3`) showcasing media, music, and photography.

Every new page MUST import and render `<Header />` and `<Footer />`. Do not rebuild navigation per page.

### Global Interactivity (client-side, do not modify core behaviour)

- `app/components/logic/keyWatcher.tsx` — Listens for keyboard shortcuts globally:
  - `d` — toggles `dark` class on `<html>` (dark mode; also initialised from `prefers-color-scheme` on first load)
  - `n` — toggles `show-notes` class on `<html>` (reveals hidden annotations)
- `app/components/cursor.tsx` — Custom cursor using Framer Motion `useMotionValue`. Must remain a 1:1 responsive circle with no lag or heavy spring. Uses hardware-based touch detection to hide on mobile — do not alter this logic. Replaces the native cursor sitewide (`cursor: none !important`). Grows/fades on hover over `a`, `button`, `.cursor-pointer`, or `[data-cursor]` elements.

### Data Layer

All content is driven by static JSON files in `app/data/`. New content sections must follow the same pattern.

- `jobs.json` — Work experience, rendered by `app/components/positions/info.tsx`
- `featured/featured.json` — Featured projects
- `current/current.json` — Current R&D projects

Each entry supports an optional `"note"` field. Notes are hidden by default and revealed when `show-notes` is on `<html>` (the `n` key). The `.note-annotation` CSS class in `globals.css` handles the animated blur/fade reveal. Note text is always `#1E5B1A`.

`app/components/cards/card.tsx` is the universal card for all grid/masonry items. It supports `image`, `video`, or neither (fallback grey box). Cards with a `"link"` field are wrapped in a Next.js `<Link>`; those without render as a `<div>`. Hover effect is a `white/30` frosted overlay — no scale or zoom animations on the media.

### Styling

- Tailwind CSS v4 (configured via `@import "tailwindcss"` in `globals.css` — no `tailwind.config` file).
- Dark mode: `.dark` class on `<html>`, not media query.
- **Colour palette** (all defined as CSS variables in `globals.css`, exposed as Tailwind tokens):
  - Background: `#F7F7F7` (light) / `#121417` (dark) → `bg-background`
  - Primary ink: `#32404F` (light) / `#FAFCFD` (dark) → `text-foreground`, `text-foreground/58` for dimmed
  - Accent green: `#1E5B1A` → `text-accent`, `bg-accent`, `hover:text-accent`
  - Glass surfaces: `bg-glass/40` (desktop nav), `bg-surface/80` or `/95` (mobile)
  - Dimmed text: use `text-foreground/58` (not a hardcoded hex) for secondary text
- **Font size tokens** (defined in `@theme` in `globals.css`):
  - `text-body` — 15px, used for all body text, captions, nav, labels
  - `text-card` — 18px, used for card/project titles
  - `text-hero` — 50px, used for the main hero h1
- **Typography rules:**
  - `Boska` (serif) — hero text and card/section titles → `font-[family-name:var(--font-boska)]`
  - `Geist Mono` — technical details, dates, navigation labels, captions → `font-[family-name:var(--font-geist-mono)]`
  - `Geist Sans` — body text and hidden notes → `font-[family-name:var(--font-geist-sans)]`
  - Note: always use the explicit `family-name` arbitrary syntax shown above, not the shorthand `font-mono`/`font-sans`/`font-serif` utilities — Next.js scopes font variables to `body`, so the Tailwind shorthands don't resolve them correctly.
- The hero title has a CSS wipe animation (`.wipe-word`, `.wipe-1`, `.wipe-2`) that colour-wipes words to brand green on hover.
- Media thumbnails live in `public/thumbnails/main/` as `.webp` images or `.mp4` videos.
