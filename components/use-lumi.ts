import {useEffect,useRef,useState} from 'react';
import {greetingInstruction,liveErrorMessage,withAbort} from '@/lib/live-protocol';
import {BoardSketch} from '@/lib/teaching-board';
import {shadowCommand} from '@/lib/shadows';
export type TeacherAction={target:string;direction?:string;value?:number};
export function useLumi(context:Record<string,unknown>,act:(a:TeacherAction)=>string,draw:(b:BoardSketch)=>void){
 const [voice,setVoice]=useState<'off'|'connecting'|'on'>('off'),[caption,setCaption]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[speaking,setSpeaking]=useState(false),[muted,setMuted]=useState(false);
 const pc=useRef<RTCPeerConnection|null>(null),dc=useRef<RTCDataChannel|null>(null),mic=useRef<MediaStream|null>(null),audio=useRef<HTMLAudioElement|null>(null),meter=useRef<AudioContext|null>(null),meterFrame=useRef(0),startup=useRef<AbortController|null>(null),ready=useRef(false),epoch=useRef(0),history=useRef<{role:string;text:string}[]>([]),current=useRef(context),action=useRef(act),board=useRef(draw),input=useRef(''),output=useRef(''),lastOutputEnd=useRef(0),requestId=useRef(0),teacherRequest=useRef<AbortController|null>(null);
 current.current=context;action.current=act;board.current=draw;
 function send(type:string,content:string,delegation_id:string|null=null,event_id=crypto.randomUUID()){
  if(ready.current&&dc.current?.readyState==='open')dc.current.send(JSON.stringify({type,event_id,delegation_id,content}));
  return event_id;
 }
 function stop(){
  epoch.current++;startup.current?.abort();startup.current=null;ready.current=false;
  const channel=dc.current,p=pc.current;dc.current=null;pc.current=null;
  if(p)p.onconnectionstatechange=null;
  if(channel?.readyState==='open'){
   // Close the server session before disposing of its transport.
   const finish=()=>{channel.close();p?.close();};
   const deadline=setTimeout(finish,1500);
   channel.onmessage=e=>{try{if(JSON.parse(e.data).type==='session.closed'){clearTimeout(deadline);finish();}}catch{}};
   channel.send(JSON.stringify({type:'session.close'}));
  }else{channel?.close();p?.close();}
  mic.current?.getTracks().forEach(t=>t.stop());mic.current=null;
  if(audio.current){audio.current.pause();audio.current.srcObject=null;audio.current=null;}
  cancelAnimationFrame(meterFrame.current);void meter.current?.close();meter.current=null;
  setVoice('off');setSpeaking(false);setMuted(false);
 }
 async function ask(question:string,image?:string){
  const id=++requestId.current;teacherRequest.current?.abort();const controller=new AbortController();teacherRequest.current=controller;
  const deadline=setTimeout(()=>controller.abort(),45000);setBusy(true);
  try{
   const r=await fetch('/api/teacher',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,image,context:current.current,history:history.current.slice(-8)}),signal:controller.signal});
   const d=await r.json() as {error?:string;text:string;action?:TeacherAction;board?:BoardSketch};
   if(!r.ok)throw Error(d.error);if(id!==requestId.current)return '';
   setNotice('');if(d.board&&current.current.phase==='play')board.current(d.board);let text=d.text;if(d.action)text+=` ${action.current(d.action)}`;
   history.current.push({role:'student',text:question},{role:'teacher',text});setCaption(text);return text;
  }catch{if(id===requestId.current)setNotice('The teacher’s thinking connection is unavailable. You can still try the experiment.');return '';}
  finally{clearTimeout(deadline);if(id===requestId.current)setBusy(false);}
 }
 function toggleMute(){
  if(voice!=='on')return;
  const next=!muted;mic.current?.getAudioTracks().forEach(t=>{t.enabled=!next;});
  if(dc.current?.readyState==='open')dc.current.send(JSON.stringify({type:next?'session.input_audio.mute':'session.input_audio.unmute'}));
  setMuted(next);
 }
 async function start(restart=false){
  if(restart)stop();
  if(!restart&&(startup.current||voice!=='off')){stop();return;}
  const id=++epoch.current,controller=new AbortController();startup.current=controller;
  const deadline=setTimeout(()=>controller.abort(new DOMException('Connection timed out','TimeoutError')),35000);
  setVoice('connecting');setNotice('');input.current='';output.current='';lastOutputEnd.current=0;
  try{
   // Resume from the entry-button gesture; the meter follows actual remote audio.
   try{meter.current=new AudioContext();void meter.current.resume();}catch{}
   const status=await fetch('/api/status',{signal:controller.signal}).then(r=>r.json()) as {configured:boolean};
   if(!status.configured)throw Error('Live teacher needs an API connection.');
   const stream=await withAbort(navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}}),controller.signal,s=>s.getTracks().forEach(t=>t.stop()));
   if(id!==epoch.current){stream.getTracks().forEach(t=>t.stop());return;}mic.current=stream;
   const p=new RTCPeerConnection();pc.current=p;const a=new Audio();a.autoplay=true;audio.current=a;
   p.ontrack=e=>{
    if(id!==epoch.current)return;const remote=e.streams[0]??new MediaStream([e.track]);a.srcObject=remote;
    void a.play().catch(()=>setNotice('Tap Miss Lumi to enable her voice.'));
    const c=meter.current;if(!c)return;
    const analyser=c.createAnalyser();analyser.fftSize=256;c.createMediaStreamSource(remote).connect(analyser);
    const samples=new Uint8Array(analyser.fftSize);let last=false,lastFrame=0;
    const read=(now:number)=>{if(id!==epoch.current)return;if(now-lastFrame>70){lastFrame=now;analyser.getByteTimeDomainData(samples);const active=!a.paused&&samples.some(v=>Math.abs(v-128)>4);if(active!==last){last=active;setSpeaking(active);}}meterFrame.current=requestAnimationFrame(read);};
    meterFrame.current=requestAnimationFrame(read);
   };
   stream.getTracks().forEach(t=>p.addTrack(t,stream));
   const channel=p.createDataChannel('oai-events');dc.current=channel;const seen=new Set<string>();
   let resolveStarted:()=>void=()=>{};
   const started=new Promise<void>(resolve=>{resolveStarted=resolve;});
   let greetingEvent='';
   channel.onmessage=async e=>{
    if(id!==epoch.current)return;
    try{
     const v=JSON.parse(e.data);
     if(v.type==='session.started'){
      ready.current=true;setVoice('on');resolveStarted();
      send('session.thinking.append',JSON.stringify(current.current));
      greetingEvent=send('session.instructions.append',greetingInstruction(current.current.goal));
     }
     if(v.type==='session.instructions.appended'&&v.client_event_id===greetingEvent){greetingEvent='';send('session.commentary.append','Begin the conversation now, following the welcome instructions.');}
     if(v.type==='session.closed'){stop();return;}
     if(v.type==='error'){setNotice(v.error?.code==='model_not_found'?'GPT-Live-1 is not enabled for this API project.':'Miss Lumi’s voice connection reported an error. Tap to retry.');stop();return;}
     if(v.type==='session.input_transcript.delta'){
      input.current=(input.current+(typeof v.delta==='string'?v.delta:'')).slice(-2000);output.current='';
     }
     if(v.type==='session.output_transcript.delta'){
      if(typeof v.start_ms==='number'&&v.start_ms-lastOutputEnd.current>1800)output.current='';
      lastOutputEnd.current=v.end_ms??lastOutputEnd.current;
      output.current=(output.current+(typeof v.delta==='string'?v.delta:'')).slice(-700);setCaption(output.current);
     }
     if(v.type==='session.delegation.created'&&v.delegation?.target==='client'&&v.delegation?.id&&!seen.has(v.delegation.id)){
      seen.add(v.delegation.id);const q=input.current||'Help me with the current experiment.';input.current='';
      const command=current.current.topic==='shadows'?shadowCommand(q):null;
      const text=command?action.current(command):await ask(q);
      if(id===epoch.current)send('session.commentary.append',text||`The reasoning service is unavailable. Offer this safe experiment hint without claiming a result: ${String(current.current.hint||current.current.goal)}`,v.delegation.id);
     }
    }catch{setNotice('Voice could not process an update.');}
   };
   p.onconnectionstatechange=()=>{if(pc.current===p&&['failed','disconnected'].includes(p.connectionState)){setNotice('Voice disconnected. Tap to reconnect.');stop();}};
   channel.onclose=()=>{if(id===epoch.current){setNotice('Voice disconnected. Tap to reconnect.');stop();}};
   await p.setLocalDescription(await p.createOffer());
   await withAbort(new Promise<void>(resolve=>{
    if(p.iceGatheringState==='complete')return resolve();
    const done=()=>{clearTimeout(t);p.removeEventListener('icegatheringstatechange',changed);resolve();};
    const changed=()=>{if(p.iceGatheringState==='complete')done();};
    const t=setTimeout(done,2500);p.addEventListener('icegatheringstatechange',changed);
   }),controller.signal);
   const r=await fetch('/api/live',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({classroom:true,topic:current.current.topic,level:current.current.level,sdp:p.localDescription?.sdp,age:current.current.age}),signal:controller.signal});
   const d=await r.json() as {error?:string;transport?:{sdp:string}};
   if(!r.ok)throw Error(d.error);if(id!==epoch.current)return;
   if(!d.transport?.sdp)throw Error('Invalid voice answer');
   await p.setRemoteDescription({type:'answer',sdp:d.transport.sdp});
   await withAbort(started,controller.signal);
  }catch(e){if(id===epoch.current){stop();setNotice(liveErrorMessage(e));}}
  finally{clearTimeout(deadline);if(startup.current===controller)startup.current=null;}
 }
 function clear(){requestId.current++;teacherRequest.current?.abort();history.current=[];input.current='';output.current='';setCaption('');setBusy(false);setNotice('');}
 useEffect(()=>{const t=setTimeout(()=>send('session.thinking.append',JSON.stringify(context)),500);return()=>clearTimeout(t);},[JSON.stringify(context)]);
 useEffect(()=>()=>{requestId.current++;teacherRequest.current?.abort();stop();},[]);
 function resumeAudio(){void meter.current?.resume();void audio.current?.play().catch(()=>setNotice('Audio could not start. Try reconnecting voice.'));}
 return {resumeAudio,voice,caption,notice,busy,speaking,muted,toggleMute,start,stop,ask,clear,setCaption,setNotice,announce:(text:string)=>send('session.commentary.append',text)};
}
