import { BLOCK_BY_ID, miningResult, type ToolDefinition } from './BlockRegistry';
import { BlockWorld, type BlockPos } from './BlockWorld';

export interface Vector3 { x: number; y: number; z: number }
export interface BlockHit { pos: BlockPos; normal: Vector3; distance: number }

/** Grid traversal, including axis-aligned rays and rays starting inside a block. */
export function raycastBlocks(world: BlockWorld, origin: Vector3, direction: Vector3, maxDistance = 5): BlockHit | null {
  const length=Math.hypot(direction.x,direction.y,direction.z);
  if (!Number.isFinite(length) || length===0 || !Number.isFinite(maxDistance) || maxDistance<0 || ![origin.x,origin.y,origin.z].every(Number.isFinite)) return null;
  const d={x:direction.x/length,y:direction.y/length,z:direction.z/length};
  const p={x:Math.floor(origin.x),y:Math.floor(origin.y),z:Math.floor(origin.z)};
  const step={x:Math.sign(d.x),y:Math.sign(d.y),z:Math.sign(d.z)};
  const delta={x:d.x ? Math.abs(1/d.x) : Infinity,y:d.y ? Math.abs(1/d.y) : Infinity,z:d.z ? Math.abs(1/d.z) : Infinity};
  const edge=(v:number,s:number,dir:number)=>dir===0 ? Infinity : (s>0 ? Math.floor(v)+1-v : v-Math.floor(v))/Math.abs(dir);
  const next={x:edge(origin.x,step.x,d.x),y:edge(origin.y,step.y,d.y),z:edge(origin.z,step.z,d.z)};
  let distance=0, normal={x:0,y:0,z:0};
  while(distance<=maxDistance){
    if(world.get(p)!==null){
      const top=world.top(p);let near=0,far=maxDistance;let face={...normal};let good=true;
      for(const axis of ['x','y','z'] as const){const low=p[axis],high=axis==='y'?top:p[axis]+1;
        if(d[axis]===0){if(origin[axis]<low||origin[axis]>high)good=false;continue;}
        const a=(low-origin[axis])/d[axis],c=(high-origin[axis])/d[axis];const enter=Math.min(a,c),leave=Math.max(a,c);
        if(enter>near){near=enter;face={x:0,y:0,z:0};face[axis]=d[axis]>0?-1:1;}far=Math.min(far,leave);
      }
      if(good&&near<=far&&far>=0)return {pos:{...p},normal:face,distance:near};
    }
    const axis=next.x<=next.y && next.x<=next.z?'x':next.y<=next.z?'y':'z';
    distance=next[axis];if(distance>maxDistance || !Number.isFinite(distance))break;
    p[axis]+=step[axis];next[axis]+=delta[axis];normal={x:0,y:0,z:0};normal[axis]=-step[axis];
  }
  return null;
}

/** A held action has one target; cancellation or a change of tool resets progress. */
export class MiningAction {
  private target: BlockPos | null=null;
  private targetId: string | null=null;
  private toolKey='';
  private elapsed=0;
  cancel(){this.target=null;this.targetId=null;this.toolKey='';this.elapsed=0}
  get progress(): number { return this.targetId ? Math.min(1,this.elapsed / this.duration) : 0 }
  private duration=1;
  advance(world:BlockWorld,p:BlockPos,tool:ToolDefinition|null,dt:number): {progress:number; broken:string|null; drop:string|null} {
    const id=world.get(p), def=id?BLOCK_BY_ID.get(id):undefined;
    if(!def || !Number.isFinite(dt) || dt<0){this.cancel();return {progress:0,broken:null,drop:null}}
    const toolKey=tool?`${tool.kind}:${tool.tier}:${tool.speed}:${tool.durability>0}`:'hand';
    if(!this.target || this.target.x!==p.x || this.target.y!==p.y || this.target.z!==p.z || this.targetId!==id || this.toolKey!==toolKey){this.elapsed=0;this.target={...p};this.targetId=id;this.toolKey=toolKey}
    const result=miningResult(def,tool);this.duration=result.seconds;this.elapsed+=dt;
    const progress=this.progress;
    if(progress<1)return {progress,broken:null,drop:null};
    const broken=world.remove(p);this.cancel();
    return {progress:broken?1:0,broken,drop:broken?result.drop:null};
  }
}
