import {openai} from './server';
import {consumeAgentStream} from './agent-stream';
export async function runLearningAgent(instructions:string,input:string){
 const upstream=await openai('agents/sessions',{agent:{model:'gpt-6-astra',instructions},environment:{type:'openai_hosted'},input,stream:true},90000,{'OpenAI-Beta':'agents=v1'});
 if(!upstream.body)throw Error('The agent stream is unavailable.');
 return consumeAgentStream(upstream.body);
}
