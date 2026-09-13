import {useEffect,useRef,useState} from 'react';

export function useClassroomSound(){
 const context=useRef<AudioContext|null>(null),[enabled,setEnabled]=useState(true);
 function chime(){
  if(!enabled)return;
  try{
   const c=context.current&&context.current.state!=='closed'?context.current:new AudioContext();context.current=c;void c.resume().catch(()=>{});
   [523.25,783.99,1046.5].forEach((frequency,i)=>{
    const tone=c.createOscillator(),gain=c.createGain(),t=c.currentTime+i*.15;
    tone.type='sine';tone.frequency.value=frequency;
    gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.035,t+.04);gain.gain.exponentialRampToValueAtTime(.0001,t+.85);
    tone.connect(gain);gain.connect(c.destination);tone.start(t);tone.stop(t+.9);
   });
  }catch{/* A sound effect must never block the experiment. */}
 }
 function chalk(){
  if(!enabled)return;
  try{const c=context.current&&context.current.state!=='closed'?context.current:new AudioContext();context.current=c;void c.resume().catch(()=>{});
   const buffer=c.createBuffer(1,c.sampleRate*1.8,c.sampleRate),samples=buffer.getChannelData(0);
   for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*Math.pow(Math.sin(i/c.sampleRate*22),8);
   const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=1900;filter.Q.value=.65;
   gain.gain.setValueAtTime(.022,c.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,c.currentTime+1.8);
   source.connect(filter);filter.connect(gain);gain.connect(c.destination);source.start();source.stop(c.currentTime+1.8);
  }catch{}
 }
 function toggle(){if(enabled)void context.current?.suspend().catch(()=>{});setEnabled(v=>!v);}
 function stop(){void context.current?.suspend().catch(()=>{});}
 useEffect(()=>()=>{const c=context.current;context.current=null;if(c&&c.state!=='closed')void c.close().catch(()=>{});},[]);
 return {enabled,toggle,chime,chalk,stop};
}
