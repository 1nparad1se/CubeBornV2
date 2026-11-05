import * as THREE from 'three';
import type { World } from '../rpg/World';
import { BLOCKS } from '../game/blocks/BlockRegistry';
import { makeGroundAtlas, makeBlockTexture } from './Textures';
import { item } from '../rpg/items';
import { raycastBlocks, type BlockHit } from '../game/blocks/BlockInteraction';
import type { BlockPos } from '../game/blocks/BlockWorld';

/** Only edited terrain chunks are volumetric. Untouched geography keeps the game's renderer. */
export class VoxelRenderer {
  readonly group=new THREE.Group();
  private chunks=new Map<string,THREE.Mesh>();
  private revision=-1;
  private atlas:THREE.CanvasTexture;
  private mat:THREE.MeshLambertMaterial;
  private names=BLOCKS.map(b=>b.id);
  private indices=new Map(this.names.map((s,i)=>[s,i]));
  private box=new THREE.BoxGeometry(1,1,1);
  private outline=new THREE.LineSegments(new THREE.EdgesGeometry(this.box),new THREE.LineBasicMaterial({color:0xffec8b,depthTest:true}));
  private previewMat=new THREE.MeshBasicMaterial({color:0x77eeaa,transparent:true,opacity:.35,depthWrite:false});
  private preview=new THREE.Mesh(this.box,this.previewMat);
  private crackTex:THREE.CanvasTexture[]=[];
  private crackMat=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  private crack=new THREE.Mesh(this.box,this.crackMat);
  private dropMat=new THREE.MeshLambertMaterial({map:makeBlockTexture(),color:0xffffff});
  private dropMesh=new THREE.InstancedMesh(this.box,this.dropMat,4096);
  private ray=new THREE.Raycaster();
  private dummy=new THREE.Object3D();
  constructor(private w:World){
    const tiles={...w.map.palette.tiles,dirt:[0x9a6a42,0x8e603b],oak_log:[0x80532f],birch_log:[0xc5baa2],spruce_log:[0x675034],pine_log:[0x83613a],planks:[0xb58b52],glass:[0xc8e7eb],workbench:[0x9d713c],furnace:[0x62646a],chest:[0xa87940]};
    this.atlas=makeGroundAtlas(this.names,tiles,w.map.palette.blocks??{});
    this.mat=new THREE.MeshLambertMaterial({map:this.atlas});
    this.outline.visible=this.preview.visible=this.crack.visible=false;
    this.outline.renderOrder=3;this.crack.renderOrder=4;
    this.group.add(this.outline,this.preview,this.crack,this.dropMesh);this.dropMesh.count=0;this.dropMesh.frustumCulled=false;
    for(let stage=0;stage<10;stage++){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d')!;g.strokeStyle='#211c18';g.lineWidth=1+stage*.12;for(let j=0;j<=stage;j++){g.beginPath();g.moveTo(32,32);for(let k=1;k<5;k++){const a=j*2.399+k*.2;g.lineTo(32+Math.cos(a)*k*8,32+Math.sin(a)*k*8);}g.stroke();}const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;this.crackTex.push(t);}
  }
  pick(camera:THREE.Camera,mx:number,my:number,width:number,height:number):BlockHit|null{
    this.ray.setFromCamera(new THREE.Vector2(mx/width*2-1,-my/height*2+1),camera);
    return raycastBlocks(this.w.blocks,this.ray.ray.origin,this.ray.ray.direction,180);
  }
  private rebuild(key:string){
    const [cx,cz]=key.split(',').map(Number),x0=cx*32,z0=cz*32,n=this.w.terrain.size;
    if(x0<0||z0<0||x0>=n||z0>=n)return;
    const old=this.chunks.get(key);if(old){old.removeFromParent();old.geometry.dispose();}
    const pos:number[]=[],nor:number[]=[],uv:number[]=[],idx:number[]=[];
    const heights=new Map<string,number>();for(const e of this.w.blocks.serialize().edits)if(e.id)heights.set(`${e.x},${e.z}`,Math.max(heights.get(`${e.x},${e.z}`)??0,e.y+1));
    const b=this.w.blocks;
    const quad=(v:number[],normal:number[],tile:string,row:number)=>{const start=pos.length/3;pos.push(...v);for(let k=0;k<4;k++)nor.push(...normal);const ti=this.indices.get(tile)??this.indices.get('stone')!;const u0=(ti+.015)/this.names.length,u1=(ti+.985)/this.names.length,v0=1-(row+.985)/8,v1=1-(row+.015)/8;uv.push(u0,v0,u1,v0,u1,v1,u0,v1);idx.push(start,start+1,start+2,start,start+2,start+3);};
    for(let z=z0;z<Math.min(n,z0+32);z++)for(let x=x0;x<Math.min(n,x0+32);x++){
      const natural=this.w.terrain.groundY(x+.5,z+.5),max=Math.max(Math.ceil(natural),heights.get(`${x},${z}`)??0);
      for(let y=0;y<max;y++){const p={x,y,z},id=b.get(p);if(!id)continue;const top=b.top(p),above=b.get({x,y:y+1,z}),below=b.get({x,y:y-1,z});const row=((x*13+z*7)&3);
        if(!above||top<y+1)quad([x,top,z+1,x+1,top,z+1,x+1,top,z,x,top,z],[0,1,0],id,row);
        if(!below&&y>0)quad([x,y,z,x+1,y,z,x+1,y,z+1,x,y,z+1],[0,-1,0],id,5);
        for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const q={x:x+dx,y,z:z+dz};const low=b.get(q)?Math.min(top,b.top(q)):y;if(low>=top-.001)continue;const sideRow=/grass|snow/.test(id)?4:row;
          if(dx===1)quad([x+1,low,z+1,x+1,low,z,x+1,top,z,x+1,top,z+1],[1,0,0],id,sideRow);
          if(dx===-1)quad([x,low,z,x,low,z+1,x,top,z+1,x,top,z],[-1,0,0],id,sideRow);
          if(dz===1)quad([x,low,z+1,x+1,low,z+1,x+1,top,z+1,x,top,z+1],[0,0,1],id,sideRow);
          if(dz===-1)quad([x+1,low,z,x,low,z,x,top,z,x+1,top,z],[0,0,-1],id,sideRow);
        }
      }
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeBoundingSphere();const mesh=new THREE.Mesh(geo,this.mat);mesh.receiveShadow=mesh.castShadow=true;this.group.add(mesh);this.chunks.set(key,mesh);
  }
  update(){
    const b=this.w.blocks,p=this.w.player;
    if(this.revision!==b.revision){this.revision=b.revision;for(const key of b.renderChunks)this.rebuild(key);}
    for(const [key,m] of this.chunks){const [x,z]=key.split(',').map(Number);m.visible=Math.hypot(x*32+16-p.x,z*32+16-p.z)<160;}
    const game=this.w.building,h=game.enabled?game.hit:null;
    this.outline.visible=this.crack.visible=!!h;
    if(h){this.fit(this.outline,h.pos);this.fit(this.crack,h.pos,1.003);this.crack.visible=game.progress>0;this.crackMat.map=this.crackTex[Math.min(9,Math.floor(game.progress*10))];}
    const at=game.enabled&&game.selected?.block?game.placement():null;this.preview.visible=!!at;if(at){this.preview.position.set(at.x+.5,at.y+.5,at.z+.5);this.previewMat.color.setHex(game.canPlace(at)?0x66ffaa:0xff4455);}
    let dc=0;for(const d of game.drops){if(dc>=4096)break;this.dummy.position.set(d.x,d.y+.07+Math.sin(d.age*3)*.035,d.z);this.dummy.scale.setScalar(.22);this.dummy.rotation.set(.15,d.age,.1);this.dummy.updateMatrix();this.dropMesh.setMatrixAt(dc,this.dummy.matrix);const id=item(d.id)?.block??'stone';this.dropMesh.setColorAt(dc,new THREE.Color(this.w.map.palette.tiles[id]?.[0]??0x9a7954));dc++;}this.dropMesh.count=dc;this.dropMesh.instanceMatrix.needsUpdate=true;if(this.dropMesh.instanceColor)this.dropMesh.instanceColor.needsUpdate=true;
  }
  private fit(m:THREE.Object3D,p:BlockPos,k=1){const hi=this.w.blocks.top(p),height=Math.max(.01,hi-p.y);m.position.set(p.x+.5,p.y+height/2,p.z+.5);m.scale.set(k,height*k,k);}
  dispose(){for(const m of this.chunks.values())m.geometry.dispose();this.box.dispose();this.outline.geometry.dispose();(this.outline.material as THREE.Material).dispose();this.previewMat.dispose();this.crackMat.dispose();this.crackTex.forEach(t=>t.dispose());this.atlas.dispose();this.mat.dispose();this.dropMat.map?.dispose();this.dropMat.dispose();this.dropMesh.dispose();this.group.clear();}
}
