import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nextExperience,experiences,discoveryReady,initialDiscovery,openingBoard,discoveryObservation} from '../lib/experiences.ts';
import {validateBoard} from '../lib/teaching-board.ts';
test('surprise rotation visits all six before repeating and avoids the previous room at refill',()=>{
 let remaining=[],last=null;const seen=[];
 for(let i=0;i<6;i++){const pick=nextExperience(remaining,last,()=>0);seen.push(pick.topic);remaining=pick.remaining;last=pick.topic;}
 assert.equal(new Set(seen).size,6);assert.notEqual(nextExperience([],last,()=>.999).topic,last);
 const recovered=nextExperience(['not-a-topic'],null);assert.ok(experiences.some(e=>e.id===recovered.topic));
});
test('new experiments require observable learner evidence',()=>{
 for(const topic of ['sound','balance','shares','patterns'])assert.equal(discoveryReady(topic,initialDiscovery()),false);
 assert.equal(discoveryReady('sound',{...initialDiscovery(),seen:[1,1]}),false);
 assert.equal(discoveryReady('shares',{...initialDiscovery(),seen:[1,2]}),true);
 assert.equal(discoveryReady('balance',{...initialDiscovery(),value:3,seen:[2,3]}),true);
 assert.equal(discoveryReady('patterns',{...initialDiscovery(),sequence:[0,1,0,1,0,0,0,1]}),false);
 assert.equal(discoveryReady('patterns',{...initialDiscovery(),sequence:[0,1,0,1,0,1,0,1]}),true);
});
test('board openings are valid freeform drawings and observations distinguish frequency from amplitude',()=>{
 for(const topic of ['shares','patterns'])assert.ok(validateBoard(openingBoard(topic),'play'));
 const low=discoveryObservation('sound',{...initialDiscovery(),value:1});const high=discoveryObservation('sound',{...initialDiscovery(),value:2});
 assert.equal(high.frequencyHz,low.frequencyHz*2);assert.equal(high.amplitude,low.amplitude);
});
