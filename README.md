# Clockwork Acrobat — local engineering review

A self-contained WebGL 2 wooden automaton. This branch is a local preview; it has not been pushed or deployed. The published version is unchanged.

## Run

Open `index.html`, or serve this directory on loopback:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/`. No build, dependencies, external assets, accounts, backend, keys or AI runtime are required.

## Operate the object

The initial pose is grounded, with only Jump engaged. Turn the front crank: one revolution gives rest, preparation, ascent, apex, landing and settling. The central blue lever controls Jump. The other on-box levers add Bow, Balance, Tumble and Music. Open the brass latch to expose the gear train; tap the door to close it.

Each disengaged output holds its cam angle and pose contribution, including an airborne Jump. Re-engagement resumes from that angle without snapping. Home pose is a separate explicit reset: it returns all shafts to their home positions and retains clutch choices.

Drag bare wood to orbit. Pinch/scroll or +/- inspect closer; Reset view restores the full object. Every part target has a keyboard equivalent; crank arrows turn 15°, Shift + arrow turns 7.5°, Page Up/Down turns 90°. Enter/Space operate a focused lever/latch. The expandable instructions contain larger button alternatives and forward/reverse steps.

Music is opt-in and off by default. Enable Sound and engage Music to hear the original phrase as its barrel turns. Disengagement, mute, focus loss, hiding the page and reduced-motion preference changes stop active voices. The only automatic visual animation is the directly requested hinge opening; reduced motion makes that instant.

## Mechanism

Seven meshed 24-tooth wheels distribute the front-crank input. Four coaxial 12-tooth pinions feed 24-, 36-, 48- and 24-tooth outputs: Bow 1:2, Balance 1:3, Tumble 1:4 and Music 1:2, with counterrotation at each mesh. A central 24:24 take-off drives Jump 1:1 in the input direction after the bus reversal. Teeth, witness marks, hubs, shafts, selector forks, sliding clutch plates, cams and followers share these angles.

Cam angles directly select the puppet's programmed motion curves. The visible radial profiles and vertical follower strokes use those same curves. The blue Jump cam has a 0.16-unit stroke, amplified to a 0.82-unit lift by the ideal lift linkage. Input gears continue to turn when a clutch is off, while its cam/barrel holds still.

This is a bounded kinematic model, not CAD or a force simulation. Spur tooth flanks are simplified; friction clutches couple velocity without inertia or slip transients. Programmed tracks coordinate multiple puppet joints. A clearance guide prevents mixed poses entering the deck. Barrel pins schematically represent the original note program. No manufacturability or physical accuracy is claimed.

## Rendering and checks

The canvas backing buffer follows the actual device pixel ratio without an arbitrary density cap; the hardware renderbuffer limit is the only bound. Multisample antialiasing, denser curved meshes, a 2048px shadow map, layered gear hubs and sharp HTML labels improve clarity. The camera fits the reachable cycle of the current clutch configuration; disengaging a clutch does not reframe the held pose.

```sh
node scripts/check.mjs
node scripts/mechanism-check.mjs
```

The first checks embedded JavaScript syntax and self-contained content. The second checks five ratios/directions, tooth phases, clutch hold/re-engagement, reversal, cam samples and audio-travel gating.

Browser checks use Mac Chrome, desktop DPR 2 and portrait/touch emulation at DPR 3. They do not establish physical-iPhone/Safari performance or subjective audio quality. Review captures and detailed observations are retained outside this worktree.
