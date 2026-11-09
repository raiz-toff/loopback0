---
name: net-figure
description: Create an animated, step-through network figure (packets moving over T568B cables, a typing CLI, tables, port states) for a lab guide or blog post on rajkumarneupane.com. Use when the user asks for a figure, animation, diagram of traffic, or "show how X works" for a networking concept (DHCP, ARP, STP, VLAN tagging, routing, NAT, ACLs, OSPF), or when a section explains a mechanism that a screenshot cannot show.
---

# net-figure

A figure proves ONE sentence by showing the network doing it. It is a data file in
`src/figures/`, rendered by `<NetFigure id="…" />` (`src/components/figures/`).
Live demo of every part: `/figures`.

Supporting files in this folder (not published on the site):
- `guide.md`: step-by-step process for making a figure by hand or with an agent.
- `reference.md`: every data field and its effect.
- `design-decisions.md`: why the kit works this way, and the improvement backlog.

## 1. Find the claim first

- Write the title as one sentence a reader can check: "STP blocks one port so a loop
  cannot melt the network." Not a topic ("Spanning Tree").
- One mechanism per figure. If the claim needs "and", make two figures.
- If nothing moves (a static topology), use Marrow (`<Topology>`) instead, not this.

## 2. Lay out the devices

- Canvas: `size: [640, 250–300]`. Keep devices ≥ 150 units apart horizontally and
  ≥ 120 vertically, and ≥ 70 from every edge (labels and notes sit under each tile).
- Flow left to right (client → network → server), or top to bottom for trees.
- Kinds: `pc`, `switch`, `router`, `server`, `cloud`. Use real hostnames (`R1`, `SW1`).
- `note` = the one fact that changes in the story (an IP, "root bridge"). Change it per
  step with `notes`.

## 3. Cable them

- Every link gets `aPort` / `bPort` with real interface names (`g0/1`, `eth0`).
- Route: aligned devices go straight. For a device below and to the side, use
  `route: 'vh'` from the lower device so cables enter the upper device's side,
  not all at one point. `hvh` / `vhv` give Z-shapes.
- Colours are the four T568B pairs (`orange`, `green`, `blue`, `brown`); `striped: true`
  is the white-banded conductor. Give neighbouring cables different colours.
- `label` only when the link type matters (`trunk`, `802.1Q`).

## 4. Write the steps (3 to 6)

Each step is one beat of the explanation:

- `caption`: one sentence, ≤ 20 words, present tense, says WHY not only what.
- `packets`: `{ path: [device ids in order], label, color, tag?, drop? }`.
  - `label` ≤ 10 characters, the protocol's own name for the message (`DISCOVER`,
    `BPDU`, `ARP REQ`).
  - Same message type = same colour in a figure.
  - Several packets in one step move together (floods, broadcasts).
  - `tag` shows a header added on the way (`VLAN 10`).
  - `drop: true` stops it at the last device's port with a ✕ (blocked port, ACL deny).
- `cli`: `{ device, cmd, out }`. Use the command a CCNA engineer would run to verify
  that step, with output trimmed to the 1–4 lines that prove it. Output must match real
  Cisco IOS format; never invent fields.
- `table`: `{ title, cols, rows, fresh }` for state that builds up (MAC table, ARP cache,
  routing table). Mark new rows in `fresh`.
- `ports`: `{ 'SW3:g0/2': 'blocking' | 'down' }`. `focus`: device ids to keep bright.
- `notes`, `ports`, `cli` and `table` carry forward, so only set what changes.

## 5. Accuracy check (required)

Before registering, check each step against how the protocol really behaves
(broadcast vs unicast, which side blocks, what the switch floods, timer values). If a
detail is simplified, the caption must not claim the detail. When unsure, say so to
the user rather than guessing.

## 6. Register and use

1. Create `src/figures/<id>.ts` exporting a `Figure` (copy `dhcp-dora.ts` as a template).
2. Add it to the `figures` map in `src/figures/index.ts`.
3. In MDX: `<NetFigure id="<id>" />` right after the paragraph that states the claim,
   before the configuration steps.
4. Run `npx tsc --noEmit` and open the page. Step through every step once.

## Rules

- Never replace a figure's text version: it is generated from the captions; write
  captions that read well on their own.
- Do not add new colours, fonts or easing to a single figure. Improve the kit in
  `src/components/figures/` instead, so every figure gets it.
- Respect `prefers-reduced-motion`: the kit already shows still frames; do not add
  animation outside it.
