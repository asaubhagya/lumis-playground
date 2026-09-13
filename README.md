# Lumi’s Playground

A desktop-first full-screen science classroom for ages 5–10. Two experiences: Light & Shadows (four discoveries) and Forces & Motion (three discoveries). Original inline SVG line-art teacher. No progress bar, dashboard, or external character assets in the classroom.

## Play

`npm run dev` launches the Sites/Vinext app. Enter a classroom, drag the objects (or open Controls), experiment, then predict. Lumi gives compact, curated prompts. Wrong predictions show the outcome and return to experimentation. Discovery feedback is based on completed interactions and predictions, not a claim of expertise.

Motion compares fixed-duration pushes, mass, and surface friction. Each stage requires at least two trials that differ only in the relevant variable. The puck follows impulse F*dt and then constant frictional deceleration. Values and distances are normalized demonstration units, not a calibrated measurement. Shadow geometry uses an ideal point source and an opaque 2D silhouette; the on-screen ellipse is a display convention. Real light sources can create softer shadows.

## AI and media

- GPT Live (`gpt-live-1`): WebRTC microphone and audio; client delegation routes teaching to the Agents API. Experiment state is sent as quiet `session.thinking.append` updates with `delegation_id:null`. Spoken results use `session.commentary.append` with the delegation ID.
- Agents API (`gpt-6-astra`): `/api/teacher` reasons over state, trial evidence and conversation. It can request one bounded control change when the learner asks for help or a demonstration. The client validates controls; the teacher cannot grade or advance. This is application tool control, not general operating-system computer use.
- Astra vision: student can share an experiment SVG snapshot or a reviewed camera photo. GPT Live does not accept images directly; the vision backend returns observations. Camera preview stays local until Share with Lumi. No inference of emotion, attention or thoughts from faces.
- Image API (`gpt-image-2.5-flare`): optional decorative discovery artwork after completion. It does not generate the physics simulation.
- Device read-aloud is separately labelled and is not GPT Live.
- WebMCP tools expose visible classroom state and bounded controls for compatible browsers.

API secrets are server-only in ignored `.dev.vars` locally and Sites runtime secrets when configured. The existing key still returns `404 model_not_found` for Astra; real Live voice did not connect during this iteration. Sites has no entitled runtime key configured. Guided experiments work without AI; the interface labels Guided mode and reports connection failures. Do not present the hosted prototype as a verified live AI demo.

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

Actual verification: the configured key reaches `/v1/live/sessions` through both the direct WebSocket probe and the local browser WebRTC route, but OpenAI returns `model_not_found`: project `proj_y7OKgzOEI46t4EWgGcSWdCJ4` does not have access to `gpt-live-1`. The model docs list Tier 1 and above; no Tier 5 upgrade is required by those docs. A successful spoken session is **not** verified. No other model replaces GPT-Live-1. Platform permissions in personal Chrome remained on “Signing in…” during this check.

Run `node scripts/probe-live.cjs` after project access changes. It prints only safe diagnostics; it never prints the key. Browser checks verified the first shadow challenge, its prediction, discovery feedback, and rejection of teacher movement during a prediction. `node --test tests/*.test.mjs` covers physics gates and voice cancellation/error handling.
