import type { World } from '../rpg/World';
import { item } from '../rpg/items';
import { countAt } from '../game/blocks/BlockGame';
import { itemIcon } from './itemIcons';
import './building.css';
export class BuildingHud {
  private root=document.createElement('div');
  private mode=document.createElement('button');
  private status=document.createElement('div');
  private slots=document.createElement('div');
  private key='';
  constructor(parent:HTMLElement,toggle:()=>void){this.root.className='building-ui';this.mode.className='building-toggle';this.mode.textContent='⛏ Добыча / строительство · F';this.mode.onclick=toggle;this.status.className='building-status';this.slots.className='building-slots';this.root.append(this.mode,this.status,this.slots);parent.append(this.root);}
  update(w:World|null,visible:boolean){this.root.hidden=!w||!visible;if(!w)return;const b=w.building;this.mode.textContent=b.enabled?'✓ Режим строительства · F — выйти':'⛏ Добыча / строительство · F';this.status.hidden=this.slots.hidden=!b.enabled;this.status.textContent=b.message;const key=JSON.stringify([w.gear.bag,w.gear.amounts,w.gear.wear,w.gear.active]);if(key===this.key)return;this.key=key;this.slots.replaceChildren();w.gear.bag.forEach((id,i)=>{const def=item(id);if(!def?.block&&!def?.tool)return;const el=document.createElement('button');el.className='building-slot'+(i===b.active?' active':'');el.title=def.name;el.append(itemIcon(id!,2,28));const label=document.createElement('span');label.textContent=def.name;const amount=document.createElement('b');amount.textContent=def.tool?`${w.gear.wear?.[i]??250}/250`:String(countAt(w.gear,i));el.append(label,amount);el.onclick=()=>b.select(i);this.slots.append(el);});}
}
