# Landing page visuals and blog list layout

## Status

Accepted. Decided by Rajkumar on 2026-11-12 after reviewing mock-ups, and applied to the real pages the same day. The mock-up routes are deleted.

## Context

Links shared on social sites open on the shared page, in a phone's in-app browser. The landing pages are the blog list, the project list, each project overview and each blog post. The home page is not shared.

An audit on 2026-11-11 found three faults:

- The generated share card overlaps its own text on posts with long titles (seen on `/blog/milewage`).
- Sharing `/blog` sends the home page's card.
- The featured slot on `/blog` shows an empty placeholder when the newest post has no cover.

Seven visual styles and six page layouts were mocked up in `src/app/demo-lab/`. The mock-ups used the brand palette and fonts, but their overall look was judged to be the assistant's default style, not the curated brand.

## Decision

### Visual styles

| Style | Decision | Notes |
|---|---|---|
| Mechanism diagram | Adopt | Reusable across projects and posts. First instance: MileWage (phone, private link, home server). |
| Annotated screenshot | Adopt | A real screenshot plus a handwritten note. |
| Type cover | Redesign before use | The mock-up does not look like the brand. Needs its own design pass. |
| Dithered photo | Explore further | The idea is kept. The current output looks like a mobile game. Find tools and settings that give a professional result. |
| Text (ASCII) diagram | Not decided | No feedback given. |
| Illustrated cover (existing covers) | Not decided | No feedback given. |
| Graffiti and stickers | Not decided | No feedback given. Recommended against in the mock-up. |

### Brand fidelity

Every mock-up needs a second pass against the brand kit in `AGENTS.md` before it is applied. The reference renders are `.github/assets/banner.html` and `.github/assets/credits.html`. A design that could belong to any site is not acceptable.

### Blog list

Combine the two layouts:

- Top of the page: keep the current live design (header card and the large featured post).
- Below it: replace the card grid with the compact rows from the mock-up, each with a small thumbnail, so a reader can skim many titles without scrolling.

### Labs and project lists

Both list pages stay inside the Fumadocs docs layout. Do not change the sidebar on the real pages: not its contents, not its behaviour. The auto-collapse tried in an earlier mock-up is dropped.

The page content and card design of the project list mock-up are approved in direction: an outcome headline, one supporting sentence and a picture per card, one intro line, no Technical Focus Areas. Comma stays as a full card, marked Retired, not a one-line note. The work is confined to the content column.

### Share cards

The first proposal (cream panel, large sans title, hatch fill) is rejected: it does not carry the brand. No direction is chosen yet. A second round, built only from existing brand pieces (the RN mark, the block lettering of `public/social.png`, the conductor stripe, the layout of the README banner), is in `/demo-lab/cards` for review.

### Pixel art

The block lettering of `public/social.png` (one square per cell, 5 x 7 glyphs) is the style Rajkumar was looking for. He calls it pixel art. Use it as the brand's display lettering in covers and cards.

### Applied

- Blog list (`/blog`): live header and featured post kept; earlier posts are compact rows with a thumbnail. Posts without a cover show the RN mark on paper.
- Blog post: author and tags moved to the end. A post with `outcome` (and optional `needs`) in its frontmatter shows a "You end with / You need" box before the body.
- Lab page: build date and tags under the description. A lab with a `covers` list in its frontmatter shows it as a checklist above the topology. "Copy Markdown / Open" moved to the foot of every docs page.
- Project list (`/docs/projects`): the `ProjectGrid` MDX component, four cards, Comma marked Retired. The sidebar is untouched.
- Share cards: the nameplate card (`src/lib/og-card.tsx`) replaces the generated card for docs pages, the blog list and posts without a cover.
- MileWage has a cover: the mechanism diagram with the pixel-art nameplate (`public/blog/covers/milewage.png`).

- Overview pages: Labs, CCNA Labs, MileWage and Comma are each one designed component (`LabsOverview`, `CcnaOverview`, `MileWageOverview`, `CommaOverview`), built from `src/components/docs/overview-parts.tsx`. Their `.mdx` files hold frontmatter and one tag. The sidebar labels each of them "Overview".

### Still open

- Type cover and dithered photo: not designed yet.
- Annotated screenshot: adopted, not used anywhere yet.
- Mechanism diagram: exists only as the MileWage image, not as a reusable component.
- Text diagram, illustrated covers, graffiti: no decision.

## Consequences

- Only one lab (`vlan-labs/intervlan-routing`) has a `covers` list and only one post (`eve-ng-setup-in-proxmox`) has `outcome` and `needs`. Every other lab and how-to needs its own lines written before it shows the checklist or the box.
- The MileWage cover is a static image. A change to the diagram means redrawing it.
- MileWage and tunit still have no real screenshot or recording. The tunit card and share card use the nameplate until one exists.
- Three posts still have no cover (`ccst-journey`, `node-not-starting-in-eve-ng`, `proxmox-problems-and-solutions`). They show the RN mark in the blog list and the nameplate as their share card.
- Fumadocs 16.18 has no "start collapsed" option for the sidebar. The sidebar is left as the layout renders it. On phones it is already a closed drawer.
- The text of the five overview pages now lives in `.tsx` files, not Markdown. It cannot be edited in Obsidian, and it is missing from "Copy Markdown", `llms.txt` and the "On this page" list for those pages. Search finds them only by title and description.
- Social sites cache share cards. A link shared before this change keeps its old card until the site refreshes it.
