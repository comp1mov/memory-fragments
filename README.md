# memory-fragment-portal

Purpose: Vercel-facing portal for Spatial Memory Fragments.

This app should become the public gallery/landing surface for existing and future fragments. It is separate from:

- `memory-fragment-viewer`: lightweight runtime for a single fragment;
- `memory-fragment-factory`: creation/export tool;
- `postpointless-studio-lab`: artist/editor surface.

## MVP Direction

Start with a Next.js app on Vercel that reads a static manifest and renders a gallery grid.

Initial data source:

- existing published files in `comp1mov/Point-of-View/MemoryFragments`;
- GitHub Pages URLs such as `https://comp1mov.github.io/Point-of-View/MemoryFragments/AR.html`;
- seed metadata in `data/fragments.manifest.json`.

## Visibility Model

MVP visibility should be explicit but conservative:

- `public`: visible in the main gallery and shareable;
- `unlisted`: hidden from the main gallery but shareable by direct URL;
- `private`: reserved for a later auth/storage phase.

Important: a fragment hosted as a public GitHub Pages HTML file cannot be truly private. Real private fragments require auth plus non-public storage or a protected deployment path.

## Captured Product Decisions

- Interface language: minimal English.
- First release priority: gallery/archive and convenient sharing, not a full no-code creation UI.
- Fragment privacy for now means `unlisted`: hidden from the public grid but available by direct URL.
- Each fragment can remain a standalone HTML player/artifact.
- Different fragments may use different player families and versions.
- The portal catalogs fragments; it should not flatten away the uniqueness of each scan.
- Covers/screenshots will be supplied manually at first.
- Portal preview slots stay lightweight: no scan iframe by default.
- PLY files stay on Dropbox/direct links for the MVP.
- Later export formats may include HTML + remote PLY, ZIP bundle, or fully embedded HTML.
- `Open fragment` opens the player in a new tab.
- HTML download is disabled by default and can become a per-fragment option later.
- Categories are intentionally flexible and can evolve: place, event, collective, audio, Strudel, architecture, home, performance, and so on.
- A fragment should eventually contain a small portal/archive link so viewers can return from the scan to the grid.
- Preferred Vercel project/domain shape: `memory-fragments`; underscores are avoided in the public domain.

## First Routes

Suggested first routes:

- `/`: public memory grid;
- `/fragments/[slug]`: detail/share page for one fragment;
- `/admin`: later management surface;
- `/new`: later creation flow or link into `memory-fragment-factory`.

The current default is to open each fragment/player in a new tab. HTML download is disabled by default and should become a per-fragment option later.

The grid uses only `public` fragments. Fragment routes are generated for all `published` fragments, so future `unlisted` records can be shared directly without appearing in the public grid.

Fragment detail pages do not embed the heavy legacy scan/player by default. They use a lightweight cover slot from the manifest; until screenshots or videos are added, the slot renders a static placeholder. The actual scan opens only through `Open fragment`.

Public sitemap output uses only the same `public` grid records. `unlisted` fragments should stay out of the grid and sitemap, while still being available by direct `/fragments/[slug]` URL when `status` is `published`.

## Build Order

1. Render the static grid from `data/fragments.manifest.json`.
2. Add detail/share pages with `Open fragment` and `Copy link`.
3. Add filters for place, year, audio, and visibility.
4. Add covers/screenshots or short preview videos.
5. Add unlisted/private logic once the storage/auth decision is made.
6. Add optional per-fragment downloads.
7. Replace static manifest with database-backed records when creation/editing becomes real.

## Local Commands

```bash
npm install
npm run dev
npm run validate:manifest
npm run typecheck
npm run build
```

`npm run validate:manifest` should pass before adding a new fragment to the grid. It checks duplicate IDs/slugs, required metadata, URLs, visibility/status values, player metadata, and whether downloads were accidentally enabled.

## Vercel Notes

Suggested project root:

```text
apps/memory-fragment-portal
```

Suggested production URL:

```text
https://memoryfragments.vercel.app
```

Set `NEXT_PUBLIC_SITE_URL` in Vercel if the production URL or custom domain changes. Without that env var, the app uses `https://memoryfragments.vercel.app` as its canonical URL.

`vercel.json` pins the framework preset to `nextjs`, so the project should not be treated as a generic static site expecting a `public` output directory.

The hyphenated alias `memory-fragments.vercel.app` is already taken outside this project, so the current clean Vercel production alias is `memoryfragments.vercel.app`.

Current local dev URL:

```text
http://127.0.0.1:3000
```
