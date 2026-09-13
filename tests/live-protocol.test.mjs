import {test} from 'node:test';
import assert from 'node:assert/strict';
import {withAbort,liveErrorMessage,liveContextSummary} from '../lib/live-protocol.ts';

test('cancelled microphone permission releases a stream granted after leaving',async()=>{
 const controller=new AbortController();let grant;let released=0;
 const request=withAbort(new Promise(resolve=>{grant=resolve;}),controller.signal,stream=>stream.stop());
 controller.abort();await assert.rejects(request,{name:'AbortError'});
 grant({stop(){released++;}});await new Promise(resolve=>setImmediate(resolve));
 assert.equal(released,1);
});

test('connection deadline rejects a permission request that never settles',async()=>{
 const controller=new AbortController();const pending=withAbort(new Promise(()=>{}),controller.signal);
 controller.abort(new DOMException('Timed out','TimeoutError'));
 await assert.rejects(pending,{name:'TimeoutError'});
});

test('successful microphone acquisition is not released by later handshake cancellation',async()=>{
 const controller=new AbortController();let released=false;const stream={};
 assert.equal(await withAbort(Promise.resolve(stream),controller.signal,()=>{released=true;}),stream);
 controller.abort();assert.equal(released,false);
});

test('voice diagnostics distinguish denied microphone from project access and timeout',()=>{
 assert.match(liveErrorMessage(new DOMException('Denied','NotAllowedError')),/Allow microphone/);
 assert.match(liveErrorMessage(new DOMException('Pending','TimeoutError')),/too long/);
 const access='GPT-Live-1 is not enabled for this API project.';
 assert.equal(liveErrorMessage(new Error(access)),access);
 assert.doesNotMatch(liveErrorMessage(new Error('internal private error')),/internal private/);
});


test('a complex board cannot overflow a live context update',()=>{
 const summary=liveContextSummary({mode:'open',topic:'shadows',phase:'play',age:'8–12',goal:'Explain seasons',board:{title:'Earth’s tilt',note:'Tilt changes the sunlight angle',elements:Array.from({length:40},()=>({type:'stroke',points:Array.from({length:80},(_,i)=>[i,i])}))}});
 assert.ok(summary.length<1000);
 assert.match(summary,/Earth’s tilt/);
 assert.doesNotMatch(summary,/elements|points/);
});
