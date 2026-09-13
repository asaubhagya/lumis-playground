import test from 'node:test';
import assert from 'node:assert/strict';
import {createBalance} from '../lib/balance-physics.ts';
test('Rapier balances equal moments and tips toward the greater moment',async()=>{
 for(const [mass,distance,direction] of [[2,3,0],[3,2,0],[6,4,1],[1,1,-1]]){
  const sim=await createBalance(mass,distance);let angle=0;
  try{for(let i=0;i<360;i++)angle=sim.step();
   assert.ok(Number.isFinite(angle));
   if(direction===0)assert.ok(Math.abs(angle)<.1,`balanced angle ${angle}`);
   else assert.ok(angle*direction>10&&Math.abs(angle)<15,`wrong tipping direction/limit ${angle}`);
  }finally{sim.free();}
 }
});
