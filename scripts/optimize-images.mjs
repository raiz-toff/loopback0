#!/usr/bin/env node
/**
 * Shrinks oversized source images in public/ and content/ in place.
 *
 * next/image serves resized AVIF/WebP to visitors, but it still has to read
 * and re-encode the original on every cache miss. A 12 MB camera JPEG makes
 * that first request slow and eats image-optimization quota. Plain links to
 * these files (OG images, email signatures) send the original as-is.
 *
 * Filenames and formats stay the same, so no references need to change.
 * A file is rewritten only when the result is at least 10% smaller. Metadata
 * (EXIF, including GPS) is stripped; orientation is baked into the pixels.
 *
 * Usage:
 *   node scripts/optimize-images.mjs            # dry run: report only
 *   node scripts/optimize-images.mjs --write    # rewrite files in place
 *   node scripts/optimize-images.mjs --check    # CI: exit 1 if any image is
 *                                               # over its edge cap or MAX_BYTES
 *
 * Originals stay recoverable from git: `git checkout -- <file>`.
 *
 * @throws {Error} When sharp is not installed (it ships with next).
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const REPO = path.resolve(import.meta.dirname, "..");
const ROOTS = ["public", "content"].map((dir) => path.join(REPO, dir));
const WRITE = process.argv.includes("--write");
const CHECK = process.argv.includes("--check");

/** Files at or below this size are left alone. */
const MIN_BYTES = 400 * 1024;

/** --check fails on any image above this size, whatever its dimensions. */
const MAX_BYTES = 3 * 1024 * 1024;

/** Generated output (Marrow) and editor config; never touch. */
const SKIP_DIRS = new Set(["public/projects/network-map", "public/icons", "content/.obsidian"]);

/**
 * Longest-edge cap per folder (first matching prefix wins).
 * Gallery: lightbox shows up to ~1024 CSS px wide at 2x DPR.
 * Blog covers: rendered at most 720 CSS px wide; OG wants >= 1200.
 * Portrait: rendered at 160 CSS px (and 52 px in email signatures).
 */
const MAX_EDGE = [
  ["public/img/portrait.jpg", 800],
  ["public/blog/covers/", 1920],
  ["content/blog/", 1920],
  ["", 2560],
];

const JPEG_QUALITY = 82;

/**
 * @param {string} dir Absolute directory to walk.
 * @returns {AsyncGenerator<string>} Absolute paths of candidate image files.
 */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(REPO, full).split(path.sep).join("/");
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(rel)) yield* walk(full);
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      yield full;
    }
  }
}

/**
 * @param {string} rel Path relative to the repo root, forward slashes.
 * @returns {number} Max longest-edge size in pixels.
 */
function maxEdgeFor(rel) {
  return MAX_EDGE.find(([prefix]) => rel.startsWith(prefix))[1];
}

/**
 * Re-encodes one image. Does not write to disk.
 * @param {string} file Absolute path.
 * @param {string} rel Path relative to the repo root.
 * @returns {Promise<Buffer>} Encoded image in the original format.
 */
async function encode(file, rel) {
  const edge = maxEdgeFor(rel);
  const meta = await sharp(file).metadata();
  let img = sharp(file)
    .rotate()
    .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true });

  if (meta.format === "png") {
    // Drop the alpha channel only when it is fully opaque.
    if (meta.hasAlpha) {
      const { isOpaque } = await sharp(file).stats();
      if (isOpaque) img = img.removeAlpha();
    }
    return img.png({ compressionLevel: 9, effort: 10 }).toBuffer();
  }
  return img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
}

const fmt = (n) => `${(n / 1048576).toFixed(2)} MB`;

/**
 * Lists images that break the caps, without re-encoding anything.
 * @returns {Promise<string[]>} One message per offending file.
 */
async function findViolations() {
  const problems = [];
  for (const root of ROOTS) {
    for await (const file of walk(root)) {
      const { size } = await stat(file);
      if (size <= MIN_BYTES) continue;
      const rel = path.relative(REPO, file).split(path.sep).join("/");
      const { width = 0, height = 0 } = await sharp(file).metadata();
      const edge = maxEdgeFor(rel);
      if (Math.max(width, height) > edge) {
        problems.push(`${rel}: ${width}x${height} px, cap is ${edge} px`);
      } else if (size > MAX_BYTES) {
        problems.push(`${rel}: ${fmt(size)}, cap is ${fmt(MAX_BYTES)}`);
      }
    }
  }
  return problems;
}

if (CHECK) {
  const problems = await findViolations();
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    console.error(`\n${problems.length} oversized image(s). Run: npm run images:optimize -- --write`);
    process.exit(1);
  }
  console.log("All images within size caps.");
  process.exit(0);
}

let before = 0;
let after = 0;
let changed = 0;

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const { size } = await stat(file);
    if (size <= MIN_BYTES) continue;
    const rel = path.relative(REPO, file).split(path.sep).join("/");

    const out = await encode(file, rel);
    if (out.length > size * 0.9) {
      console.log(`skip   ${rel} (${fmt(size)}, gain under 10%)`);
      continue;
    }

    before += size;
    after += out.length;
    changed += 1;
    console.log(`${WRITE ? "wrote" : "would"}  ${rel}  ${fmt(size)} -> ${fmt(out.length)}`);
    if (WRITE) await writeFile(file, out);
  }
}

console.log(
  `\n${changed} file(s): ${fmt(before)} -> ${fmt(after)}` +
    (WRITE ? "" : "  (dry run; pass --write to apply)"),
);
