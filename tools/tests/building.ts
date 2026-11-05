import assert from 'node:assert/strict';
import {World} from '../../src/rpg/World';
import {Terrain} from '../../src/game/Terrain';
import {GameClock} from '../../src/game/GameClock';
import {NullFx} from '../../src/game/types';
import {TEST_MAP} from '../../src/rpg/testMap';
import {newGear,fixGear} from '../../src/rpg/equipment';
import {addStack,countAt} from '../../src/game/blocks/BlockGame';
function make(){const t=new Terrain(32,true);t.top=new Float32Array(1024).fill(6);t.tileNames=['grass'];return new World(NullFx,new GameClock(),'human',newGear([]),{map:TEST_MAP,terrain:t,spawn:{x:8.5,z:8.5},dummies:[]});}
for(const fps of [30,60,144]){
 const w=make(),b=w.building,p={x:9,y:5,z:8};addStack(w.gear,'tool:shovel',1);w.gear.active=0;b.toggle(true);
 for(let i=0;i<fps;i++)b.input({pos:p,normal:{x:0,y:1,z:0},distance:2},true,false,1/fps);
 assert.equal(w.blocks.get(p),null);assert.equal(b.drops.length,1);assert.equal(w.gear.wear![0],249);assert.equal(w.terrain.groundY(9.5,8.5),6);
 w.player.x=9;for(let i=0;i<fps*2;i++)b.update(1/fps);w.player.x=8.5;
 const slot=w.gear.bag.indexOf('block:dirt');assert.ok(slot>=0);assert.equal(countAt(w.gear,slot),1);assert.equal(b.drops.length,0);
 b.select(slot);b.input({pos:{...p,y:4},normal:{x:0,y:1,z:0},distance:2},false,true,0);
 assert.equal(w.blocks.get(p),'dirt');assert.equal(w.gear.bag[slot],null);
 assert.equal(w.blocks.canStand(9.5,8.5,5),false);assert.equal(w.blocks.canStand(9.5,8.5,6),true);
 const restored=make();assert.ok(restored.blocks.load(JSON.parse(JSON.stringify(w.blocks.serialize()))));restored.setGear(fixGear(JSON.parse(JSON.stringify(w.gear)),newGear([])));assert.equal(restored.blocks.get(p),'dirt');assert.equal(restored.gear.wear![0],249);
 for(let x=7;x<=9;x++)for(let z=7;z<=9;z++)w.blocks.remove({x,y:5,z});
 for(let i=0;i<fps*2;i++)w.update(1/fps);assert.ok(Math.abs(w.player.y-5)<.05,`fall onto excavated floor at ${fps} FPS: ${w.player.y}`);
 console.log(`ok mining, pickup, placement, collision, reload, falling at ${fps} FPS`);
}
const w=make();w.gear.bag.fill('block:dirt');w.gear.amounts=w.gear.bag.map(()=>64);assert.equal(addStack(w.gear,'block:dirt',3),3);
w.building.loadDrops([{id:'block:dirt',x:8.5,y:6,z:8.5,vy:0,age:1,count:3}]);w.building.update(.1);assert.equal(w.building.drops[0].count,3);
console.log('ok full inventory preserves dropped resources');
