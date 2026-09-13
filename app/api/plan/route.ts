import {fail,requestBody} from '@/lib/server';
import {shadowContract,shadowLevels} from '@/lib/shadows';
import {scienceContract} from '@/lib/learning';
import {runLearningAgent} from '@/lib/agent';
import {parseAgentJson} from '@/lib/agent-stream';
export async function POST(r:Request){try{
 const d=await requestBody(r);
 const isShadow=d.topic==='shadows';
 const result=await runLearningAgent((isShadow?shadowContract:scienceContract)+' You are the learning-map planner. Return only JSON with title (string) and prompts (array of exactly four short learner-facing challenge prompts). Preserve the required level order and never include the answers. No tools, files or browsing needed.',`Create a four-step ${isShadow?'light-and-shadow workshop':'heat-transfer discovery map'} for ages ${d.age==='5–7'?'5–7':'8–10'}. Each prompt must be under 20 words. ${isShadow?'Use only these exact implemented goals and permitted controls: '+JSON.stringify(shadowLevels.map(l=>({goal:l.goal,control:l.control})))+' Phrase each as a curious question about the stated action; do not introduce extra tasks, shapes, tools or controls.':''}`);
 const plan=parseAgentJson(result.text);
 if(typeof plan.title!=='string'||!Array.isArray(plan.prompts)||plan.prompts.length!==4||plan.prompts.some((p:unknown)=>typeof p!=='string'||p.length>250))throw Error('Learning map validation failed.');
 return Response.json({...plan,source:'Agents API',sessionId:result.sessionId});
 }catch(e){return fail(e);}}
