import type { BlockWorld } from './BlockWorld';
/** Local click navigation with separate nodes for floors below and above a roof. */
export function blockPath(b:BlockWorld,sx:number,sz:number,sy:number,tx:number,tz:number):number[]{
  const gx=Math.floor(tx),gz=Math.floor(tz),start={x:Math.floor(sx),z:Math.floor(sz),y:sy,cost:0,parent:-1};
  const nodes=[start],open=[0],seen=new Map<string,number>();let end=-1;
  while(open.length&&nodes.length<6000){let best=0,score=Infinity;for(let k=0;k<open.length;k++){const n=nodes[open[k]],s=n.cost+Math.abs(gx-n.x)+Math.abs(gz-n.z);if(s<score){score=s;best=k;}}
    const i=open.splice(best,1)[0],p=nodes[i];if(p.x===gx&&p.z===gz){end=i;break;}
    for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,z=p.z+dz;if(Math.abs(x-start.x)>50||Math.abs(z-start.z)>50||b.terrain.blocksWalker(x,z))continue;
      let limit=p.y+2.2,y=b.floorAt(x+.5,z+.5,limit);let found=false;
      for(let tries=0;tries<8;tries++){if(y<=limit && b.canStand(x+.5,z+.5,y)){found=true;break;}limit=y-.01;if(limit<p.y-8)break;y=b.support(x+.5,z+.5,limit)??-100;}
      if(!found||y<0||y-p.y>2.2)continue;const cost=p.cost+1+(y>p.y+.55?2:0);const key=`${x},${z},${y}`;if((seen.get(key)??Infinity)<=cost)continue;seen.set(key,cost);nodes.push({x,z,y,cost,parent:i});open.push(nodes.length-1);
    }
  }
  if(end<0)return[];const result:number[]=[];while(nodes[end].parent>=0){const n=nodes[end];result.unshift(n.x+.5,n.z+.5);end=n.parent;}return result;
}
