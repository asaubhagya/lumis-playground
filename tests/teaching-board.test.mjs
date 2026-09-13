import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateBoard} from '../lib/teaching-board.ts';
test('board cannot reveal a prediction or accept arbitrary drawing payloads',()=>{
 const sketch={diagram:'shadow',title:'Light and shadow',note:'A toy blocks light.'};
 assert.deepEqual(validateBoard(sketch,'play'),sketch);
 for(const phase of ['predict','result','retry','done'])assert.equal(validateBoard(sketch,phase),null);
 assert.equal(validateBoard({...sketch,diagram:'script'},'play'),null);
 assert.equal(validateBoard({...sketch,note:42},'play'),null);
 assert.equal(validateBoard({...sketch,note:'a'.repeat(900)},'play').note.length,100);
});
