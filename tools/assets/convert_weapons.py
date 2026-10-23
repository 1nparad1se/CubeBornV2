"""
Converts the owner's voxel weapons (weapons.zip: 10 swords, 10 staves, 10 bows, JSON v4, about
230 000 voxels each) into game assets: each model is reduced to cells of F × F × F source voxels
(a cell is kept when enough of it is filled, in its most common colour), and written as a
compact JSON (size, palette, one byte per cell, base64) to src/assets/weapons/.

    python3 -I tools/assets/convert_weapons.py <unzipped weapons dir> src/assets/weapons
"""
import base64
import glob
import json
import os
import sys
from collections import Counter

F = 8
FILL = 0.18

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
for path in sorted(glob.glob(os.path.join(src, '*', '*.json'))):
    name = os.path.basename(path)
    if name == 'validation.json':
        continue
    d = json.load(open(path))
    a = d['d']
    pal = [int(c[1:], 16) for c in d['p']]
    xs, ys, zs = a[0::4], a[1::4], a[2::4]
    x0, y0, z0 = min(xs), min(ys), min(zs)
    cells = {}
    for i in range(0, len(a), 4):
        k = ((a[i] - x0) // F, (a[i + 1] - y0) // F, (a[i + 2] - z0) // F)
        cells.setdefault(k, []).append(a[i + 3])
    nx = (max(xs) - x0) // F + 1
    ny = (max(ys) - y0) // F + 1
    nz = (max(zs) - z0) // F + 1
    used = Counter()
    grid = bytearray(nx * ny * nz)
    keep = {}
    for k, cols in cells.items():
        # thin parts (string, edges) are kept with less fill so they do not vanish
        if len(cols) < F * F * F * FILL and len(cols) < F * F * 1.2:
            continue
        c = Counter(cols).most_common(1)[0][0]
        keep[k] = c
        used[c] += 1
    order = [c for c, _ in used.most_common()]
    assert len(order) < 255
    idx = {c: i + 1 for i, c in enumerate(order)}
    for (x, y, z), c in keep.items():
        grid[(z * ny + y) * nx + x] = idx[c]
    kind = 'sword' if 'sword' in name else 'staff' if 'staff' in name else 'bow'
    num = name.split('_')[0]
    out = {
        'kind': kind,
        'n': int(num),
        'size': [nx, ny, nz],
        # where the source origin (0, 0, 0) lies in cells: the grip line runs along y at x = z = 0
        'origin': [(-x0) / F, (-y0) / F, (-z0) / F],
        'cell': F,
        'pal': [pal[c] for c in order],
        'v': base64.b64encode(bytes(grid)).decode(),
    }
    fn = os.path.join(dst, f'{kind}_{num}.json')
    json.dump(out, open(fn, 'w'), separators=(',', ':'))
    print(fn, out['size'], len(keep), 'cells', os.path.getsize(fn), 'bytes')
