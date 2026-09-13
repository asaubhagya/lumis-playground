import type {Topic} from './classroom';
import type {BoardSketch} from './teaching-board';
export type DiscoveryTopic='sound'|'balance'|'shares'|'patterns';
export const experiences:{id:Topic;name:string;opening:'canvas'|'board'}[]=[
 {id:'shadows',name:'Light & shadows',opening:'canvas'},{id:'forces',name:'Forces & motion',opening:'canvas'},
 {id:'sound',name:'Pitch ≠ loudness',opening:'canvas'},{id:'balance',name:'The lever mystery',opening:'canvas'},
 {id:'shares',name:'Different fractions, same amount',opening:'canvas'},{id:'patterns',name:'Patterns that grow',opening:'canvas'},
];
export const isDiscovery=(t:Topic):t is DiscoveryTopic=>['sound','balance','shares','patterns'].includes(t);
export function nextExperience(remaining:unknown,last:unknown,random=Math.random):{topic:Topic;remaining:Topic[]}{
 const ids=experiences.map(e=>e.id);let bag=Array.isArray(remaining)?[...new Set(remaining.filter((x):x is Topic=>ids.includes(x)))]:[];
 if(!bag.length)bag=[...ids];const candidates=bag.filter(x=>x!==last),pool=candidates.length?candidates:bag;
 const topic=pool[Math.min(pool.length-1,Math.max(0,Math.floor(random()*pool.length)))];return {topic,remaining:bag.filter(x=>x!==topic)};
}
export const discoveryLessons={
 sound:{name:'Two ways to change a sound',goal:'Change frequency alone. Then change amplitude alone.',hint:'Keep amplitude fixed while comparing 220 and 440 Hz. Then keep frequency fixed and compare soft and strong.',prediction:'A quiet whistle has a higher pitch than a loud drum. What must vibrate faster?',options:['The whistle','The drum','Loudness decides pitch'],correct:0,result:'The whistle vibrates faster. Frequency sets pitch; amplitude affects loudness. A high pitch can still be quiet.',concept:'Pitch and loudness can change independently.'},
 balance:{name:'A lighter weight can balance',goal:'Balance 3 kg at 2 m using a different mass on the right.',hint:'Try moving a lighter mass farther from the pivot. Compare mass × distance on both sides.',prediction:'What happens with 1 kg at 4 m on the left and 2 kg at 2 m on the right?',options:['The left falls','The right falls','They balance'],correct:2,result:'They balance: 1 × 4 = 2 × 2. A smaller force farther from the pivot can have the same turning effect.',concept:'Balance depends on force and distance from the pivot.'},
 shares:{name:'Different pieces, same amount',goal:'Make one half using fourths, then eighths.',hint:'Change the number of equal parts, then shade until the colored length matches the half above.',prediction:'Which fraction also covers one half of the same whole?',options:['3/4','3/6','1/6'],correct:1,result:'3/6 = 1/2. Multiplying both numerator and denominator by the same number changes the pieces, not the amount.',concept:'Equivalent fractions name the same proportion of a whole.'},
 patterns:{name:'Find the next row',goal:'Build the fourth triangle. How many tiles does it need?',hint:'The rows have 1, then 2, then 3 tiles. The fourth triangle adds a row of 4.',prediction:'The fourth triangle has 10 tiles. How many tiles will the fifth triangle have?',options:['11','14','15'],correct:2,result:'15 tiles: add a new row of 5 to the previous 10. Growing patterns describe how a quantity changes, not just what comes next.',concept:'Triangular numbers grow by adding the next counting number.'},
} as const;
export type DiscoveryState={value:number;aux:number;seen:number[];sequence:number[];trials:{value:number;aux:number}[]};
export const initialDiscovery=():DiscoveryState=>({value:1,aux:1,seen:[],sequence:[],trials:[]});
export function updateDiscovery(s:DiscoveryState,value:number,aux=s.aux):DiscoveryState{
 const trial={value,aux};return {...s,value,aux,seen:[...new Set([...s.seen,value])],trials:[...s.trials.slice(-29),trial]};
}
export function discoveryReady(topic:DiscoveryTopic,s:DiscoveryState){
 if(topic==='sound')return s.trials.some(a=>s.trials.some(b=>a.value!==b.value&&a.aux===b.aux))&&s.trials.some(a=>s.trials.some(b=>a.value===b.value&&a.aux!==b.aux));
 if(topic==='balance')return s.value*s.aux===6&&s.value!==3&&s.trials.some(t=>t.value*t.aux!==6);
 if(topic==='shares')return s.trials.some(t=>t.aux===4&&t.value===2)&&s.trials.some(t=>t.aux===8&&t.value===4);
 return s.value===10&&s.trials.length>0;
}
export function discoveryObservation(topic:DiscoveryTopic,s:DiscoveryState){
 if(topic==='sound')return {frequencyHz:s.value===1?220:440,amplitude:s.aux===1?'soft':'strong',trials:s.trials,visual:'slow-motion displacement illustration, not a literal sound wave in air'};
 if(topic==='balance')return {leftMassKg:3,leftDistanceM:2,rightMassKg:s.value,rightDistanceM:s.aux,leftMassDistance:6,rightMassDistance:s.value*s.aux,balanced:s.value*s.aux===6,trials:s.trials};
 if(topic==='shares')return {numerator:s.value,denominator:s.aux===1?4:s.aux,reference:'1/2',sameWhole:true,trials:s.trials};
 return {triangles:[1,3,6],proposedFourth:s.value,rule:'add the next row: +2, +3, +4, +5'};
}
export function openingBoard(_topic:Topic):BoardSketch|null{return null;}
