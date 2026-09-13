import {openai} from './server';
import {runLearningAgent} from './agent';
// Voice remains GPT-Live-1. Only unavailable Astra reasoning falls back.
export async function teacherReasoning(instructions:string,input:string){
 try{
  const result=await runLearningAgent(instructions,input);
  return {text:result.text,source:'Agents API',model:'gpt-6-astra'};
 }catch(error){
  if(!(error instanceof Error)||!error.message.includes('model_not_found'))throw error;
  const r=await openai('responses',{model:'gpt-5.4-mini',instructions,input:'Return JSON.\n'+input,reasoning:{effort:'low'},text:{format:{type:'json_object'}},max_output_tokens:2600,store:false},20000);
  const d=await r.json() as {status?:string;output?:{content?:{type:string;text?:string}[]}[]};
  if(d.status!=='completed')throw Error('The teacher response did not complete.');
  const text=(d.output||[]).flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text||'').join('');
  return {text,source:'Responses API',model:'gpt-5.4-mini'};
 }
}
