import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDiagram} from '../lib/board-diagram.ts';
import {validateBoard} from '../lib/teaching-board.ts';
const item={symbol:'sun',label:'Sunlight',detail:'The same amount of light'};
test('structured board works without arbitrary freehand geometry',()=>{
 const diagram={layout:'single',items:[item],links:[]};
 assert.deepEqual(validateDiagram(diagram),diagram);
 assert.ok(validateBoard({title:'Light',note:'One idea at a time',elements:[],diagram},'play')?.diagram);
});
test('diagram limits prevent crowded layouts and invalid symbols',()=>{
 assert.equal(validateDiagram({layout:'compare',items:[item],links:[]}),null);
 assert.equal(validateDiagram({layout:'flow',items:Array(4).fill(item)}),null);
 assert.equal(validateDiagram({layout:'single',items:[{...item,label:'x'.repeat(23)}]}),null);
 assert.equal(validateDiagram({layout:'single',items:[{...item,symbol:'<script>'}]}),null);
});
