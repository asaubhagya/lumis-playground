// Real API smoke test: silent microphone input, Miss Lumi's spoken greeting.
// The output is generated speech only, never a recording of the user's mic.
const fs=require('node:fs');
const WebSocket=require('ws');
async function main(){
 const {lumiLiveInstructions,greetingInstruction}=await import('../lib/live-protocol.ts');
 const key=fs.readFileSync('.dev.vars','utf8').match(/^OPENAI_API_KEY=["']?([^\s"']+)/m)?.[1];
 if(!key)throw Error('No local key configured');
 const socket=new WebSocket('wss://api.openai.com/v1/live/sessions',{headers:{Authorization:`Bearer ${key}`}});
 let inputTimer,quietTimer,closing=false,transcript='',requestId='';const audio=[];
 const send=event=>{if(socket.readyState===1)socket.send(JSON.stringify(event));};
 const close=()=>{if(closing)return;closing=true;clearInterval(inputTimer);clearTimeout(quietTimer);send({type:'session.close'});setTimeout(()=>socket.close(),2000).unref();};
 const deadline=setTimeout(close,45000);
 socket.on('upgrade',r=>{requestId=r.headers['x-request-id'];});
 socket.on('open',()=>send({type:'session.start',session:{model:'gpt-live-1',instructions:lumiLiveInstructions,audio:{format:{type:'audio/pcm',rate:24000},output:{voice:'marin'}},delegation:{type:'client'}}}));
 socket.on('message',raw=>{
  const event=JSON.parse(raw);
  if(event.type==='session.started'){
   console.log('GPT-Live-1 session started.');
   inputTimer=setInterval(()=>send({type:'session.input_audio.append',audio:Buffer.alloc(960).toString('base64')}),20);
   send({type:'session.thinking.append',delegation_id:null,content:JSON.stringify({topic:'shadows',level:0,phase:'play',goal:'Move the ball into the light.',scene:{objectX:440,objectY:410,lampY:250},hint:'Watch the screen while you move the ball across the light.'})});
   send({type:'session.instructions.append',event_id:'welcome',delegation_id:null,content:greetingInstruction('Move the ball into the light.')});
  }
  if(event.type==='session.instructions.appended'&&event.client_event_id==='welcome')send({type:'session.commentary.append',delegation_id:null,content:'Begin the conversation now, following the welcome instructions.'});
  if(event.type==='session.output_audio.delta'){audio.push(Buffer.from(event.delta,'base64'));clearTimeout(quietTimer);quietTimer=setTimeout(close,4000);}
  if(event.type==='session.output_transcript.delta'){transcript+=event.delta;}
  if(event.type==='error'){console.log(JSON.stringify({error:event.error,requestId}));close();}
  if(event.type==='session.closed')socket.close();
 });
 socket.on('error',e=>console.log(e.message.replaceAll(key,'[REDACTED]')));
 socket.on('close',()=>{
  clearInterval(inputTimer);clearTimeout(quietTimer);clearTimeout(deadline);
  const pcm=Buffer.concat(audio);let energy=0;for(let i=0;i+1<pcm.length;i+=2)energy+=(pcm.readInt16LE(i)/32768)**2;
  const rms=pcm.length?Math.sqrt(energy/(pcm.length/2)):0;
  if(pcm.length){const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(36+pcm.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(24000,24);h.writeUInt32LE(48000,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);fs.writeFileSync('/private/tmp/lumi-live-greeting.wav',Buffer.concat([h,pcm]));}
  console.log(JSON.stringify({requestId,transcript,audioSeconds:pcm.length/48000,rms,hasSpeechAudio:pcm.length>0&&rms>.001}));
  if(!pcm.length||!transcript.trim()||rms<.001)process.exitCode=1;
 });
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
