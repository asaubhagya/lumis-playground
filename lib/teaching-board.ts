export type ChalkTone='chalk'|'sage'|'gold'|'rose'|'orange'|'sky'|'violet';
export type ChalkMark=
 | {type:'line'|'arrow'|'stroke';points:[number,number][];tone:ChalkTone}
 | {type:'ellipse';x:number;y:number;rx:number;ry:number;tone:ChalkTone}
 | {type:'text';x:number;y:number;text:string;size:number;tone:ChalkTone};
export type BoardChallenge={question:string;options:string[];correct:number;explanation:string};
export type BoardSketch={title:string;note:string;elements:ChalkMark[];challenge?:BoardChallenge};
const number=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):null;
export function validateBoard(value:unknown,phase:unknown):BoardSketch|null{
 if(phase!=='play'||!value||typeof value!=='object')return null;
 const b=value as Record<string,unknown>;
 if(typeof b.title!=='string'||typeof b.note!=='string'||!Array.isArray(b.elements)||!b.elements.length||b.elements.length>40)return null;
 const elements:ChalkMark[]=[];
 for(const raw of b.elements){
  if(!raw||typeof raw!=='object')return null;
  const m=raw as Record<string,unknown>,tone:ChalkTone=['sage','gold','rose','orange','sky','violet'].includes(String(m.tone))?m.tone as ChalkTone:'chalk';
  if(['line','arrow','stroke'].includes(String(m.type))){
   if(!Array.isArray(m.points)||m.points.length<2||m.points.length>80)return null;
   const points:[number,number][]=[];
   for(const p of m.points){if(!Array.isArray(p)||p.length!==2)return null;const x=number(p[0],8,432),y=number(p[1],8,252);if(x===null||y===null)return null;points.push([x,y]);}
   elements.push({type:m.type as 'line'|'arrow'|'stroke',points,tone});
  }else{
   const x=number(m.x,8,420),y=number(m.y,12,248);if(x===null||y===null)return null;
   if(m.type==='ellipse'){
    const rx=number(m.rx,2,Math.min(x-3,437-x)),ry=number(m.ry,2,Math.min(y-3,257-y));if(rx===null||ry===null)return null;elements.push({type:'ellipse',x,y,rx,ry,tone});
   }else if(m.type==='text'){
    if(typeof m.text!=='string')return null;elements.push({type:'text',x,y,text:m.text.slice(0,44),size:number(m.size,14,30)??20,tone});
   }else return null;
  }
 }
 const result:BoardSketch={title:b.title.trim().slice(0,42),note:b.note.trim().slice(0,100),elements};
 if(b.challenge&&typeof b.challenge==='object'){
  const c=b.challenge as Record<string,unknown>;
  if(typeof c.question==='string'&&c.question.trim()&&typeof c.explanation==='string'&&Array.isArray(c.options)&&c.options.length>=2&&c.options.length<=3&&c.options.every(o=>typeof o==='string'&&o.trim()&&o.length<=60)&&Number.isInteger(c.correct)&&Number(c.correct)>=0&&Number(c.correct)<c.options.length){
   result.challenge={question:c.question.slice(0,120),options:c.options as string[],correct:Number(c.correct),explanation:c.explanation.slice(0,200)};
  }
 }
 return result;
}
export const boardContract=` You have a flexible drawing canvas, not preset diagrams. Compose any useful explanation yourself with chalk strokes, arrows, shapes and handwritten words. Return optional board:null, or {"title":"up to 5 words","note":"one short sentence under 90 characters","elements":[...]}.
Canvas coordinates are x:8..432, y:8..252, on a 440 by 260 board. Each element is exactly one of:
{"type":"line"|"arrow"|"stroke","points":[[x,y],[x,y],...],"tone":"chalk"|"sage"|"gold"};
{"type":"ellipse","x":centerX,"y":centerY,"rx":radiusX,"ry":radiusY,"tone":"chalk"};
{"type":"text","x":left,"y":baseline,"text":"short label","size":20,"tone":"chalk"}.
Use strokes for freehand outlines, curves, objects, diagrams, number lines, equations, patterns, or simple pictures. Use a closed stroke to draw a rectangle or polygon. Arrows end at the final point. Do not use SVG, HTML, code, image URLs, or unsupported primitives. Keep it legible: usually 6–16 elements, max 24, few labels of 1–3 words, at least 25px apart, and keep words away from the right edge. Use mainly chalk and sage. For concepts that need colors, such as rainbows, you may use tones rose (red), orange, gold (yellow), sage (green), sky (blue), and violet. Use these meaningfully; a rainbow diagram needs distinct colored bands, not a single monochrome arch. Labels must match the geometry. Physically ground the drawing: light travels straight and opaque objects block it. Draw what helps the question, not a fixed template. The board can illustrate any foundational idea needed for the explanation; welcome other age-appropriate subjects, including numbers, nature and everyday science. Explain the requested idea fully enough to be useful, then offer to return to the experiment; do not force an unrelated drawing into the current topic. Include a board when the learner asks to draw, write, sketch, or paint, and when a visual clearly helps. Use the board like a patient teacher, asking one small question. During any prediction board must be null: do not reveal the answer, tell the child to recall observations and choose, and do not suggest moving paused controls. Never claim to draw until the application reports it. Keep all explanations appropriate for ages 5–7.`;

export const openBoardContract=` In open classroom mode, include a challenge on the first substantive explanation and whenever a useful small check is possible: {"question":"one simple question about this picture","options":["short choice","short choice"],"correct":0,"explanation":"why, in one kind concrete sentence"}. Use 2 or 3 choices and a zero-based correct index. This is a small check of understanding, not a test or proof of mastery. Ensure one unambiguously correct choice. Do not reveal the correct choice in the question. The application reveals the explanation after the child selects. Keep the diagram accurate and visually self-contained. For a new concept, prefer an inviting concrete picture over text or equations. On a follow-up, progress from the child's response rather than repeating the same question. Never add a challenge during a preset prediction. Student ink is supplied only if the child shares it; describe visible marks without assuming intent.`;
