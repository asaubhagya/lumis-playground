# Aha! — ten-minute science lab

Browser prototype for ages 5–10. Heat & temperature is the complete module. Light & shadows is visibly marked as the next module, not a working game.

## Run

Run `npm run dev` from this directory. The Sites/Vinext starter reads `OPENAI_API_KEY` from ignored `.dev.vars`. Never commit that file. Configure the same key as a secret in Sites for deployment. `npm run build` produces the Cloudflare Worker application.

## Learning contract

The four required discoveries are heat direction, insulation, transfer to a warm drink, and an everyday-object application. Predictions unlock levels only after app-side checks. The insulation level also requires running the successful experiment. Incorrect attempts trigger progressively more concrete hints. The discovery map records completed concepts and observed answers; it does not certify mastery.

The ice simulation is qualitative and accelerated. Displayed percentages are illustrative model output, not experimentally measured melting rates. It fixes cube amount and environment, comparing a thick dry wool wrap, no wrap, and a thin contacting metal shell. Do not generalize the metal ranking to arbitrary containers or thicknesses.

## API integration

- `/api/plan`: Agents API beta, `gpt-6-astra`, creates and validates four short age-adjusted map prompts. Uses completed final-answer item events plus root turn completion. Curated map remains available on failure.
- `/api/coach`: Responses API, `gpt-6-astra`, short grounded hints and optional image understanding. Learner answers never control grading through the model.
- `/api/live`: GPT-Live-1 WebRTC session, client delegation back to the Astra coach. Voice guides the learner; the canvas is operated by the learner. This is not autonomous computer use.
- `/api/image`: GPT Image 2.5 Flare, creates an everyday-object illustration on request. Simulation geometry remains deterministic.
- `/api/status`: exposes configuration presence, never key values.

WebMCP tools expose read state, configure material, and run experiment. They cannot submit answers or unlock levels. These are structured browser actions, not a claim that the runtime uses a computer-use model.

## Verification and current limitation

TypeScript check and three learning/simulation contract tests pass. Browser checks cover a wrong prediction, success gating, all four levels, final recap, mouse-drawn prediction, mobile layout and age mode, and WebMCP valid/invalid input. Camera reached a review state; no captured personal photo was sent for testing. Voice playback is not verified.

On 2026-09-13 a newly created key in the selected Personal / Default project authenticated but had no access to `gpt-6-astra`, `gpt-live-1`, or `gpt-image-2.5-flare`. Astra and Image requests returned 403 model_not_found; Agents returned 404 model_not_found. Available model IDs were older GPT models. Billing credits alone did not establish model access. The exact requested models are retained; no silent substitution. API end-to-end success remains blocked on the hackathon project/model entitlement.

## Assets

`public/ice-lab.png` was generated with the built-in Image Gen tool. Prompt: translucent blue ice cube on an orange circular laboratory tray, condensation droplets, deep navy background, tactile glass/clay 3D editorial style, square composition, no text, people, or characters. The generated image is topic art, not scientific measurement.

Design references and API source links are in the parent repository's `docs/research/` folder.
