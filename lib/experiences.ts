import type {Topic} from './classroom';
import type {BoardSketch} from './teaching-board';
export type DiscoveryTopic='sound'|'balance'|'shares'|'patterns';
export const experiences: {id:Topic;name:string;opening:'canvas'|'board'}[]=[
 {id:'shadows',name:'Light & shadows',opening:'canvas'}, {id:'forces',name:'Forces & motion',opening:'canvas'},
 {id:'sound',name:'Sound & vibrations',opening:'canvas'}, {id:'balance',name:'Finding balance',opening:'canvas'},
 {id:'shares',name:'Equal shares',opening:'board'}, {id:'patterns',name:'Secret patterns',opening:'board'},
];
export const isDiscovery=(t:Topic):t is DiscoveryTopic=>['sound','balance','shares','patterns'].includes(t);
// Draw without replacement. Store only topic IDs, never learner conversations.
export function nextExperience(remaining:unknown,last:unknown,random=Math.random):{topic:Topic;remaining:Topic[]}{
 const ids=experiences.map(e=>e.id);
 let bag=Array.isArray(remaining)?[...new Set(remaining.filter((x):x is Topic=>ids.includes(x)))]:[];
 if(!bag.length)bag=[...ids];
 const candidates=bag.filter(x=>x!==last);const pool=candidates.length?candidates:bag;
 const topic=pool[Math.min(pool.length-1,Math.max(0,Math.floor(random()*pool.length)))];
 return {topic,remaining:bag.filter(x=>x!==topic)};
}
export const discoveryLessons={
 sound:{name:'Hear the difference',goal:'Try a slow vibration. Then a fast one.',hint:'Tap Low and High. Listen and watch the waves.',prediction:'Which vibration makes a higher pitch?',options:['A faster vibration','A slower vibration'],correct:0,result:'Faster vibrations make a higher pitch. Pitch is different from loudness.',concept:'Faster vibrations make a higher pitch.'},
 balance:{name:'Find the balance',goal:'Make both sides balance.',hint:'Each bead has the same mass. Add or take away beads on the right.',prediction:'Add one bead to the right. Which side goes down?',options:['The left side','The right side'],correct:1,result:'The heavier side goes down. Equal masses at equal distances balance.',concept:'Equal masses at equal distances balance.'},
 shares:{name:'One whole, many pieces',goal:'Split the same whole into two, then four equal pieces.',hint:'Tap 2 pieces and 4 pieces. Watch the size of one piece.',prediction:'Which is bigger: one half or one quarter of the same whole?',options:['One half','One quarter'],correct:0,result:'One half is bigger. More equal pieces means each piece is smaller.',concept:'More equal shares make smaller pieces.'},
 patterns:{name:'Find what repeats',goal:'Complete the repeating pattern.',hint:'Look for the little group that repeats. Try adding the next shape.',prediction:'In circle, triangle, circle, triangle… what comes next?',options:['A triangle','A circle'],correct:1,result:'A circle comes next. The circle–triangle group repeats.',concept:'A pattern follows a repeating rule.'},
} as const;
export type DiscoveryState={value:number;seen:number[];sequence:number[]};
export const initialDiscovery=():DiscoveryState=>({value:1,seen:[],sequence:[0,1,0,1]});
export function discoveryReady(topic:DiscoveryTopic,s:DiscoveryState){
 if(topic==='patterns')return s.sequence.length>=8&&s.sequence.every((v,i)=>v===i%2);
 if(topic==='balance')return s.value===3&&s.seen.length>0;
 return s.seen.includes(1)&&s.seen.includes(2);
}
export function discoveryObservation(topic:DiscoveryTopic,s:DiscoveryState){
 if(topic==='sound')return {frequencyHz:s.value===1?220:440,amplitude:'fixed',tried:s.seen,visual:'slow-motion illustration, not real-time waveform'};
 if(topic==='balance')return {leftBeads:3,rightBeads:s.value,equalMassBeads:true,equalArmLengths:true,balanced:s.value===3};
 if(topic==='shares')return {equalPieces:s.value===1?2:4,sameWhole:true,tried:s.seen};
 return {sequence:s.sequence.map(v=>v===0?'circle':'triangle'),rule:'circle, triangle repeat'};
}
export function openingBoard(topic:Topic):BoardSketch|null{
 if(topic==='shares')return {title:'One whole',note:'How could we share it fairly?',elements:[{type:'ellipse',x:220,y:120,rx:85,ry:85,tone:'chalk'},{type:'text',x:179,y:237,text:'your turn',size:20,tone:'sage'}]};
 if(topic==='patterns')return {title:'What comes next?',note:'Find the little group that repeats.',elements:[...([65,185] as const).map(x=>({type:'ellipse' as const,x,y:120,rx:20,ry:20,tone:'sage' as const})),...([125,245] as const).map(x=>({type:'stroke' as const,points:[[x,95],[x+23,140],[x-23,140],[x,95]] as [number,number][],tone:'gold' as const})),{type:'text',x:311,y:132,text:'?',size:30,tone:'chalk'}]};
 return null;
}
