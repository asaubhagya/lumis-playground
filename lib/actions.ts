import type {Material} from './learning';
export type LabAction={type:'set_material';material:Material}|{type:'run_experiment'}|{type:'show_map'}|{type:'none'};
export function validateAction(value:unknown):LabAction{
 if(!value||typeof value!=='object')return {type:'none'};
 const a=value as Record<string,unknown>;
 if(a.type==='set_material'&&['bare','metal','wool'].includes(String(a.material)))return {type:'set_material',material:a.material as Material};
 if(a.type==='run_experiment'||a.type==='show_map')return {type:a.type};
 return {type:'none'};
}
// A model cannot invent consent to operate the experiment. Match the learner's
// explicit command as well as checking the current level at the call site.
export function requestedAction(text:string):LabAction{
 const q=text.toLowerCase();
 if(/\b(show|open)\b.{0,25}\b(map|discoveries|progress)\b/.test(q))return {type:'show_map'};
 if(/\b(run|start|test|try)\b.{0,20}\b(experiment|test|simulation|it)\b/.test(q))return {type:'run_experiment'};
 if(/\b(use|choose|select|wrap|switch|put|try)\b/.test(q)){
  if(/\bwool\b/.test(q))return {type:'set_material',material:'wool'};
  if(/\bmetal\b/.test(q))return {type:'set_material',material:'metal'};
  if(/\b(no wrap|uncovered|bare)\b/.test(q))return {type:'set_material',material:'bare'};
 }
 return {type:'none'};
}
