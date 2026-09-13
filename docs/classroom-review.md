# Miss Lumi’s Classroom: learning review
Audience: ages 8–12. Open classroom is the primary route. Surprise tutorials teach one relationship through manipulation, observation, and a transfer question.

## Sources consulted
- PhET elementary activity design: https://phet.colorado.edu/files/guides/TeacherGuide_ActivityDesign_en.pdf
- PhET Balancing Act: https://phet.colorado.edu/en/simulations/balancing-act
- PhET Fractions Intro: https://phet.colorado.edu/en/simulations/fractions-intro
- Exploratorium Colored Shadows: https://www.exploratorium.edu/snacks/colored-shadows
- Math Learning Center visual models: https://www.mathlearningcenter.org/sites/default/files/images/Models_in_Bridges.pdf

These informed the pedagogy; code, drawings and questions are original. No external simulation or licensed artwork is embedded.

## Review and changes
| Tutorial | Weakness in previous version | Revised learning mechanism |
|---|---|---|
| Light and shadows | Target matching alone can feel like a game without explanation | Retain the four geometry challenges and predictions; teacher prompts explain ray paths and causal changes. |
| Forces and motion | Child may change several controls without a fair comparison | Retain controlled-comparison gate across force, mass and friction. Only comparable pairs qualify. |
| Sound | Two pitches did not demonstrate the difference between pitch and volume | Independently vary frequency and amplitude, listen, and compare each with the other fixed. A loud drum vs quiet whistle tests transfer. |
| Balance | Equal bead counts taught only a special case | Vary mass and lever arm. A lighter mass farther away balances 3 kg at 2 m. A new mass-distance pair tests the principle. |
| Fractions | Halves vs quarters was too shallow for the audience | Construct 2/4 and 4/8 against the SAME half-length reference; transfer to 3/6. |
| Patterns | AB shape repetition too easy for ages 8–12 | Build a growing triangular number pattern 1,3,6,10 and predict 15 by adding the next row. |

## Open classroom
- One clear explanation board, with separate GPT Image companion when helpful.
- Whiteboard is default; chalkboard remains available.
- No student drawing, camera, or device speech controls.
- Real-time GPT Live voice; quiet typed fallback.
- A specific follow-up question after substantive explanations.
- Generated historical scenes are labelled illustrations, never documentary evidence.
- Keep an explanation usable if image generation fails; explicit retry.
- Illustration requests are cancelled on topic change/leave to prevent stale images.
- Scientific relationships use deterministic math in preset tutorials; AI imagery is not an authoritative simulator.

## September 13: three carefully selected surprises

Research references (pedagogical inspiration; no third-party simulation code or art copied):
- [PhET Balancing Act](https://github.com/phetsims/balancing-act): a dedicated balance simulation, GPL-3.0. The useful learning move is to compare mass AND distance, then predict a new configuration. We implement our own lever using Rapier rather than embed its application/dependency stack.
- [IlliniOpenEdu PhysicsSims](https://github.com/IlliniOpenEdu/PhysicsSims): browser-based physics simulations; a useful reference catalogue for separating a physical model from its presentation. Candidates involving many simultaneous parameters are deferred for this age group.
- [Rapier JavaScript joints](https://rapier.rs/docs/user_guides/javascript/joints/): the selected implementation uses a 2D revolute joint, real rigid-body dynamics, gravity, damping and joint travel stops. The beam has symmetric mass and ideal loads at marked positions. Stops limit travel, not the torque equation.
- [Exploratorium Colored Shadows](https://www.exploratorium.edu/snacks/colored-shadows): prompts learners to change the light and notice what changes. Our simpler single-light experiment isolates position and distance before asking for a prediction.

The active rotation is now only **Light & Shadows, Balance, Sound**. The old force/fraction/pattern definitions remain available internally for regression coverage, but do not appear in Surprise selection. Every active tutorial requires a meaningful experiment before a transfer question; rapid clicking cannot substitute for evidence.

1. **Shadows:** move an object/light, compare size and direction, predict what removing the blocking object does. Geometric ray model; not a rigid-body simulation.
2. **Balance:** find different mass-distance pairs that balance 3 kg at 2 m; predict a new pair. Rapier computes the displayed angle at a fixed 60 Hz. Equality of moments is checked independently for grading. This is an idealised lever, not a load-bearing engineering model.
3. **Sound:** compare frequency while holding amplitude fixed, then amplitude while holding frequency fixed. Synthesised tones and a labelled slowed displacement sketch distinguish pitch from strength; the sketch is not the literal path of air particles.

Open-class explanations prefer one clean diagram, comparison or short process. Labels have dedicated lanes beneath pictures; arrows occupy the space between columns. Images default to absent, and are requested only when they add a distinct useful representation.
