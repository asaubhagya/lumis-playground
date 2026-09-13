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
