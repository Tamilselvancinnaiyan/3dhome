import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {EXTERNAL,INTERNAL,HEIGHT,FLOOR_Y,outline,perimeter,rooms as roomDefs,wallSpecs,porch,stair,entranceSteps,furnitureFootprints,rect,inside,dimensionText,dimension,feetInches,areaSummary,wallCells,floorCells,mergeRects,doorPose,openingRect,bounds,contains} from './model-plan.mjs?v=verified-plan-2';
const $=id=>document.getElementById(id),vp=$('viewport');
const scene=new THREE.Scene();scene.background=new THREE.Color('#e6e9e3');
const camera=new THREE.PerspectiveCamera(42,1,.1,300);
let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});}catch(e){$('loading').textContent='This viewer needs WebGL. Please enable hardware acceleration in your browser.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;vp.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(17,0,17);controls.enableDamping=true;controls.maxPolarAngle=Math.PI/2-.04;controls.minDistance=8;controls.maxDistance=180;
const hemi=new THREE.HemisphereLight('#fff6e5','#80978a',2.5);scene.add(hemi);
const sun=new THREE.DirectionalLight('#fff4df',3);sun.position.set(-20,55,30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-55,right:55,top:55,bottom:-55,near:1,far:150});sun.shadow.bias=-.0004;scene.add(sun);
const house=new THREE.Group(),furn=new THREE.Group(),roof=new THREE.Group(),wallGroup=new THREE.Group();scene.add(house);house.add(furn,roof,wallGroup);
const materials={};function mat(color,rough=.8,metal=0){return materials[color+rough+metal]??=new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});}
function box(w,h,d,x,y,z,color,parent=house){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function rectBox(r,bottom,top,color,parent=house){return box(r.x1-r.x0,top-bottom,r.z1-r.z0,(r.x0+r.x1)/2,(top+bottom)/2,(r.z0+r.z1)/2,color,parent);}
function cyl(r,h,x,y,z,color,parent=furn){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,24),typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function rail(x1,y1,z1,x2,y2,z2,r=.045,parent=house){const p=new THREE.Vector3(x1,y1,z1),q=new THREE.Vector3(x2,y2,z2),v=q.clone().sub(p);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),8),mat('#41454A',.5,.6));m.position.copy(p.add(q).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());parent.add(m);return m;}
function nameObject(object,name){object.name=name;return object;}
// One slab per non-overlapping outline rectangle; closed, square wall corners.
box(46,.4,48,17,-1.7,18,'#d0d4c8');
for(const r of outline){nameObject(rectBox(r,-1.5,-.5,'#d5d0c3'),'Main plinth support');nameObject(rectBox(r,-.5,0,'#ded6c6'),'Main structural floor slab');}
const cells=floorCells(),wallFootprints=mergeRects(cells.filter(c=>c.kind==='external'||c.kind==='partition').map(c=>c.r));
const floorColors={bed2:'#d6bb94',master:'#d6bb94',common:'#a6c1c6',attached:'#a6c1c6',kitchen:'#d0cebd',pooja:'#e5c89d',utility:'#ddcfb5'};
for(const kind of [...new Set(cells.map(c=>c.kind))]){
 if(kind==='external'||kind==='partition')continue;
 for(const r of mergeRects(cells.filter(c=>c.kind===kind).map(c=>c.r)))nameObject(rectBox(r,0,FLOOR_Y,floorColors[kind]??'#e5ddc8'),'Clear floor · '+kind);
}
// Partition the wall volumes before rendering: every solid point belongs to one mesh.
for(const p of wallCells()){
 const mesh=rectBox(p.r,p.bottom,p.top,p.top<=.18?'#86512E':'#F2EBDD',wallGroup);
 if(p.top>.18&&p.r.z1===.75){const accent=p.r.x0>=.75&&p.r.x1<=11.75?'#A5AD98':p.r.x0>=17.5&&p.r.x1<=29.5?'#A39485':null;if(accent)mesh.material=[mesh.material,mesh.material,mesh.material,mesh.material,mat(accent),mesh.material];}
 mesh.userData={role:'wall',external:p.external,bounds:p.r,bottom:p.bottom,top:p.top};
}
const doors=[];
for(const w of wallSpecs)for(const o of w.openings){
 const r=openingRect(w,o),midX=(r.x0+r.x1)/2,midZ=(r.z0+r.z1)/2;
 if(o.kind==='door'){
  const p=doorPose(w,o),hinge=new THREE.Group();hinge.position.set(p.x,0,p.z);hinge.rotation.y=p.rotation;wallGroup.add(hinge);
  box(p.width,6.88,.12,p.width/2,3.54,0,'#86512E',hinge);box(.16,.16,.28,p.width-.22,3.2,.12,'#c1b086',hinge);
  doors.push({hinge,base:p.rotation,swing:o.swing,w:p.width,wall:w,opening:o});
 }else if(o.kind==='vent'){
  const group=new THREE.Group();group.position.set(midX,8.1,midZ);group.rotation.y=w.axis==='x'?0:-Math.PI/2;wallGroup.add(group);
  const width=o.to-o.from,thickness=w.axis==='x'?r.z1-r.z0:r.x1-r.x0,shape=new THREE.Shape();shape.moveTo(-width/2,-.6);shape.lineTo(width/2,-.6);shape.lineTo(width/2,.6);shape.lineTo(-width/2,.6);shape.closePath();const hole=new THREE.Path();hole.absarc(0,0,.58,0,Math.PI*2,true);shape.holes.push(hole);
  const panel=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false,curveSegments:32}),mat('#F2EBDD'));panel.position.z=-thickness/2;panel.castShadow=true;panel.receiveShadow=true;group.add(panel);
  const collar=new THREE.Mesh(new THREE.TorusGeometry(.58,.025,8,32),mat('#41454A'));collar.position.z=(w.id==='west'?1:-1)*(thickness/2+.01);group.add(collar);
 }else if(o.kind==='window'){
  const group=new THREE.Group();group.position.set(midX,0,midZ);group.rotation.y=w.axis==='x'?0:-Math.PI/2;wallGroup.add(group);
  const width=o.to-o.from,h=o.top-o.sill,center=(o.top+o.sill)/2;
  const glass=new THREE.MeshStandardMaterial({color:'#a8d0db',transparent:true,opacity:h<2?.65:.32,roughness:.15,metalness:.2});
  box(width,h,.08,0,center,0,glass,group);
  // Frames fit inside each opening, preserving finished-face room dimensions.
  for(const x of [-width/2+.04,0,width/2-.04])box(.08,h,.18,x,center,0,'#86512E',group);
  for(const y of [o.sill+.04,center,o.top-.04])box(width,.08,.18,0,y,0,'#86512E',group);
 }
}
for(const w of wallSpecs.filter(w=>w.id==='kitchen-north'))for(const p of wallCells().filter(p=>p.top===3.5&&p.r.z0>=w.r.z0&&p.r.z1<=w.r.z1&&p.r.x1<=11.125))rectBox(p.r,3.5,3.62,'#C8BDB0',wallGroup);
// Main roof follows the corrected L-shaped outline; no phantom roofed recess.
for(const r of outline)nameObject(rectBox(r,HEIGHT,9.9,'#41454A',roof),'Main RCC roof slab');
for(const r of [rect(0,0,35.625,.35),rect(0,.35,.35,29.4),rect(35.275,.35,35.625,9.15),rect(32.4,9.15,35.625,9.5),rect(32.4,9.5,32.75,9.75),rect(32.4,12.75,32.75,29.4),rect(.35,29.4,32.75,29.75)])rectBox(r,9.9,12.9,'#F2EBDD',roof);
// North/front porch starts at the OUTSIDE face, not the wall centerline.
const porchGroup=new THREE.Group();porchGroup.name='Sit-out · exact 15 × 6 ft';house.add(porchGroup);
rectBox(porch.r,-1.5,-.5,'#d5d0c3',porchGroup);rectBox(porch.r,-.5,0,'#F2EBDD',porchGroup);rectBox(porch.r,0,FLOOR_Y,mat('#8B8D8C',1),porchGroup);
for(let x=porch.r.x0+2;x<porch.r.x1;x+=2)box(.01,.002,6,x,.081,32.75,'#777a78',porchGroup);
for(let z=porch.r.z0+2;z<porch.r.z1;z+=2)box(15,.002,.01,porch.centerX,.081,z,'#777a78',porchGroup);
nameObject(rectBox(porch.r,HEIGHT,9.9,'#E5D9C7',roof),'Porch roof · 15 × 6 ft');
const pillarBounds=[rect(porch.r.x0,porch.r.z1-.75,porch.r.x0+.75,porch.r.z1),rect(porch.r.x1-.75,porch.r.z1-.75,porch.r.x1,porch.r.z1)];
for(const r of pillarBounds)nameObject(rectBox(r,FLOOR_Y,HEIGHT,'#F5F2EA',porchGroup),'Porch square pillar');
for(const [i,r] of entranceSteps.entries())rectBox(r,-1.5,FLOOR_Y-i*(FLOOR_Y+1.5)/3,mat('#8B8D8C',1),porchGroup);
const porchLights=[];
for(const x of [11.55,17.55]){cyl(.19,.07,x,HEIGHT-.035,32.75,'#F5F2EA',roof);const diffuser=mat('#fff1ce').clone();diffuser.emissive.set('#ffd7a3');diffuser.emissiveIntensity=.25;cyl(.14,.012,x,HEIGHT-.076,32.75,diffuser,roof);const light=new THREE.PointLight('#ffd7a3',0,8,2);light.position.set(x,HEIGHT-.2,32.75);roof.add(light);porchLights.push(light);}
// Twenty-two equal risers, twenty-one 12-inch goings, and a 3-foot landing.
// A continuous extruded waist/profile replaces the previous floating tread boxes.
const profile=new THREE.Shape();profile.moveTo(0,stair.groundY-.45);profile.lineTo(0,stair.groundY+stair.rise);
for(let i=0;i<21;i++){const top=stair.groundY+(i+1)*stair.rise;profile.lineTo(i+1,top);if(i<20)profile.lineTo(i+1,top+stair.rise);}
profile.lineTo(21,stair.groundY+21*stair.rise-.45);profile.lineTo(0,stair.groundY-.45);profile.closePath();
const flight=new THREE.Mesh(new THREE.ExtrudeGeometry(profile,{depth:3.5,bevelEnabled:false}),mat('#b5b6ae'));
flight.rotation.y=Math.PI/2;flight.position.set(stair.flight.x0,0,stair.flight.z1);flight.castShadow=true;flight.receiveShadow=true;flight.name='Independent stair flight';house.add(flight);
nameObject(rectBox(stair.landing,stair.topY-.75,stair.topY,'#b5b6ae'),'Stair landing');
const stairMin=stair.flight.x0,stairMax=stair.flight.x1,stairX=(stairMin+stairMax)/2;
for(const x of [stairMin+.045,stairMax-.045]){
 const y0=stair.groundY+stair.rise;rail(x,y0+3,stair.flight.z1-.1,x,stair.topY-stair.rise+3,stair.flight.z0+.1);
 rail(x,y0+1.5,stair.flight.z1-.1,x,stair.topY-stair.rise+1.5,stair.flight.z0+.1);
 for(let i=0;i<21;i+=2){const z=stair.flight.z1-i-.5,y=stair.groundY+(i+1)*stair.rise;const handY=stair.groundY+stair.rise+3+(i+.5-.1)/20.8*(20*stair.rise);rail(x,y,z,x,handY,z);}
  rail(x,stair.topY-stair.rise+3,stair.flight.z0+.1,x,stair.topY+3,stair.flight.z0);
}
rail(stairMax-.045,stair.topY,9.75,stairMax-.045,stair.topY+3,9.75);rail(stairMin,stair.topY+3,9.795,stairMax-.045,stair.topY+3,9.795);rail(stairMax-.045,stair.topY+3,9.795,stairMax-.045,stair.topY+3,12.75);
// Existing furniture styles, rebuilt at the corrected room coordinates.
function queenBed(x,z,rotation=0){
  const bedGroup=new THREE.Group();bedGroup.position.set(x,0,z);bedGroup.rotation.y=rotation;furn.add(bedGroup);
  const w=5,d=6.5,wood='#987352';
  box(w-.3,.26,d-.3,0,.21,0,wood,bedGroup); // Recessed support plinth.
  box(w,.3,d,0,.49,0,wood,bedGroup);
  box(w,.12,d,0,.7,0,'#ddd5c7',bedGroup);
  box(w-.04,.5,d-.18,0,1.01,.07,'#f5f1e8',bedGroup);
  box(w,2.3,.14,0,1.23,-d/2+.07,wood,bedGroup);
  box(w-.06,.05,3.8,0,1.285,1.23,'#d7cfbf',bedGroup);
  for(const dx of [-1.25,1.25])box(1.65,.18,1.1,dx,1.35,-2.15,'#f7f3eb',bedGroup);
}

function wardrobe(x,z,w){
  const h=7,d=2,base=.08;
  box(w,h,d-.06,x,base+h/2,z+.03,'#cfb99a',furn);
  for(const side of [-1,1]){
    box(w/2-.04,h-.2,.06,x+side*w/4,base+h/2,z-d/2+.03,'#ddd2bd',furn);
    box(.045,.65,.035,x+side*.13,3.4,z-d/2+.0175,'#81735f',furn);
  }
  for(const y of [base+.11,base+h-.11])box(w-.08,.035,.04,x,y,z-d/2+.03,'#b7a58a',furn);
}

function chair(x,z,rot){const g=new THREE.Group();furn.add(g);g.position.set(x,0,z);g.rotation.y=rot;box(1.5,.25,1.5,0,1.55,0,'#86512E',g);box(1.5,1.6,.18,0,2.15,-.7,'#86512E',g);for(const xx of [-.55,.55])for(const zz of [-.55,.55])box(.1,1.5,.1,xx,.75,zz,'#86512E',g);}

function plant(x,z,s=1,y=0){cyl(.5*s,.8*s,x,y+.4*s,z,'#9c8b70');for(let i=0;i<7;i++){const a=i*2.4,m=new THREE.Mesh(new THREE.SphereGeometry(.5*s,8,8),mat(i%2?'#647d42':'#839359'));m.scale.set(.6,1.6,.4);m.position.set(x+Math.sin(a)*.4*s,y+1.1*s,z+Math.cos(a)*.4*s);m.rotation.z=Math.sin(a)*.6;furn.add(m);}}

function furnish(id,build){const start=furn.children.length;build();const children=furn.children.slice(start),g=new THREE.Group();g.name=id;g.userData.furnitureId=id;for(const c of children)g.add(c);furn.add(g);return g;}
furnish('bed2-bed',()=>queenBed(4.4,3.75,Math.PI/2));furnish('master-bed',()=>queenBed(23.5,4.3));
furnish('bed2-wardrobe',()=>wardrobe(3.25,10.7,4));furnish('master-wardrobe',()=>wardrobe(26.7,12.7,5));
furnish('bed2-table',()=>{box(1,.12,.65,1.7,1.4,6.9,'#987352',furn);for(const x of [1.31,2.09])for(const z of [6.665,7.135])box(.08,1.26,.08,x,.71,z,'#987352',furn);});
for(const [id,x] of [['master-shelf-left',20.25],['master-shelf-right',26.75]])furnish(id,()=>box(1,.16,1,x,1.4,1.25,'#987352',furn));
furnish('living-sofa',()=>{
 for(const x of [16.8,24])for(const z of [15.5,17.7])box(.16,.37,.16,x,.265,z,'#86512E',furn);
 box(8,1.1,2.7,20.4,1,16.7,'#b6aa94',furn);box(8,.7,2.7,20.4,1.8,16.7,'#e4d9c4',furn);box(8,2,.55,20.4,2.1,15.45,'#d1c4ac',furn);
 for(const x of [16.625,24.175])box(.45,1.6,2.7,x,1.8,16.7,'#e4d9c4',furn);
 for(const x of [17.8,20.4,23])box(2.45,.22,2.1,x,2.22,16.7,'#eee4d2',furn);
 for(const [x,c] of [[17.9,'#99734d'],[22.9,'#839359']]){const p=box(1.25,.3,1.25,x,2.48,16.4,c,furn);p.rotation.y=.35;}
}).position.z=1.75;
box(8,.06,7.5,20.4,.11,22.55,'#d6cbb7',furn);
furnish('living-table',()=>{box(4,.23,2.8,20.4,1.5,21.3,'#b38451',furn);for(const x of [18.9,21.9])for(const z of [20.3,22.3])box(.12,1.305,.12,x,.7325,z,'#86512E',furn);}).position.z=1.25;
furnish('living-console',()=>{box(7,1.5,1.1,20,.83,28.35,'#86512E',furn);box(5,2.8,.14,19.9,3.4,28.85,'#242b28',furn);box(4.7,2.5,.04,19.9,3.4,28.75,'#405563',furn);box(.15,.5,.12,19.9,1.83,28.85,'#242b28',furn);});
// A compact six-seat table keeps a 2.55-foot dining-side route to the kitchen.
furnish('dining-set',()=>{
 box(4,.3,2.5,4.5,2.5,15,'#86512E',furn);for(const x of [3,6])for(const z of [14.1,15.9])box(.17,2.27,.17,x,1.215,z,'#86512E',furn);
 for(const x of [3.5,5.5]){chair(x,12.95,0);furn.children.at(-1).position.y=FLOOR_Y;chair(x,17.05,Math.PI);furn.children.at(-1).position.y=FLOOR_Y;}
 chair(1.55,15,Math.PI/2);furn.children.at(-1).position.y=FLOOR_Y;chair(7.45,15,-Math.PI/2);furn.children.at(-1).position.y=FLOOR_Y;
});
// Handwash on the common side of the dining zone, clear of the bedroom door.
box(1.8,2.5,1.4,9.65,1.33,13,'#86512E',furn);box(1.9,.16,1.5,9.65,2.66,13,'#C8BDB0',furn);
cyl(.52,.12,9.65,2.8,13,'#F2EBDD');rail(9.65,2.74,12.45,9.65,3.25,12.45,.045,furn);rail(9.65,3.25,12.45,9.65,3.25,12.85,.045,furn);
// L-shaped kitchen counters meet at an edge, not overlapping boxes.
for(const r of [rect(.75,27,10.75,29),rect(.75,23.5,2.75,27)]){rectBox(r,FLOOR_Y,2.8,'#C8BDB0',furn);rectBox(r,2.8,2.98,'#555c55',furn);}
furnish('kitchen-fridge',()=>{box(2.2,6,2.2,2.1,3.08,22.35,'#c4ccc7',furn);box(2.2,.04,2.2,2.1,4,22.35,'#8a9691',furn);});
box(2.2,.06,1.4,8.5,3.01,28,'#9da8a4',furn);box(1.7,.05,1,8.5,3.065,28,'#667b7c',furn);rail(8.5,3.05,27.4,8.5,3.8,27.4,.045,furn);rail(8.5,3.8,27.4,8.5,3.8,27.9,.045,furn);
box(2.4,.07,1.6,4.4,3.015,28,'#262c29',furn);for(const x of [3.8,5])for(const z of [27.6,28.4])cyl(.3,.055,x,3.0775,z,'#666c67');
for(const x of [1.8,9.6])nameObject(box(1.7,2,1.1,x,6,28.45,'#86512E',furn),'Kitchen wall-mounted cabinet');
function bathroom(prefix){
 const objects=furnitureFootprints.filter(f=>f.id.startsWith(prefix+'-'));
 for(const f of objects){const r=f.r,x=(r.x0+r.x1)/2,z=(r.z0+r.z1)/2;
 furnish(f.id,()=>{
  if(f.id.endsWith('toilet')){box(1.4,1.1,2,x,.63,r.z1-1,'#f6f6ef',furn);cyl(.65,.12,x,1.24,r.z1-1.1,'#fff');box(1.4,1.8,.5,x,.98,r.z0+.25,'#fff',furn);}
  else if(f.id.endsWith('shower')){rectBox(r,FLOOR_Y,.15,'#cbd9d7',furn);const px=r.x1-.05;rail(px,3,z,px,6.8,z,.045,furn);rail(px,6.8,z,px-.5,6.8,z,.045,furn);const face=roomDefs.find(q=>q.id===prefix).r.x1;for(const y of [3.2,6.5])rail(px,y,z,face,y,z,.045,furn);}
  else{rectBox(r,FLOOR_Y,2.6,'#d8dfd8',furn);rectBox(r,2.6,2.76,'#fafaf3',furn);}
 });
 }
}
bathroom('common');bathroom('attached');
furnish('pooja-altar',()=>{box(2.7,1.3,1.4,30,.73,16.6,'#b38451',furn);box(2.7,.18,1.4,30,1.47,16.6,'#d6aa65',furn);box(2.5,3.4,.12,30,3.1,15.9,'#86512E',furn);cyl(.38,.15,30,1.635,16.6,'#d8ad4b');const idol=new THREE.Mesh(new THREE.SphereGeometry(.4,16,16),mat('#d8ad4b',.35,.5));idol.scale.set(1,1.6,.7);idol.position.set(30,2.35,16.6);furn.add(idol);});
furnish('utility-washer',()=>{box(2.2,3.2,2.2,29.1,1.68,27.6,'#e8ebe5',furn);const face=cyl(.78,.12,29.1,1.7,26.56,'#506466');face.rotation.x=Math.PI/2;});
furnish('utility-counter',()=>{box(1.1,2.6,2,31.35,1.38,27.5,'#b7b4a1',furn);box(1.1,.2,2,31.35,2.78,27.5,'#d9dfd6',furn);});
for(const [z,rotation] of [[31.15,0],[34.15,Math.PI]]){chair(10.4,z,rotation);furn.children.at(-1).position.y=FLOOR_Y;}
cyl(.55,.12,10.4,FLOOR_Y+1.75,32.65,'#cfb99a');cyl(.12,1.69,10.4,FLOOR_Y+.845,32.65,'#86512E');
for(const p of [[19.2,30.95,.65,FLOOR_Y],[18.6,34.75,.65,FLOOR_Y],[17,27.5,1,FLOOR_Y],[24.8,27.5,1,FLOOR_Y],[20.4,22.55,.4,1.615],[31.25,19.8,.45,FLOOR_Y]])plant(...p);
for(let z=-2;z<40;z+=5)for(const x of [-2.5,39])plant(x,z,.8,-1.5);
// Room labels and areas are derived from the same finished-face geometry as floors.
const views={living:[14.55,26],dining:[9.7,18.5],kitchen:[5,24],master:[19.2,9],bed2:[9.5,7.2],common:[15.5,5],attached:[32.2,7],pooja:[30,19.3],utility:[28.8,24.7]};
const rooms=roomDefs.map(q=>({...q,dim:dimensionText(q.r),x:(q.r.x0+q.r.x1)/2,z:(q.r.z0+q.r.z1)/2,walk:views[q.id],look:[(q.r.x0+q.r.x1)/2,3,q.r.z0+1]}));
rooms.push({id:'sitout',name:'Sit-out',r:porch.r,dim:dimensionText(porch.r),x:14.55,z:32.75,walk:[14.55,32.75],look:[14.55,3,29.75]},{id:'stair',name:'External staircase',dim:`${feetInches(3.5)} wide · ${stair.risers} risers`,x:34.5,z:34.5,walk:[34.5,34.5],look:[34.5,8,12]});
for(const r of rooms){const b=document.createElement('button');b.innerHTML=`${r.name}<span>${r.dim}</span>`;b.onclick=()=>focusRoom(r);$('rooms').append(b);r.button=b;const l=document.createElement('div');l.className='room-label';l.textContent=r.name;$('labels-layer').append(l);r.label=l;}
const summary=areaSummary(),number=n=>n.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
$('main-area').textContent=number(summary.main);$('wall-assumptions').textContent=`1 model unit = 1 foot. External walls: ${feetInches(EXTERNAL)}; internal walls: ${feetInches(INTERNAL)}. Preliminary modeling assumptions; wall construction needs architect/engineer confirmation.`;
const mainBounds=bounds(outline),mainDimensions=dimension(mainBounds),stairBounds=bounds([stair.flight,stair.landing]),stairDimensions=dimension(stairBounds);
for(const [label,value] of [['Clear internal room area',summary.clear],['External wall area',summary.external],['Internal partition area',summary.partition],['Circulation / unassigned',summary.circulation],['Main-house built-up',summary.main],['Sit-out',summary.porch],['External staircase',summary.stairs],['Porch approach steps',summary.steps],['Combined ground footprint',summary.combined]]){const row=document.createElement('div');row.innerHTML=`<dt>${label}</dt><dd>${number(value)} sq ft</dd>`;$('area-values').append(row);}
$('area-note').textContent=`Main block: ${feetInches(mainDimensions.width)} × ${feetInches(mainDimensions.depth)} overall, with a stepped right edge. Combined footprint includes approach steps; without them: ${number(summary.combinedWithoutSteps)} sq ft. Living/dining are clear measurement zones within the open hall. Stair: ${stair.risers} risers of ${(stair.rise*12).toFixed(2)}″, ${feetInches(stair.going)} goings and a 3-foot landing.`;
// Optional dimension overlay: projected labels plus in-scene dimension lines.
const measures=new THREE.Group();house.add(measures);const measureLabels=[];
const dimensionMaterial=new THREE.LineBasicMaterial({color:'#285c57',depthTest:false,transparent:true,opacity:.9});
function measurement(x1,z1,x2,z2,text,lx=(x1+x2)/2,lz=(z1+z2)/2){
 const vertical=x1===x2,t=.15,segments=[[x1,z1,x2,z2],vertical?[x1-t,z1,x1+t,z1]:[x1,z1-t,x1,z1+t],vertical?[x2-t,z2,x2+t,z2]:[x2,z2-t,x2,z2+t]];
 const points=segments.flatMap(([a,b,c,d])=>[new THREE.Vector3(a,.14,b),new THREE.Vector3(c,.14,d)]),line=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points),dimensionMaterial);line.renderOrder=1000;measures.add(line);
 const element=document.createElement('div');element.className='dimension-label';element.textContent=text;$('measurements-layer').append(element);measureLabels.push({x:lx,z:lz,element});
}
for(const q of roomDefs){const r=q.r,d=dimension(r);measurement(r.x0,r.z0+.6,r.x1,r.z0+.6,feetInches(d.width));measurement(r.x0+.6,r.z0,r.x0+.6,r.z1,feetInches(d.depth),r.x0+.9,(r.z0+r.z1)/2);}
measurement(mainBounds.x0,-1.5,mainBounds.x1,-1.5,`Overall ${feetInches(mainDimensions.width)}`);measurement(-1.5,mainBounds.z0,-1.5,mainBounds.z1,`Overall ${feetInches(mainDimensions.depth)}`);
measurement(0,10,.75,10,`External ${feetInches(EXTERNAL)}`,-1.3,9.3);measurement(11.75,6,12.125,6,`Internal ${feetInches(INTERNAL)}`,14.5,6);
measurement(7.05,36.2,22.05,36.2,`Sit-out ${feetInches(15)}`);measurement(22.5,29.75,22.5,35.75,feetInches(6),23.4,32.75);
measurement(32.75,34.4,36.25,34.4,`Stair ${feetInches(stairDimensions.width)}`);measurement(37,9.75,37,33.75,`${feetInches(stairDimensions.depth)} incl. landing`,39,21.75);
const northArrow=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(3,.14,32),3,'#285c57',.6,.35);measures.add(northArrow);measurement(3,35,3,35,'N · FRONT',3,35.8);
let mode='cutaway',yaw=0,pitch=0,drag=false,lastX=0,lastY=0,anim=null,stairWalking=false;const keys={};
function setDoors(open){for(const d of doors)d.hinge.rotation.y=d.base+(open?d.swing*Math.PI/2:0);}
setDoors(true);
function moveCamera(pos,target){anim={start:performance.now(),from:camera.position.clone(),to:new THREE.Vector3(...pos),tf:controls.target.clone(),tt:new THREE.Vector3(...target)};}
function overview(m,animate=true){
 const target=m==='exterior'?[17,3,16]:[17,0,17],factor=Math.max(1,1/Math.sqrt(camera.aspect));let pos;
 if(m==='top')pos=[17,Math.max(69,47/(2*Math.tan(21*Math.PI/180)*camera.aspect)),17.01];
 else{const base=m==='exterior'?[58,32,68]:[61,58,72];pos=base.map((v,i)=>target[i]+(v-target[i])*factor);}
 if(animate)moveCamera(pos,target);else{camera.position.set(...pos);controls.target.set(...target);}
}
function setMode(m){mode=m;anim=null;stairWalking=false;camera.fov=m==='walk'?65:42;camera.updateProjectionMatrix();controls.enabled=m!=='walk';roof.visible=m==='exterior'||m==='walk';wallGroup.scale.y=m==='cutaway'||m==='top'?.36:1;
 document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));$('view-name').textContent=({cutaway:'FURNISHED CUTAWAY',exterior:'EXTERIOR & TERRACE',top:'PLAN OVERVIEW',walk:'WALKTHROUGH'})[m];$('walk-controls').hidden=m!=='walk';$('crosshair').hidden=m!=='walk';$('instructions').textContent=m==='walk'?'WASD / arrows to move · Drag to look · Esc exits':'Drag to rotate · Scroll to zoom · Right-drag to pan';
 if(m==='walk'){camera.position.set(14.55,5.4+FLOOR_Y,32.75);yaw=0;pitch=-.06;}else overview(m);
}
function focusRoom(r){$('space-name').textContent=r.name;$('space-info').textContent=r.dim+(r.zone?' · Clear measurement zone; open plan':r.id==='stair'?' · Independent external access':r.id==='attached'?' · From master bedroom':'');rooms.forEach(q=>q.button.classList.toggle('active',q===r));
 if(mode==='walk'){stairWalking=r.id==='stair';camera.position.set(r.walk[0],5.4+(stairWalking?stair.groundY:FLOOR_Y),r.walk[1]);yaw=Math.atan2(-(r.look[0]-r.walk[0]),-(r.look[2]-r.walk[1]));pitch=0;}else moveCamera([r.x+12,19,r.z+16],[r.x,1,r.z]);
}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$('furniture').onchange=e=>furn.visible=e.target.checked;$('doors').onchange=e=>setDoors(e.target.checked);
const roomLights=[];for(const r of rooms.filter(r=>r.id!=='stair')){const light=new THREE.PointLight('#ffd7a3',0,18,2);light.position.set(r.x,7,r.z);scene.add(light);roomLights.push(light);}
$('night').onchange=e=>{const n=e.target.checked;scene.background.set(n?'#233a43':'#e6e9e3');hemi.intensity=n?.45:2.5;sun.intensity=n?.35:3;roomLights.forEach(l=>l.intensity=n?90:0);porchLights.forEach(l=>l.intensity=n?22:0);};
$('reset').onclick=()=>{setMode('cutaway');$('space-name').textContent='Whole house';$('space-info').textContent='Finished-face room sizes · 15 × 6 ft sit-out · independent staircase';rooms.forEach(r=>r.button.classList.remove('active'));};
$('reference').onclick=()=>$('plan-dialog').showModal();$('close-plan').onclick=()=>$('plan-dialog').close();$('capture').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='tamil-house-'+mode+'.png';a.href=renderer.domElement.toDataURL('image/png');a.click();};
window.addEventListener('keydown',e=>{if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)&&mode==='walk'){e.preventDefault();keys[e.key.toLowerCase()]=true;}if(e.key==='Escape'&&mode==='walk')setMode('cutaway');});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='walk')return;drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});renderer.domElement.addEventListener('pointermove',e=>{if(!drag||mode!=='walk')return;yaw-=(e.clientX-lastX)*.005;pitch=Math.max(-1.1,Math.min(1.1,pitch-(e.clientY-lastY)*.005));lastX=e.clientX;lastY=e.clientY;});renderer.domElement.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('pointercancel',()=>drag=false);
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();keys[b.dataset.key]=true;b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=()=>keys[b.dataset.key]=false;});
function distanceSeg(x,z,a,b,c,d){const vx=c-a,vz=d-b,t=Math.max(0,Math.min(1,((x-a)*vx+(z-b)*vz)/(vx*vx+vz*vz)));return Math.hypot(x-a-vx*t,z-b-vz*t);}
function hits(r,x,z,pad=.25){return x>r.x0-pad&&x<r.x1+pad&&z>r.z0-pad&&z<r.z1+pad;}
function onStair(x,z){return contains(stair.flight,x,z)||contains(stair.landing,x,z);}
function blocked(x,z){if(x<-5||x>42||z<-5||z>42)return true;
 if(camera.position.y>14){if(onStair(x,z))return false;return !outline.some(r=>contains(r,x,z))||perimeter.some(([a,b,c,d])=>distanceSeg(x,z,a,b,c,d)<.4&&!(a===32.75&&c===32.75&&z>9.75&&z<12.75));}
 if(onStair(x,z))return false;if(wallFootprints.some(r=>hits(r,x,z))||pillarBounds.some(r=>hits(r,x,z)))return true;
 if(!$('doors').checked)for(const d of doors){const p=doorPose(d.wall,d.opening);if(distanceSeg(x,z,p.x,p.z,p.x+Math.cos(p.rotation)*p.width,p.z-Math.sin(p.rotation)*p.width)<.3)return true;}
 return furnitureFootprints.some(f=>hits(f.r,x,z,.2));
}
function heightAt(x,z){
 if(contains(stair.flight,x,z)){stairWalking=true;return 5.4+stair.groundY+Math.min(stair.risers,1+(stair.flight.z1-z)/stair.going)*stair.rise;}
 if(contains(stair.landing,x,z)){stairWalking=true;return 5.4+stair.topY;}
 if(camera.position.y>14&&outline.some(r=>contains(r,x,z)))return 5.4+stair.topY;
 stairWalking=false;if(outline.some(r=>contains(r,x,z))||contains(porch.r,x,z))return 5.4+FLOOR_Y;
 const i=entranceSteps.findIndex(r=>inside(r,x,z));if(i>=0)return 5.4+FLOOR_Y-i*(FLOOR_Y+1.5)/3;return 5.4-1.5;
}
let prev=performance.now();const projected=new THREE.Vector3();
function placeLabel(element,x,z,visible){projected.set(x,.16,z).project(camera);element.style.display=visible&&projected.z<1&&projected.z>-1?'block':'none';element.style.left=(projected.x*.5+.5)*vp.clientWidth+'px';element.style.top=(-projected.y*.5+.5)*vp.clientHeight+'px';}
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-prev)/1000,.035);prev=now;
 if(mode==='walk'){const f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0),s=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),n=Math.hypot(f,s)||1,dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*dt*6/n,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*dt*6/n;
  if(!blocked(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(!blocked(camera.position.x,camera.position.z+dz))camera.position.z+=dz;camera.position.y=heightAt(camera.position.x,camera.position.z);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);
 }else{if(anim){const t=Math.min(1,(now-anim.start)/900),e=t*t*(3-2*t);camera.position.lerpVectors(anim.from,anim.to,e);controls.target.lerpVectors(anim.tf,anim.tt,e);if(t===1)anim=null;}controls.update();}
 const measuring=mode==='top'&&$('measurements').checked;measures.visible=measuring;vp.classList.toggle('measuring',measuring);
 for(const r of rooms)placeLabel(r.label,r.x,r.id==='common'&&measuring?8.9:r.id==='attached'&&measuring?9.55:r.id==='stair'&&measuring?35.7:r.r?r.r.z1-1:r.z,$('labels').checked&&mode!=='walk'&&mode!=='exterior');
 for(const label of measureLabels)placeLabel(label.element,label.x,label.z,measuring);
 renderer.render(scene,camera);
}
new ResizeObserver(()=>{const w=vp.clientWidth,h=vp.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(mode!=='walk'){anim=null;overview(mode,false);}}).observe(vp);
$('loading').remove();setMode('cutaway');requestAnimationFrame(frame);
