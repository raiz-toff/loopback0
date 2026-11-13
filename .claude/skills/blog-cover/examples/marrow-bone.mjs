// Example of the pixel-kit API, not a design to reuse. Concept for /blog/marrow:
// "marrow" (the core of a bone) fused with Marrow's fibre mark (a glass core).
// Render: node .claude/skills/blog-cover/render.mjs .claude/skills/blog-cover/examples/marrow-bone.mjs /tmp/marrow.png

/** @param {typeof import("../pixel-kit.mjs")} k */
export function draw(k) {
  const g = k.blank();
  const { C } = k;

  k.letters(g, "MARROW", 5, 4);
  k.stripe(g);

  // hero: one bone, cream with an ink outline, shaded underneath
  const bone = k.union(
    k.circle(17, 21, 5.6), k.circle(17, 31, 5.6),
    k.circle(63, 21, 5.6), k.circle(63, 31, 5.6),
    k.rect(17, 21.5, 63, 30.5),
  );
  k.fill(g, bone, C.cream);
  k.shadeBelow(g, (x, y) => bone(x, y) && y > 24);
  k.outline(g, bone);

  // the only colour: a cut-away showing a lit fibre where the marrow would be
  k.fill(g, k.rect(31, 23, 50, 29), "#27272a");
  k.outline(g, k.rect(31, 23, 50, 29));
  k.fill(g, k.rect(31.5, 24, 49.5, 28), C.aqua);
  k.fill(g, k.rect(31.5, 25, 49.5, 27), C.aquaDark);
  // shapes are tested at cell centres (x + 0.5): a one-row line spans 26..27
  k.fill(g, k.rect(31.5, 26, 49.5, 26.9), "#ffffff");
  return g;
}
