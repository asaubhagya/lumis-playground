import {useEffect,useRef} from 'react';
export default function RoomAtmosphere(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const room=root.current?.parentElement;if(!room)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let tick=0;
  const move=(e:PointerEvent)=>{if(reduced.matches)return;cancelAnimationFrame(tick);tick=requestAnimationFrame(()=>{const x=e.clientX/window.innerWidth-.5,y=e.clientY/window.innerHeight-.5;room.style.setProperty('--pointer-x',`${e.clientX}px`);room.style.setProperty('--pointer-y',`${e.clientY}px`);room.style.setProperty('--look-x',`${x*7}px`);room.style.setProperty('--look-y',`${y*5}px`);room.style.setProperty('--drift-x',`${x*18}px`);room.style.setProperty('--drift-y',`${y*12}px`);});};
  window.addEventListener('pointermove',move,{passive:true});return()=>{cancelAnimationFrame(tick);window.removeEventListener('pointermove',move);};
 },[]);
 return <div ref={root} className="room-atmosphere" aria-hidden="true"><div className="pointer-light"/><div className="dust-field">{Array.from({length:18},(_,i)=><i key={i} style={{left:`${(i*37+13)%100}%`,top:`${(i*23+19)%91}%`,animationDelay:`-${i*.8}s`,animationDuration:`${9+i%5}s`}}/>)}</div></div>;
}
