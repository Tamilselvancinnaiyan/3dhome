import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import * as THREE from '../vendor/three.module.js';
import * as plan from '../model-plan.mjs';
function loadViewer(){
 const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'http://localhost:8000'}),document=dom.window.document;
 class Renderer{constructor(){this.domElement=document.createElement('canvas');this.shadowMap={};}setPixelRatio(){}setSize(){}render(){}}
 class Controls{constructor(){this.target=new THREE.Vector3();}update(){}}
 const context=vm.createContext({...plan,roomDefs:plan.rooms,THREE:{...THREE,WebGLRenderer:Renderer},OrbitControls:Controls,document,window:dom.window,performance,devicePixelRatio:1,requestAnimationFrame:()=>0,ResizeObserver:class{observe(){}}});
 const source=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
 return vm.runInContext(source+'\n;({house,furn,roof,wallGroup,doors,rooms,camera,setMode,setDoors,blocked,heightAt,measures,measureLabels,frame,document})',context);
}
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
test('rendered queen beds, wardrobes, and key furniture match the geometry used by the area/access checks',()=>{
 const v=loadViewer();v.house.updateMatrixWorld(true);
 for(const f of plan.furnitureFootprints){const g=v.furn.getObjectByName(f.id);assert.ok(g,`${f.id} missing from viewer`);const b=new THREE.Box3().setFromObject(g);near(b.min.x,f.r.x0);near(b.max.x,f.r.x1);near(b.min.z,f.r.z0);near(b.max.z,f.r.z1);}
 const cabinets=[];v.furn.traverse(n=>{if(n.name==='Kitchen wall-mounted cabinet')cabinets.push(n);});assert.equal(cabinets.length,2);for(const c of cabinets)near(new THREE.Box3().setFromObject(c).max.z,29);
 for(const id of ['bed2-bed','master-bed','bed2-wardrobe','master-wardrobe'])near(new THREE.Box3().setFromObject(v.furn.getObjectByName(id)).min.y,plan.FLOOR_Y);
});
test('rendered structure has solid volume, porch supports meet canopy, and stair projection matches summary',()=>{
 const v=loadViewer();v.wallGroup.scale.y=1;v.house.updateMatrixWorld(true);
 v.house.traverse(n=>{if(!n.isMesh)return;const p=n.geometry.attributes.position;for(const x of p.array)assert.ok(Number.isFinite(x),'Nonfinite geometry');assert.ok(n.geometry.index===null||n.geometry.index.count>0);});
 const flight=v.house.getObjectByName('Independent stair flight'),landing=v.house.getObjectByName('Stair landing');
 const b=new THREE.Box3().setFromObject(flight),l=new THREE.Box3().setFromObject(landing);near(b.min.x,32.75);near(b.max.x,36.25);near(b.min.z,12.75);near(b.max.z,33.75);near(l.min.z,9.75);near(l.max.z,12.75);near(l.max.y,9.9);
 const pillars=[];v.house.traverse(n=>{if(n.name==='Porch square pillar')pillars.push(n);});assert.equal(pillars.length,2);for(const p of pillars){const b=new THREE.Box3().setFromObject(p);near(b.min.y,plan.FLOOR_Y);near(b.max.y,plan.HEIGHT);}
});
test('website derives sidebar values, measurements and labels from geometry, and mode toggles remain independent',()=>{
 const v=loadViewer();assert.equal(v.document.getElementById('main-area').textContent,'1,001.63');assert.equal(v.document.querySelectorAll('#area-values dd').length,9);assert.equal(v.measureLabels.length,27);
 v.setMode('top');assert.equal(v.roof.visible,false);v.document.getElementById('measurements').checked=true;v.frame(performance.now()+1000);assert.equal(v.measures.visible,true);
 v.setMode('exterior');v.frame(performance.now()+2000);assert.equal(v.roof.visible,true);assert.equal(v.measures.visible,false);
 v.document.getElementById('furniture').onchange({target:{checked:false}});assert.equal(v.furn.visible,false);assert.equal(v.roof.visible,true);
 v.document.getElementById('night').onchange({target:{checked:true}});
 v.setMode('walk');v.setDoors(true);v.document.getElementById('doors').checked=true;assert.equal(v.blocked(14.55,29.25),false);v.document.getElementById('doors').checked=false;v.setDoors(false);assert.equal(v.blocked(14.55,29),true);
 near(v.heightAt(34.5,10.5),15.3);near(v.heightAt(14.55,32.75),5.48);
});
