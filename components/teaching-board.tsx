'use client';
import {X} from 'lucide-react';
import type {BoardSketch} from '@/lib/teaching-board';
export default function TeachingBoard({sketch,onClose}:{sketch:BoardSketch;onClose:()=>void}){
 const shadow=sketch.diagram==='shadow',size=sketch.diagram==='size',rays=sketch.diagram==='rays';
 return <aside className="teaching-board" aria-label="Miss Lumi’s chalkboard">
 <button className="board-close" onClick={onClose} aria-label="Clear chalkboard"><X size={15}/></button>
 <p className="board-title">{sketch.title}</p>
 <svg viewBox="0 0 440 205" role="img" aria-label={rays?'Light rays travel in straight lines':shadow?'A ball blocks light, leaving a shadow on the wall':size?'A ball closer to the lamp blocks a wider bundle of light':'A lamp, ball, and wall to think about'}>
 <g className="chalk-lines" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="40" cy="95" r="12" pathLength="1"/>
 <path d="M40 71v-8 M40 119v8 M17 95H9 M63 95h8 M23 78l-6-6 M57 112l6 6 M23 112l-6 6 M57 78l6-6" pathLength="1"/>
 {rays?<><path d="M70 90L361 31 M70 95H371 M70 100L361 160" pathLength="1"/><path d="M350 28l11 3-7 9 M361 87l10 8-10 7 M354 149l7 11-12 1" pathLength="1"/></>:<>
 <path d="M384 22v153" pathLength="1"/>
 {size?<><path className="chalk-shadow" d="M40 95L384 24v142Z" pathLength="1"/><circle cx="154" cy="95" r="23" pathLength="1"/><path d="M384 25v140" strokeWidth="9" opacity=".42" pathLength="1"/></>:<><path d="M40 95L384 58 M40 95L384 132" pathLength="1"/><circle cx="255" cy="95" r="23" pathLength="1"/>{shadow&&<path d="M384 59v72" strokeWidth="9" opacity=".42" pathLength="1"/>}</>}
 </>}
 </g>
 <g className="chalk-labels" fill="currentColor" fontSize="18"><text x="20" y="158">light</text>{!rays&&<><text x={size?133:235} y="158">ball</text><text x="358" y="199">wall</text></>}{sketch.diagram==='question'&&<text x="320" y="102" fontSize="32">?</text>}</g>
 </svg><p className="board-note">{sketch.note}</p><div className="chalk-rest"/>
 </aside>;
}
