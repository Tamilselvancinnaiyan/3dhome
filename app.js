import {designValidation,kitchenCounters} from './design-validation.mjs?v=timber-sidelight-9';
import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {EXTERNAL,INTERNAL,HEIGHT,FLOOR_Y,outline,perimeter,roofEdges,dressing,rooms as roomDefs,wallSpecs,porch,stair,entranceSteps,furnitureFootprints,rect,inside,dimensionText,dimension,feetInches,areaSummary,wallCells,floorCells,mergeRects,doorPose,openingRect,bounds,contains} from './model-plan.mjs?v=timber-sidelight-9';
const $=id=>document.getElementById(id),vp=$('viewport');
if(window.innerWidth<=800)document.querySelector('.exterior-settings').open=false;
function setOptionalText(id,text){const element=$(id);if(element)element.textContent=text;}
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
function rail(x1,y1,z1,x2,y2,z2,r=.045,parent=house){const p=new THREE.Vector3(x1,y1,z1),q=new THREE.Vector3(x2,y2,z2),v=q.clone().sub(p);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),8),mat('#252525',.7,.25));m.position.copy(p.add(q).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());parent.add(m);return m;}
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
const exteriorWalls=[];
wallGroup.traverse(n=>{if(n.userData.external)exteriorWalls.push(n);});
const entranceLeaves=[],windowFrames=[],windowBeads=[];
const doors=[];
for(const w of wallSpecs)for(const o of w.openings){
 const r=openingRect(w,o),midX=(r.x0+r.x1)/2,midZ=(r.z0+r.z1)/2;
 if(o.kind==='door'){
  const p=doorPose(w,o),hinge=new THREE.Group();hinge.position.set(p.x,0,p.z);hinge.rotation.y=p.rotation;wallGroup.add(hinge);
  if(w.external){
   // Reference entrance: solid carved timber leaf, with glazing in a separate fixed sidelight.
   const leaf=box(p.width,6.88,.16,p.width/2,3.54,0,'#86512E',hinge);leaf.name='Solid timber main door';entranceLeaves.push(leaf);
   for(const sign of [-1,1]){
    for(const x of [.18,p.width-.18])entranceLeaves.push(box(.09,6.48,.045,x,3.54,sign*.1,'#86512E',hinge));
    for(const y of [.3,6.78])entranceLeaves.push(box(p.width-.36,.09,.045,p.width/2,y,sign*.1,'#86512E',hinge));
    const carving=new THREE.LineBasicMaterial({color:'#54351f'});
    for(const scale of [.65,1]){
     const points=Array.from({length:128},(_,i)=>{const t=i/128*Math.PI*2,r=(.65+.17*Math.cos(8*t))*scale;return new THREE.Vector3(p.width*.48+r*Math.cos(t),3.75+r*Math.sin(t),sign*.084);});
     const flower=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),carving);flower.name='Timber door carved rosette';hinge.add(flower);
    }
    box(.055,1.6,.09,p.width-.28,4.05,sign*.19,'#514638',hinge);
    for(const y of [3.36,4.74])box(.12,.1,.14,p.width-.28,y,sign*.14,'#514638',hinge);
    box(.09,.16,.045,p.width-.28,3.05,sign*.11,'#514638',hinge);
   }
  }else box(p.width,6.88,.12,p.width/2,3.54,0,'#86512E',hinge);
  if(!w.external)box(.16,.16,.28,p.width-.22,3.2,.12,'#c1b086',hinge);
  doors.push({hinge,base:p.rotation,swing:o.swing,w:p.width,wall:w,opening:o});
 }else if(o.kind==='vent'){
  const group=new THREE.Group();group.position.set(midX,8.1,midZ);group.rotation.y=w.axis==='x'?0:-Math.PI/2;wallGroup.add(group);
  const width=o.to-o.from,thickness=w.axis==='x'?r.z1-r.z0:r.x1-r.x0,shape=new THREE.Shape();shape.moveTo(-width/2,-.6);shape.lineTo(width/2,-.6);shape.lineTo(width/2,.6);shape.lineTo(-width/2,.6);shape.closePath();const hole=new THREE.Path();hole.absarc(0,0,.58,0,Math.PI*2,true);shape.holes.push(hole);
  const panel=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false,curveSegments:32}),mat('#F2EBDD'));panel.position.z=-thickness/2;panel.castShadow=true;panel.receiveShadow=true;group.add(panel);
  const collar=new THREE.Mesh(new THREE.TorusGeometry(.58,.025,8,32),mat('#41454A'));collar.position.z=(w.id==='west'?1:-1)*(thickness/2+.01);group.add(collar);
 }else if(o.kind==='window'&&o.sidelight){
  const side=new THREE.Group();side.name='Fixed timber-framed entrance sidelight';side.position.set(midX,0,midZ);wallGroup.add(side);
  const width=o.to-o.from,h=o.top-o.sill,cy=(o.top+o.sill)/2;
  const glassMaterial=new THREE.MeshStandardMaterial({color:'#c7d6cf',transparent:true,opacity:.18,roughness:.08,side:THREE.DoubleSide,depthWrite:false});
  const glass=box(width-.18,h-.18,.045,0,cy,0,glassMaterial,side);glass.name='Main door sidelight glazing';glass.castShadow=false;
  for(const x of [-width/2+.045,width/2-.045])entranceLeaves.push(box(.09,h,.2,x,cy,0,'#86512E',side));
  for(const y of [o.sill+.045,o.top-.045])entranceLeaves.push(box(width,.09,.2,0,y,0,'#86512E',side));
  for(let y=o.sill+.25;y<o.top-.1;y+=.24){const slat=box(width-.18,.035,.09,0,y,.07,'#62533b',side);slat.name='Sidelight horizontal slat';}
  // Timber trim wraps the narrow pier between the leaf and fixed sidelight.
  for(const z of [29-.025,29.775])entranceLeaves.push(box(.15,7,.045,20.375,3.5,z,'#86512E',wallGroup));
 }else if(o.kind==='window'){
  const group=new THREE.Group();group.position.set(midX,0,midZ);group.rotation.y=w.axis==='x'?0:-Math.PI/2;wallGroup.add(group);
  const width=o.to-o.from,h=o.top-o.sill,center=(o.top+o.sill)/2;
  group.name='Reference window · '+w.id+' · '+o.from;
  const sign=w.id==='front'||w.id==='west'?1:-1;
  const thickness=w.axis==='x'?r.z1-r.z0:r.x1-r.x0,face=sign*(thickness/2+.025);
  const glass=new THREE.MeshStandardMaterial({color:h<2?'#c2cbca':'#d4dedd',transparent:true,opacity:h<2?.65:.24,roughness:h<2?.45:.12,metalness:.08});
  box(width-.22,h-.22,.045,0,center,face-sign*.06,glass,group);
  // Reference-style two-leaf windows: strong perimeter, one vertical mullion,
  // no horizontal crossbar. All frame members remain inside the original opening.
  for(const x of [-width/2+.065,width/2-.065])windowFrames.push(box(.13,h,.22,x,center,face,'#252525',group));
  for(const y of [o.sill+.065,o.top-.065])windowFrames.push(box(width,.13,.22,0,y,face,'#252525',group));
  windowFrames.push(box(.09,h-.26,.18,0,center,face,'#252525',group));
  // Recessed wood-look inner bead and discreet casement handles.
  const bead=mat('#805437',.72);windowBeads.push(bead);
  for(const x of [-width/2+.15,width/2-.15])box(.045,h-.26,.035,x,center,face+sign*.12,bead,group);
  for(const y of [o.sill+.15,o.top-.15])box(width-.26,.045,.035,0,y,face+sign*.12,bead,group);
  if(h>=2)for(const x of [-.14,.14])box(.035,.32,.055,x,center-.1,face+sign*.13,'#252525',group);
  if(w.external){
   box(width+.24,.14,thickness+.32,0,o.sill-.07,0,'#303236',group);
   nameObject(box(width+.5,.23,1.05,0,o.top+.18,sign*(thickness/2+.39),'#303236',group),'Charcoal window sunshade');
  }
 }
}
for(const w of wallSpecs.filter(w=>w.id==='kitchen-north'))for(const p of wallCells().filter(p=>p.top===3.25&&p.r.z0>=w.r.z0&&p.r.z1<=w.r.z1&&p.r.x1<=16))rectBox(p.r,3.25,3.37,'#C8BDB0',wallGroup);
// Main roof follows the reference-aligned rectangular outline.
for(const r of outline)nameObject(rectBox(r,HEIGHT,9.9,'#41454A',roof),'Main RCC roof slab');
const accessEdge=([x,z,X,Z])=>x===35.625&&X===35.625&&z<12.75&&Z>9.75;
const terraceParapets=roofEdges.filter(e=>!accessEdge(e)).map(([x,z,X,Z])=>x===X?rect(x-.175,z,x+.175,Z):rect(x,z-.175,X,z+.175));
// Reference board: solid front fascia; low side/rear upstands with metal guards.
const parapetTop=r=>r.z0>29?12.9:10.8;
for(const r of terraceParapets)nameObject(rectBox(r,9.9,parapetTop(r),'#F2EBDD',roof),'Terrace parapet');
// North/front porch starts at the OUTSIDE face, not the wall centerline.
const porchGroup=new THREE.Group();porchGroup.name='Sit-out · exact 20 × 5 ft';house.add(porchGroup);
rectBox(porch.r,-1.5,-.5,'#d5d0c3',porchGroup);rectBox(porch.r,-.5,0,'#F2EBDD',porchGroup);rectBox(porch.r,0,FLOOR_Y,mat('#8B8D8C',1),porchGroup);
for(let x=porch.r.x0+2;x<porch.r.x1;x+=2)box(.01,.002,5,x,.081,32.25,'#777a78',porchGroup);
for(let z=porch.r.z0+2;z<porch.r.z1;z+=2)box(20,.002,.01,porch.centerX,.081,z,'#777a78',porchGroup);
nameObject(rectBox(porch.r,HEIGHT,9.9,'#E5D9C7',roof),'Porch roof · 20 × 5 ft');
const pillarBounds=[rect(porch.r.x0,porch.r.z1-.75,porch.r.x0+.75,porch.r.z1),rect(porch.r.x1-.75,porch.r.z1-.75,porch.r.x1,porch.r.z1)];
for(const r of pillarBounds)nameObject(rectBox(r,FLOOR_Y,HEIGHT,'#F5F2EA',porchGroup),'Porch square pillar');
for(const [i,r] of entranceSteps.entries())rectBox(r,-1.5,FLOOR_Y-i*(FLOOR_Y+1.5)/3,mat('#8B8D8C',1),porchGroup);
const porchLights=[];
for(const x of [14.3,18.55,22.8]){cyl(.19,.07,x,HEIGHT-.035,32.25,'#F5F2EA',roof);const diffuser=mat('#fff1ce').clone();diffuser.emissive.set('#ffd7a3');diffuser.emissiveIntensity=.25;cyl(.14,.012,x,HEIGHT-.111,32.25,diffuser,roof);const light=new THREE.PointLight('#ffd7a3',0,8,2);light.position.set(x,HEIGHT-.2,32.25);roof.add(light);porchLights.push(light);}
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
rail(stairMax-.045,stair.topY,9.75,stairMax-.045,stair.topY+3,9.75);rail(stair.landing.x0,stair.topY+3,9.795,stairMax-.045,stair.topY+3,9.795);rail(stairMax-.045,stair.topY+3,9.795,stairMax-.045,stair.topY+3,12.75);
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
furnish('bed2-bed',()=>queenBed(4.4,3.75,-Math.PI/2));furnish('master-bed',()=>queenBed(23.75,4.3,-Math.PI/2));
furnish('bed2-wardrobe',()=>wardrobe(3.25,10.7,4));furnish('master-wardrobe',()=>wardrobe(32.375,12.7,5));
furnish('bed2-table',()=>{box(1,.12,.65,1.7,1.4,6.9,'#987352',furn);for(const x of [1.31,2.09])for(const z of [6.665,7.135])box(.08,1.26,.08,x,.71,z,'#987352',furn);});
for(const [id,z] of [['master-shelf-left',1.25],['master-shelf-right',7.35]])furnish(id,()=>box(1,.16,1,26.5,1.4,z,'#987352',furn));
furnish('living-sofa',()=>{
 for(const x of [16.8,24])for(const z of [15.5,17.7])box(.16,.37,.16,x,.265,z,'#86512E',furn);
 box(8,1.1,2.7,20.4,1,16.7,'#b6aa94',furn);box(8,.7,2.7,20.4,1.8,16.7,'#e4d9c4',furn);box(8,2,.55,20.4,2.1,15.45,'#d1c4ac',furn);
 for(const x of [16.625,24.175])box(.45,1.6,2.7,x,1.8,16.7,'#e4d9c4',furn);
 for(const x of [17.8,20.4,23])box(2.45,.22,2.1,x,2.22,16.7,'#eee4d2',furn);
 for(const [x,c] of [[17.9,'#99734d'],[22.9,'#839359']]){const p=box(1.25,.3,1.25,x,2.48,16.4,c,furn);p.rotation.y=.35;}
}).position.set(3.6,0,-1);
box(8,.06,7.5,24,.11,21.55,'#d6cbb7',furn);
furnish('living-table',()=>{cyl(1.6,.18,24,1.5,21.55,'#b38451');cyl(.5,1.33,24,.745,21.55,'#86512E');});
const consoleGroup=furnish('living-console',()=>{box(7,1.5,1.1,20,.83,28.35,'#86512E',furn);box(5,2.8,.14,19.9,3.4,28.85,'#242b28',furn);box(4.7,2.5,.04,19.9,3.4,28.75,'#405563',furn);box(.15,.5,.12,19.9,1.83,28.85,'#242b28',furn);});
consoleGroup.position.x=4.6;
// Six-seat dining arrangement with a clear west approach to pooja.
furnish('dining-set',()=>{
 box(5.5,.3,2,11.125,2.5,16.875,'#86512E',furn);
 for(const x of [8.9,13.35])for(const z of [16.2,17.55])box(.17,2.27,.17,x,1.215,z,'#86512E',furn);
 for(const x of [9.25,11.125,13]){chair(x,15.625,0);chair(x,18.125,Math.PI);}
});
// L-shaped kitchen counters meet at an edge, not overlapping boxes.
for(const r of kitchenCounters){rectBox(r,FLOOR_Y,2.8,'#C8BDB0',furn);rectBox(r,2.8,2.98,'#555c55',furn);}
furnish('kitchen-fridge',()=>{box(2.2,6,2.2,2.1,3.08,22.35,'#c4ccc7',furn);box(2.2,.04,2.2,2.1,4,22.35,'#8a9691',furn);}).position.set(12.425,0,5.55);
// Sink against the kitchen–dining corner, with its passage kept clear.
furnish('kitchen-sink-counter',()=>{
 const r=furnitureFootprints.find(f=>f.id==='kitchen-sink-counter').r;
 rectBox(r,FLOOR_Y,2.8,'#C8BDB0',furn);rectBox(r,2.8,2.98,'#555c55',furn);
 box(1.4,.06,2.2,6.625,3.01,25.5,'#9da8a4',furn);box(1,.05,1.7,6.625,3.065,25.5,'#667b7c',furn);
 rail(6.025,3.05,25.5,6.025,3.8,25.5,.045,furn);rail(6.025,3.8,25.5,6.525,3.8,25.5,.045,furn);
});
box(2.4,.07,1.6,10.5,3.015,28,'#262c29',furn);for(const x of [9.9,11.1])for(const z of [27.6,28.4])cyl(.3,.055,x,3.0775,z,'#666c67');
for(const x of [6.5,14.5])nameObject(box(1.7,2,1.1,x,x>13?7.5:6,28.45,'#86512E',furn),'Kitchen wall-mounted cabinet');
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
const altarGroup=furnish('pooja-altar',()=>{box(2.7,1.3,1.4,30,.73,16.6,'#b38451',furn);box(2.7,.18,1.4,30,1.47,16.6,'#d6aa65',furn);box(2.5,3.4,.12,30,3.1,15.9,'#86512E',furn);cyl(.38,.15,30,1.635,16.6,'#d8ad4b');const idol=new THREE.Mesh(new THREE.SphereGeometry(.4,16,16),mat('#d8ad4b',.35,.5));idol.scale.set(1,1.6,.7);idol.position.set(30,2.35,16.6);furn.add(idol);});
altarGroup.position.set(-27.575,0,-3.5);
const washerGroup=furnish('utility-washer',()=>{box(2.2,3.2,2.2,29.1,1.68,27.6,'#e8ebe5',furn);const face=cyl(.78,.12,29.1,1.7,26.56,'#506466');face.rotation.x=Math.PI/2;});
washerGroup.position.x=-26.925;
const utilityCounterGroup=furnish('utility-counter',()=>{box(1.1,2.6,2,31.35,1.38,27.5,'#b7b4a1',furn);box(1.1,.2,2,31.35,2.78,27.5,'#d9dfd6',furn);});
utilityCounterGroup.position.x=-26.825;
furnish('utility-storage',()=>{const r=furnitureFootprints.find(f=>f.id==='utility-storage').r;rectBox(r,FLOOR_Y,2.7,'#cfb99a',furn);rectBox(r,2.7,2.85,'#555c55',furn);});
// Utility basin and tap move with the counter.
box(.8,.06,1.4,4.525,2.91,27.5,'#667b7c',furn);rail(4.925,2.95,27.5,4.925,3.7,27.5,.04,furn);
for(const p of [[21,27.5,.65,FLOOR_Y],[29,27.5,.65,FLOOR_Y],[24,21.55,.4,1.615],[1.375,16.3,.3,FLOOR_Y]])plant(...p);
// Exterior landscape is independent of interior furniture visibility.
const landscape=new THREE.Group();landscape.name='Modest landscape';house.add(landscape);
for(const [x,z,size,y] of [[-2,8,.65,-1.5],[-7,18,.65,-1.5],[39,6,.75,-1.5]]){const start=furn.children.length;plant(x,z,size,y);for(const child of furn.children.slice(start))landscape.add(child);}
box(3,.12,23,-7,-1.5,14,'#746e5e',landscape);box(4,.12,10,39,-1.5,5,'#746e5e',landscape);
box(5,.08,5.8,18.55,-1.46,41.65,'#969696',landscape);
// Exterior treatments use existing bounds; plan and collision geometry are unchanged.
const decoration=new THREE.Group();decoration.name='Optional exterior finishes';house.add(decoration);
const canopyDetail=new THREE.Group();roof.add(canopyDetail);
const palette={
 warm:{wall:'#E9E3D9',secondary:'#CBC6BD',fascia:'#303236',stone:'#666563',wood:'#805437'},
 grey:{wall:'#DADBD9',secondary:'#BFC2C2',fascia:'#34383C',stone:'#62676B',wood:'#513B30'},
 earthy:{wall:'#D7CCBA',secondary:'#B9AB98',fascia:'#514841',stone:'#74695E',wood:'#99643C'}
};
function textured(color,kind){
 const data=new Uint8Array(32*32*4);
 for(let y=0;y<32;y++)for(let x=0;x<32;x++){const i=(y*32+x)*4;const n=kind==='wood'?125+35*Math.sin(x*1.7+Math.sin(y*.22)):128+25*Math.sin(x*12.9898+y*78.233);data[i]=data[i+1]=data[i+2]=n;data[i+3]=255;}
 const map=new THREE.DataTexture(data,32,32);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(kind==='wood'?4:10,kind==='wood'?1:6);map.needsUpdate=true;
 return new THREE.MeshStandardMaterial({color,roughness:kind==='wood'?.68:.92,bumpMap:map,bumpScale:kind==='wood'?.012:.018});
}
const finish={wall:textured(palette.warm.wall,'plaster'),secondary:mat(palette.warm.secondary),fascia:mat(palette.warm.fascia),stone:textured(palette.warm.stone,'stone'),wood:textured(palette.warm.wood,'wood')};
for(const leaf of entranceLeaves)leaf.material=finish.wood;
for(const mesh of exteriorWalls)mesh.material=finish.wall;
roof.traverse(n=>{if(n.isMesh&&n.geometry.type==='BoxGeometry')n.material=n.position.y>10?finish.wall:finish.fascia;});
// Waterproof surface stops at parapet inner edges and keeps the access gap open.
for(const r of outline)rectBox(r,9.9,9.925,mat('#656866',.95),roof);
box(20,.1,5,porch.centerX,HEIGHT-.05,32.25,finish.wood,canopyDetail);
box(20,.48,.12,porch.centerX,9.66,porch.r.z1+.06,finish.fascia,canopyDetail);
for(const x of [porch.r.x0-.06,porch.r.x1+.06])box(.12,.48,5.12,x,9.66,32.25,finish.fascia,canopyDetail);
// Reference: stone wraps the existing supports, without widening structural columns.
for(const r of pillarBounds){
 const cladding=new THREE.Group();cladding.name='Reference stone pillar';decoration.add(cladding);
 rectBox(rect(r.x0-.035,r.z0-.035,r.x1+.035,r.z1+.035),FLOOR_Y,HEIGHT,finish.stone,cladding);
 for(let y=.65;y<HEIGHT;y+=.8){box(.82,.016,.012,(r.x0+r.x1)/2,y,r.z1+.042,finish.secondary,cladding);const joint=box(.012,.78,.012,r.x0+(Math.round(y/.8)%2?.23:.52),y-.4,r.z1+.042,finish.secondary,cladding);joint.rotation.z=.16;}
}
// Narrow weatherproof wood-look battens, below existing front openings only.
for(const [from,to,sill] of [[9,13,3]]){
 const panel=new THREE.Group();panel.name='Reference timber window apron';decoration.add(panel);
 box(to-from,.95,.035,(from+to)/2,.57,29.79,finish.fascia,panel);
 for(let x=from+.07;x<to;x+=.18)box(.12,.95,.045,x,.57,29.825,finish.wood,panel);
 if(sill===3){box(to-from,.68,.035,(from+to)/2,7.47,29.79,finish.fascia,panel);for(let x=from+.07;x<to;x+=.18)box(.12,.68,.045,x,7.47,29.825,finish.wood,panel);}
}
// Slatted ceiling remains within the original 20 × 5 ft supported canopy.
for(let x=porch.r.x0+.12;x<porch.r.x1;x+=.28)box(.018,.012,4.94,x,HEIGHT-.106,32.25,finish.fascia,canopyDetail);
// Parapet coping follows the existing outline and preserves its stair access gap.
for(const r of terraceParapets)nameObject(rectBox(r,parapetTop(r),parapetTop(r)+.08,finish.fascia,roof),'Reference parapet coping');
const terraceGuard=new THREE.Group();terraceGuard.name='Terrace horizontal guardrails';roof.add(terraceGuard);
// Square powder-coated MS posts and three horizontal members, 3 ft 6 in total
// above the terrace. East-side 9.75–12.75 access stays completely open.
const terraceGuardRuns=roofEdges.filter(e=>!accessEdge(e)&&!(e[1]===29.75&&e[3]===29.75));
const guardBase=10.88,guardTop=13.4,guardFinish=mat('#252525',.72,.25);
for(const [x0,z0,x1,z1] of terraceGuardRuns){
 const length=Math.hypot(x1-x0,z1-z0),alongX=x0!==x1;
 for(const y of [11.45,12.35,guardTop-.04])box(alongX?length+.08:.08,.08,alongX?.08:length+.08,(x0+x1)/2,y,(z0+z1)/2,guardFinish,terraceGuard);
 const bays=Math.ceil(length/4);
 for(let i=0;i<=bays;i++){const t=i/bays;nameObject(box(.1,guardTop-guardBase,.1,x0+(x1-x0)*t,(guardTop+guardBase)/2,z0+(z1-z0)*t,guardFinish,terraceGuard),'Terrace guard post');}
}

// Match the board's restrained side/rear feature strips, on solid wall bays.
rectBox(rect(-.045,27.55,-.012,29),FLOOR_Y,9.25,finish.stone,decoration);
rectBox(rect(1.05,-.045,2.45,-.012),FLOOR_Y,9.25,finish.stone,decoration);
// Third slim stair rail and guarded far edge of the existing terrace landing.
for(const x of [stairMin+.045,stairMax-.045])rail(x,stair.groundY+stair.rise+2.25,stair.flight.z1-.1,x,stair.topY-stair.rise+2.25,stair.flight.z0+.1);
for(const h of [1,2]){rail(stair.landing.x0,stair.topY+h,9.795,stairMax-.045,stair.topY+h,9.795);rail(stairMax-.045,stair.topY+h,9.795,stairMax-.045,stair.topY+h,12.75);}

for(const z of [0,29.75])box(35.625,.22,.08,17.8125,9.32,z===0?-.04:29.79,finish.fascia,decoration);
for(const y of [4.5,5.05,5.6])box(4.3,.018,.025,24.75,y+2,29.77,finish.secondary,decoration);
for(const r of outline)rectBox(r,-1.4,-1.05,finish.secondary,decoration);
flight.material=mat('#969696',.98);house.getObjectByName('Stair landing').material=flight.material;
// Slim external rainwater pipes, terminating at ground level.
for(const [x,z] of [[-.1,1],[35.745,28.8]]){cyl(.075,11.3,x,4.15,z,'#CBC6BD',decoration);box(.22,.14,.38,x,9.86,z,'#303236',roof);}
const exteriorLights=[...porchLights],diffusers=[];
roof.traverse(n=>{if(n.isMesh&&n.material.emissive?.getHex()===0xffd7a3)diffusers.push(n.material);});
for(const light of porchLights){light.color.set('#fff1e0');light.distance=10;}
function fixture(x,y,z,parent=decoration,rotation=0){
 const housing=new THREE.Group();housing.name='Exterior up/down sconce';housing.position.set(x,y,z);housing.rotation.y=rotation;parent.add(housing);
 box(.25,.5,.2,0,0,0,'#252525',housing);
 for(const direction of [-1,1]){
  const material=new THREE.MeshStandardMaterial({color:'#fff5e9',emissive:'#fff5e9',emissiveIntensity:.15});
  box(.19,.025,.15,0,direction*.255,.015,material,housing);diffusers.push(material);
  const light=new THREE.SpotLight('#fff1e0',0,6,Math.PI/7,.65,2);
  light.position.set(0,direction*.28,.16);light.target.position.set(0,direction*2.8,-.08);housing.add(light,light.target);
  light.userData.eveningIntensity=22;exteriorLights.push(light);
 }
}
for(const r of pillarBounds)fixture((r.x0+r.x1)/2,5.6,r.z1+.09);
fixture(1.75,5.7,-.12,decoration,Math.PI);fixture(-.12,5.7,28.25,decoration,-Math.PI/2);fixture(35.755,5.7,21.5,decoration,Math.PI/2);
for(const [i,r] of entranceSteps.entries()){
 const top=FLOOR_Y-i*(FLOOR_Y+1.5)/3,strip=new THREE.MeshStandardMaterial({color:'#fff1e0',emissive:'#fff1e0',emissiveIntensity:.15});
 nameObject(box(r.x1-r.x0-.22,.035,.035,(r.x0+r.x1)/2,top-.075,r.z1+.02,strip,decoration),'Reference entrance step light');diffusers.push(strip);
 const light=new THREE.PointLight('#fff1e0',0,2.6,2);light.position.set((r.x0+r.x1)/2,top-.09,r.z1+.18);light.userData.eveningIntensity=2.5;decoration.add(light);exteriorLights.push(light);
}
for(const x of [14.3,18.55,22.8]){cyl(.15,.016,x,HEIGHT-.115,34.2,'#E9E3D9',canopyDetail);const diffuser=new THREE.MeshStandardMaterial({color:'#fff1e0',emissive:'#fff1e0',emissiveIntensity:.15});cyl(.11,.012,x,HEIGHT-.128,34.2,diffuser,canopyDetail);diffusers.push(diffuser);const light=new THREE.PointLight('#fff1e0',0,9,2);light.position.set(x,HEIGHT-.25,34.2);canopyDetail.add(light);exteriorLights.push(light);}
// Low foliage beds stop short of the entrance steps and external stair approach.
for(const [from,to,z] of [[.8,7.5,31.2],[29.5,34.5,31.2]]){
 box(to-from,.12,1.9,(from+to)/2,-1.46,z,'#746e5e',landscape);
 for(let x=from+.45;x<to;x+=1.35){const start=furn.children.length;plant(x,z,.62,-1.4);for(const child of furn.children.slice(start))landscape.add(child);}
}

// Discreet stair lights follow the existing rise and never project into the flight.
for(let i=3;i<21;i+=4){
 const z=stair.flight.z1-i-.5,y=stair.groundY+(i+1)*stair.rise;
 const material=new THREE.MeshStandardMaterial({color:'#fff1e0',emissive:'#fff1e0',emissiveIntensity:.15});
 box(.045,.04,.42,stairMin+.06,y+.018,z,material,decoration);diffusers.push(material);
}
for(const i of [5,15]){const light=new THREE.PointLight('#fff1e0',0,3.2,2);light.position.set(stairMin+.12,stair.groundY+(i+1)*stair.rise+.25,stair.flight.z1-i-.5);light.userData.eveningIntensity=3;decoration.add(light);exteriorLights.push(light);}
// Three low-output planting accents, recessed within the existing beds.
for(const [x,z] of [[2,31.2],[31,31.2],[34,31.2]]){
 cyl(.11,.08,x,-1.32,z,'#252525',landscape);
 const diffuser=new THREE.MeshStandardMaterial({color:'#fff1e0',emissive:'#fff1e0',emissiveIntensity:.15});cyl(.075,.015,x,-1.27,z,diffuser,landscape);diffusers.push(diffuser);
 const light=new THREE.SpotLight('#fff1e0',0,4,Math.PI/5,.8,2);light.position.set(x,-1.24,z);light.target.position.set(x,1.1,z-.45);light.userData.eveningIntensity=5;landscape.add(light,light.target);exteriorLights.push(light);
}

const temperatures={warm:'#ffcf99',neutral:'#fff1e0',cool:'#f1f6ff'};
let selectedTemperature='neutral';
function updateLighting(night=$('night').checked){scene.background.set(night?'#293742':'#e6e9e3');hemi.color.set('#f4f6ff');hemi.intensity=night?.65:2.5;sun.color.set('#fff9ef');sun.intensity=night?.2:3;roomLights.forEach(l=>l.intensity=night?35:0);exteriorLights.forEach(l=>{l.color.set(temperatures[selectedTemperature]);l.intensity=night?(l.userData.eveningIntensity??(l.parent===canopyDetail?16:18)):0;});diffusers.forEach(m=>{m.emissive.set(temperatures[selectedTemperature]);m.emissiveIntensity=night?1:.15;});}
function applyScheme(key){for(const [role,color] of Object.entries(palette[key]))finish[role].color.set(color);windowBeads.forEach(m=>m.color.set(palette[key].wood));}
const elevationPositions={front:[16.4,15,85],rear:[17.8,15,-53],left:[-53,15,16],right:[89,15,16],perspective:[58,32,68],aerial:[58,64,70]};
function exteriorView(name){setMode('exterior');const target=[17,5,17],factor=1.12*Math.max(1,1/Math.sqrt(camera.aspect));moveCamera(elevationPositions[name].map((v,i)=>target[i]+(v-target[i])*factor),target);$('view-name').textContent='EXTERIOR · '+name.toUpperCase();}
$('exterior-scheme').onchange=e=>applyScheme(e.target.value);
$('light-temperature').onchange=e=>{selectedTemperature=e.target.value;updateLighting();};
$('landscaping').onchange=e=>landscape.visible=e.target.checked;
$('decoration').onchange=e=>{decoration.visible=e.target.checked;updateLighting();};
document.querySelectorAll('[data-elevation]').forEach(b=>b.onclick=()=>exteriorView(b.dataset.elevation));

// Room labels and areas are derived from the same finished-face geometry as floors.
const views={living:[31.5,24.5],dining:[7,17.5],kitchen:[10,24],master:[19.2,9],bed2:[9.5,7.2],common:[15.5,5],attached:[32.2,7],pooja:[2.875,15.5],utility:[3.375,24.5]};
const rooms=roomDefs.map(q=>({...q,dim:dimensionText(q.r)+(q.extra?.length?' + alcove':''),x:(q.r.x0+q.r.x1)/2,z:(q.r.z0+q.r.z1)/2,walk:views[q.id],look:q.id==='utility'?[2.475,1.8,27.6]:[(q.r.x0+q.r.x1)/2,3,q.r.z0+1]}));
rooms.push({id:'sitout',name:'Sit-out',r:porch.r,dim:dimensionText(porch.r),x:18.55,z:32.25,walk:[18.55,32.25],look:[18.55,3,29.75]},{id:'stair',name:'External staircase',dim:`${feetInches(3.5)} wide · ${stair.risers} risers`,x:37.375,z:34.5,walk:[37.375,34.5],look:[37.375,8,12]});
for(const r of rooms){const b=document.createElement('button');b.innerHTML=`${r.name}<span>${r.dim}</span>`;b.onclick=()=>focusRoom(r);$('rooms').append(b);r.button=b;const l=document.createElement('div');l.className='room-label';l.textContent=r.name;$('labels-layer').append(l);r.label=l;}
const summary=areaSummary(),number=n=>n.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
$('main-area').textContent=number(summary.main);setOptionalText('wall-assumptions',`1 model unit = 1 foot. External walls: ${feetInches(EXTERNAL)}; internal walls: ${feetInches(INTERNAL)}. Preliminary modeling assumptions; wall construction needs architect/engineer confirmation.`);
// Status text and highlights share the same geometry-derived audit results.
const validation=designValidation(),validationGroup=new THREE.Group();house.add(validationGroup);
const validationColors={PASS:'#238454',FAIL:'#cc3434','NEEDS MANUAL VERIFICATION':'#c78210'};
const validationList=$('validation-checks');
for(const check of validation.checks){
 const item=document.createElement('details');item.className='validation-item';item.dataset.status=check.status;
 const heading=document.createElement('summary');heading.textContent=`${check.status} · ${check.title}`;item.append(heading);
 for(const text of [`Severity: ${check.severity}`,check.existing,`Criterion: ${check.criterion}`,`Action: ${check.correction}`,`Impact: ${check.impact}`]){const p=document.createElement('p');p.textContent=text;item.append(p);}
 const source=document.createElement('small');source.textContent='Source: '+check.source.map(v=>v.replace('|',' → ')).join('; ');item.append(source);validationList?.append(item);
 // Whole-house structural uncertainty belongs in the panel, not a blanket tint
 // that would hide local issues. A green region means only its named check passes.
 if(check.id==='structure'||check.id==='area')continue;
 for(const r of check.regions){
  const color=validationColors[check.status],geometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(r.x0,.18,r.z0),new THREE.Vector3(r.x1,.18,r.z0),new THREE.Vector3(r.x1,.18,r.z1),new THREE.Vector3(r.x0,.18,r.z1)]);
  const line=new THREE.LineLoop(geometry,new THREE.LineBasicMaterial({color,depthTest:false}));line.renderOrder=10;validationGroup.add(line);
  if(check.status==='FAIL'){const fill=new THREE.Mesh(new THREE.PlaneGeometry(r.x1-r.x0,r.z1-r.z0),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.18,depthTest:false,depthWrite:false}));fill.rotation.x=-Math.PI/2;fill.position.set((r.x0+r.x1)/2,.17,(r.z0+r.z1)/2);fill.renderOrder=9;validationGroup.add(fill);}
 }
}
setOptionalText('validation-counts',['FAIL','NEEDS MANUAL VERIFICATION','PASS'].map(status=>`${validation.checks.filter(c=>c.status===status).length} ${status.toLowerCase()}`).join(' · '));
for(const [label,value] of [['Main-house built-up',validation.areas.main],['Sit-out',validation.areas.porch],['Staircase',validation.areas.stairs],['Approach steps',validation.areas.steps],['Total modeled footprint',validation.areas.combined]]){const row=document.createElement('div');const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=number(value)+' sq ft';row.append(dt,dd);$('validation-areas')?.append(row);}
setOptionalText('validation-budget',`At ₹2,350/sq ft: main house ₹${number(validation.budget.main/100000)} lakh; house + sit-out + stair ₹${number(validation.budget.covered/100000)} lakh. Same-rate scenarios, not a quotation. See audit report for exclusions.`);
const mainBounds=bounds(outline),mainDimensions=dimension(mainBounds),stairBounds=bounds([stair.flight,stair.landing]),stairDimensions=dimension(stairBounds);
for(const [label,value] of [['Clear internal room area',summary.clear],['External wall area',summary.external],['Internal partition area',summary.partition],['Circulation / unassigned',summary.circulation],['Main-house built-up',summary.main],['Sit-out',summary.porch],['External staircase',summary.stairs],['Porch approach steps',summary.steps],['Combined ground footprint',summary.combined]]){const row=document.createElement('div');row.innerHTML=`<dt>${label}</dt><dd>${number(value)} sq ft</dd>`;$('area-values')?.append(row);}
setOptionalText('area-note',`Main block: ${feetInches(mainDimensions.width)} × ${feetInches(mainDimensions.depth)} overall, with aligned exterior edges. Combined footprint includes approach steps; without them: ${number(summary.combinedWithoutSteps)} sq ft. Living/dining are clear measurement zones within the open hall. Stair: ${stair.risers} risers of ${(stair.rise*12).toFixed(2)}″, ${feetInches(stair.going)} goings and a 3-foot landing.`);
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
measurement(porch.r.x0,porch.r.z1+1.45,porch.r.x1,porch.r.z1+1.45,`Sit-out ${feetInches(dimension(porch.r).width)}`);measurement(porch.r.x1+.45,porch.r.z0,porch.r.x1+.45,porch.r.z1,feetInches(dimension(porch.r).depth),porch.r.x1+1.35,32.25);
measurement(stair.flight.x0,34.4,stair.flight.x1,34.4,`Stair flight ${feetInches(dimension(stair.flight).width)}`);measurement(stair.flight.x1+.75,9.75,stair.flight.x1+.75,33.75,`${feetInches(stairDimensions.depth)} incl. landing`,39,21.75);
const northArrow=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(3,.14,32),3,'#285c57',.6,.35);measures.add(northArrow);measurement(3,35,3,35,'N · FRONT',3,35.8);
let mode='cutaway',yaw=0,pitch=0,drag=false,lastX=0,lastY=0,anim=null,stairWalking=false;const keys={};
function setDoors(open){for(const d of doors)d.hinge.rotation.y=d.base+(open?d.swing*Math.PI/2:0);}
setDoors(true);
function moveCamera(pos,target){anim={start:performance.now(),from:camera.position.clone(),to:new THREE.Vector3(...pos),tf:controls.target.clone(),tt:new THREE.Vector3(...target)};}
function overview(m,animate=true){
 const target=m==='exterior'?[17,3,16]:[17,0,17],factor=(m==='exterior'?1.2:1)*Math.max(1,1/Math.sqrt(camera.aspect));let pos;
 if(m==='top')pos=[17,Math.max(69,47/(2*Math.tan(21*Math.PI/180)*camera.aspect)),17.01];
 else{const base=m==='exterior'?[58,32,68]:[61,58,72];pos=base.map((v,i)=>target[i]+(v-target[i])*factor);}
 if(animate)moveCamera(pos,target);else{camera.position.set(...pos);controls.target.set(...target);}
}
function setMode(m){mode=m;anim=null;stairWalking=false;camera.fov=m==='walk'?80:42;camera.near=m==='walk'?.04:.1;camera.updateProjectionMatrix();controls.enabled=m!=='walk';roof.visible=m==='exterior'||m==='walk';decoration.visible=(m==='exterior'||m==='walk')&&$('decoration').checked;wallGroup.scale.y=m==='cutaway'||m==='top'?.36:1;
 document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));$('view-name').textContent=({cutaway:'FURNISHED CUTAWAY',exterior:'EXTERIOR & TERRACE',top:'PLAN OVERVIEW',walk:'WALKTHROUGH'})[m];$('walk-controls').hidden=m!=='walk';$('crosshair').hidden=m!=='walk';$('instructions').textContent=m==='walk'?'WASD / arrows to move · Drag to look · Esc exits':'Drag to rotate · Scroll to zoom · Right-drag to pan';
 if(m==='walk'){camera.position.set(18.55,5.4+FLOOR_Y,32.75);yaw=0;pitch=0;}else overview(m);
}
function focusRoom(r){$('space-name').textContent=r.name;$('space-info').textContent=r.dim+(r.zone?' · Clear measurement zone; open plan':r.id==='stair'?' · Independent external access':r.id==='attached'?' · From master bedroom':'');rooms.forEach(q=>q.button.classList.toggle('active',q===r));
 if(mode==='walk'){stairWalking=r.id==='stair';camera.position.set(r.walk[0],5.4+(stairWalking?stair.groundY:FLOOR_Y),r.walk[1]);yaw=Math.atan2(-(r.look[0]-r.walk[0]),-(r.look[2]-r.walk[1]));pitch=Math.atan2(r.look[1]-camera.position.y,Math.hypot(r.look[0]-r.walk[0],r.look[2]-r.walk[1]));}else moveCamera([r.x+12,19,r.z+16],[r.x,1,r.z]);
}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$('furniture').onchange=e=>furn.visible=e.target.checked;$('doors').onchange=e=>setDoors(e.target.checked);
const roomLights=[];for(const r of rooms.filter(r=>r.id!=='stair')){const light=new THREE.PointLight('#ffd7a3',0,18,2);light.position.set(r.x,7,r.z);scene.add(light);roomLights.push(light);}
$('night').onchange=e=>updateLighting(e.target.checked);
updateLighting(false);
$('reset').onclick=()=>{setMode('cutaway');$('space-name').textContent='Whole house';$('space-info').textContent='Finished-face room sizes · 20 × 5 ft sit-out · independent staircase';rooms.forEach(r=>r.button.classList.remove('active'));};
$('reference').onclick=()=>$('plan-dialog').showModal();$('close-plan').onclick=()=>$('plan-dialog').close();$('capture').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='tamil-house-'+mode+'.png';a.href=renderer.domElement.toDataURL('image/png');a.click();};
window.addEventListener('keydown',e=>{if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)&&mode==='walk'){e.preventDefault();keys[e.key.toLowerCase()]=true;}if(e.key==='Escape'&&mode==='walk')setMode('cutaway');});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='walk')return;drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});renderer.domElement.addEventListener('pointermove',e=>{if(!drag||mode!=='walk')return;yaw-=(e.clientX-lastX)*.005;pitch=Math.max(-1.1,Math.min(1.1,pitch-(e.clientY-lastY)*.005));lastX=e.clientX;lastY=e.clientY;});renderer.domElement.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('pointercancel',()=>drag=false);
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();keys[b.dataset.key]=true;b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=()=>keys[b.dataset.key]=false;});
function distanceSeg(x,z,a,b,c,d){const vx=c-a,vz=d-b,t=Math.max(0,Math.min(1,((x-a)*vx+(z-b)*vz)/(vx*vx+vz*vz)));return Math.hypot(x-a-vx*t,z-b-vz*t);}
function hits(r,x,z,pad=.25){return x>r.x0-pad&&x<r.x1+pad&&z>r.z0-pad&&z<r.z1+pad;}
function onStair(x,z){return contains(stair.flight,x,z)||contains(stair.landing,x,z);}
function blocked(x,z){if(x<-5||x>42||z<-5||z>42)return true;
 if(camera.position.y>14){if(onStair(x,z))return false;return !outline.some(r=>contains(r,x,z))||perimeter.some(([a,b,c,d])=>distanceSeg(x,z,a,b,c,d)<.4&&!(a===35.625&&c===35.625&&z>9.75&&z<12.75));}
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
 if(mode==='walk'){const f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0),s=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),n=Math.hypot(f,s)||1,dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*dt*4/n,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*dt*4/n;
  if(!blocked(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(!blocked(camera.position.x,camera.position.z+dz))camera.position.z+=dz;camera.position.y=heightAt(camera.position.x,camera.position.z);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);
 }else{if(anim){const t=Math.min(1,(now-anim.start)/900),e=t*t*(3-2*t);camera.position.lerpVectors(anim.from,anim.to,e);controls.target.lerpVectors(anim.tf,anim.tt,e);if(t===1)anim=null;}controls.update();}
 validationGroup.visible=mode==='top'&&Boolean($('validation-overlay')?.checked);vp.classList.toggle('validating',validationGroup.visible);
 const measuring=mode==='top'&&$('measurements').checked;measures.visible=measuring;vp.classList.toggle('measuring',measuring);
 for(const r of rooms)placeLabel(r.label,r.x,r.id==='common'&&measuring?8.9:r.id==='attached'&&measuring?9.55:r.id==='stair'&&measuring?35.7:r.r?r.r.z1-1:r.z,$('labels').checked&&mode!=='walk'&&mode!=='exterior');
 for(const label of measureLabels)placeLabel(label.element,label.x,label.z,measuring);
 renderer.render(scene,camera);
}
new ResizeObserver(()=>{const w=vp.clientWidth,h=vp.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(mode!=='walk'){anim=null;overview(mode,false);}}).observe(vp);
$('loading').remove();setMode('cutaway');requestAnimationFrame(frame);

// Interior detail preset makes the finished sill and separate passage reviewable.
$('opening-view').onclick=()=>{
 setMode('walk');camera.position.set(6.875,5.48,18);
 const target=new THREE.Vector3(10.475,3.2,23.2),direction=target.sub(camera.position);
 yaw=Math.atan2(-direction.x,-direction.z);pitch=Math.atan2(direction.y,Math.hypot(direction.x,direction.z));
 $('space-name').textContent='Kitchen–dining opening';$('space-info').textContent='3.37 ft finished sill · 3 ft doorless passage';
};
