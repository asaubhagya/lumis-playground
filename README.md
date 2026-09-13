# Pip’s Playground

A Sites-hosted prototype for ages 5–10: an original toy robot, one continuous shadow workshop, and four connected discoveries. Entry points: `/` (Pip) and `/heat` (the earlier Heat Transfer lab, retained as an early module).

## Play loop

Move the opaque ball or point lamp with drag, touch, or labelled arrow buttons. Match a target, predict a changed setup, and observe the result. Wrong predictions show the experiment and offer a retry. The final level combines size and position and asks the learner to explain the cause. No model can grade, reveal internal answers, or unlock a level through the exposed actions.

The 5–7 band uses shorter instructions; 8–10 uses fuller prompts. The speaker uses device speech synthesis and is labelled read-aloud. Live voice is a separate GPT Live WebRTC connection. Progress is session-only and replay resets the journey.

## Science model

`lib/shadows.ts` models a 2D cross-section of a point light, opaque circular silhouette and fixed screen. Projection uses similar triangles: magnification = light-to-screen distance / light-to-object distance. Shadow position is projected along straight rays through the object edges. The screen ellipse is a display convention for the side view. Real flashlights have extended sources and can form penumbras; this is not a calibrated physical simulation.

The four prerequisites are blocking light, distance and shadow size, light position and shadow direction, then transfer to a different arrangement. Discoveries record actions plus predictions, not proof of expertise. The final explanation is a recognition task, not free-response assessment. Useful reference: [PhET Bending Light](https://phet.colorado.edu/en/simulations/bending-light) and the existing primary science references under the parent `docs/research` folder.

## AI integration and current limitation

- `/api/plan`: Astra Agents API produces four age-adapted thinking prompts for the guide. The exact on-screen goals, sequence and gating remain curated and fixed.
- `/api/coach`: Astra Agents API reasons over topic, challenge, scene, phase, attempts, and recent conversation. Photos first use Astra Responses for visual observations.
- `/api/live`: GPT Live (`gpt-live-1`) with WebRTC and client delegation to the coach. Explicit movement commands use the same bounded controls as the UI.
- `/api/image`: `gpt-image-2.5-flare` creates an optional decorative workshop poster. It never renders the physics model.
- WebMCP: read workshop state or move a toy one step. No grading/advance tools.

Existing server routes accept `topic: "shadows"`; omitted topic retains Heat Transfer compatibility. Secrets never belong in client code. `.dev.vars` is ignored.

**Verified 2026-09-13:** the local project key authenticates but Astra Agents calls still return `404 model_not_found`. Image generation was rechecked and returns `403 model_not_found`. Hosted runtime has no API secret configured. Thus hosted puzzles, original generated Pip artwork, device read-aloud and camera capture work independently; live coach, voice, photo understanding and runtime image generation are unavailable. No substitute model is silently used. To enable them, provide an appropriately entitled project key as the Sites `OPENAI_API_KEY` secret and redeploy, then verify each endpoint and live audio end-to-end.

Camera permission is requested only from the completion activity. Capture is local; only “Discuss my photo” sends it for analysis. Camera/voice tracks close on cancellation, navigation, and stale connection completion. No learner uploads are persisted by the app.

## Assets

`public/pip-robot.png`: original generated artwork, created for this prototype. The workshop and scientific diagrams are deterministic SVG/CSS. `public/ice-lab.png` belongs to the earlier heat module. No Disney or other franchise assets were used.

## Validation

Run `node --experimental-strip-types --test tests/*.test.mjs` and `./node_modules/.bin/tsc --noEmit`. The Sites build and packaging helpers create the deployment. Tests cover projection relationships, reachable goals, invalid inputs, bounds, explicit-command parsing, heat gates and Agents stream completion. Browser validation covers the four-level journey, wrong-answer recovery, drag/tap controls, final explanation, responsive layout and unavailable-service messages.
