'use client';
import {X} from 'lucide-react';
import type {BoardSketch,ChalkMark} from '@/lib/teaching-board';
const colors={chalk:'#d4e7d9',sage:'#9fc9b4',gold:'#e2cc96'};
function Mark({mark,index}:{mark:ChalkMark;index:number}){
 const style={color:colors[mark.tone],animationDelay:`${Math.min(index*.09,1.7)}s`};
 if(mark.type==='text')return <text className="chalk-word" x={mark.x} y={mark.y} fontSize={mark.size} fill="currentColor" stroke="none" style={style}>{mark.text}</text>;
 if(mark.type==='ellipse')return <ellipse className="chalk-mark" cx={mark.x} cy={mark.y} rx={mark.rx} ry={mark.ry} pathLength="1" style={style}/>;
 const points=mark.type==='line'?mark.points.slice(0,2):mark.points;
 const path=points.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' ');
 let arrow='';if(mark.type==='arrow'){const end=points.at(-1)!,prev=points.at(-2)!,angle=Math.atan2(end[1]-prev[1],end[0]-prev[0]);arrow=`M${end[0]-9*Math.cos(angle-.5)} ${end[1]-9*Math.sin(angle-.5)}L${end[0]} ${end[1]}L${end[0]-9*Math.cos(angle+.5)} ${end[1]-9*Math.sin(angle+.5)}`;}
 return <path className="chalk-mark" d={path+' '+arrow} pathLength="1" style={style}/>;
}
export default function TeachingBoard({sketch,onClose}:{sketch:BoardSketch;onClose:()=>void}){
 return <aside className="teaching-board" aria-label="Miss Lumi’s chalkboard">
 <button className="board-close" onClick={onClose} aria-label="Clear chalkboard"><X size={15}/></button>
 <p className="board-title">{sketch.title}</p>
 <svg viewBox="0 0 440 260" role="img" aria-label={`${sketch.title}. ${sketch.note}`}>
 <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">{sketch.elements.map((mark,i)=><Mark key={i} mark={mark} index={i}/>)}</g>
 </svg><p className="board-note">{sketch.note}</p><div className="chalk-rest"/>
 </aside>;
}
