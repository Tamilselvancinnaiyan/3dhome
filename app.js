import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
const $=id=>document.getElementById(id),vp=$('viewport');
const scene=new THREE.Scene();scene.background=new THREE.Color('#e6e9e3');
const camera=new THREE.PerspectiveCamera(42,1,.1,300);camera.position.set(52,51,64);
let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});}catch(e){$('loading').textContent='This viewer needs WebGL. Please enable hardware acceleration in your browser.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;vp.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(14,0,16);controls.enableDamping=true;controls.maxPolarAngle=Math.PI/2-.04;controls.minDistance=8;controls.maxDistance=110;
const hemi=new THREE.HemisphereLight('#fff6e5','#80978a',2.5);scene.add(hemi);const sun=new THREE.DirectionalLight('#fff4df',3);sun.position.set(-20,55,30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-50,right:50,top:50,bottom:-50,near:1,far:150});sun.shadow.bias=-.0004;scene.add(sun);
const house=new THREE.Group(),furn=new THREE.Group(),roof=new THREE.Group(),wallGroup=new THREE.Group();scene.add(house);house.add(furn,roof,wallGroup);
const materials={};function mat(color,rough=.8,metal=0){const k=color+rough+metal;return materials[k]??=new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});}
function box(w,h,d,x,y,z,color,parent=house){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function cyl(r,h,x,y,z,color,parent=furn){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,24),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const walls=[],doors=[],windows=[];const H=9.4,T=.45;
function wall(x1,z1,x2,z2,openings=[]){const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),angle=Math.atan2(dz,dx);const group=new THREE.Group();group.position.set(x1,0,z1);group.rotation.y=-angle;wallGroup.add(group);let p=0;for(const o of [...openings,{at:len,width:0}]){if(o.at>p)part(p,o.at,0,H);if(o.width){if(o.kind==='vent'){part(o.at,o.at+o.width,0,7.5);part(o.at,o.at+o.width,8.7,H);ventAt(o.at,o.width);}else if(o.kind==='window'){const sill=o.sill??3,top=sill+(o.height??4);part(o.at,o.at+o.width,0,sill);part(o.at,o.at+o.width,top,H);windowAt(o.at,o.width,sill,top);}else{part(o.at,o.at+o.width,7,H);if(o.kind!=='opening')doorAt(o.at,o.width,o.swing);}p=o.at+o.width;}}
function part(a,b,lo,hi){box(b-a,hi-lo,T,(a+b)/2,(hi+lo)/2,0,'#F2EBDD',group);if(lo===0){const ax=x1+Math.cos(angle)*a,az=z1+Math.sin(angle)*a,bx=x1+Math.cos(angle)*b,bz=z1+Math.sin(angle)*b;walls.push({ax,az,bx,bz});box(b-a,.22,T+.04,(a+b)/2,.11,0,'#86512E',group);}}
function windowAt(a,w,sill,top){const height=top-sill,center=(sill+top)/2;const glass=new THREE.MeshStandardMaterial({color:'#a8d0db',transparent:true,opacity:height<2?.65:.32,roughness:height<2?.65:.1,metalness:.2});box(w,height,.08,a+w/2,center,0,glass,group);for(const x of [a,a+w/2,a+w])box(.08,height+.2,.18,x,center,0,'#86512E',group);for(const y of [sill,center,top])box(w+.15,.08,.18,a+w/2,y,0,'#86512E',group);windows.push(group);}
// A real circular exhaust opening through an exterior wall, 14 inches across.
function ventAt(a,w){
const shape=new THREE.Shape();shape.moveTo(-w/2,-.6);shape.lineTo(w/2,-.6);shape.lineTo(w/2,.6);shape.lineTo(-w/2,.6);shape.closePath();
const hole=new THREE.Path();hole.absarc(0,0,.58,0,Math.PI*2,true);shape.holes.push(hole);
const panel=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:T,bevelEnabled:false,curveSegments:32}),mat('#F2EBDD'));panel.position.set(a+w/2,8.1,-T/2);panel.castShadow=true;panel.receiveShadow=true;group.add(panel);
const collar=new THREE.Mesh(new THREE.TorusGeometry(.58,.035,8,32),mat('#41454A'));collar.position.set(a+w/2,8.1,T/2+.02);group.add(collar);
}
function doorAt(a,w,swing){const hinge=new THREE.Group();hinge.position.set(a,0,0);group.add(hinge);box(w,6.95,.12,w/2,3.5,0,'#86512E',hinge);box(.16,.16,.3,w-.22,3.2,.12,'#c1b086',hinge);doors.push({hinge,w,group,a,swing});}}
// Geometry follows the spatial arrangement of the uploaded poster, in feet.
box(38,.35,41,15,-.6,17,'#d0d4c8');box(30,.45,30,15,-.24,15,'#ded6c6');
function floor(x,z,w,d,color){box(w,.08,d,x+w/2,.025,z+d/2,color);}
floor(0,0,10,11,'#d6bb94');floor(14.5,0,11,11,'#d6bb94');floor(10,0,4.5,7.5,'#a6c1c6');floor(25.5,0,4.5,11,'#a6c1c6');floor(0,11,26,13,'#e5ddc8');floor(0,23,12,7,'#d0cebd');floor(26,11,4,14,'#c6c9bf');floor(12,24,14,6,'#e5ddc8');floor(0,30,26,6,'#cda77b');
// Fine tile joints and wood planks.
for(let x=.1;x<30;x+=2)box(.017,.015,30,x,.074,15,'#c4c0af');for(let z=.1;z<30;z+=2)box(30,.015,.017,15,.074,z,'#c4c0af');
for(const r of [{x:0,w:10},{x:14.5,w:11}])for(let x=r.x+.4;x<r.x+r.w;x+=.8)box(.016,.025,10.5,x,.09,5.5,'#baa078');
wall(0,0,30,0,[{at:3,width:3,kind:'window'},{at:10.35,width:1.2,kind:'vent'},{at:12,width:1.5,kind:'window',sill:5.5,height:1.5},{at:18,width:3,kind:'window'},{at:25.85,width:1.2,kind:'vent'},{at:27.6,width:1.5,kind:'window',sill:5.5,height:1.5}]);
wall(0,0,0,30,[{at:3,width:4,kind:'window'},{at:14,width:5,kind:'window'},{at:23.5,width:1.2,kind:'vent'},{at:25,width:3,kind:'window'}]);
wall(30,0,30,25,[{at:6.75,width:1.5,kind:'window',sill:5.5,height:1.5},{at:19,width:3,kind:'window'}]);wall(26,25,30,25);wallGroup.children.at(-1).scale.y=.35;wall(26,25,26,30); // Living-room exterior ends at the open sit-out.
wall(0,30,12,30,[{at:4,width:4,kind:'window'}]);wall(12,25,12,30);wall(12,30,26,30,[{at:.8,width:3.5,swing:1},{at:6,width:4.5,kind:'window',sill:1.8,height:4}]);
wall(0,11,10,11);wall(10,0,10,7.5);wall(10,7.5,10,11,[{at:.25,width:3,swing:-1}]);wall(10,7.5,14.5,7.5,[{at:.5,width:2.5,swing:1}]);wall(14.5,0,14.5,11,[{at:8,width:3,swing:1}]);wall(14.5,11,25.5,11);wall(25.5,0,25.5,11,[{at:8,width:2.5,swing:1}]);wall(25.5,11,30,11);
wall(26,11,26,25,[{at:.8,width:2.6,kind:'opening'},{at:7,width:2.5,swing:-1}]);
wall(26,16,30,16); // Pooja above, utility below, as in the supplied detail.
floor(26,11,4,5,'#e5c89d');
floor(26,16,4,9,'#ddcfb5');// Half-height kitchen/dining partition with an unobstructed 3-foot passage.
wall(0,23,3.5,23);wallGroup.children.at(-1).scale.y=3.5/H;
wall(6.5,23,12,23);wallGroup.children.at(-1).scale.y=3.5/H;
box(3.5,.12,.55,1.75,3.56,23,'#C8BDB0',wallGroup);
box(5.5,.12,.55,9.25,3.56,23,'#C8BDB0',wallGroup);wall(12,23,12,25);
// Interior accent paint stays on the room-facing surface, clear of windows and doors.
function bedroomAccent(left,right,windowLeft,windowRight,color){
  const z=.24,depth=.025;
  box(windowLeft-left,H,depth,(left+windowLeft)/2,H/2,z,color,wallGroup);
  box(right-windowRight,H,depth,(windowRight+right)/2,H/2,z,color,wallGroup);
  box(windowRight-windowLeft,3,depth,(windowLeft+windowRight)/2,1.5,z,color,wallGroup);
  box(windowRight-windowLeft,H-7,depth,(windowLeft+windowRight)/2,(H+7)/2,z,color,wallGroup);
}
bedroomAccent(.25,9.75,3,6,'#A5AD98');
bedroomAccent(14.75,25.25,18,21,'#A39485');
// Keep the utility doorway clear of accent panels.
// Terrace slab, parapets, and stair landing.
box(30,.55,30,15,9.7,15,'#41454A',roof);for(const a of [[30,1.8,.35,15,10.8,0],[.35,1.8,30,0,10.8,15],[.35,1.8,8.8,30,10.8,4.4],[.35,1.8,18.8,30,10.8,20.6],[30,1.8,.35,15,10.8,30]])box(...a,'#F2EBDD',roof);
// Independent east-side stairs stay outside the roof footprint and meet an open parapet landing.
const stairX=32.2,stairMin=30.45,stairMax=33.95;
const steps=24,run=22,rise=9.95/steps;for(let i=0;i<steps;i++)box(3.5,.16,run/steps+.05,stairX,rise*(i+1),32.9-(i+.5)*run/steps,'#b5b6ae');box(4.2,.4,2.4,31.85,9.75,10,'#b5b6ae');
function rail(x1,y1,z1,x2,y2,z2,r=.045){const p=new THREE.Vector3(x1,y1,z1),q=new THREE.Vector3(x2,y2,z2),v=q.clone().sub(p);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),8),mat('#41454A',.5,.6));m.position.copy(p.add(q).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());house.add(m);}
for(const x of [stairMin,stairMax]){rail(x,3,33,x,12.7,11);rail(x,1.5,33,x,11.2,11);for(let i=0;i<=12;i++){const z=33-i*22/12,y=i*9.95/12;rail(x,y,z,x,y+3,z);}}
// Guard the landing edges while leaving the terrace connection open.
rail(stairMax,9.95,8.8,stairMax,12.95,8.8);rail(30,12.95,8.8,stairMax,12.95,8.8);rail(30,12.95,11.2,stairMin,12.95,11.2);
// Full-frontage entrance steps; sit-out sides remain open.
for(let i=0;i<3;i++)box(26,.22*(i+1),1,13,.11*(i+1),38.5-i,'#bdbeb5');
for(const x of [.4,25.6])box(.35,9.5,.35,x,4.75,35.6,'#F2EBDD');box(26,.3,6,13,9.5,33,'#41454A',roof);
// Furniture made from fully local procedural meshes.
// All dimensions are feet. The complete bed, including its slim headboard,
// fits a 5 x 6.5 footprint; the frame does not project past that envelope.
function queenBed(x,z,rotation=0){
  const bedGroup=new THREE.Group();bedGroup.position.set(x,0,z);bedGroup.rotation.y=rotation;furn.add(bedGroup);
  const w=5,d=6.5,wood='#987352';
  box(w-.3,.24,d-.3,0,.22,0,wood,bedGroup); // Recessed support plinth.
  box(w,.3,d,0,.49,0,wood,bedGroup);
  box(w,.12,d,0,.7,0,'#ddd5c7',bedGroup);
  box(w-.04,.5,d-.18,0,1.01,.07,'#f5f1e8',bedGroup);
  box(w,2.3,.14,0,1.23,-d/2+.07,wood,bedGroup);
  box(w-.06,.05,3.8,0,1.285,1.23,'#d7cfbf',bedGroup);
  for(const dx of [-1.25,1.25])box(1.65,.18,1.1,dx,1.38,-2.15,'#f7f3eb',bedGroup);
}
// Turn the beds so wardrobe access remains open within the existing walls.
queenBed(3.75,3.5,Math.PI/2); // 2.775-foot entrance aisle and wardrobe access.
queenBed(18.5,3.75,Math.PI/2); // 2.525 feet to wardrobe; 3.525 feet at bed foot.
// Bedroom 2: one compact 12 x 7.8-inch table, below the window sill.
box(1,.12,.65,1.05,1.4,.6,'#987352',furn);
for(const x of [.66,1.44])for(const z of [.365,.835])box(.08,1.27,.08,x,.705,z,'#987352',furn);
// Master: compact shelves on the headboard wall, outside the entrance swing.
for(const z of [.73,6.9])box(1,.16,1,15.23,1.4,z,'#987352',furn);
// Light laminate wardrobes. Sliding panels and recessed pulls stay inside the
// stated footprint, so using the wardrobe requires no additional door swing.
function wardrobe(x,z,w){
  const h=7,d=2,base=.08;
  box(w,h,d-.06,x,base+h/2,z+.03,'#cfb99a',furn);
  for(const side of [-1,1]){
    box(w/2-.04,h-.2,.06,x+side*w/4,base+h/2,z-d/2+.03,'#ddd2bd',furn);
    box(.045,.65,.035,x+side*.13,3.4,z-d/2+.0175,'#81735f',furn);
  }
  for(const y of [base+.11,base+h-.11])box(w-.08,.035,.04,x,y,z-d/2+.03,'#b7a58a',furn);
}
wardrobe(2.5,9.775,4); // 4 x 2 x 7 feet, against Bedroom 2's solid front wall.
wardrobe(20,9.775,5); // 5 x 2 x 7 feet, clear of both master doorways.
// Sofa along the rear wall, coffee table on the rug, TV on the front wall.
box(8,.06,7.5,20,.1,19,'#d6cbb7',furn);
box(8,1.1,2.7,20,1,13.1,'#b6aa94',furn);
box(8,.7,2.7,20,1.8,13.1,'#e4d9c4',furn);
box(8,2,.55,20,2.1,11.95,'#d1c4ac',furn);
for(const x of [16.1,23.9])box(.45,1.6,2.9,x,1.8,13.1,'#e4d9c4',furn);
for(const x of [17.4,20,22.6])box(2.45,.22,2.1,x,2.22,13.2,'#eee4d2',furn);
for(const [x,color] of [[17.5,'#99734d'],[22.5,'#839359']]){const cushion=box(1.25,.3,1.25,x,2.48,12.9,color,furn);cushion.rotation.y=.35;}
box(4,.23,2.8,20,1.5,19,'#b38451',furn);
for(const x of [18.5,21.5])for(const z of [18,20])box(.12,1.4,.12,x,.7,z,'#86512E',furn);
box(7,1.5,1.1,20,.8,29.15,'#86512E',furn);
box(5,2.8,.14,20,3.4,29.35,'#242b28',furn);
box(4.7,2.5,.04,20,3.4,29.25,'#405563',furn);
// Pooja altar occupies the far end of the newly divided room.
box(2.7,1.3,1.4,28,.7,12.1,'#b38451',furn);
box(2.8,.18,1.5,28,1.43,12.1,'#d6aa65',furn);
box(2.5,3.4,.12,28,3.1,11.3,'#86512E',furn);
cyl(.38,.15,28,1.6,12.1,'#d8ad4b');
const idol=new THREE.Mesh(new THREE.SphereGeometry(.4,16,16),mat('#d8ad4b',.35,.5));idol.scale.set(1,1.6,.7);idol.position.set(28,2.25,12.1);furn.add(idol);
const diningStart=furn.children.length;
box(5, .3,4,20,2.5,18.5,'#86512E',furn);for(const x of [18,22])for(const z of [17,20])box(.17,2.5,.17,x,1.25,z,'#86512E',furn);
function chair(x,z,rot){const g=new THREE.Group();furn.add(g);g.position.set(x,0,z);g.rotation.y=rot;box(1.5,.25,1.5,0,1.55,0,'#86512E',g);box(1.5,1.6,.18,0,2.15,-.7,'#86512E',g);for(const xx of [-.55,.55])for(const zz of [-.55,.55])box(.1,1.5,.1,xx,.75,zz,'#86512E',g);}
for(const x of [18.6,21.3]){chair(x,15.7,0);chair(x,21.2,Math.PI);}chair(16.8,18.5,-Math.PI/2);chair(23.2,18.5,Math.PI/2);
for(const mesh of furn.children.slice(diningStart))mesh.position.x-=13;
// Dining handwash basin beside Bedroom 2, clear of the bedroom doorway.
box(2.2,2.5,1.6,1.65,1.25,12.25,'#86512E',furn);
box(2.4,.16,1.8,1.65,2.58,12.25,'#C8BDB0',furn);
const diningBasin=new THREE.Mesh(new THREE.TorusGeometry(.6,.12,12,32),mat('#F2EBDD'));diningBasin.rotation.x=-Math.PI/2;diningBasin.scale.set(1.2,1,1);diningBasin.position.set(1.65,2.76,12.35);furn.add(diningBasin);
const basinBowl=new THREE.Mesh(new THREE.SphereGeometry(.57,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2),new THREE.MeshStandardMaterial({color:'#F2EBDD',roughness:.3,side:THREE.DoubleSide}));basinBowl.scale.set(1.2,.5,1);basinBowl.position.set(1.65,2.76,12.35);furn.add(basinBowl);
rail(1.65,2.66,11.65,1.65,3.25,11.65);rail(1.65,3.25,11.65,1.65,3.25,12.05);
box(1.9,2.2,.08,1.65,4.6,11.28,'#8faeaa',furn);
// Kitchen L counter, appliances, cabinets and sink.
for(const a of [[10,2.8,2,6,1.4,28.6],[2,2.8,4.5,1.4,1.4,25.4]]){box(...a,'#C8BDB0',furn);box(a[0]+.08,.18,a[2]+.08,a[3],2.9,a[5],'#555c55',furn);}box(2.2,6,2.2,1.5,3,24,'#c4ccc7',furn);box(2.23,.04,2.23,1.5,4,24,'#8a9691',furn);box(2.2,.06,1.4,8,3.02,28.6,'#9da8a4',furn);box(1.7,.05,1,8,3.06,28.6,'#667b7c',furn);rail(8,3,28,8,3.8,28);rail(8,3.8,28,8,3.8,28.5);box(2.4,.07,1.6,4,3.02,28.6,'#262c29',furn);for(const x of [3.4,4.6])for(const z of [28.2,29])cyl(.3,.055,x,3.08,z,'#666c67');for(const x of [3,5.5,8,10.4]){box(2.1,2,1.1,x,6,29.25,'#86512E',furn);box(.05,.6,.09,x+.6,6,28.65,'#665f50',furn);}
// Bathing zone beside the entry; toilet at the far end of each bathroom.
function bath(x,z){
const toiletZ=z-4.6,showerZ=z-.3;
box(1.4,1.1,2,x,.6,toiletZ,'#f6f6ef',furn);cyl(.65,.12,x,1.22,toiletZ-.1,'#fff');box(1.4,1.8,.5,x,1.2,toiletZ-1,'#fff',furn);
box(1.2,2.5,.7,x,1.3,z-3.4,'#d8dfd8',furn);box(1.5,.25,1,x,2.7,z-3.4,'#fafaf3',furn);box(1.4,2,.07,x,4.5,z-3.85,'#8faeaa',furn);
box(2.8,.07,2.8,x,.15,showerZ,'#cbd9d7',furn);rail(x,6.8,showerZ-.6,x,6.8,showerZ-.1);
}

bath(12.2,6);bath(28,9);box(2.2,3.2,2.2,28,1.6,23,'#e8ebe5',furn);const washer=cyl(.78,.13,28,1.7,21.86,'#506466');washer.rotation.x=Math.PI/2;box(1.1,2.6,2,29.2,1.3,23,'#b7b4a1',furn);box(1.2,.2,2.1,29.2,2.7,23,'#d9dfd6',furn);
function plant(x,z,s=1,y=0){cyl(.5*s,.8*s,x,y+.4*s,z,'#9c8b70');for(let i=0;i<7;i++){const a=i*2.4,m=new THREE.Mesh(new THREE.SphereGeometry(.5*s,8,8),mat(i%2?'#647d42':'#839359'));m.scale.set(.6,1.6,.4);m.position.set(x+Math.sin(a)*.4*s,y+1.1*s,z+Math.cos(a)*.4*s);m.rotation.z=Math.sin(a)*.6;furn.add(m);}}
for(const p of [[16,29],[24,29],[29.3,14.8,.55],[29.3,24,.55],[1.2,35],[24.8,35],[20,19,.4,1.65]])plant(...p);for(let z=-2;z<38;z+=4)for(const x of [-2,35.5])plant(x,z,.9);
box(2,.3,14,35.5,-.25,26,'#b4b7a5');
const rooms=[{name:'Living room',dim:"16′ × 14′",x:20,z:23,look:[20,3.4,29.3]},{name:'Dining',dim:"10′ × 8′6″",x:7,z:21.5,look:[7,3,17]},{name:'Kitchen',dim:"10′ × 8′",x:8,z:25,look:[5,3,28]},{name:'Master bedroom',dim:"12′ × 13′",x:23,z:9,look:[20,3,4]},{name:'Bedroom 2',dim:"11′ × 11′",x:8,z:8.5,look:[4,3,4]},{name:'Common bathroom',dim:"5′ × 7′6″",x:12.3,z:6.6,look:[12,3,1.5]},{name:'Attached bathroom',dim:"5′ × 8′",x:28,z:9.8,look:[28,3,3]},{name:'Pooja room',dim:"4′ × 5′",x:28,z:14.5,look:[28,2.5,12]},{name:'Utility',dim:"4′6″ × 8′",x:28,z:20,look:[28,3,23]},{name:'Sit-out',dim:"26′ × 6′ · Open sides",x:13,z:33,look:[19,3,30]},{name:'External staircase',dim:'Independent access',x:stairX,z:34.5,look:[stairX,8,16]}];
for(const r of rooms){const b=document.createElement('button');b.innerHTML=`${r.name}<span>${r.dim}</span>`;b.onclick=()=>focusRoom(r);$('rooms').append(b);r.button=b;const l=document.createElement('div');l.className='room-label';l.textContent=r.name;$('labels-layer').append(l);r.label=l;}
let stairWalking=false;let mode='cutaway',yaw=0,pitch=0,drag=false,lastX=0,lastY=0,anim=null;const keys={};
function setDoors(open){for(const d of doors)d.hinge.rotation.y=open?d.swing*Math.PI/2:0;}
setDoors(true);
function moveCamera(pos,target){anim={start:performance.now(),from:camera.position.clone(),to:new THREE.Vector3(...pos),tf:controls.target.clone(),tt:new THREE.Vector3(...target)};}
function setMode(m){camera.fov=m==='walk'?65:42;camera.updateProjectionMatrix();mode=m;anim=null;stairWalking=false;controls.enabled=m!=='walk';roof.visible=m==='exterior'||m==='walk';wallGroup.scale.y=m==='cutaway'||m==='top'?.36:1;document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));$('view-name').textContent=({cutaway:'FURNISHED CUTAWAY',exterior:'EXTERIOR & TERRACE',top:'PLAN OVERVIEW',walk:'WALKTHROUGH'})[m];$('walk-controls').hidden=m!=='walk';$('crosshair').hidden=m!=='walk';$('instructions').textContent=m==='walk'?'WASD / arrows to move · Drag to look · Esc exits':'Drag to rotate · Scroll to zoom · Right-drag to pan';if(m==='walk'){camera.position.set(14.5,5.4,33);yaw=0;pitch=-.06;}else if(m==='top'){moveCamera([15,68,16.1],[15,0,16]);}else if(m==='exterior'){moveCamera([50,29,63],[15,3,16]);}else moveCamera([52,51,64],[14,0,16]);}
function focusRoom(r){$('space-name').textContent=r.name;$('space-info').textContent=r.dim+(r.name==='Utility'?' · Door from living room':r.name==='External staircase'?' · Enter from outside':r.name==='Attached bathroom'?' · Enter from master bedroom':'');rooms.forEach(q=>q.button.classList.toggle('active',q===r));if(mode==='walk'){stairWalking=r.name==='External staircase';camera.position.set(r.x,5.4,r.z);const dx=r.look[0]-r.x,dz=r.look[2]-r.z;yaw=Math.atan2(-dx,-dz);pitch=0;}else moveCamera([r.x+12,19,r.z+16],[r.x,1,r.z]);}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$('furniture').onchange=e=>furn.visible=e.target.checked;$('labels').onchange=()=>{};$('doors').onchange=e=>setDoors(e.target.checked);$('night').onchange=e=>{const n=e.target.checked;scene.background.set(n?'#233a43':'#e6e9e3');hemi.intensity=n?.45:2.5;sun.intensity=n?.35:3;roomLights.forEach(l=>l.intensity=n?90:0);};
const roomLights=[];for(const r of rooms.slice(0,9)){const l=new THREE.PointLight('#ffd7a3',0,18,2);l.position.set(r.x,7,r.z);scene.add(l);roomLights.push(l);}
$('reset').onclick=()=>{setMode('cutaway');$('space-name').textContent='Whole house';$('space-info').textContent='Entrance beside kitchen · pooja and utility split · sofa facing front TV';rooms.forEach(r=>r.button.classList.remove('active'));};$('reference').onclick=()=>$('plan-dialog').showModal();$('close-plan').onclick=()=>$('plan-dialog').close();$('capture').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='tamil-house-'+mode+'.png';a.href=renderer.domElement.toDataURL('image/png');a.click();};
window.addEventListener('keydown',e=>{if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)&&mode==='walk'){e.preventDefault();keys[e.key.toLowerCase()]=true;}if(e.key==='Escape'&&mode==='walk')setMode('cutaway');});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='walk')return;drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});renderer.domElement.addEventListener('pointermove',e=>{if(!drag||mode!=='walk')return;yaw-=(e.clientX-lastX)*.005;pitch=Math.max(-1.1,Math.min(1.1,pitch-(e.clientY-lastY)*.005));lastX=e.clientX;lastY=e.clientY;});renderer.domElement.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('pointercancel',()=>drag=false);
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();keys[b.dataset.key]=true;b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=()=>keys[b.dataset.key]=false;});
function distanceSeg(x,z,a,b,c,d){const vx=c-a,vz=d-b,t=Math.max(0,Math.min(1,((x-a)*vx+(z-b)*vz)/(vx*vx+vz*vz)));return Math.hypot(x-a-vx*t,z-b-vz*t);}
function blocked(x,z){if(x<-5||x>38||z<-5||z>40)return true;const terrace=camera.position.y>14;if(terrace&&x>=29.4&&x<=stairMax&&z>=8.8&&z<=11.2)return false;if(terrace&&!(x>stairMin&&x<stairMax&&z>=8.8&&z<=33.5))return x<.5||x>29.5||z<.5||z>29.5;if(stairWalking&&x>stairMin&&x<stairMax&&z>8.8&&z<33.5)return false;for(const w of walls)if(distanceSeg(x,z,w.ax,w.az,w.bx,w.bz)<.48)return true;if(!$('doors').checked){for(const d of doors){const p=d.group.localToWorld(new THREE.Vector3(d.a,0,0)),q=d.group.localToWorld(new THREE.Vector3(d.a+d.w,0,0));if(distanceSeg(x,z,p.x,p.z,q.x,q.z)<.45)return true;}}return false;}
function heightAt(x,z){if(camera.position.y>14&&x>=29.4&&x<=stairMax&&z>=8.8&&z<=11.2)return 15.35;if(x>stairMin&&x<stairMax&&z>33)stairWalking=true;if(stairWalking&&x>stairMin&&x<stairMax&&z>=8.8&&z<=33.5)return 5.4+Math.max(0,Math.min(9.95,(33-z)/22*9.95));if(camera.position.y>14&&x>.5&&x<30&&z>.5&&z<29.5)return 15.35;stairWalking=false;return 5.4;}
let prev=performance.now();const v=new THREE.Vector3();function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-prev)/1000,.035);prev=now;if(mode==='walk'){let f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0),s=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),n=Math.hypot(f,s)||1;const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*dt*6/n,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*dt*6/n;if(!blocked(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(!blocked(camera.position.x,camera.position.z+dz))camera.position.z+=dz;camera.position.y=heightAt(camera.position.x,camera.position.z);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);}else{if(anim){const t=Math.min(1,(now-anim.start)/900),e=t*t*(3-2*t);camera.position.lerpVectors(anim.from,anim.to,e);controls.target.lerpVectors(anim.tf,anim.tt,e);if(t===1)anim=null;}controls.update();}scene.updateMatrixWorld();for(const r of rooms){v.set(r.x,.5,r.z).project(camera);const visible=$('labels').checked&&mode!=='walk'&&mode!=='exterior'&&v.z<1&&v.z>-1;r.label.style.display=visible?'block':'none';r.label.style.left=(v.x*.5+.5)*vp.clientWidth+'px';r.label.style.top=(-v.y*.5+.5)*vp.clientHeight+'px';}renderer.render(scene,camera);}
new ResizeObserver(()=>{const w=vp.clientWidth,h=vp.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}).observe(vp);$('loading').remove();setMode('cutaway');requestAnimationFrame(frame);
