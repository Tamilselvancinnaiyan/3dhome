import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {rooms,outline,wallSpecs,porch,stair,entranceSteps,furnitureFootprints,rect,areaSummary,floorCells,openingRect,doorPose,dimension,mergeRects,intersects} from '../model-plan.mjs?v=timber-sidelight-9';
import {kitchenCounters} from '../design-validation.mjs';
const root=new URL('../',import.meta.url),S=40,X=170,Y=260,W=1960,H=2390;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const num=n=>n.toLocaleString('en-IN',{maximumFractionDigits:2,minimumFractionDigits:2});
const ft=n=>{let f=Math.floor(n),i=Math.round((n-f)*12);return i?`${f}′ ${i}″`:`${f}′`;};
const dims=r=>`${ft(r.x1-r.x0)} × ${ft(r.z1-r.z0)}`;
export async function writePlanImage(){
 let a=[`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#355d50"/></marker><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9L9 0" stroke="#aeb8b4" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="#faf9f5"/><style>text{font-family:Arial,Helvetica,sans-serif;fill:#243d34}.sub{fill:#6d7b73}.dim{fill:#355d50;font-size:19px}.small{font-size:17px}.name{font-size:22px;font-weight:700}</style>`];
 const box=(r,fill,stroke='none',sw=1,rx=0)=>a.push(`<rect x="${X+r.x0*S}" y="${Y+r.z0*S}" width="${(r.x1-r.x0)*S}" height="${(r.z1-r.z0)*S}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" rx="${rx}"/>`);
 const line=(x,z,x1,z1,color='#486052',sw=2,extra='')=>a.push(`<line x1="${X+x*S}" y1="${Y+z*S}" x2="${X+x1*S}" y2="${Y+z1*S}" stroke="${color}" stroke-width="${sw}" ${extra}/>`);
 const text=(s,x,y,size=22,anchor='start',cls='')=>a.push(`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" class="${cls}">${esc(s)}</text>`);
 const at=(s,x,z,size=22,cls='')=>text(s,X+x*S,Y+z*S,size,'middle',cls);
 const circ=(x,z,r,fill,stroke='#b4ad9d',sw=2)=>a.push(`<circle cx="${X+x*S}" cy="${Y+z*S}" r="${r*S}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
 text('YOUR HOME / CURRENT 2D PLAN',170,82,38,'start','name');
 text('Geometry-derived layout · rear at top / front at bottom · dimensions in feet and inches',170,127,22,'start','sub');
 text('Updated model: enlarged utility · empty sit-out · solid timber entrance + fixed glazed sidelight',170,170,20,'start','sub');
 line(0,-1,35.625,-1,'#8f9e95',1.5);line(0,-1.3,0,-.7);line(35.625,-1.3,35.625,-.7);at('35′ 7½″ overall',17.8125,-1.35,20,'dim');
 line(-1.5,0,-1.5,29.75,'#8f9e95',1.5);line(-1.8,0,-1.2,0);line(-1.8,29.75,-1.2,29.75);text('29′ 9″',X-83,Y+15*S,19,'middle','dim');
 for(const r of outline)box(r,'#f0ede4','#536256',1);
 const colors={bed2:'#eee2ce',master:'#eee2ce',dining:'#f5eddb',living:'#f6edda',kitchen:'#e8ece4',pooja:'#f4e5c3',utility:'#e4ebe6',common:'#dfecef',attached:'#dfecef'};
 for(const q of rooms)box(q.r,colors[q.id]);
 for(const q of rooms.filter(q=>q.zone))box(q.r,'none','#bac3b5',1);
 for(const r of entranceSteps)box(r,'#d9dcd6','#8d988f',1.5);
 box(porch.r,'#e8e3d7','#7c8a7d',2);
 for(const r of [rect(porch.r.x0,porch.r.z1-.75,porch.r.x0+.75,porch.r.z1),rect(porch.r.x1-.75,porch.r.z1-.75,porch.r.x1,porch.r.z1)])box(r,'#4d5a50');
 box(stair.flight,'#e3e5e0','#7c8a7d',2);box(stair.landing,'#e3e5e0','#7c8a7d',2);
 for(let i=1;i<21;i++)line(stair.flight.x0,stair.flight.z0+i*stair.going,stair.flight.x1,stair.flight.z0+i*stair.going,'#9ba69c',1.3);
 const sx=(stair.flight.x0+stair.flight.x1)/2;line(sx,31,sx,15,'#355d50',3,'marker-end="url(#arrow)"');at('UP',sx,32,17,'name');
 for(const [t,z] of [['EXTERNAL',35.2],['STAIRCASE',35.8],['3′ 6″ wide',36.5]])at(t,sx,z,17);
 for(const r of kitchenCounters)box(r,'#bbbda6','#707a67',1);
 const f=id=>furnitureFootprints.find(q=>q.id===id).r;
 for(const q of furnitureFootprints){let r=q.r;
  if(q.id.endsWith('-bed')){box(r,'#c5b697','#a38e6b',2,6);box(rect(r.x0+.12,r.z0+.12,r.x1-.15,r.z1-.12),'#fffaf0','#d2cbbf',1,5);box(rect(r.x0+.15,r.z0+.15,r.x1-1.65,r.z1-.15),'#bcc3a0');for(const z of [r.z0+.35,r.z1-2.05])box(rect(r.x1-1.35,z,r.x1-.25,z+1.65),'#f7f3e8','#d1c5b1',1,7);}
  else if(q.id.includes('wardrobe')){box(r,'#bda181','#876e51',1.5);for(let x=r.x0+1;x<r.x1;x++)line(x,r.z0,x,r.z1,'#8e785c',1);}
  else if(q.id==='living-sofa'){box(r,'#c9b79b','#a18b6a',2,10);box(rect(r.x0+.08,r.z0+.08,r.x1-.08,r.z0+.52),'#ab9577');for(let i=0;i<3;i++)box(rect(r.x0+.5+i*2.35,r.z0+.7,r.x0+2.65+i*2.35,r.z1-.3),'#e3d3b8','#bcaa8a',1,8);}
  else if(q.id==='living-table'){circ((r.x0+r.x1)/2,(r.z0+r.z1)/2,1.6,'#c2a16c');circ(24,21.55,.36,'#8c9b63','#6d7e47');}
  else if(q.id==='dining-set'){for(const x of [9.25,11.125,13])for(const z of [15.625,18.125])box(rect(x-.75,z-.75,x+.75,z+.75),'#c0a27c','#917754',1.5,5);box(rect(8.375,15.875,13.875,17.875),'#ad895d','#7f6545',2,8);circ(11.125,16.875,.3,'#9ca36d');}
  else if(q.id==='living-console'){box(r,'#ae8860','#826645',1.5);box(rect(r.x0+1,r.z1-.18,r.x1-1,r.z1-.03),'#344c45');}
  else if(q.id.includes('washer')){box(r,'#f9faf7','#8a9a93',2,4);circ((r.x0+r.x1)/2,(r.z0+r.z1)/2,.7,'#d5e2df','#91a6a1');}
  else if(q.id.includes('fridge')){box(r,'#f3f5f0','#93a097',2,3);line(r.x0+.1,r.z0+.9,r.x1-.1,r.z0+.9,'#aab6ab',1.5);}
  else if(q.id.endsWith('toilet')){box(r,'#fbfcf8','#a1b6b7',1.5,12);circ((r.x0+r.x1)/2,r.z1-.7,.45,'#e7f0ee','#b5c6c6');}
  else if(q.id.endsWith('shower')){box(r,'#c8dfe0','#93b5b7',1.5);line(r.x0,r.z0,r.x1,r.z1,'#9fc0c2',1);}
  else if(q.id.includes('basin')||q.id.includes('counter')){box(r,'#b9c3b7','#7e9486',1.5);box(rect(r.x0+.15,r.z0+.25,r.x1-.15,r.z1-.25),'#e6f0ec','#8da8a4',1,6);}
  else if(q.id==='pooja-altar'){box(r,'#c49e60','#987944',1.5);circ((r.x0+r.x1)/2,(r.z0+r.z1)/2,.31,'#d9b34b','#b18b32');}
  else box(r,q.id==='utility-storage'?'#c3b18d':'#c8b899','#9a947e',1.2,2);
 }
 // Hob lies on the exterior front counter, away from the doorless passage.
 box(rect(9.3,27.2,11.7,28.8),'#49504a');for(const x of [9.9,11.1])for(const z of [27.6,28.4])circ(x,z,.23,'none','#bfc9bb',1.5);
 const cells=floorCells(),half=wallSpecs.find(w=>w.id==='kitchen-north');
 for(const kind of ['external','partition'])for(const r of mergeRects(cells.filter(c=>c.kind===kind).map(c=>c.r)))box(r,intersects(r,half.r)?'#aab2a6':'#354238');
 for(const w of wallSpecs)for(const o of w.openings){const r=openingRect(w,o);
  if(o.kind==='window'||o.kind==='vent'){
   box(r,'#f6fbf9','#65847c',1.3);
   if(w.axis==='x'){line(r.x0,(r.z0+r.z1)/2,r.x1,(r.z0+r.z1)/2,'#73a5a7',3);if(o.sidelight)for(let x=r.x0+.12;x<r.x1;x+=.2)line(x,r.z0+.12,x,r.z1-.12,'#927f5c',1);}
   else line((r.x0+r.x1)/2,r.z0,(r.x0+r.x1)/2,r.z1,'#73a5a7',3);
  }
  if(o.kind==='door'){
   const p=doorPose(w,o,Math.PI/2);line(p.x,p.z,p.x+Math.cos(p.rotation)*p.width,p.z-Math.sin(p.rotation)*p.width,'#96754d',3);
   const pts=Array.from({length:25},(_,i)=>{const v=doorPose(w,o,i/24*Math.PI/2);return `${X+(v.x+Math.cos(v.rotation)*v.width)*S},${Y+(v.z-Math.sin(v.rotation)*v.width)*S}`;});a.push(`<polyline points="${pts.join(' ')}" fill="none" stroke="#b4bcb2" stroke-width="1.4" stroke-dasharray="5 4"/>`);
  }
 }
 const labels={bed2:[6.25,8.5],master:[23.5,9],common:[14.625,4.9],attached:[32.375,4.9],pooja:[2.75,15.1],utility:[3,22.3],dining:[10.625,19.65],kitchen:[10.625,23.4],living:[26,25.4]};
 for(const q of rooms){const [x,z]=labels[q.id],small=['common','attached','pooja','utility'].includes(q.id),name=q.id==='common'?'COMMON BATH':q.id==='attached'?'ATTACHED BATH':q.name.toUpperCase();at(name,x,z-.2,small?17:22,'name');at(dims(q.r),x,z+.45,small?17:20,'dim');}
 at('WARDROBE ACCESS',32.2,10.1,15,'sub');at('Separate from bedroom target',32.2,10.65,13,'sub');
 at('COVERED SIT-OUT',18.55,31.75,22,'name');at('20′ × 5′  /  100 sq ft',18.55,32.6,21,'dim');
 at('3′ clear passage',7.125,20.15,14,'sub');at('Half-height wall · open above',11.75,21.65,14,'sub');
 at('Solid timber door + glazed sidelight',19.7,30.65,16,'sub');
 line(2,35.2,2,37,'#355d50',2.5,'marker-end="url(#arrow)"');at('FRONT / +Z',2,37.75,17,'dim');
 const summary=areaSummary();
 a.push('<rect x="170" y="1850" width="1620" height="460" rx="16" fill="#fff" stroke="#d6ded4"/>');
 text('CLEAR ROOM MEASUREMENTS',200,1895,24,'start','name');text('Finished face to finished face',200,1925,17,'start','sub');
 let yy=1965;for(const q of rooms){text(q.name,200,yy,20);text(dims(q.r),620,yy,20);text(num(summary.roomAreas[q.id])+' sq ft',1100,yy,20,'end');yy+=32;}
 text('Clear rooms total',200,yy+10,21,'start','name');text(num(summary.clear)+' sq ft',1100,yy+10,21,'end','name');
 const rows=[['Main-house built-up',summary.main],['Included circulation / thresholds',summary.circulation],['Covered sit-out',summary.porch],['External stair + landing',summary.stairs],['Entrance steps',summary.steps]];
 text('FOOTPRINT ACCOUNTING',1170,1895,24,'start','name');let ay=1950;for(const [label,value] of rows){text(label,1170,ay,18);text(num(value)+' sq ft',1750,ay+27,23,'end','name');ay+=66;}
 text('1 unit = 1 ft  ·  9-inch exterior walls  ·  4½-inch internal partitions',170,2340,19,'start','sub');
 text('Planning model. Dimensions and areas come from the current geometry; not a structural drawing.',170,2370,17,'start','sub');
 a.push('</svg>');const svg=a.join('\n');await writeFile(new URL('current-layout.svg',root),svg);
 const require=createRequire(import.meta.url);let sharp;try{sharp=require('sharp');}catch{sharp=require(join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));}
 await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL('current-layout.png',root)));
 return {svg:'current-layout.svg',png:'current-layout.png',areas:summary};
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(await writePlanImage());
