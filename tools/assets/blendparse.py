"""Minimal .blend reader (Blender 5 large-BHead format): blocks, SDNA, struct field access."""
import struct


class Blend:
    def __init__(self, path):
        d = self.d = open(path, 'rb').read()
        assert d[:7] == b'BLENDER'
        off = 17
        self.blocks = []
        self.by_ptr = {}
        # pointers are only unique within an ID and its data blocks (Blender 5): look them up in
        # the scope of the ID that owns the block holding the pointer
        self.scoped = {}
        owner = -1
        while off < len(d):
            code = d[off:off + 4]
            sdna, old, ln, nr = struct.unpack_from('<iQqq', d, off + 4)
            data_off = off + 32
            b = {'code': code.rstrip(b'\0').decode('latin1'), 'sdna': sdna, 'old': old, 'len': ln, 'nr': nr, 'off': data_off}
            if b['code'] != 'DATA':
                owner = len(self.blocks)
            b['owner'] = owner
            self.blocks.append(b)
            if old:
                self.by_ptr.setdefault(old, b)
                self.scoped[(owner, old)] = b
            off = data_off + ln
            if code == b'ENDB':
                break
        dna = next(b for b in self.blocks if b['code'] == 'DNA1')
        self.parse_dna(dna['off'])

    def parse_dna(self, o):
        d = self.d
        assert d[o:o + 4] == b'SDNA'
        o += 4

        def align(x):
            return (x + 3) & ~3

        def names_block(tag, o):
            assert d[o:o + 4] == tag, (tag, d[o:o + 8])
            o += 4
            n = struct.unpack_from('<i', d, o)[0]
            o += 4
            out = []
            for _ in range(n):
                e = d.index(b'\0', o)
                out.append(d[o:e].decode('latin1'))
                o = e + 1
            return out, align(o)

        self.names, o = names_block(b'NAME', o)
        self.types, o = names_block(b'TYPE', o)
        assert d[o:o + 4] == b'TLEN'
        o += 4
        self.tlen = list(struct.unpack_from('<%dh' % len(self.types), d, o))
        o = align(o + 2 * len(self.types))
        assert d[o:o + 4] == b'STRC'
        o += 4
        n = struct.unpack_from('<i', d, o)[0]
        o += 4
        self.structs = []
        self.struct_by_type = {}
        for i in range(n):
            t, nf = struct.unpack_from('<hh', d, o)
            o += 4
            fields = []
            for _ in range(nf):
                ft, fn = struct.unpack_from('<hh', d, o)
                o += 4
                fields.append((self.types[ft], self.names[fn]))
            self.structs.append((self.types[t], fields))
            self.struct_by_type[self.types[t]] = i
        self.layout = {}

    def fields(self, sname):
        """Field offsets of a struct: name -> (type, offset, size, count, is_ptr)."""
        if sname in self.layout:
            return self.layout[sname]
        _, flds = self.structs[self.struct_by_type[sname]]
        out = {}
        off = 0
        for ft, fn in flds:
            ptr = fn.startswith('*') or fn.startswith('(*')
            base = fn.lstrip('*').split('[')[0].replace('(', '').replace(')', '')
            dims = [int(x.rstrip(']')) for x in fn.split('[')[1:]]
            cnt = 1
            for x in dims:
                cnt *= x
            size = 8 if ptr else self.tlen[self.types.index(ft)]
            out[base] = (ft, off, size, cnt, ptr)
            off += size * cnt
        self.layout[sname] = out
        return out

    def sname(self, b):
        return self.structs[b['sdna']][0]

    def get(self, sname, base, field):
        ft, off, size, cnt, ptr = self.fields(sname)[field]
        o = base + off
        if ptr:
            if cnt == 1:
                return struct.unpack_from('<Q', self.d, o)[0]
            return list(struct.unpack_from('<%dQ' % cnt, self.d, o))
        fmt = {'float': 'f', 'int': 'i', 'short': 'h', 'char': 'b', 'uchar': 'B', 'double': 'd', 'int64_t': 'q', 'uint64_t': 'Q', 'ushort': 'H', 'int8_t': 'b', 'uint8_t': 'B', 'int16_t': 'h', 'int32_t': 'i', 'uint32_t': 'I', 'uint': 'I'}.get(ft)
        if ft == 'char' and cnt > 1:
            raw = self.d[o:o + cnt]
            return raw.split(b'\0')[0].decode('latin1')
        if fmt is None:
            return o  # nested struct: its offset
        vals = struct.unpack_from('<%d%s' % (cnt, fmt), self.d, o)
        return vals[0] if cnt == 1 else list(vals)

    def blocks_of(self, sname):
        return [b for b in self.blocks if b['sdna'] >= 0 and b['code'] not in ('DNA1', 'ENDB') and self.sname(b) == sname]

    def deref(self, ptr, scope=None):
        if scope is not None:
            b = self.scoped.get((scope, ptr))
            if b is not None:
                return b
        if scope is None and self.cur is not None:
            b = self.scoped.get((self.cur, ptr))
            if b is not None:
                return b
        return self.by_ptr.get(ptr)

    cur = None

    def enter(self, block):
        """Resolve following pointers inside the ID that owns `block`."""
        self.cur = block['owner']

    def id_name(self, b):
        return self.get(self.sname(b), b['off'], 'name') if 'name' in self.fields(self.sname(b)) else self.get('ID', b['off'], 'name')

    def listbase(self, base, stype, field):
        """Walk a ListBase (first/last) of structs linked by next."""
        lb = self.get(stype, base, field)  # offset of ListBase struct
        first = self.get('ListBase', lb, 'first')
        out = []
        p = first
        while p:
            b = self.deref(p)
            if not b:
                break
            out.append(b)
            # the first member of every linked struct starts with its next pointer
            p = struct.unpack_from('<Q', self.d, b['off'])[0]
        return out
