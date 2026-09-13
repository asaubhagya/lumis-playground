import {test} from 'node:test';
import assert from 'node:assert/strict';
import {grade,iceRemaining} from '../lib/learning.ts';
test('a correct explanation cannot skip the required experiment',()=>{
 assert.equal(grade(1,1,false,'wool'),false);
 assert.equal(grade(1,1,true,'metal'),false);
 assert.equal(grade(1,0,true,'wool'),false);
 assert.equal(grade(1,1,true,'wool'),true);
});
test('learning gates reject wrong and out-of-range answers',()=>{
 assert.equal(grade(0,1,false,'bare'),false);
 assert.equal(grade(0,0,false,'bare'),true);
 assert.equal(grade(3,1,false,'bare'),true);
 assert.equal(grade(4,0,false,'bare'),false);
});
test('comparison conserves bounds and insulation leaves more ice',()=>{
 for(const material of ['bare','metal','wool']){
  assert.equal(iceRemaining(material,0),100);
  assert.ok(iceRemaining(material,1)>=0);
  assert.ok(iceRemaining(material,1)<=100);
  assert.equal(iceRemaining(material,-2),100);
  assert.equal(iceRemaining(material,2),iceRemaining(material,1));
 }
 assert.ok(iceRemaining('wool',1)>iceRemaining('bare',1));
});
