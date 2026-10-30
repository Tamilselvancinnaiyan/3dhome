import test from 'node:test';
import assert from 'node:assert/strict';
import {rooms,wallSpecs,outline,dressing,EXTERNAL,INTERNAL,HEIGHT,porch,stair,entranceSteps,furnitureFootprints,area,inside,intersects,dimension,unionArea,areaSummary,wallCells,floorCells,openingRect,sweptDoorHits,contains,doorPose,rect} from '../model-plan.mjs?v=timber-sidelight-9';
import {obstacles} from '../design-validation.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const targets={living:[16,14],dining:[10,8.5],kitchen:[10,8],master:[12,13],bed2:[11,11],common:[5,7.5],attached:[5,8],pooja:[4,5],utility:[4.5,11.5]};
test('all independently specified clear room targets are physically free of walls and other zones',()=>{
 const solids=wallCells();for(const q of rooms){const d=dimension(q.r);assert.deepEqual([d.width,d.depth],targets[q.id]);for(const r of [q.r,...(q.extra??[])])for(const p of solids)assert.equal(intersects(r,p.r),false,`${q.id} intersects a wall`);}
 for(let i=0;i<rooms.length;i++)for(let j=i+1;j<rooms.length;j++)assert.equal(intersects(rooms[i].r,rooms[j].r),false);
});
test('external and internal wall bands have the specified thickness and no intersecting solid volumes',()=>{
 for(const w of wallSpecs)near(w.axis==='x'?w.r.z1-w.r.z0:w.r.x1-w.r.x0,w.external?EXTERNAL:INTERNAL);
 const solids=wallCells();for(let i=0;i<solids.length;i++)for(let j=i+1;j<solids.length;j++){const a=solids[i],b=solids[j];assert.ok(!(intersects(a.r,b.r)&&Math.min(a.top,b.top)>Math.max(a.bottom,b.bottom)+1e-8),'Duplicated wall volume');}
});
test('floor cells cover the outline exactly once and reconcile all clear, wall and circulation areas',()=>{
 const s=areaSummary();assert.equal(s.reconciles,true);near(s.clear,815.25);near(s.main,1059.84375);near(s.clear+s.external+s.partition+s.circulation,s.main);
 const cells=floorCells();near(cells.reduce((sum,c)=>sum+area(c.r),0),unionArea(outline));
 for(const q of rooms)near(s.roomAreas[q.id],area(q.r)+(q.extra??[]).reduce((sum,r)=>sum+area(r),0));
});
test('20 x 5 porch, stairs and steps share boundaries but have no overlapping plan area',()=>{
 assert.deepEqual(Object.values(dimension(porch.r)),[20,5]);near(area(porch.r),100);near(unionArea([stair.flight,stair.landing]),84);
 const structures=[...outline,porch.r,stair.flight,stair.landing,...entranceSteps];for(let i=0;i<structures.length;i++)for(let j=i+1;j<structures.length;j++)assert.equal(intersects(structures[i],structures[j]),false);
 const s=areaSummary();near(s.combined,structures.reduce((sum,r)=>sum+area(r),0));near(s.combinedWithoutSteps,1243.84375);near(s.combined,1257.34375);
 near(stair.rise*stair.risers,stair.topY-stair.groundY);near(stair.going,1);assert.ok(stair.rise>.49&&stair.rise<.59);
});
test('bedroom beds and wardrobes fit, do not overlap, and retain practical essential aisles',()=>{
 for(const f of furnitureFootprints){if(f.room==='circulation'){assert.ok(outline.some(r=>f.r.x0>=r.x0&&f.r.x1<=r.x1&&f.r.z0>=r.z0&&f.r.z1<=r.z1));for(const q of rooms)assert.equal(intersects(f.r,q.r),false);for(const w of wallSpecs)assert.equal(intersects(f.r,w.r),false);continue;}const room=f.id==='living-console'?rect(18.875,14.125,34.875,29):f.room==='dressing'?dressing.r:f.room==='sitout'?porch.r:rooms.find(q=>q.id===f.room).r; // Console occupies the open hall front apron, outside the 16 × 14 measurement zone.
assert.ok(f.r.x0>=room.x0-1e-7&&f.r.x1<=room.x1+1e-7&&f.r.z0>=room.z0-1e-7&&f.r.z1<=room.z1+1e-7,`${f.id} outside its room`);}
 for(const id of ['bed2','master']){const fs=furnitureFootprints.filter(f=>f.room===id),bed=fs.find(f=>f.id.endsWith('-bed')),ward=furnitureFootprints.find(f=>f.id===id+'-wardrobe');for(let i=0;i<fs.length;i++)for(let j=i+1;j<fs.length;j++)assert.equal(intersects(fs[i].r,fs[j].r),false);assert.ok(ward.r.z0-bed.r.z1>=2.5);}
 near(dimension(furnitureFootprints.find(f=>f.id==='bed2-bed').r).width,6.5);near(dimension(furnitureFootprints.find(f=>f.id==='master-bed').r).width,6.5);
});
test('all hinged doors clear all furniture during their entire swing and openings avoid crossing walls',()=>{
 for(const w of wallSpecs)for(const o of w.openings){if(o.kind==='door'){assert.equal(sweptDoorHits(w,o,obstacles),null,`${w.id}: furniture in door sweep`);const walls=floorCells().filter(c=>c.kind==='external'||c.kind==='partition').map(c=>c.r);assert.equal(sweptDoorHits(w,o,walls),null,`${w.id}: wall clipping during swing`);assert.ok(o.to-o.from>=2.5);}
  for(const other of wallSpecs)if(other!==w)assert.equal(intersects(openingRect(w,o),other.r),false,`${w.id} opening crosses ${other.id}`);
 }
});
test('flood-fill verifies 2.5-foot-wide essential routes to all rooms with doors open',()=>{
 const walls=floorCells().filter(c=>c.kind==='external'||c.kind==='partition').map(c=>c.r);for(const w of wallSpecs)for(const o of w.openings)if(o.kind==='door'){const p=doorPose(w,o,Math.PI/2),x=p.x+Math.cos(p.rotation)*p.width,z=p.z-Math.sin(p.rotation)*p.width;walls.push(Math.abs(x-p.x)>.01?rect(Math.min(x,p.x),z-.06,Math.max(x,p.x),z+.06):rect(x-.06,Math.min(z,p.z),x+.06,Math.max(z,p.z)));}const pad=1.25,blocked=(x,z)=>walls.some(r=>x>r.x0-pad&&x<r.x1+pad&&z>r.z0-pad&&z<r.z1+pad)||furnitureFootprints.some(f=>x>f.r.x0-pad&&x<f.r.x1+pad&&z>f.r.z0-pad&&z<f.r.z1+pad);
 const cell=.25,key=(x,z)=>`${x},${z}`,queue=[[74,112]],seen=new Set(['74,112']);
 for(let head=0;head<queue.length;head++){const [x,z]=queue[head];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Z=z+dz,k=key(X,Z),wx=X*cell,wz=Z*cell;if(seen.has(k)||!outline.some(r=>contains(r,wx,wz))||blocked(wx,wz))continue;seen.add(k);queue.push([X,Z]);}}
 const destinations={bed2:[9.5,7.2],master:[19.2,9],common:[15.5,5],attached:[32.2,7],kitchen:[10,24],dining:[7,17.5],living:[31.5,24.5],pooja:[2.875,15.5],utility:[3.375,24.5]};
 for(const [id,[x,z]] of Object.entries(destinations))assert.ok(seen.has(key(Math.round(x/cell),Math.round(z/cell))),`No usable route to ${id}`);
});

test('reference layout has aligned exterior, exclusive service access and a separate wardrobe zone',()=>{
 const room=id=>rooms.find(q=>q.id===id);
 assert.equal(room('master').extra,undefined);
 assert.ok(inside(dressing.r,31,11));assert.equal(floorCells().find(c=>inside(c.r,31,11))?.kind,'circulation');
 for(const id of ['pooja','utility'])near(room(id).r.x0,.75);
 const utility=wallSpecs.find(w=>w.id==='utility-east');assert.equal(utility.external,false);assert.equal(utility.openings.length,1);
 const half=wallSpecs.find(w=>w.id==='kitchen-north');near(half.height,3.25);near(half.openings[0].to-half.openings[0].from,3);near(half.openings[0].from,5.625);near(half.openings[0].to,8.625);
 assert.ok(wallSpecs.find(w=>w.id==='west').openings.some(o=>o.kind==='window'));
 const sofa=furnitureFootprints.find(f=>f.id==='living-sofa').r;near(sofa.z0-wallSpecs.find(w=>w.id==='master-south').r.z1,.05);
 for(const w of wallSpecs)for(const x of [w.r.x0+.001,w.r.x1-.001])for(const z of [w.r.z0+.001,w.r.z1-.001])assert.ok(outline.some(r=>contains(r,x,z)),`${w.id} outside slab/roof footprint`);
});

test('pooja shares Bedroom 2 wall and recovered depth belongs to utility',()=>{
 const room=id=>rooms.find(q=>q.id===id).r;
 near(room('pooja').z0,room('bed2').z1+INTERNAL);
 const divider=wallSpecs.find(w=>w.id==='pooja-utility');near(divider.r.z0,room('pooja').z1);near(divider.r.z1,room('utility').z0);
 near(area(room('utility')),51.75);assert.equal(wallSpecs.some(w=>w.id==='pooja-rear'),false);
});
