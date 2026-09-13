'use client';
import {useEffect,useState} from 'react';
export function useBalancePhysics(enabled:boolean,mass:number,distance:number){
 const [state,setState]=useState<{angle:number;status:'loading'|'ready'|'error'}>({angle:0,status:'loading'});
 useEffect(()=>{
  if(!enabled)return;
  let cancelled=false,frame=0,release:(()=>void)|undefined;
  setState({angle:0,status:'loading'});
  void import('./balance-physics').then(m=>m.createBalance(mass,distance)).then(sim=>{
   if(cancelled){sim.free();return;}release=()=>sim.free();
   let previous=performance.now(),accumulator=0;
   function tick(now:number){
    accumulator+=Math.min((now-previous)/1000,.1);previous=now;
    let angle:number|undefined;
    while(accumulator>=1/60){angle=sim.step();accumulator-=1/60;}
    if(angle!==undefined)setState({angle,status:'ready'});
    frame=requestAnimationFrame(tick);
   }
   frame=requestAnimationFrame(tick);
  }).catch(()=>{if(!cancelled)setState({angle:0,status:'error'});});
  return ()=>{cancelled=true;cancelAnimationFrame(frame);release?.();};
 },[enabled,mass,distance]);
 return state;
}
