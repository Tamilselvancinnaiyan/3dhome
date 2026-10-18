// All coordinates and finished-face dimensions are feet. North/front is +Z.
export const EXTERNAL=.75, INTERNAL=.375, HEIGHT=9.4, FLOOR_Y=.08;
export const rect=(x0,z0,x1,z1)=>({x0,z0,x1,z1});
export const inside=(r,x,z)=>x>r.x0&&x<r.x1&&z>r.z0&&z<r.z1;
export const contains=(r,x,z)=>x>=r.x0-1e-8&&x<=r.x1+1e-8&&z>=r.z0-1e-8&&z<=r.z1+1e-8;
export const intersects=(a,b)=>Math.min(a.x1,b.x1)>Math.max(a.x0,b.x0)+1e-8&&Math.min(a.z1,b.z1)>Math.max(a.z0,b.z0)+1e-8;
export const area=r=>(r.x1-r.x0)*(r.z1-r.z0);
export const bounds=rs=>rect(Math.min(...rs.map(r=>r.x0)),Math.min(...rs.map(r=>r.z0)),Math.max(...rs.map(r=>r.x1)),Math.max(...rs.map(r=>r.z1)));
export const outline=[rect(0,0,35.625,9.5),rect(0,9.5,32.75,29.75)];
export const perimeter=[[0,0,35.625,0],[35.625,0,35.625,9.5],[35.625,9.5,32.75,9.5],[32.75,9.5,32.75,29.75],[32.75,29.75,0,29.75],[0,29.75,0,0]];
export const rooms=[
 {id:'living',name:'Living room',r:rect(11.125,15,27.125,29),zone:true,original:'Open plan; label 16 × 14'},
 {id:'dining',name:'Dining',r:rect(.75,12.125,10.75,20.625),zone:true,original:'Open plan; label 10 × 8.5'},
 {id:'kitchen',name:'Kitchen',r:rect(.75,21,10.75,29),original:'12 × 7 centerlines'},
 {id:'master',name:'Master bedroom',r:rect(17.5,.75,29.5,13.75),original:'11 × 11 centerlines'},
 {id:'bed2',name:'Bedroom 2',r:rect(.75,.75,11.75,11.75),original:'10 × 11 centerlines'},
 {id:'common',name:'Common bathroom',r:rect(12.125,.75,17.125,8.25),original:'4.5 × 7.5 centerlines'},
 {id:'attached',name:'Attached bathroom',r:rect(29.875,.75,34.875,8.75),original:'4.5 × 11 centerlines'},
 {id:'pooja',name:'Pooja room',r:rect(28,15.625,32,20.625),original:'4 × 5 centerlines'},
 {id:'utility',name:'Utility',r:rect(27.5,21,32,29),original:'4 × 9 centerlines'}
];
const opening=(kind,from,to,extra={})=>({kind,from,to,...extra});
const win=(from,to,sill=3,height=4)=>opening('window',from,to,{sill,top:sill+height});
const vent=(from,to)=>opening('vent',from,to,{sill:7.5,top:8.7});
const door=(from,to,swing=1,hinge='min')=>opening('door',from,to,{swing,hinge});
const w=(id,axis,r,external,openings=[],height=HEIGHT)=>({id,axis,r,external,openings,height});
export const wallSpecs=[
 w('rear','x',rect(0,0,35.625,.75),true,[win(3,6),vent(12.6,13.8),win(14,16,5.5,1.5),win(21,24),vent(30.5,31.7),win(32,33.5,5.5,1.5)]),
 w('west','z',rect(0,0,.75,29.75),true,[win(3,7),win(15,19),vent(21.75,22.95),win(24,27)]),
 w('east-rear','z',rect(34.875,0,35.625,9.5),true,[win(5.5,7,5.5,1.5)]),
 w('recess-edge','x',rect(32,8.75,35.625,9.5),true),
 w('east-front','z',rect(32,8.75,32.75,29.75),true,[win(23.5,26.5)]),
 w('front','x',rect(0,29,32.75,29.75),true,[win(4,8),door(12.8,16.3,1),win(22.5,27,1.8,4),win(28.5,31,3,3)]),
 w('bed2-east','z',rect(11.75,.75,12.125,11.75),false,[door(8.5,11.5,1,'max')]),
 w('bed2-south','x',rect(.75,11.75,12.125,12.125),false),
 w('common-south','x',rect(12.125,8.25,17.125,8.625),false,[door(14.125,16.875,1)]),
 w('master-west','z',rect(17.125,.75,17.5,13.75),false),
 w('master-east','z',rect(29.5,.75,29.875,13.75),false,[door(5.5,8.25,1)]),
 w('master-south','x',rect(17.125,13.75,29.875,14.125),false,[door(18,21,-1,'max')]),
 w('attached-south','x',rect(29.875,8.75,32,9.125),false),
 w('kitchen-north','x',rect(.75,20.625,11.125,21),false,[opening('opening',4,7)],3.5),
 w('kitchen-east','z',rect(10.75,21,11.125,29),false),
 w('pooja-north','x',rect(27.625,15.25,32,15.625),false),
 w('pooja-west','z',rect(27.625,15.625,28,20.625),false,[opening('opening',17.5,20)]),
 w('pooja-utility','x',rect(27.125,20.625,32,21),false),
 w('utility-west','z',rect(27.125,21,27.5,29),false,[door(21.5,24.25,-1)])
];
export const porch={r:rect(7.05,29.75,22.05,35.75),centerX:14.55,floorY:FLOOR_Y,roofBottom:HEIGHT};
export const stair={flight:rect(32.75,12.75,36.25,33.75),landing:rect(32.75,9.75,36.25,12.75),groundY:-1.5,topY:9.9,risers:22};
stair.rise=(stair.topY-stair.groundY)/stair.risers;stair.going=(stair.flight.z1-stair.flight.z0)/(stair.risers-1);
export const entranceSteps=Array.from({length:3},(_,i)=>rect(12.3,35.75+i,16.8,36.75+i));
export const furnitureFootprints=[
 {id:'bed2-bed',room:'bed2',r:rect(1.15,1.25,7.65,6.25)},
 {id:'bed2-wardrobe',room:'bed2',r:rect(1.25,9.7,5.25,11.7)},
 {id:'bed2-table',room:'bed2',r:rect(1.2,6.575,2.2,7.225)},
 {id:'master-bed',room:'master',r:rect(21,1.05,26,7.55)},
 {id:'master-wardrobe',room:'master',r:rect(24.2,11.7,29.2,13.7)},
 {id:'master-shelf-left',room:'master',r:rect(19.75,.75,20.75,1.75)},
 {id:'master-shelf-right',room:'master',r:rect(26.25,.75,27.25,1.75)},
 {id:'common-toilet',room:'common',r:rect(12.7,1.25,14.1,3.5)},
 {id:'common-shower',room:'common',r:rect(14.65,1.1,17.125,3.4)},
 {id:'common-basin',room:'common',r:rect(12.55,6,13.95,6.9)},
 {id:'attached-toilet',room:'attached',r:rect(30.4,1.25,31.8,3.5)},
 {id:'attached-shower',room:'attached',r:rect(32.35,1.1,34.875,3.4)},
 {id:'attached-basin',room:'attached',r:rect(33.6,6.9,34.8,7.8)},
 {id:'living-sofa',room:'living',r:rect(16.4,16.925,24.4,19.8)},
 {id:'living-table',room:'living',r:rect(18.4,21.15,22.4,23.95)},
 {id:'living-console',room:'living',r:rect(16.5,27.8,23.5,28.92)},
 {id:'dining-set',room:'dining',r:rect(.76,12.16,8.24,17.84)},
 {id:'kitchen-fridge',room:'kitchen',r:rect(1,21.25,3.2,23.45)},
 {id:'pooja-altar',room:'pooja',r:rect(28.65,15.84,31.35,17.3)},
 {id:'utility-washer',room:'utility',r:rect(28,26.5,30.2,28.7)},
 {id:'utility-counter',room:'utility',r:rect(30.8,26.5,31.9,28.5)}
];
export const dimension=r=>({width:r.x1-r.x0,depth:r.z1-r.z0});
export function feetInches(feet){const e=Math.round(feet*96),f=Math.floor(e/96),inch=(e%96)/8;return `${f}′ ${Number(inch.toFixed(3))}″`;}
export const dimensionText=r=>{const d=dimension(r);return `${feetInches(d.width)} × ${feetInches(d.depth)}`;};
export function openingRect(w,o){return w.axis==='x'?rect(o.from,w.r.z0,o.to,w.r.z1):rect(w.r.x0,o.from,w.r.x1,o.to);}
export function gridCells(groups,visit){
 const rs=Object.values(groups).flat(),xs=[...new Set(rs.flatMap(r=>[r.x0,r.x1]))].sort((a,b)=>a-b),zs=[...new Set(rs.flatMap(r=>[r.z0,r.z1]))].sort((a,b)=>a-b);
 for(let j=0;j<zs.length-1;j++)for(let i=0;i<xs.length-1;i++){
  const r=rect(xs[i],zs[j],xs[i+1],zs[j+1]),x=(r.x0+r.x1)/2,z=(r.z0+r.z1)/2;
  visit(r,Object.fromEntries(Object.entries(groups).map(([k,rr])=>[k,rr.some(v=>inside(v,x,z))])),x,z);
 }
}
export function unionArea(rs){let a=0;gridCells({rs},(r,s)=>{if(s.rs)a+=area(r);});return a;}
export function mergeRects(rs){
 const rows=new Map();for(const r of rs){const key=`${r.z0}:${r.z1}`;if(!rows.has(key))rows.set(key,[]);rows.get(key).push({...r});}
 const strips=[];for(const row of rows.values()){row.sort((a,b)=>a.x0-b.x0);for(const r of row){const last=strips.at(-1);if(last&&last.z0===r.z0&&last.z1===r.z1&&Math.abs(last.x1-r.x0)<1e-8)last.x1=r.x1;else strips.push(r);}}
 const out=[];strips.sort((a,b)=>a.x0-b.x0||a.x1-b.x1||a.z0-b.z0);for(const r of strips){const last=out.at(-1);if(last&&last.x0===r.x0&&last.x1===r.x1&&Math.abs(last.z1-r.z0)<1e-8)last.z1=r.z1;else out.push(r);}return out;
}
export function wallCells(){
 const openings=wallSpecs.flatMap(w=>w.openings.map(o=>openingRect(w,o))),groups={walls:wallSpecs.map(w=>w.r),openings},pieces=new Map();
 gridCells(groups,(r,state,x,z)=>{
  if(!state.walls)return;const active=wallSpecs.filter(w=>inside(w.r,x,z));
  const cuts=[...new Set([0,.18,HEIGHT,...active.map(w=>w.height),...active.flatMap(w=>w.openings.flatMap(o=>(o.kind==='window'||o.kind==='vent')?[o.sill,o.top]:[0,7]))])].sort((a,b)=>a-b);
  for(let i=0;i<cuts.length-1;i++){
   const bottom=cuts[i],top=cuts[i+1],y=(bottom+top)/2;
   const solid=active.filter(w=>y<w.height&&!w.openings.some(o=>inside(openingRect(w,o),x,z)&&y>=((o.kind==='window'||o.kind==='vent')?o.sill:0)&&y<((o.kind==='window'||o.kind==='vent')?o.top:7)));
   if(!solid.length)continue;const external=solid.some(w=>w.external),key=`${bottom}:${top}:${external}`;
   if(!pieces.has(key))pieces.set(key,{bottom,top,external,rs:[]});pieces.get(key).rs.push(r);
  }
 });
 return [...pieces.values()].flatMap(p=>mergeRects(p.rs).map(r=>({...p,r,rs:undefined})));
}
export function floorCells(){
 const openings=wallSpecs.flatMap(w=>w.openings.map(o=>openingRect(w,o))),out=[];
 gridCells({outline,wall:wallSpecs.map(w=>w.r),openings,rooms:rooms.map(r=>r.r)},(r,state,x,z)=>{
  if(!state.outline)return;
  const solid=wallSpecs.filter(w=>inside(w.r,x,z)&&!w.openings.some(o=>(o.kind==='door'||o.kind==='opening')&&inside(openingRect(w,o),x,z)));
  const kind=solid.some(w=>w.external)?'external':solid.length?'partition':rooms.find(q=>inside(q.r,x,z))?.id??'circulation';out.push({r,kind});
 });return out;
}
export function areaSummary(){
 const cells=floorCells(),sum=kind=>cells.filter(c=>c.kind===kind).reduce((s,c)=>s+area(c.r),0);
 const roomAreas=Object.fromEntries(rooms.map(q=>[q.id,sum(q.id)]));
 const clear=Object.values(roomAreas).reduce((a,b)=>a+b,0),external=sum('external'),partition=sum('partition'),circulation=sum('circulation'),main=unionArea(outline),porchArea=area(porch.r),stairs=unionArea([stair.flight,stair.landing]),steps=unionArea(entranceSteps);
 return {roomAreas,clear,external,partition,circulation,main,porch:porchArea,stairs,steps,combined:unionArea([...outline,porch.r,stair.flight,stair.landing,...entranceSteps]),combinedWithoutSteps:unionArea([...outline,porch.r,stair.flight,stair.landing]),reconciles:Math.abs(clear+external+partition+circulation-main)<1e-7};
}
export function doorPose(w,o,angle=0){
 const gap=.06,sign=o.hinge==='max'?-1:1,base=(w.axis==='x'?0:-Math.PI/2)+(sign===-1?Math.PI:0);
 const at=o.hinge==='max'?o.to-gap:o.from+gap,open=base+o.swing*Math.PI/2;
 // Hinges sit on the face toward which the leaf opens, rather than inside the
 // wall centerline. Small jamb clearances prevent clipping during the swing.
 return {x:w.axis==='x'?at:(Math.cos(open)<0?w.r.x0:w.r.x1),z:w.axis==='x'?(-Math.sin(open)<0?w.r.z0:w.r.z1):at,rotation:base+angle*o.swing,width:o.to-o.from-2*gap};
}
export function sweptDoorHits(w,o,obstacles){
 for(let a=0;a<=90;a+=2){const p=doorPose(w,o,a*Math.PI/180);for(let d=0;d<=p.width;d+=.04)for(const t of [-.06,.06]){
  const x=p.x+Math.cos(p.rotation)*d+Math.sin(p.rotation)*t,z=p.z-Math.sin(p.rotation)*d+Math.cos(p.rotation)*t;
  for(const q of obstacles)if(inside(q.r??q,x,z))return {angle:a,obstacle:q.id??'wall',x,z};
 }}return null;
}
