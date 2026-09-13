# Lynden BD

Release prepared 2026-09-13. Visibility: `unlisted`.

- Scan label: Lynden BD 19:14 05.04.2025.
- Place: The Sun Inn, Barnes, London, UK.
- Date: 2025-04-05 19:14, taken from the supplied scan label. The attached calendar screenshot showed 2027 and was not used as the scan date.
- PLY: 2,543,769 RGB points, binary little-endian, 38,156,787 bytes. All XYZ coordinates finite.
- Original bounds: X -1.8671 to 5.2912, Y -1.2967 to 1.2919, Z 0.3518 to 7.5254.
- Source metadata: `../data/lynden-bd.fragment.json`.
- Source music: `../data/lynden-bd.strudel.js`.
- Authoritative player: `lynden-bd.html`; includes all fragment metadata and music in its FRAGMENT block.
- Cover: `../public/covers/lynden-bd.jpg`, captured from the actual player, camera 2, with music stopped and controls hidden.

Based on the HOSQ `v052.7-anchor-safe-arrows` player, from the AlgoRhythms / Memory Fragment master family. Existing players are unchanged.

## Fragment Settings

Normalized cloud scale 3, rotation 0. Four curated camera positions face the open side of the room. Cloud rotation stays off so the table remains visible from those positions. Intro: 14 seconds; idle camera transitions: 14 seconds. Portrait view uses a wider vertical field of view.

New-copy fixes: camera transitions synchronize the smooth-wheel zoom distance, aim at the interpolated target, and clear queued zoom movement; intro blocks idle cameras until assembly ends; audio effect uniforms reset when audio is stopped.

## Music

cheeeees! is an original 156 BPM rock-and-roll Strudel sketch: twelve-bar boogie, shuffled eighth notes, walking bass, sampled piano and guitar, handclaps, four-bar drum fills and alternating twelve-bar lead choruses. It does not use a recording or melody from the Beatles.

The play button loads `@strudel/web@1.3.0`, Dirt-Samples percussion/guitar sounds and the dough-samples piano. Samples are preloaded before the first beat. Music starts only after a click. The analyser drives the point effects without requesting microphone permission. The Strudel editor link contains the same score as the HTML.

Integration reference: https://strudel.cc/technical-manual/project-start/
Samples reference: https://strudel.cc/learn/samples/

## Verification

Browser checks: full point count; four camera presets and no position drift; idle camera change and interruption by wheel input; nonblank canvas screenshots; desktop 1440 x 900 and portrait 390 x 844; music start/stop; nonzero audio waveform and reactive uniforms; clean browser errors. Additional production and portal checks are recorded in the release conversation.

Publishing follows `../AGENT_PUBLISHING_WORKFLOW.md`: copy the HTML to `Point-of-View/MemoryFragments/lynden-bd.html`, publish that repository, then publish the portal manifest and cover.

- Portal: https://memoryfragments.vercel.app/fragments/lynden-bd
- Player: https://comp1mov.github.io/Point-of-View/MemoryFragments/lynden-bd.html
