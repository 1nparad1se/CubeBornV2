import type { World } from '../../rpg/World';
import { item } from '../../rpg/items';
import type { Gear } from '../../rpg/equipment';
import { BLOCK_BY_ID } from './BlockRegistry';
import { MiningAction, type BlockHit } from './BlockInteraction';
import type { BlockPos } from './BlockWorld';

export interface DroppedBlock {id:string;x:number;y:number;z:number;vy:number;age:number;count:number}
export const countAt=(g:Gear,i:number)=>g.bag[i] ? g.amounts?.[i]??1 : 0;
export function addStack(g:Gear,id:string,count:number):number {
  const cap=item(id)?.block?64:1;
  g.amounts??=g.bag.map(v=>v?1:0);g.wear??=g.bag.map(()=>250);
  for(let i=0;i<g.bag.length&&count>0;i++)if(g.bag[i]===id&&countAt(g,i)<cap){const k=Math.min(count,cap-countAt(g,i));g.amounts[i]+=k;count-=k;}
  for(let i=0;i<g.bag.length&&count>0;i++)if(!g.bag[i]){const k=Math.min(count,cap);g.bag[i]=id;g.amounts[i]=k;g.wear[i]=item(id)?.tool?.durability??0;count-=k;}
  return count;
}
export function consume(g:Gear,i:number):boolean {if(!g.bag[i])return false;g.amounts??=g.bag.map(v=>v?1:0);if(--g.amounts[i]<=0){g.bag[i]=null;g.amounts[i]=0;}return true;}

/** Simulation used by the running RPG; it shares the character's existing bag and world. */
export class BlockGame {
  enabled=false;
  hit:BlockHit|null=null;
  progress=0;
  swinging=false;
  placePulse=0;
  revision=0;
  readonly drops:DroppedBlock[]=[];
  private mining=new MiningAction();
  message='F — добыча и строительство';
  constructor(readonly w:World){}
  get active(){return this.w.gear.active??0}
  get selected(){return item(this.w.gear.bag[this.active])}
  toggle(on=!this.enabled){this.enabled=on;this.cancel();this.w.player.path=[];this.w.player.cancelAttack();this.w.autoAttack=false;this.w.ctl.clickMove=null;this.w.ctl.attackHeld=false;this.message=on?'ЛКМ удерживать — добыть · ПКМ — поставить · F / Esc — выйти':'F — добыча и строительство';}
  cancel(){this.mining.cancel();this.progress=0;this.swinging=false;this.hit=null;}
  select(i:number){this.w.gear.active=i;this.cancel();this.revision++;}
  cycle(dir:number){const g=this.w.gear;const slots=g.bag.map((id,i)=>item(id)?.block||item(id)?.tool?i:-1).filter(i=>i>=0);if(slots.length){const k=slots.indexOf(this.active);this.select(slots[(k+dir+slots.length)%slots.length]);}}
  reachable(p:BlockPos){const a=this.w.player;return Math.hypot(p.x+.5-a.x,p.y+.5-(a.y+1),p.z+.5-a.z)<=5;}
  protected(p:BlockPos){return this.w.dummies.some(d=>Math.hypot(p.x+.5-d.x,p.z+.5-d.z)<1);}
  placement():BlockPos|null {const h=this.hit;if(!h)return null;return{x:h.pos.x+h.normal.x,y:h.pos.y+h.normal.y,z:h.pos.z+h.normal.z};}
  canPlace(p:BlockPos):boolean {
    const a=this.w.player,b=this.w.blocks;
    return !!this.selected?.block&&this.reachable(p)&&b.inBounds(p)&&b.get(p)===null&&!this.protected(p)&&
      !(p.x<a.x+a.radius&&p.x+1>a.x-a.radius&&p.z<a.z+a.radius&&p.z+1>a.z-a.radius&&p.y<a.y+1.8&&p.y+1>a.y+.02);
  }
  input(hit:BlockHit|null,held:boolean,place:boolean,dt:number){
    this.hit=hit&&this.reachable(hit.pos)?hit:null;
    const p=this.w.player,h=this.hit;
    if(!this.enabled||!h){this.mining.cancel();this.progress=0;this.swinging=false;return;}
    if(place){const target=this.placement(),id=this.selected?.block;if(target&&id&&this.canPlace(target)&&this.w.blocks.place(target,id)){consume(this.w.gear,this.active);this.placePulse=.25;this.revision++;this.w.fx.sound('hit',.3);}else this.message='Нельзя поставить: место занято, слишком далеко или внутри персонажа';}
    if(!held){this.mining.cancel();this.progress=0;this.swinging=false;return;}
    if(this.protected(h.pos)||h.pos.y===0){this.message='Этот блок защищён';this.mining.cancel();return;}
    const dx=h.pos.x+.5-p.x,dz=h.pos.z+.5-p.z,l=Math.hypot(dx,dz)||1;p.fx=dx/l;p.fz=dz/l;
    const def=this.selected?.tool;
    const tool=def?{...def,durability:this.w.gear.wear?.[this.active]??def.durability}:null;
    const result=this.mining.advance(this.w.blocks,h.pos,tool,dt);this.progress=result.progress;this.swinging=true;
    this.message=(BLOCK_BY_ID.get(this.w.blocks.get(h.pos)??'')?.name??'Блок')+' · '+Math.round(this.progress*100)+'%';
    if(result.broken){
      if(result.drop)this.drops.push({id:'block:'+result.drop,x:h.pos.x+.5,y:h.pos.y+.5,z:h.pos.z+.5,vy:2,age:0,count:1});
      if(tool&&tool.durability>0){this.w.gear.wear??=this.w.gear.bag.map(()=>250);if(--this.w.gear.wear[this.active]<=0)consume(this.w.gear,this.active);}
      this.w.fx.sound('hit',.5);this.revision++;this.progress=0;
    }
  }
  update(dt:number){
    this.placePulse=Math.max(0,this.placePulse-dt);
    for(let i=this.drops.length-1;i>=0;i--){const d=this.drops[i];d.age+=dt;d.vy-=12*dt;const oldY=d.y;d.y+=d.vy*dt;
      const support=this.w.blocks.support(d.x,d.z,oldY+.2)??0;
      if(d.y<support+.15){d.y=support+.15;d.vy=0;}
      const p=this.w.player;if(d.age>.6&&Math.hypot(d.x-p.x,d.z-p.z,d.y-(p.y+.6))<1.7){const left=addStack(this.w.gear,d.id,d.count);if(left!==d.count){d.count=left;this.revision++;this.w.fx.sound('select',.3);}if(!left)this.drops.splice(i,1);}
    }
  }
  loadDrops(raw:unknown){if(!Array.isArray(raw))return;for(const d of raw)if(d&&item(d.id)?.block&&[d.x,d.y,d.z,d.vy,d.age,d.count].every(Number.isFinite)&&d.count>0&&d.count<=64&&d.x>=0&&d.z>=0&&d.x<this.w.terrain.size&&d.z<this.w.terrain.size)this.drops.push({...d,count:Math.floor(d.count)});}
}
