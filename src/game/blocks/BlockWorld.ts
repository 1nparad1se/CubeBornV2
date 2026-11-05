import { CELL, isWater, type Terrain } from '../Terrain';
import { BLOCK_BY_ID } from './BlockRegistry';

export const BLOCK_CHUNK_SIZE = 16;
export interface BlockPos { x: number; y: number; z: number }
export interface BlockEdit extends BlockPos { id: string | null }
export interface BlockChanges { version: 1; edits: BlockEdit[] }

const key = (p: BlockPos) => `${p.x},${p.y},${p.z}`;
const chunk = (x: number, z: number) => `${Math.floor(x / BLOCK_CHUNK_SIZE)},${Math.floor(z / BLOCK_CHUNK_SIZE)}`;
const validCoord = (v: number) => Number.isSafeInteger(v);

/**
 * Sparse voxel changes over the original height-field. A null edit represents air; absence means
 * the original terrain. This data layer does not alter Terrain, its collision or its renderer.
 */
export class BlockWorld {
  private edits = new Map<string, BlockEdit>();
  private changedChunks = new Set<string>();
  revision = 0;
  readonly columns = new Set<string>();
  readonly renderChunks = new Set<string>();
  constructor(readonly terrain: Terrain, readonly maxY = 256) {}

  inBounds(p: BlockPos): boolean {
    return validCoord(p.x) && validCoord(p.y) && validCoord(p.z) && p.y >= 0 && p.y < this.maxY &&
      p.x >= this.terrain.ox && p.z >= this.terrain.oz && p.x < this.terrain.ox + this.terrain.size && p.z < this.terrain.oz + this.terrain.size;
  }

  /** Water, tree trunks and protected/non-floor cells are deliberately not synthesized as blocks. */
  original(p: BlockPos): string | null {
    if (!this.inBounds(p)) return null;
    const t=this.terrain, x=p.x-t.ox, z=p.z-t.oz, i=z*t.size+x, c=t.cell[i];
    if (c !== CELL.floor && c !== CELL.ice && c !== CELL.solid && c !== CELL.wall && !isWater(c)) return null;
    const top=t.top ? t.top[i] : t.elev[i];
    if (p.y >= top) return null;
    const surface=Math.ceil(top)-1;
    const tile=t.tileNames[t.tile[i]];
    if (p.y < surface-3) return 'stone';
    if (p.y < surface) return /stone|basalt|tuff|gravel|sand|clay/.test(tile) ? tile : 'dirt';
    if (isWater(c)) return 'gravel';
    return BLOCK_BY_ID.has(tile) ? tile : 'dirt';
  }

  get(p: BlockPos): string | null {
    if (!this.inBounds(p)) return null;
    const e=this.edits.get(key(p));
    return e ? e.id : this.original(p);
  }

  /** Actual voxel top: retain the game's quarter-block surface on unmodified cells. */
  top(p: BlockPos): number {
    if (!this.get(p)) return p.y;
    if (this.edits.has(key(p))) return p.y + 1;
    const t=this.terrain, i=(p.z-t.oz)*t.size+p.x-t.ox;
    return Math.min(p.y+1,t.top ? t.top[i] : t.elev[i]);
  }

  /** Exact AABB collision over solid voxels; touching a face is not penetration. */
  intersects(min: BlockPos, max: BlockPos): boolean {
    if (![min.x,min.y,min.z,max.x,max.y,max.z].every(Number.isFinite)) return true;
    for(let z=Math.floor(min.z);z<Math.ceil(max.z);z++)
      for(let x=Math.floor(min.x);x<Math.ceil(max.x);x++)
        for(let y=Math.max(0,Math.floor(min.y));y<Math.min(this.maxY,Math.ceil(max.y));y++){
          const p={x,y,z}, id=this.get(p);
          if(id && BLOCK_BY_ID.get(id)?.solid && this.top(p)>min.y && y<max.y) return true;
        }
    return false;
  }

  /** Highest support below the feet, without snapping a character onto a roof overhead. */
  support(x: number,z: number,feet: number): number | null {
    if(![x,z,feet].every(Number.isFinite)) return null;
    for(let y=Math.min(this.maxY-1,Math.floor(feet));y>=0;y--){
      const p={x:Math.floor(x),y,z:Math.floor(z)}, id=this.get(p);
      if(id && BLOCK_BY_ID.get(id)?.solid){const top=this.top(p);if(top<=feet+1e-6)return top;}
    }
    return null;
  }

  /** Rejects invalid changes and occupied placement, without mutating state. */
  place(p: BlockPos, id: string): boolean {
    if (!this.inBounds(p) || !BLOCK_BY_ID.has(id) || this.get(p) !== null || this.protectedColumn(p)) return false;
    this.write(p,id); return true;
  }
  remove(p: BlockPos): string | null {
    if (!this.inBounds(p) || p.y===0 || this.protectedColumn(p)) return null;
    const previous=this.get(p); if (previous === null) return null;
    this.write(p,null); return previous;
  }
  private protectedColumn(p: BlockPos): boolean {
    const t=this.terrain, i=(p.z-t.oz)*t.size+(p.x-t.ox), c=t.cell[i];
    return isWater(c) || (c !== CELL.floor && c !== CELL.ice);
  }
  private write(p: BlockPos, id: string | null) {
    this.revision++;
    this.columns.add(`${p.x},${p.z}`);
    this.renderChunks.add(`${Math.floor(p.x/32)},${Math.floor(p.z/32)}`);
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])
      this.renderChunks.add(`${Math.floor((p.x+dx)/32)},${Math.floor((p.z+dz)/32)}`);
    const k=key(p);
    if (this.original(p) === id) this.edits.delete(k); else this.edits.set(k,{...p,id});
    const cx=Math.floor(p.x/BLOCK_CHUNK_SIZE), cz=Math.floor(p.z/BLOCK_CHUNK_SIZE);
    this.changedChunks.add(chunk(p.x,p.z));
    const lx=((p.x%BLOCK_CHUNK_SIZE)+BLOCK_CHUNK_SIZE)%BLOCK_CHUNK_SIZE;
    const lz=((p.z%BLOCK_CHUNK_SIZE)+BLOCK_CHUNK_SIZE)%BLOCK_CHUNK_SIZE;
    if (lx===0) this.changedChunks.add(`${cx-1},${cz}`);
    if (lx===BLOCK_CHUNK_SIZE-1) this.changedChunks.add(`${cx+1},${cz}`);
    if (lz===0) this.changedChunks.add(`${cx},${cz-1}`);
    if (lz===BLOCK_CHUNK_SIZE-1) this.changedChunks.add(`${cx},${cz+1}`);
  }
  takeDirtyChunks(): string[] { const result=[...this.changedChunks]; this.changedChunks.clear(); return result; }
  changedAt(x:number,z:number) { return this.columns.has(`${Math.floor(x)},${Math.floor(z)}`); }
  floorAt(x:number,z:number,feet:number):number {
    return this.changedAt(x,z) ? this.support(x,z,feet)??0 : this.terrain.groundY(x,z);
  }
  canStand(x:number,z:number,y:number,r=.3):boolean {
    return !this.intersects({x:x-r,y:y+.025,z:z-r},{x:x+r,y:y+1.75,z:z+r});
  }
  serialize(): BlockChanges { return {version:1,edits:[...this.edits.values()].map(e=>({...e}))}; }
  /** Validate the entire payload before applying it; a bad save never partly changes the world. */
  load(raw: unknown): boolean {
    if (!raw || typeof raw !== 'object') return false;
    const r=raw as Partial<BlockChanges>;
    if (r.version!==1 || !Array.isArray(r.edits)) return false;
    const next=new Map<string,BlockEdit>();
    for (const e of r.edits) {
      if (!e || !this.inBounds(e) || this.protectedColumn(e) || (e.id!==null && (typeof e.id!=='string' || !BLOCK_BY_ID.has(e.id))) || next.has(key(e))) return false;
      next.set(key(e),{x:e.x,y:e.y,z:e.z,id:e.id});
    }
    for (const e of this.edits.values()) this.write(e,this.original(e));
    this.edits.clear();
    for (const e of next.values()) this.write(e,e.id);
    return true;
  }
}
