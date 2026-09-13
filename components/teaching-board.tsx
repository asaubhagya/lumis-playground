'use client';
import {useRef,useState} from 'react';
import {X,Sun,Moon,PenLine,Eraser,Send} from 'lucide-react';
import type {BoardSketch,ChalkMark} from '@/lib/teaching-board';
const colors={chalk:'#d4e7d9',sage:'#9fc9b4',gold:'#e2cc96',rose:'#e7a0a5',orange:'#e7b07f',sky:'#93c7e5',violet:'#b5a1de'};
function Mark({mark,index,light}:{mark:ChalkMark;index:number;light:boolean}){
 const style={color:light?({chalk:"#28413c",sage:"#367d62",gold:"#95742c",rose:"#af505a",orange:"#ac672c",sky:"#38779e",violet:"#7755a3"}[mark.tone]):colors[mark.tone],animationDelay:`${Math.min(index*.09,1.7)}s`};
 if(mark.type==='text')return <text className="chalk-word" x={mark.x} y={mark.y} fontSize={mark.size} fill="currentColor" stroke="none" style={style}>{mark.text}</text>;
 if(mark.type==='ellipse')return <ellipse className="chalk-mark" cx={mark.x} cy={mark.y} rx={mark.rx} ry={mark.ry} pathLength="1" style={style}/>;
 const points=mark.type==='line'?mark.points.slice(0,2):mark.points;
 const path=points.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' ');
 let arrow='';if(mark.type==='arrow'){const end=points.at(-1)!,prev=points.at(-2)!,angle=Math.atan2(end[1]-prev[1],end[0]-prev[0]);arrow=`M${end[0]-9*Math.cos(angle-.5)} ${end[1]-9*Math.sin(angle-.5)}L${end[0]} ${end[1]}L${end[0]-9*Math.cos(angle+.5)} ${end[1]-9*Math.sin(angle+.5)}`;}
 return <path className="chalk-mark" d={path+' '+arrow} pathLength="1" style={style}/>;
}
export default function TeachingBoard({sketch,onClose,light=false,onToggle,interactive=false,busy=false,onAnswer,onFeedback}:{sketch:BoardSketch;onClose:()=>void;light?:boolean;onToggle?:()=>void;interactive?:boolean;busy?:boolean;onAnswer?:(question:string,image?:string)=>void;onFeedback?:(text:string)=>void}){
 const [pen,setPen]=useState(false),[ink,setInk]=useState<[number,number][][]>([]),[chosen,setChosen]=useState<number|null>(null),[sharing,setSharing]=useState(false);
 const drawing=useRef(false),surface=useRef<SVGSVGElement>(null);
 function point(e:React.PointerEvent<SVGSVGElement>):[number,number]{const svg=e.currentTarget,p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const m=svg.getScreenCTM();const pos=m?p.matrixTransform(m.inverse()):p;return [Math.max(8,Math.min(432,pos.x)),Math.max(8,Math.min(252,pos.y))];}
 async function share(){
  if(!surface.current||!ink.length||busy||sharing)return;setSharing(true);
  let url='';try{const copy=surface.current.cloneNode(true) as SVGSVGElement;copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.setAttribute('width','880');copy.setAttribute('height','520');copy.querySelectorAll('*').forEach(el=>{el.removeAttribute('class');});
   url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));const img=new Image();await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=reject;img.src=url;});const canvas=document.createElement('canvas');canvas.width=880;canvas.height=520;const ctx=canvas.getContext('2d')!;ctx.fillStyle=light?'#edf0e5':'#152c28';ctx.fillRect(0,0,880,520);ctx.drawImage(img,0,0,880,520);onAnswer?.(`I added my own drawing to the board about ${sketch.title}. Look at the visible marks, ask what I meant if unclear, and help me explore the idea.`,canvas.toDataURL('image/png'));
  }catch{onFeedback?.('The drawing could not be shared. Please try again.');}finally{if(url)URL.revokeObjectURL(url);setSharing(false);}
 }
 const challenge=sketch.challenge;
 return <aside className={`teaching-board ${light?"whiteboard":""} ${interactive?'interactive-board':''}`} aria-label={light?"Miss Lumi’s whiteboard":"Miss Lumi’s chalkboard"}>
 <button className="board-theme" aria-label={light?"Use chalkboard":"Use whiteboard"} onClick={onToggle}>{light?<Moon size={16}/>:<Sun size={16}/>}</button>
 <button className="board-close" onClick={onClose} aria-label="Clear chalkboard"><X size={15}/></button>
 <p className="board-title">{sketch.title}</p>
 <svg ref={surface} viewBox="0 0 440 260" role="img" aria-label={`${sketch.title}. ${sketch.note}`} style={{touchAction:pen?'none':'pan-y',cursor:pen?'crosshair':'default'}} onPointerDown={e=>{if(!pen||ink.length>=30)return;drawing.current=true;e.currentTarget.setPointerCapture(e.pointerId);setInk(v=>[...v,[point(e)]]);}} onPointerMove={e=>{if(!drawing.current)return;const p=point(e);setInk(v=>{const next=v.slice(),last=next.at(-1);if(last&&last.length<400)next[next.length-1]=[...last,p];return next;});}} onPointerUp={e=>{drawing.current=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}} onPointerCancel={()=>{drawing.current=false;}}>
 <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">{sketch.elements.map((mark,i)=><Mark light={light} key={i} mark={mark} index={i}/>)}</g>
 <g fill="none" stroke={light?'#95742c':'#e2cc96'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{ink.map((points,i)=><polyline key={i} points={points.map(p=>p.join(',')).join(' ')}/>)}</g>
 </svg><p className="board-note">{sketch.note}</p>
 {interactive&&challenge&&<div className="board-challenge"><p>{challenge.question}</p><div>{challenge.options.map((option,i)=><button key={option} disabled={chosen!==null||busy} aria-pressed={chosen===i} onClick={()=>{setChosen(i);onFeedback?.((i===challenge.correct?'You noticed it! ':'Let’s look together. ')+challenge.explanation);}}>{option}</button>)}</div>{chosen!==null&&<section role="status"><button disabled={busy} onClick={()=>onAnswer?.(`On the board "${sketch.title}", you asked "${challenge.question}". I chose "${challenge.options[chosen]}". The board explanation was "${challenge.explanation}". Help me understand my choice and draw one next small discovery.`)}>Keep exploring →</button></section>}</div>}
 {interactive&&<details className="board-drawing-options"><summary>Draw with Lumi</summary><div className="board-ink-tools"><button aria-label="Draw on the board" aria-pressed={pen} onClick={()=>setPen(v=>!v)}><PenLine size={16}/>{pen?'Your turn to draw':'Draw with Lumi'}</button>{ink.length>0&&<><button aria-label="Erase my drawing" onClick={()=>setInk([])}><Eraser size={16}/></button><button disabled={busy||sharing} onClick={()=>void share()}><Send size={14}/>{sharing?'Sharing…':'Show Lumi'}</button></>}</div></details>}
 <div className="chalk-rest"/>
 </aside>;
}
