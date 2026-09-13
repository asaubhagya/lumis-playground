import {useEffect,useRef,useState} from 'react';

export function useClassroomSound(){
 const context=useRef<AudioContext|null>(null),[enabled,setEnabled]=useState(true);
 function chime(){
  if(!enabled)return;
  try{
   const c=context.current??new AudioContext();context.current=c;void c.resume();
   [523.25,783.99,1046.5].forEach((frequency,i)=>{
    const tone=c.createOscillator(),gain=c.createGain(),t=c.currentTime+i*.15;
    tone.type='sine';tone.frequency.value=frequency;
    gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.035,t+.04);gain.gain.exponentialRampToValueAtTime(.0001,t+.85);
    tone.connect(gain);gain.connect(c.destination);tone.start(t);tone.stop(t+.9);
   });
  }catch{/* A sound effect must never block the experiment. */}
 }
 function toggle(){if(enabled)void context.current?.suspend();setEnabled(v=>!v);}
 function stop(){void context.current?.suspend();}
 useEffect(()=>()=>{void context.current?.close();},[]);
 return {enabled,toggle,chime,stop};
}
