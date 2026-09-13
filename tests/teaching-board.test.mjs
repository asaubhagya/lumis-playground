import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateBoard} from '../lib/teaching-board.ts';
const sketch={title:'A new idea',note:'Follow this arrow.',elements:[{type:'arrow',points:[[20,50],[200,50]],tone:'chalk'},{type:'text',x:20,y:90,text:'2 + 2 = 4',size:20,tone:'chalk'}]};
test('freeform board accepts novel drawings and rejects them during predictions',()=>{
 assert.deepEqual(validateBoard(sketch,'play'),sketch);
 for(const phase of ['predict','result','retry','done'])assert.equal(validateBoard(sketch,phase),null);
});
test('board rejects executable markup, invalid geometry and unbounded payloads',()=>{
 for(const elements of [[{type:'script',text:'alert(1)'}],[{type:'stroke',points:[[0,1],[NaN,3]]}],Array(41).fill(sketch.elements[0]),[{type:'ellipse',x:20,y:20,rx:Infinity,ry:5}]])assert.equal(validateBoard({...sketch,elements},'play'),null);
 const bounded=validateBoard({...sketch,elements:[{type:'stroke',points:[[-40,400],[900,-2]],tone:'url(evil)'}]},'play');
 assert.deepEqual(bounded.elements[0],{type:'stroke',points:[[8,252],[432,8]],tone:'chalk'});
 assert.equal(validateBoard({...sketch,note:'a'.repeat(900)},'play').note.length,100);
});
test('open classroom challenges retain bounded choices and reject invalid answer keys',()=>{
 const challenge={question:'Which needs light?',options:['A plant','A rock'],correct:0,explanation:'Plants use light energy to make food.'};
 assert.deepEqual(validateBoard({...sketch,challenge},'play').challenge,challenge);
 for(const bad of [{...challenge,correct:2},{...challenge,correct:0.5},{...challenge,options:['one']},{...challenge,options:['', 'two']},{...challenge,options:['a'.repeat(61),'two']}]){
  assert.equal(validateBoard({...sketch,challenge:bad},'play').challenge,undefined);
 }
 assert.equal(validateBoard({...sketch,challenge},'predict'),null);
});

test('generated text labels stay apart instead of overlapping',()=>{
 const board=validateBoard({title:'Patterns',note:'Examples teach a pattern',elements:[{type:'text',x:280,y:70,text:'pattern',size:20},{type:'text',x:285,y:70,text:'new input',size:20}]},'play');
 assert.ok(board);
 assert.ok(Math.abs(board.elements[0].y-board.elements[1].y)>=24);
});
