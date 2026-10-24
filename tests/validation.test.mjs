import test from 'node:test';
import assert from 'node:assert/strict';
import {designValidation,routeChecks,obstacles,kitchenCounters} from '../design-validation.mjs';
import {areaSummary,stair,rooms} from '../model-plan.mjs';
test('audit derives values from geometry and responds to a changed room/landing',()=>{
 const original=designValidation();assert.deepEqual(original.areas,areaSummary());
 assert.equal(original.checks.find(c=>c.id==='dining').status,'FAIL');
 assert.equal(original.checks.find(c=>c.id==='stair-landing').status,'FAIL');
 assert.equal(original.checks.find(c=>c.id==='structure').status,'NEEDS MANUAL VERIFICATION');
 const z=stair.landing.z0;try{stair.landing.z0-=.5;const next=designValidation();assert.equal(next.checks.find(c=>c.id==='stair-landing').status,'PASS');assert.equal(next.areas.stairs-original.areas.stairs,1.75);}finally{stair.landing.z0=z;}
 const q=rooms.find(q=>q.id==='master'),x=q.r.x1;try{q.r.x1-=1;assert.equal(designValidation().checks.find(c=>c.id==='room-master').status,'FAIL');}finally{q.r.x1=x;}
 assert.equal(original.budget.main,original.areas.main*2350);assert.equal(original.budget.all,original.areas.combined*2350);
});
test('broader inventory includes kitchen counters, excludes removed handwash and checks routes',()=>{
 assert.equal(kitchenCounters.length,2);assert.equal(obstacles.some(o=>o.id==='dining-handwash'),false);
 assert.equal(routeChecks().length,9);assert.ok(routeChecks().every(r=>r.reachable));
});
