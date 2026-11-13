// Cover for /blog/marrow, made with the blog-cover skill (.claude/skills/blog-cover).
// Concept: the post's promise, "self-contained", drawn literally: a whole network sealed in a bottle.
// Render: node .claude/skills/blog-cover/render.mjs content/blog/marrow/cover.mjs public/blog/covers/marrow-bottle.png
export function draw(k) {
  const g = k.blank();
  const { C } = k;
  // the blog header crops covers to 2:1 (one row off the top and bottom): letters
  // start at row 5 and the stripe is 3 rows, so both survive the crop
  k.letters(g, "MARROW", 5, 5);
  k.stripe(g, 3);

  // bottle on its side: body with rounded shoulders, neck, cork
  const body = k.union(k.rect(16, 15, 52, 37), k.circle(52, 26, 11));
  const neck = k.rect(58, 22, 67, 30);
  const glass = k.union(body, neck);
  k.fill(g, glass, "#eef3f1");
  k.fill(g, k.rect(19, 17, 46, 17.9), "#ffffff"); // highlight along the top
  k.fill(g, k.rect(19, 34, 52, 35.9), "#d7e2df"); // glass shade along the bottom
  k.outline(g, glass);
  const cork = k.rect(67, 23, 72, 29);
  k.fill(g, cork, C.brown);
  k.outline(g, cork);

  // the network inside: one hub, five devices, all aqua (the only colour)
  const hub = [36, 26];
  const leaves = [[24, 20], [24, 31], [36, 19], [47, 21], [47, 31]];
  leaves.forEach(([x, y]) => k.fill(g, k.segment(hub[0] + 0.5, hub[1] + 0.5, x + 0.5, y + 0.5, 0.45), C.ink));
  [hub, ...leaves].forEach(([x, y], i) => {
    const r = i === 0 ? 2.2 : 1.6;
    const node = k.rect(x - r + 0.5, y - r + 0.5, x + r + 0.5, y + r + 0.5);
    k.fill(g, node, C.aqua);
    k.outline(g, node, C.aquaDark);
  });
  return g;
}
