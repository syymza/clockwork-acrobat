# Clockwork Acrobat

A hand-cranked wooden acrobat in genuine 3D. Turn the dial to bow, balance or tumble; open the casing to see the gears and linkages. Drag the object to orbit it. The large canvas, pastel natural materials and opt-in crank music are the approved review version.

## Run locally

Open `index.html` in a modern browser with WebGL 2, or serve this directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765/`. No install or build is required. HTML, CSS, JavaScript, geometry, textures and original music are self-contained. There are no external assets, accounts, backend, database, API keys, AI runtime or telemetry.

## Controls

- Drag the separate brass dial in a circle, in either direction. Step is an alternative to dragging.
- Focus the dial: arrows turn 15 degrees; Shift plus arrow turns 7.5; Page Up/Down turns 90; Enter/Space turns 30.
- Drag the object to orbit. Focus it and use arrows to rotate, plus/minus to zoom, Home to reset. Touch supports orbit and pinch zoom.
- Choose Bow, Balance or Tumble; open the casing to expose the mechanism.
- Sound starts off. Enable it, then turn to play the original music-box phrase. Mute, page hiding, focus loss and reduced-motion preference changes stop voices. The model moves only with direct input, with no autoplay.

These are stylized motions and linkages, not an accurate mechanical simulation.

## Checks and review limits

Run `node scripts/check.mjs` for JavaScript syntax and self-contained asset checks. No third-party test dependencies are required.

The approved version was reviewed in desktop Chrome and browser touch/viewport emulation. Checks covered repeated crank and orbit drags, cancellation, mode changes, resize cleanup, pinch limits, keyboard alternatives, 320px and 390px portrait layouts, and sound state handling. A 288-pose, 36-view sample produced 12.77 million bounds checks without clipping at default fit; sampled head/hat and hand vertices cleared the tabletop. No WebGL errors or captured console warnings/errors were reported.

These are sampled checks, not continuous collision proof. Physical-iPhone, Safari and subjective listening have not been tested. WebGL 2 is required.

## Review status

Prepared for a draft pull request. Hosting is not enabled. No Pages workflow, deployment configuration or paid service is included. Earlier variants and scratch/review assets are deliberately excluded.
