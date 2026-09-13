import {test} from 'node:test';
import assert from 'node:assert/strict';
import {motionRun,comparisonReady} from '../lib/classroom.ts';
const trial=(s)=>({...s,distance:motionRun(s).distance});
test('fixed-duration pushes respect impulse, mass and friction',()=>{
 const base={force:1,mass:1,rough:false},a=motionRun(base),b=motionRun({...base,force:2}),heavy=motionRun({...base,mass:2}),rough=motionRun({...base,rough:true});
 assert.equal(b.speed,2*a.speed);assert.equal(heavy.speed,a.speed/2);assert.equal(rough.speed,a.speed);assert.ok(rough.distance<a.distance);assert.ok(heavy.distance<a.distance);
 assert.equal(a.speed*a.duration-.5*a.deceleration*a.duration**2,a.distance);
});
test('discovery gates require a controlled comparison, not repeated or confounded trials',()=>{
 const a=trial({force:1,mass:1,rough:false});
 assert.equal(comparisonReady(0,[a,a]),false);
 assert.equal(comparisonReady(0,[a,trial({force:2,mass:2,rough:false})]),false);
 assert.equal(comparisonReady(0,[a,trial({...a,force:2})]),true);
 assert.equal(comparisonReady(1,[a,trial({...a,mass:2})]),true);
 assert.equal(comparisonReady(2,[a,trial({...a,rough:true})]),true);
});
