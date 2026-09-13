import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nextExperience,experiences,surpriseExperiences,discoveryReady,initialDiscovery,openingBoard,discoveryObservation} from '../lib/experiences.ts';
import {validateBoard} from '../lib/teaching-board.ts';
test('surprise rotation visits the three curated rooms before repeating and avoids the previous room at refill',()=>{
 let remaining=[],last=null;const seen=[];
 for(let i=0;i<3;i++){const pick=nextExperience(remaining,last,()=>0);seen.push(pick.topic);remaining=pick.remaining;last=pick.topic;}
 assert.equal(new Set(seen).size,3);assert.notEqual(nextExperience([],last,()=>.999).topic,last);
 const recovered=nextExperience(['not-a-topic'],null);assert.ok(experiences.some(e=>e.id===recovered.topic));
});

test('tutorial gates require meaningful comparisons and equivalent constructions',()=>{
 for(const topic of ['sound','balance','shares','patterns'])assert.equal(discoveryReady(topic,initialDiscovery()),false);
 assert.equal(discoveryReady('sound',{...initialDiscovery(),trials:[{value:1,aux:1},{value:2,aux:2}]}),false,'confounded pitch/loudness comparison');
 assert.equal(discoveryReady('sound',{...initialDiscovery(),trials:[{value:1,aux:1},{value:2,aux:1},{value:2,aux:2}]}),true);
 assert.equal(discoveryReady('balance',{...initialDiscovery(),value:3,aux:2,trials:[{value:1,aux:1}]}),false,'must use a different mass');
 assert.equal(discoveryReady('balance',{...initialDiscovery(),value:2,aux:3,trials:[{value:2,aux:1}]}),true);
 assert.equal(discoveryReady('balance',{...initialDiscovery(),value:2,aux:2,trials:[{value:2,aux:1}]}),false);
 assert.equal(discoveryReady('shares',{...initialDiscovery(),trials:[{value:2,aux:4}]}),false);
 assert.equal(discoveryReady('shares',{...initialDiscovery(),trials:[{value:2,aux:4},{value:4,aux:8}]}),true);
 assert.equal(discoveryReady('patterns',{...initialDiscovery(),value:9,trials:[{value:9,aux:1}]}),false);
 assert.equal(discoveryReady('patterns',{...initialDiscovery(),value:10,trials:[{value:10,aux:1}]}),true);
});
test('observations distinguish frequency, amplitude and lever distance',()=>{
 const low=discoveryObservation('sound',{...initialDiscovery(),value:1});const high=discoveryObservation('sound',{...initialDiscovery(),value:2});
 assert.equal(high.frequencyHz,low.frequencyHz*2);assert.equal(high.amplitude,low.amplitude);
 assert.equal(discoveryObservation('sound',{...initialDiscovery(),aux:2}).amplitude,'strong');
 assert.equal(discoveryObservation('balance',{...initialDiscovery(),value:2,aux:3}).balanced,true);
 assert.equal(discoveryObservation('balance',{...initialDiscovery(),value:3,aux:1}).balanced,false);
});
