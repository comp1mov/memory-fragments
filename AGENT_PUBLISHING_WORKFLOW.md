# Agent Publishing Workflow

This repo is the portal/catalog. The heavy standalone HTML players are published from:

```text
https://github.com/comp1mov/Point-of-View/tree/main/MemoryFragments
```

The portal reads:

```text
data/fragments.manifest.json
```

## Input Needed For A New Fragment

Ask for or extract:

- `title`
- `place`
- `dateLabel`, preferably `YYYY-MM-DD HH:mm`
- Dropbox `.ply` scan URL
- optional Strudel share URL
- short `artistNote`
- `visibility`: usually `unlisted` while testing
- point estimate if known

## Dropbox URL Rule

Convert:

```text
https://www.dropbox.com/scl/fi/.../scan.ply?rlkey=...&dl=0
```

to:

```text
https://dl.dropboxusercontent.com/scl/fi/.../scan.ply?rlkey=...
```

Do not leave `dl=0` in the final HTML or manifest.

## Strudel Rule

Paste the Strudel share URL exactly as supplied by the user.

Do not decode, re-encode, beautify, or repair the Strudel hash unless the user explicitly asks. Put the same URL into:

- `FRAGMENT.strudelTrackUrl`
- `FRAGMENT.musicCredit.url`, if a music/Strudel credit is shown

## HTML Artifact

Create or update the standalone player in the Point-of-View repo:

```text
MemoryFragments/<slug>.html
```

Use the current master shape: one `FRAGMENT` block near the top of the module script. The scan URL and Strudel URL should live there, not scattered through the code.

Check inside the HTML:

```text
FRAGMENT.title
FRAGMENT.place
FRAGMENT.dateLabel
FRAGMENT.scanUrl
FRAGMENT.strudelTrackUrl
```

## Portal Manifest

Add a matching record to:

```text
data/fragments.manifest.json
```

Important fields:

```json
{
  "id": "mf-<slug>",
  "slug": "<slug>",
  "title": "...",
  "place": "...",
  "dateLabel": "...",
  "visibility": "unlisted",
  "status": "published",
  "entry": {
    "htmlFile": "<slug>.html",
    "githubPagesUrl": "https://comp1mov.github.io/Point-of-View/MemoryFragments/<slug>.html",
    "githubBlobUrl": "https://github.com/comp1mov/Point-of-View/blob/main/MemoryFragments/<slug>.html",
    "rawUrl": "https://raw.githubusercontent.com/comp1mov/Point-of-View/main/MemoryFragments/<slug>.html",
    "localReference": "MemoryFragments/<slug>.html"
  },
  "sourceScan": {
    "type": "dropbox-direct",
    "pointCountEstimate": null,
    "url": "https://dl.dropboxusercontent.com/..."
  }
}
```

## Checks

Run from this portal repo:

```bash
node scripts/validate-manifest.mjs
```

If TypeScript is needed on Windows and `tsconfig.tsbuildinfo` is blocked:

```bash
.\node_modules\.bin\tsc.cmd --noEmit --incremental false
```

## Publishing

Push two commits:

1. `Point-of-View`: new or updated `MemoryFragments/<slug>.html`
2. `memory-fragments`: updated `data/fragments.manifest.json`

After GitHub Pages and Vercel deploy, return:

```text
https://memoryfragments.vercel.app/fragments/<slug>
```

The page is a portal/share page. The actual scan opens from its `Open fragment` button.
