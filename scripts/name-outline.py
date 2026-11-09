"""
Builds the footer name outline (src/components/name-outline.ts).

Shapes a word with HarfBuzz, draws each glyph at its shaped position, and
merges the overlapping outlines into one path, printed as JSON.

Usage:
  python -m venv .venv && .venv/bin/pip install fonttools uharfbuzz skia-pathops
  .venv/bin/python scripts/name-outline.py "NotoSansDevanagari[wdth,wght].ttf" "राजकुमार" /tmp/noto-700.ttf

The font is the variable Noto Sans Devanagari from github.com/google/fonts
(ofl/notosansdevanagari), pinned here to wght 700, wdth 100.
"""
import sys, json
import uharfbuzz as hb
import pathops
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

font_path, word, out_ttf = sys.argv[1], sys.argv[2], sys.argv[3]
inst = instantiateVariableFont(TTFont(font_path), {"wght": 700, "wdth": 100})
inst.save(out_ttf)

face = hb.Face(hb.Blob.from_file_path(out_ttf))
buf = hb.Buffer(); buf.add_str(word); buf.guess_segment_properties()
hb.shape(hb.Font(face), buf, {})

tt = TTFont(out_ttf)
gs, order = tt.getGlyphSet(), tt.getGlyphOrder()

merged = pathops.Path()
pen = merged.getPen()
x = 0
glyphs = []
for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
    name = order[info.codepoint]; glyphs.append(name)
    rec = DecomposingRecordingPen(gs); gs[name].draw(rec)
    rec.replay(TransformPen(pen, (1, 0, 0, 1, x + pos.x_offset, pos.y_offset)))
    x += pos.x_advance
merged.simplify(fix_winding=True)  # union: overlaps removed, one clean outline

bp = BoundsPen(None); merged.draw(bp)
xmin, ymin, xmax, ymax = bp.bounds
svg = SVGPathPen(None, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
# flip y (font units are y-up) and move the box to the origin
merged.draw(TransformPen(svg, (1, 0, 0, -1, -xmin, ymax)))
print(json.dumps({"d": svg.getCommands(), "w": round(xmax - xmin), "h": round(ymax - ymin),
                  "glyphs": glyphs, "advance": x, "baseline": round(ymax)}))
