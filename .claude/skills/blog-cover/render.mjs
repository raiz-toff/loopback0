#!/usr/bin/env node
// Renders a pixel-medium cover file to PNG.
//
//   node .claude/skills/blog-cover/render.mjs <cover.mjs> <out.png>
//
// <cover.mjs> exports `draw(kit)` returning a grid from pixel-kit.mjs.
// Writes <out.png> at 1200 x 630, plus <out>.preview.png at 300 px wide:
// the size of a link preview on a phone. Judge the cover by the preview.

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import * as kit from "./pixel-kit.mjs";

const [coverPath, outPath] = process.argv.slice(2);
if (!coverPath || !outPath) {
  console.error("usage: node .claude/skills/blog-cover/render.mjs <cover.mjs> <out.png>");
  process.exit(1);
}

const { draw } = await import(pathToFileURL(resolve(coverPath)).href);
const svg = Buffer.from(kit.toSvg(draw(kit)));

await sharp(svg).png({ compressionLevel: 9, palette: true }).toFile(outPath);
const preview = outPath.replace(/\.png$/, ".preview.png");
await sharp(svg).resize({ width: 300, kernel: "lanczos3" }).png().toFile(preview);
console.log(`wrote ${outPath} (1200x630) and ${preview} (300 px link-preview check)`);
