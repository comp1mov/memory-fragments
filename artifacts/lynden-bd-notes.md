# Lynden Birthday

Release revised 2026-09-14. Visibility: `unlisted`.

- Scan label: Lynden Birthday 19:14 05.04.2025.
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

Normalized cloud scale 3, rotation 0. Four curated camera positions face the open side of the room. Cloud rotation stays off so the table remains visible from those positions. Intro: 70 seconds (five times slower than the first release); idle camera transitions: 14 seconds. Portrait view uses a wider vertical field of view.

New-copy fixes: camera transitions synchronize the smooth-wheel zoom distance, aim at the interpolated target, and clear queued zoom movement; intro blocks idle cameras until assembly ends; audio effect uniforms reset when audio is stopped.

The iPad revision uses AlgoRhythms native OrbitControls gestures and native wheel zoom with push-through at minimum distance. HOSQ smooth-wheel zoom and touch arrows are disabled: its wheel-distance easing was undoing native pinch zoom. Pointer input interrupts automatic transitions before OrbitControls receives the event. Coarse-pointer music/help targets are 44 pixels. Point size is 0.0055 (previously 0.004); size variation remains 0.7. Audio sweeps and coloured flicker use amber/orange tones.

## Music

Cheers is the user-supplied 112 BPM Strudel score, preserved without musical changes: a relaxed groove with piano, guitar, bass and percussion, a build-up, a more active section and a return to calm. Only the track title appears in the loading-screen music credit.

The standalone player applies a 0.4 postgain at playback to leave headroom for stacked voices. The source score, embedded score and Strudel editor link retain the exact supplied code.

The single `@` button starts/stops Cheers and its audio response. There is no separate Play button. It loads `@strudel/web@1.3.0`, Dirt-Samples percussion/guitar sounds and the dough-samples piano. Samples are preloaded before the first beat. Music starts only after a click. The analyser drives the point effects without requesting microphone permission. The Strudel editor link contains the same score as the HTML. Closing the optional editor unloads its iframe to prevent hidden audio overlapping the player.

Integration reference: https://strudel.cc/technical-manual/project-start/
Samples reference: https://strudel.cc/learn/samples/

## Verification

Browser checks: full point count; four camera presets and no position drift; idle camera change and interruption by wheel input; nonblank canvas screenshots; desktop 1440 x 900 and portrait 390 x 844; music start/stop; nonzero audio waveform and reactive uniforms; clean browser errors. Additional production and portal checks are recorded in the release conversation.

The 2026-09-14 checks reproduce pinch snap-back in the previous release and verify retained pinch zoom, one-finger orbit, two-finger pan, first-touch interruption of a camera transition, larger touch targets, orange uniforms, music start/stop and the complete 70-second intro. Tablet testing uses Chromium touch emulation at 1024 x 1366, not physical iPad Safari. The local authoring workspace also passes export/re-import, camera capture and draft-recovery checks.

Publishing follows `../AGENT_PUBLISHING_WORKFLOW.md`: copy the HTML to `Point-of-View/MemoryFragments/lynden-bd.html`, publish that repository, then publish the portal manifest and cover.

- Portal: https://memoryfragments.vercel.app/fragments/lynden-bd
- Player: https://comp1mov.github.io/Point-of-View/MemoryFragments/lynden-bd.html
