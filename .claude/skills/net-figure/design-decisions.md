# Design decisions

## Title

Data-driven animated network figures

## Status

Accepted. First version, 2026-11-09. Improved in small steps.

## Context

- Lab guides and posts relied on Packet Tracer screenshots. A screenshot shows what was clicked, not what the network did.
- The Fumadocs landing page (fumadocs.dev) showed a stronger pattern: each section has one moving figure that proves one sentence. Its code separates content data from drawing and motion, and holds to strict constraints: one palette, one easing curve, one rhythm.
- The site already has a brand system: the T568B conductor palette, Geist and Geist Mono, hatched panels.
- Content is written in Obsidian as MDX. Figures must be usable from MDX without writing code.
- Marrow already produces interactive static topologies. Figures must not duplicate it.

## Decision

- **One figure, one claim.** The title is a checkable sentence. Steps prove it. Two claims make two figures.
- **Data, not code.** A figure is a typed object in `src/figures/`. MDX references it by id: `<NetFigure id="…" />`. Obsidian authors never touch component code.
- **Kit owns the look.** `src/components/figures/` draws devices, cables, ports, packets, the console and tables. Figures cannot set their own colours, fonts or easing.
- **Brand constraints.** Cables use the four T568B pair colours with a striped variant. Labels use Geist Mono. Panels use the hatched texture.
- **Packets follow cables.** A packet takes a list of devices. The kit joins the cables between them and moves the packet hop by hop, with a short pause at each device.
- **Animation outside React.** Packets move by writing SVG transforms each frame. React renders once per step, so motion does not cause re-renders.
- **State carries forward.** Notes, port states, console and table persist across steps. Stepping backwards recomputes state from step one, so every step is reachable directly.
- **Accessible by default.** Each step's caption is announced. A text version is generated from captions and commands. Reduced motion shows still frames.
- **A skill writes figures.** `.claude/skills/net-figure/SKILL.md` encodes the rules: claim first, 3–6 steps, real interface names, real IOS output, an accuracy check before use.

## Consequences

Positive:

- A new figure takes minutes and needs no design work.
- All figures look consistent and improve together when the kit improves.
- Captions double as accessible text and as the figure's outline.
- Figures load only on pages that use them.

Negative:

- Layout is manual: device coordinates are set by hand.
- Only five device glyphs and five cable routes exist.
- Protocol accuracy depends on review. The kit cannot check it.
- Text inside the stage is small on phones; the stage scrolls sideways instead of reflowing.

## Next improvements

- Dithered reveal for packets and panels, using a 4 × 4 Bayer mask, in the brand palette.
- More glyphs: firewall, access point, Layer 3 switch, wireless client.
- A `VLAN tag` animation that adds and removes the tag mid-hop.
- Pause autoplay when the figure leaves the viewport.
- Generate device layout from a Marrow YAML file, so one source drives both the topology and the figure.
- The router-on-a-stick figure for the [inter-VLAN routing lab](/docs/labs/vlan-labs/intervlan-routing).
