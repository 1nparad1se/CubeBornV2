"""
Converts the owner's character (Character.blend, Blender 5, zstd) into the game asset:
src/assets/character.json (bones, and per part: positions, UVs, triangles, bone of each vertex)
and src/assets/character.png (the pixel atlas, reduced from 2048 px without losing a pixel of the
design: its cells are 32 px). Axes are turned from Blender (z up, -y forward) to the game's
(y up, +z forward): (x, y, z) -> (x, z, -y). Every part is bound to one bone; the trousers are
split at the knee between thigh and shin.

    PYTHONPATH=<zstandard> python3 tools/assets/convert_character.py Character.blend src/assets
"""
import json
import os
import struct
import sys

import zstandard
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from blendparse import Blend  # noqa: E402

src, dst = sys.argv[1], sys.argv[2]
raw = open(src, 'rb').read()
if raw[:4] == b'\x28\xb5\x2f\xfd':
    raw = zstandard.ZstdDecompressor().stream_reader(raw).read()
tmp = os.path.join(dst, '.character.blend')
open(tmp, 'wb').write(raw)
B = Blend(tmp)
os.remove(tmp)
d = B.d


def rawp(ptr):
    b = B.deref(ptr)
    return None if b is None else d[b['off']:b['off'] + b['len']]


def name_of(b):
    return B.get('ID', b['off'], 'name')[2:]


def conv(x, y, z):
    return [round(x, 5), round(z, 5), round(-y, 5)]


# ---------------------------------------------------------------- bones
bones = []
for ab in B.blocks_of('bArmature'):
    B.enter(ab)

    def walk(lst, parent):
        for bb in lst:
            o = bb['off']
            bones.append({'name': B.get('Bone', o, 'name'), 'parent': parent, 'head': conv(*B.get('Bone', o, 'arm_head')), 'tail': conv(*B.get('Bone', o, 'arm_tail'))})
            walk(B.listbase(o, 'Bone', 'childbase'), bones[-1]['name'])

    walk(B.listbase(ab['off'], 'bArmature', 'bonebase'), None)
bone_idx = {b['name']: i for i, b in enumerate(bones)}

# ---------------------------------------------------------------- parts
parts = []
for ob in B.blocks_of('Object'):
    B.enter(ob)
    o = ob['off']
    if B.get('Object', o, 'type') != 1:
        continue
    mb = B.deref(B.get('Object', o, 'data'))
    if not mb or name_of(ob).startswith('Preview'):
        continue
    B.enter(mb)
    mo = mb['off']
    ro = rawp(B.get('Mesh', mo, 'poly_offset_indices'))
    offs = list(struct.unpack_from('<%di' % (len(ro) // 4), ro))
    st = B.get('Mesh', mo, 'attribute_storage')
    ab = B.deref(B.get('AttributeStorage', st, 'dna_attributes'))
    attrs = {}
    for i in range(B.get('AttributeStorage', st, 'dna_attributes_num')):
        ao = ab['off'] + i * 24
        rn = rawp(B.get('Attribute', ao, 'name'))
        db = B.deref(B.get('Attribute', ao, 'data'))
        if rn is None or db is None or B.get('Attribute', ao, 'storage_type') != 0:
            continue
        attrs[rn.split(b'\0')[0].decode()] = (B.get('AttributeArray', db['off'], 'size'), rawp(B.get('AttributeArray', db['off'], 'data')))
    nv, pdata = attrs['position']
    pos = struct.unpack_from('<%df' % (nv * 3), pdata)
    nl, cdata = attrs['.corner_vert']
    corner = struct.unpack_from('<%di' % nl, cdata)
    uvs = struct.unpack_from('<%df' % (nl * 2), attrs['UV_Atlas'][1])
    groups = [B.get('bDeformGroup', g['off'], 'name') for g in B.listbase(mo, 'Mesh', 'vertex_group_names')]
    # one vertex per corner (each face keeps its own UVs), triangles fanned from each face
    P, U, V, I = [], [], [], []
    for f in range(len(offs) - 1):
        a, b = offs[f], offs[f + 1]
        base = len(P) // 3
        for c in range(a, b):
            x, y, z = pos[corner[c] * 3:corner[c] * 3 + 3]
            P += conv(x, y, z)
            U += [round(uvs[c * 2], 6), round(uvs[c * 2 + 1], 6)]
            if len(groups) == 1:
                V.append(bone_idx[groups[0]])
            else:
                # the trousers: above the knee the thigh, below it the shin
                knee = next(bb for bb in bones if bb['name'] == groups[1])['head'][1]
                V.append(bone_idx[groups[0]] if z >= knee - 0.005 else bone_idx[groups[1]])
        for k in range(1, b - a - 1):
            I += [base, base + k, base + k + 1]
    parts.append({'name': name_of(ob), 'pos': P, 'uv': U, 'bone': V, 'idx': I})

json.dump({'bones': bones, 'parts': parts}, open(os.path.join(dst, 'character.json'), 'w'), separators=(',', ':'))
# ---------------------------------------------------------------- texture
for ib in B.blocks_of('Image'):
    B.enter(ib)
    pf = B.get('Image', ib['off'], 'packedfile')
    if not pf:
        continue
    pb = B.deref(pf)
    data = rawp(B.get('PackedFile', pb['off'], 'data'))[:B.get('PackedFile', pb['off'], 'size')]
    tmp = os.path.join(dst, '.tex.png')
    open(tmp, 'wb').write(data)
    im = Image.open(tmp).convert('RGBA')
    os.remove(tmp)
    im.resize((512, 512), Image.NEAREST).save(os.path.join(dst, 'character.png'))
print(len(bones), 'bones', len(parts), 'parts', sum(len(p['idx']) // 3 for p in parts), 'triangles')
