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

This is a Next.js 16 personal portfolio site using the App Router, React 19, Tailwind CSS v4, and Framer Motion.

### Layout & Pages

- `app/layout.tsx` — Root layout. Mounts two global client components (`<Cursor />` and `<KeyWatcher />`) that apply to every page. Loads three fonts via `next/font/google`: Geist Sans (`--font-geist-sans`), Geist Mono (`--font-geist-mono`), and Newsreader (`--font-newsreader`).
- `app/page.tsx` — Main page. Two-column layout: sticky left column (intro/links) and scrollable right column (experience, R&D projects, featured projects).
- `app/about/page.tsx` and `app/fun/page.tsx` — Stub pages, not yet built out.

### Global Interactivity (client-side)

- `app/components/logic/keyWatcher.tsx` — Listens for keyboard shortcuts globally:
  - `d` — toggles `dark` class on `<html>` (dark mode)
  - `n` — toggles `show-notes` class on `<html>` (reveals hidden annotations)
- `app/components/cursor.tsx` — Custom cursor using Framer Motion `useMotionValue`. Replaces the native cursor sitewide (set to `cursor: none !important` in CSS). Grows on hover over `a`, `button`, `.cursor-pointer`, or `[data-cursor]` elements.

### Data Layer

Content is driven by static JSON files in `app/data/`:
- `jobs.json` — Work experience entries rendered by `app/components/positions/info.tsx`
- `featured/featured.json` — Featured projects rendered on the main page
- `current/current.json` — Current R&D projects rendered on the main page

Each JSON entry supports an optional `"note"` field. Notes are hidden by default and revealed when the `show-notes` class is present on `<html>` (toggled via the `n` key). The `.note-annotation` CSS class handles the animated reveal.

Project cards (`app/components/cards/card.tsx`) support `image`, `video`, or neither (fallback grey box). Cards with a `"link"` field are wrapped in a Next.js `<Link>`; those without are plain `<div>`s.

### Styling

- Tailwind CSS v4 (configured via `@import "tailwindcss"` in `globals.css`, no `tailwind.config` file).
- Dark mode uses the `.dark` class on `<html>` (not `prefers-color-scheme` — though `keyWatcher` initialises dark mode from the system preference on first load).
- Brand green: `#1E5B1A`. Main text dark: `#32404F`. Main text light: `#FAFCFD`.
- The hero title has a CSS wipe animation (`.wipe-word`, `.wipe-1`, `.wipe-2`) that colour-wipes words to brand green on hover.
- Media thumbnails live in `public/thumbnails/main/` as `.webp` images or `.mp4` videos.
