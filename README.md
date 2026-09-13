# Lumi’s Playground

A desktop-first full-screen science classroom for ages 5–7. The demo is Light & Shadows (four discoveries). Forces & Motion remains in source for future exploration. Original inline SVG line-art teacher. No progress bar, dashboard, or external character assets in the classroom.

## Play

`npm run dev` launches the Sites/Vinext app. Enter a classroom, drag the objects (or open Controls), experiment, then predict. Lumi gives compact, curated prompts. Wrong predictions show the outcome and return to experimentation. Discovery feedback is based on completed interactions and predictions, not a claim of expertise.

Motion compares fixed-duration pushes, mass, and surface friction. Each stage requires at least two trials that differ only in the relevant variable. The puck follows impulse F*dt and then constant frictional deceleration. Values and distances are normalized demonstration units, not a calibrated measurement. Shadow geometry uses an ideal point source and an opaque 2D silhouette; the on-screen ellipse is a display convention. Real light sources can create softer shadows.

## AI and media

- GPT Live (`gpt-live-1`): WebRTC microphone and audio; client delegation routes teaching to the server reasoning backend. Experiment state is sent as quiet `session.thinking.append` updates with `delegation_id:null`. Spoken results use `session.commentary.append` with the delegation ID.
- Agents API (`gpt-6-astra`): `/api/teacher` reasons over state, trial evidence and conversation. It can request one bounded control change when the learner asks for help or a demonstration. The client validates controls; the teacher cannot grade or advance. This is application tool control, not general operating-system computer use.
- Vision (`gpt-5.4-mini`): student can share an experiment SVG snapshot or a reviewed camera photo. GPT Live does not accept images directly; the vision backend returns observations. Camera preview stays local until Share with Lumi. No inference of emotion, attention or thoughts from faces.
- Image API (`gpt-image-2.5-flare`): optional decorative discovery artwork after completion. It does not generate the physics simulation.
- Device read-aloud is separately labelled and is not GPT Live.
- WebMCP tools expose visible classroom state and bounded controls for compatible browsers.

API secrets are server-only in ignored `.dev.vars` locally and Sites runtime secrets. GPT-Live-1 is verified connected, producing speech in both a real WebSocket session and the deployed WebRTC classroom. Project model allowlisting and a new key after that change resolved the access issue; no tier upgrade was needed. Astra still returns `model_not_found`, so teacher reasoning falls back to the already-allowed GPT-5.4-mini Responses API. Voice always remains GPT-Live-1. Optional Image 2.5 generation is not yet verified with the current allowlist.

Microphone and camera require browser permission. Leaving the classroom stops tracks, closes voice, cancels animation and pending replies. Progress and captured images are session-only. The older Heat lab remains at `/heat` but is not part of the new navigation.

## Verification

`node --test tests/*.test.mjs` validates stream handling, progression and physics relationships, including controlled motion comparisons. `./node_modules/.bin/tsc --noEmit` checks types. Build with the Sites hosting helper.

Official API contracts: https://developers.openai.com/api/docs/guides/live-delegation and https://developers.openai.com/api/docs/guides/agents-api/quickstart.

Desktop refinement: entering attempts Live voice automatically. A connected session persists across discoveries and sends bounded proactive observation requests after completed experiments. Pointer light, ambient dust, gaze tracking, arrow-key shadow controls (last selected toy), and Space to push complement dragging. Reduced motion disables atmosphere movement. Offline status is explicit.

Current demo scope: one homepage entry, ages 5–7, Light & Shadows only, taught by Miss Lumi. Motion remains in the source but is not offered in the demo.


### Miss Lumi voice verification (13 September 2026)

The home invitation is “A classroom for tiny curious minds.” Entry starts a quiet, user-initiated Web Audio chime and a brief wake-up animation. Sound effects have a separate mute control. The live face animation measures returned audio, independently of decorative entry motion.

The browser uses GPT-Live-1 over WebRTC with the server-held Sites secret. It waits for `session.started`, sends a fresh English greeting through `session.instructions.append`, and waits for the matching acknowledgment before prompting the welcome. Experiment state is sent through thinking updates; explicit movement requests execute a bounded app control and cannot grade or advance. Pending microphone requests time out and release streams granted after cancellation. Mic mute preserves the ongoing connection. Leaving stops tracks and closes the server session.

Official references: [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live), [greeting before the caller speaks](https://developers.openai.com/api/docs/guides/live-conversations#greet-before-the-caller-speaks), [Live prompting](https://developers.openai.com/api/docs/guides/live-prompting), [model availability](https://developers.openai.com/api/docs/models/gpt-live-1).

Actual verification: GPT-Live-1 produced “Hi, I’m Miss Lumi! Can you try moving the ball into the light?” and non-silent PCM audio. The deployed browser connected with its microphone and returned live speech captions. The teacher endpoint returns real, grounded GPT-5.4-mini reasoning and a structured chalkboard sketch when helpful.

Run `node scripts/probe-live.cjs` after project access changes. It prints only safe diagnostics; it never prints the key. Browser checks verified the first shadow challenge, its prediction, discovery feedback, and rejection of teacher movement during a prediction. `node --test tests/*.test.mjs` covers physics gates and voice cancellation/error handling.


### Chalkboard

Miss Lumi can draw when asked verbally, through a typed question, or using the small pen button. The reasoning model composes a fresh drawing from freeform strokes, arrows, ellipses and handwritten labels on a 440 × 260 canvas. There are no preset diagrams. SVG chalk strokes and handwriting reveal progressively with a quiet synthesized chalk sound. The sound-effects mute includes chalk. The board is dismissible and clears before predictions; the server and client both reject new board content outside experimentation. The renderer supports arbitrary foundational explanations; the teacher connects them to the current lesson. Server and client validate primitive types, finite coordinates, point counts and text lengths. No generated code, HTML, SVG markup or external assets execute. Text is rendered as text, never HTML.
