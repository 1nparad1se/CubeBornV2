import * as THREE from 'three';
import { item } from '../../rpg/items';
import { makeBlockTexture,makeGroundAtlas } from '../Textures';
import { WILD_MAP } from '../../world/wild';
export function buildItem(id:string){
  const root=new THREE.Group(),geos:THREE.BufferGeometry[]=[],mats:THREE.Material[]=[],textures:THREE.Texture[]=[];
  const def=item(id),tex=makeBlockTexture();textures.push(tex);
  const box=(w:number,h:number,d:number,x:number,y:number,z:number,color:number)=>{const g=new THREE.BoxGeometry(w,h,d),m=new THREE.MeshLambertMaterial({color,map:tex});geos.push(g);mats.push(m);const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);root.add(mesh);return mesh;};
  if(def?.block){const name=def.block;const atlas=makeGroundAtlas([name],{[name]:WILD_MAP.palette.tiles[name]??[0x9a7954]},WILD_MAP.palette.blocks??{});atlas.repeat.set(1,1/8);atlas.offset.y=7/8;textures.push(atlas);const m=box(.32,.32,.32,0,0,.12,0xffffff).material as THREE.MeshLambertMaterial;m.map=atlas;}
  else if(def?.tool){box(.065,.6,.065,0,.15,0,0x8b6039);if(def.tool.kind==='pickaxe'){box(.46,.09,.09,0,.48,0,0xaeb9ba);box(.08,.15,.09,.2,.43,0,0xaeb9ba);}else if(def.tool.kind==='axe')box(.25,.25,.08,.1,.43,0,0xaeb9ba);else if(def.tool.kind==='shovel')box(.2,.26,.055,0,.5,0,0xaeb9ba);else box(.25,.08,.08,.1,.45,0,0xaeb9ba);}
  return {root,dispose(){geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
