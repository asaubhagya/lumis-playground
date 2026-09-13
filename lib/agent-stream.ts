// Kept independent of the server runtime so the event contract can be tested.
export type AgentResult = {text:string;sessionId:string};
export async function consumeAgentStream(stream:ReadableStream<Uint8Array>):Promise<AgentResult>{
 const reader=stream.getReader();const decoder=new TextDecoder();
 let buffer='',text='',sessionId='',completed=false,bytes=0;
 const event=(block:string)=>{
  const data=block.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trimStart()).join('\n');
  if(!data||data==='[DONE]')return;
  const e=JSON.parse(data);
  if(typeof e.session_id==='string')sessionId=e.session_id;
  if(typeof e.session?.id==='string')sessionId=e.session.id;
  if(e.type==='agent.session.turn.item.done'&&e.item?.role==='assistant'&&e.item?.phase==='final_answer'){
   text=(e.item.content||[]).filter((p:{type:string})=>p.type==='output_text').map((p:{text:string})=>p.text).join('');
  }
  if(e.type==='agent.session.turn.completed'&&e.turn?.subagent_id===null)completed=true;
  if(['agent.session.turn.failed','agent.session.turn.cancelled','agent.session.failed'].includes(e.type))throw Error('The learning agent could not finish.');
 };
 try{
  while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>1000000)throw Error('Agent response exceeded the size limit.');buffer+=decoder.decode(value,{stream:true}).replace(/\r\n/g,'\n');let boundary;while((boundary=buffer.indexOf('\n\n'))!==-1){event(buffer.slice(0,boundary));buffer=buffer.slice(boundary+2);}}
  buffer+=decoder.decode();if(buffer.trim())event(buffer);
  if(!completed||!text.trim())throw Error('The agent did not return a completed answer.');
  return {text,sessionId};
 }finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}
export function parseAgentJson(text:string){const cleaned=text.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,'');return JSON.parse(cleaned);}
