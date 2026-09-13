import {fail,requestBody} from '@/lib/server';
import {scienceContract} from '@/lib/learning';
import {runLearningAgent} from '@/lib/agent';
import {parseAgentJson} from '@/lib/agent-stream';
export async function POST(r:Request){try{
 const d=await requestBody(r);
 const result=await runLearningAgent(scienceContract+' You are the learning-map planner. Return only JSON with title (string) and prompts (array of exactly four short learner-facing challenge prompts). Preserve the required level order and never include the answers. No tools, files or browsing needed.',`Create a four-step heat-transfer discovery map for ages ${d.age==='5–7'?'5–7':'8–10'}. Each prompt must be under 20 words.`);
 const plan=parseAgentJson(result.text);
 if(typeof plan.title!=='string'||!Array.isArray(plan.prompts)||plan.prompts.length!==4||plan.prompts.some((p:unknown)=>typeof p!=='string'||p.length>250))throw Error('Learning map validation failed.');
 return Response.json({...plan,source:'Agents API',sessionId:result.sessionId});
 }catch(e){return fail(e);}}
