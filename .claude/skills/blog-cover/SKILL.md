---
name: blog-cover
description: Design the cover image (and link-preview picture) for a blog post or project on rajkumarneupane.com. Use when the user asks for a cover, header image, hero image, thumbnail, OG or share image, or "a picture for this post/project", or when a new post or project has no cover. Picks the medium from the post's context (real screenshot, real photo, pixel art, mechanism diagram) instead of reusing one template.
---

# blog-cover

A cover is one idea about the post, shown so it reads at link-preview size. It is
not a summary and not a diagram of how the thing works: that belongs in the body.

The medium adapts to the post. The brand holds it together through a few anchors
and strict colour discipline, not through one look.

Supporting files in this folder (not published on the site):
- `research.md`: what the research says, with sources, and the mistakes that made
  earlier covers look generic. Read it before your first cover.
- `pixel-kit.mjs` + `render.mjs`: the pixel medium (grid drawing, PNG export).
- `examples/`: kit usage only. Never reuse an example's design.

## 1. Read the post and take stock

- Read the title, the description, the opening section and the result.
- Name the post type: how-to / lab guide, project or build log, personal story,
  concept explainer, reference / cheat sheet.
- List the real material that exists: screenshots in the post folder, photos of the
  hardware, Marrow topologies, recordings. Real material beats any drawing.

## 2. Find the idea (before any layout)

1. Write a word list of 12 to 15 words from the post's own text: nouns, verbs,
   the name, the result, the problem.
2. Write three concepts, one sentence each, each with a different technique:
   - **Fusion**: two words from the list merged into one object (bone + fibre core).
   - **Pun or literal idiom**: a phrase from the post drawn literally.
   - **Transformation**: a before state turning into the after state.
   - **The real thing plus one note**: a real screenshot or photo with one handwritten
     note pointing at the one detail that matters.
3. Drop any concept that uses a cliché: padlock or shield for security, globe for the
   internet, cloud icon, binary rain, glowing mesh of dots, circuit-board texture,
   hooded hacker, generic server rack, stock laptop.
4. The concept must point at the title or the opening line, so a reader links the
   picture to the post in a second.

## 3. Choose the medium from the context

| Context | Medium | Status |
|---|---|---|
| How-to or lab whose result shows on a screen (EVE-NG, Proxmox, GitLab, a dashboard) | **Annotated real screenshot**: one crop of the real UI, one handwritten note | Adopted |
| Hardware, homelab, physical setup, personal story, and a real photo exists | **Real photo**: one subject, cropped tight; dither only if it looks professional | Explore: mock first |
| A tool or project with its own brand (Marrow, tunit), a concept, or no real visual | **Pixel art** on the 80 x 42 grid (`pixel-kit.mjs`) | Adopted lettering; covers new |
| An architecture post where the mechanism IS the headline | **Mechanism diagram**: 2 or 3 parts, one link, short labels | Adopted (MileWage), use rarely |
| Opinion or essay | Type cover | Not designed yet: do not use |

Pick the medium that carries the chosen concept best. Two posts in a row with the same
medium is fine; two covers with the same composition is not.

## 4. Rules for every medium

- **Size**: 1200 x 630 PNG. Keep the focal object inside the central 87%.
- **Crops**: the blog post header shows covers at 2:1 (`object-cover`), cutting
  about 15 px off the top and bottom; list thumbnails are about 94 x 52 px. On the
  pixel grid that means nothing important in row 0 or row 41: start lettering at
  row 5 and use a 3-row stripe (`k.stripe(g, 3)`).
- **New file name for a new cover** (e.g. `marrow-bottle.png`, not the old name):
  the image optimiser caches by URL for 31 days and social sites cache link
  previews by URL, so an overwritten file keeps showing the old image.
- **One focal point.** If two things compete, delete one.
- **Colour is hierarchy**: full colour on the hero only; everything else in paper
  `#E8E4DA`, cream `#F1EBDE`, ink `#18181b` and one shade. The hero's colour comes from
  the subject: T568B conductors for copper/network posts and the portfolio itself,
  aqua `#19A9B8` only for Marrow, a real screenshot's own colours for screenshots.
- **One visual language per cover.** Do not mix pixel shapes, vector boxes,
  screenshots and handwriting in one frame. The one allowed mix: a real screenshot or
  photo plus one Caveat note.
- **At least one brand anchor**: the T568B stripe along the bottom edge, the RN mark,
  one word in the 5 x 7 block lettering, or a Caveat handwritten note.
- **Text**: at most one word or a short name. Never the full post title (the page and
  the link card already show it). Never CLI prompts or commands as decoration.

## 5. Mock, then build

1. Landing pages are mocked first (AGENTS.md): draw all three concepts as thumbnails
   in `src/app/demo-lab/<slug>-cover/`, each at full width and at 300 px. Delete only
   your own demo files afterwards (other sessions share `demo-lab`).
2. The user picks one. Refine only that one.
3. Build it:
   - Pixel: write `draw(kit)` in a `.mjs` file and run
     `node .claude/skills/blog-cover/render.mjs <cover.mjs> public/blog/covers/<slug>.png`.
     Keep the cover source next to the post's other sources if it may change later.
   - Screenshot or photo: crop the real image, add the note with the Caveat font and
     `HandwrittenArrow` style, export at 1200 x 630.
4. Set `cover:` in the post frontmatter. Project overviews reuse the same file.

## 6. Check before showing

- Look at the 300 px preview (`render.mjs` writes `<name>.preview.png`). Can you tell
  what the hero is in two seconds?
- Count the focal points (one) and the hues besides paper and ink (three at most).
- Ask: could this cover belong to any other site? If yes, it is not done.
- Run `npm run images:optimize -- --check`.
