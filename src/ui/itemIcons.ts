import { item } from '../rpg/items';
import { makeGroundAtlas } from '../render/Textures';
import { WILD_MAP } from '../world/wild';
import { SPR_BOW, SPR_SPEAR, SPR_STAFF1H, SPR_STAFF2H, SPR_SWORD, SPR_SWORD2H, SPR_XBOW, armorIcon, shieldFace, spriteCanvas, type Sprite } from '../render/human/sprites';

/** Pixel sprite shown for an item in the inventory (the same pixel art as its 3D model). */
function itemSprite(id: string): Sprite | null {
  const def = item(id);
  if (!def) return null;
  const w = def.weapon?.kind;
  if (w === 'sword1h') return SPR_SWORD;
  if (w === 'sword2h') return SPR_SWORD2H;
  if (w === 'spear') return SPR_SPEAR;
  if (w === 'staff1h') return SPR_STAFF1H;
  if (w === 'staff2h') return SPR_STAFF2H;
  if (w === 'bow') return SPR_BOW;
  if (w === 'crossbow') return SPR_XBOW;
  if (def.slot === 'off') {
    const px: string[] = [];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const fx = x - 3;
        const fy = y - 2;
        px.push(fx >= 0 && fx < 10 && fy >= 0 && fy < 12 ? shieldFace(fx, fy, 10, 12) : '');
      }
    return { n: 16, px };
  }
  if (def.armorSet && def.slot !== 'main') return armorIcon(def.slot as 'head' | 'hands' | 'feet' | 'body', def.armorSet);
  return null;
}

const cache = new Map<string, string>();

/** An <img> of the item icon (pixelated), `size` in CSS pixels. */
export function itemIcon(id: string, scale = 3, size = 40): HTMLElement {
  const key = id + ':' + scale;
  let url = cache.get(key);
  if (!url) {
    const def=item(id);
    if(def?.block||def?.tool){const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d')!;g.imageSmoothingEnabled=false;if(def.block){const tex=makeGroundAtlas([def.block],{[def.block]:WILD_MAP.palette.tiles[def.block]??[0x9a7954]},WILD_MAP.palette.blocks??{});g.drawImage(tex.image,0,0,16,16,3,3,26,26);tex.dispose();}else{g.fillStyle='#987345';g.fillRect(14,9,4,21);g.fillStyle='#b8c9cb';if(def.tool?.kind==='pickaxe'){g.fillRect(4,5,25,5);g.fillRect(25,9,4,5);}else if(def.tool?.kind==='axe')g.fillRect(16,3,13,14);else if(def.tool?.kind==='shovel')g.fillRect(10,2,12,13);else g.fillRect(14,4,15,6);}url=c.toDataURL();}
    else {
    const s = itemSprite(id);
    url = s ? spriteCanvas(s, scale).toDataURL() : '';
    }
    cache.set(key, url);
  }
  const img = document.createElement('img');
  img.className = 'item-icon';
  img.src = url;
  img.alt = item(id)?.name ?? '';
  img.draggable = false;
  img.style.width = img.style.height = size + 'px';
  return img;
}
