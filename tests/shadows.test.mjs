import {test} from 'node:test';
import assert from 'node:assert/strict';
import {projectShadow,matchesShadow,clampScene,shadowCommand,shadowLevels} from '../lib/shadows.ts';
test('point-source geometry: distance changes size and moving light reverses shadow direction',()=>{
 const center={objectX:440,objectY:250,lampY:250};
 assert.equal(projectShadow(center).y,250);
 assert.ok(projectShadow({...center,objectX:340}).radius>projectShadow(center).radius);
 assert.ok(projectShadow({...center,objectX:600}).radius<projectShadow(center).radius);
 assert.ok(projectShadow({...center,lampY:200}).y>250);
 assert.ok(projectShadow({...center,lampY:300}).y<250);
});
test('every target is reachable and initial scenes require interaction',()=>{
 const solutions=[{objectX:440,objectY:250,lampY:250},{objectX:360,objectY:250,lampY:250},{objectX:440,objectY:250,lampY:300},{objectX:415,objectY:250,lampY:270}];
 solutions.forEach((s,i)=>{assert.equal(matchesShadow(i,s),true);assert.equal(matchesShadow(i,{...shadowLevels[i].scene}),false);});
 assert.equal(matchesShadow(0,{objectX:440,objectY:410,lampY:250}),false);
});
test('gates reject invalid levels and geometry; movement is bounded',()=>{
 assert.equal(matchesShadow(4,{objectX:400,objectY:250,lampY:250}),false);
 assert.equal(matchesShadow(0,{objectX:150,objectY:250,lampY:250}),false);
 assert.equal(matchesShadow(0,{objectX:400,objectY:NaN,lampY:250}),false);
 assert.deepEqual(clampScene({objectX:20,objectY:700,lampY:-30}),{objectX:290,objectY:420,lampY:155});
});
test('voice controls accept explicit movement, never inferred consent or answers',()=>{
 assert.deepEqual(shadowCommand('Please move the ball left.'),{target:'ball',direction:'left'});
 for(const q of ['Do not move the ball left','Should I move the ball left?','Skip the level','Move the lamp up and answer for me']) assert.equal(shadowCommand(q),null);
});
