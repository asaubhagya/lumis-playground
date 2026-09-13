import {LIVE_MODEL,lumiLiveInstructions} from '@/lib/live-protocol';
import {fail,openai,requestBody} from '@/lib/server';
import {shadowContract,shadowLevels} from '@/lib/shadows';
import {levels,scienceContract} from '@/lib/learning';
export async function POST(r:Request){try{
 const d=await requestBody(r,60000);
 if(typeof d.sdp!=='string'||!d.sdp.startsWith('v=0')||!Number.isInteger(d.level)||d.level<0||d.level>3)return Response.json({error:'Invalid voice session.'},{status:400});
 const contract=d.classroom?lumiLiveInstructions:d.topic==='shadows'?shadowContract:scienceContract;
 const challenge=d.classroom?'Use the current classroom state supplied through thinking updates.':d.topic==='shadows'?shadowLevels[d.level].goal:levels[d.level].question;
 const controls=d.classroom?'You can delegate a student request for a small control change. Shadows: ball movement or lamp height. Forces: push strength, puck mass, surface, or push. Wait for the application result before claiming movement.':d.topic==='shadows'?'Delegate explicit ball/lamp movement commands.':'Delegate explicit requests to select a material or run an experiment.';
 const upstream=await openai('live/sessions',{session:{model:LIVE_MODEL,audio:{output:{voice:'marin'}},instructions:contract+` Speak warmly to a child aged ${d.age==='5–7'?'5 to 7':'8 to 10'}. One short sentence at a time; listen to interruptions. Current challenge: ${challenge} ${controls} Delegate only reasoning or control changes that require backend help. Never answer predictions or unlock discoveries. Do not claim you see the camera unless vision observations were supplied.`,delegation:{type:'client'}},transport:{type:'webrtc',sdp:d.sdp}},25000);
 return Response.json(await upstream.json());
 }catch(e){return fail(e);}}
