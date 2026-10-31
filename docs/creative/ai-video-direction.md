# AI video page: creative direction v1

Branch: ai-video-rethink (worktree C:\Users\ruben\Downloads\studio26\site-ai-video).
Author: Claude, 31 Oct 2026, from Ruben's brief: rebuild everything to Awwwards
standard; copy, content, demos and scaffold are all open to change.
Production media lives outside git in C:\Users\ruben\Downloads\studio26\production\ai-video.

## 1. The idea

**The page is the scroll it sells to.** Studio26 ads are made to stop a thumb in
the first half-second, so the page performs that moment instead of describing it.

Acceptance bar (from build-awwwards-quality-sites and the plan): one signature
moment, everything else supports it; the first viewport is complete as a static
frame; native scroll; reduced motion gets final states; no fake claims; all work
labelled "Concept work, invented brands".

## 2. Page structure

| # | Section | What happens | Reduced motion / no JS |
|---|---|---|---|
| 1 | The feed (signature) | A phone sits centre-stage with a vertical feed. Scrolling moves the feed. At each ad the feed stops and the ad breaks out of the phone into full-bleed cinema (GSAP ScrollTrigger + Flip, short pin, native scroll). | Static grid of four posters with play buttons |
| 2 | See the layers | One spot is pulled apart: raw AI shot, grade, type, captions, platform safe zones. Visitor scrubs a slider or scroll through the layers. | Five static frames in a row |
| 3 | One ad, every format | The same ad morphs live between 9:16, 4:5 and 16:9 on toggle. | Three static frames side by side |
| 4 | Your offer, as an ad | Visitor types business and offer; the brand system typesets it over a real looping clip. Light (target under 40 KB JS). | Example frame with sample text |
| 5 | The offer | What you get, process in four beats, price and turnaround (Ruben to set). | Same |
| 6 | Call to action | One action: book a call. | Same |

Visual system: homepage tokens (Paper #e8e6e2, Ink #171a1c, Cobalt #173fc5,
Mid #505459), Instrument Sans, generous whitespace around the work.

## 3. Copy direction

Voice: short, plain, confident. Proof sells; no "AI-powered", "revolutionary",
"unlock". UK spelling.

Hero headline options:
- A. Ads that stop the scroll.
- B. Made for the half-second.
- C. Stop. Watch. Book.
Sub: Fifteen-second films for Reels, TikTok, Shorts and YouTube, made with AI,
3D and motion design, finished by hand.

Section lines (drafts):
- Layers: "Generated in seconds. Finished by people who care."
- Formats: "One ad. Every screen."
- Demo: "Type your offer. See it as an ad."
- CTA: "Have an offer worth stopping for?"

## 4. The four flagship spots (invented brands, labelled concept work)

Every spot: 15 s master, 6 s cut-down, 9:16, 4:5 and 16:9, burnt-in captions
version, poster frame, sound-off readable. Music from a free licensed library;
no voice-over in v1.

### Spot A: Maison Filaos (boutique hotel), cinematic AI film
Mood: slow, warm, sensory. Palette: dawn gold, lagoon turquoise, linen white.
| Time | Shot | Source |
|---|---|---|
| 0.0 to 2.0 | Macro: sunlight breaks across rippling lagoon water | Flow A1 |
| 2.0 to 5.0 | Slow push-in: linen curtain lifts in the breeze, lagoon beyond | Flow A2 |
| 5.0 to 8.0 | Overhead: wooden pontoon over clear water, a lone figure walking | Flow A3 |
| 8.0 to 11.0 | Close: coffee poured into a ceramic cup on a terrace, sea behind | Flow A4 |
| 11.0 to 15.0 | Wide: villa terrace at golden sunrise; type "Wake up somewhere else." End card | Flow A5 + Remotion |

### Spot B: Ile Noire (premium island rum), 3D product
Mood: dark, precise, luxurious; echoes the chrome and cobalt sculpture.
| Time | Shot | Source |
|---|---|---|
| 0.0 to 3.0 | Black void; a single rim light traces the bottle edge | Blender B1 |
| 3.0 to 6.0 | Slow orbit; cobalt glass, liquid catches light | Blender B2 |
| 6.0 to 9.0 | Macro: an ice sphere drops, slow motion splash | Flow B3 (or Blender) |
| 9.0 to 12.0 | Bottle on volcanic rock, sugarcane silhouettes, night sky | Flow B4 + Blender comp |
| 12.0 to 15.0 | Hero bottle, type "Aged by the island." End card | Blender B5 + Remotion |

### Spot C: Pointe aux Feuilles Residences (beachfront property for foreign buyers)
Mood: airy, aspirational, architectural.
| Time | Shot | Source |
|---|---|---|
| 0.0 to 3.0 | Drone glide over turquoise reef towards a white modern villa | Flow C1 |
| 3.0 to 6.0 | Interior: floor-to-ceiling glass, sea view, sheer curtains moving | Flow C2 |
| 6.0 to 9.0 | Infinity pool edge merging with the ocean at sunset | Flow C3 |
| 9.0 to 12.0 | Family dinner on a terrace, lanterns, warm evening light (no faces in close-up) | Flow C4 |
| 12.0 to 15.0 | Type "Your address in paradise. From [price]." End card | Remotion |

### Spot D: Kestrel (fintech launch), kinetic type and motion design
Mood: sharp, fast, confident. Entirely Remotion, brand system plus cobalt.
| Time | Beat |
|---|---|
| 0.0 to 2.0 | "Payday." Slams in, numbers counter spin |
| 2.0 to 5.0 | Phone UI assembles from shapes; balance animates up |
| 5.0 to 9.0 | Three benefits, one word each, hard cuts on the beat |
| 9.0 to 12.0 | Card flips, chrome sheen pass |
| 12.0 to 15.0 | "Money, on island time." End card |

## 5. Flow prompt sheet (for Ruben)

How to generate: Google Flow (or Gemini app) with Veo. Generate each shot at
1080p in 16:9. Shots marked [V] also generate natively in 9:16. Make 2 to 3
takes per shot. Save the best takes as MP4 into
C:\Users\ruben\Downloads\studio26\production\ai-video\flow-raw using the file
name shown, adding _t1, _t2 for takes. No real people's likeness, no real brand
logos, no text in frame (type is added later). Audio from Veo is optional; we
replace the mix.

A1_lagoon-macro: Extreme macro shot of early morning sunlight breaking across
gently rippling turquoise lagoon water, sparkling highlights, shallow depth of
field, slow motion, warm golden hour light, calm and luxurious, 100mm lens,
cinematic colour grade, soft film grain. [V]

A2_curtain-pushin: Slow dolly push-in towards an open villa doorway, a white
linen curtain lifts gently in the sea breeze, beyond it a calm turquoise lagoon
at sunrise, warm natural light, airy and serene, 35mm lens, cinematic.

A3_pontoon-overhead: Top-down aerial shot of a wooden pontoon over crystal clear
turquoise water, a single person in a white linen shirt walks slowly to the end,
long soft morning shadows, minimal composition, drone shot, cinematic. [V]

A4_coffee-terrace: Close-up of coffee being poured from a ceramic pot into a
handmade ceramic cup on a wooden terrace table, blurred lagoon and palm trees
behind, steam rising, golden morning light, slow motion, 85mm lens.

A5_terrace-sunrise: Wide shot of a boutique villa terrace with linen loungers
facing a calm lagoon at sunrise, mountains on the horizon, pink and gold sky,
gentle camera drift right, tranquil and premium, cinematic. [V]

B3_ice-splash: Extreme slow motion macro of a clear ice sphere dropping into a
heavy crystal glass of amber rum on a black background, droplets suspended in
the air, single rim light, high contrast, luxury product cinematography. [V]

B4_volcanic-night: Dark bottle-free scene: black volcanic rock in the foreground,
sugarcane field silhouettes and a starry night sky behind, moonlight, slight
mist, slow camera push, moody and luxurious, cinematic. (A 3D bottle is
composited later.)

C1_reef-drone: Drone glides low over a turquoise coral reef lagoon towards a
white minimalist modern beachfront villa with palm trees, bright midday sun,
crystal water, smooth forward motion, real estate cinematography. [V]

C2_glass-interior: Interior of a modern minimalist villa living room with
floor-to-ceiling glass doors open to the ocean, sheer white curtains moving in
the breeze, natural wood and stone, soft daylight, slow sideways dolly, 24mm.

C3_infinity-pool: Infinity pool edge merging seamlessly with the ocean horizon
at sunset, orange and violet sky reflected in the water, slow low camera glide
along the pool edge, luxurious and calm, cinematic. [V]

C4_terrace-dinner: Evening family dinner on a villa terrace with lanterns and
warm string lights, ocean at dusk behind, people seen from behind or at a
distance only, no close-up faces, relaxed and warm, slow push-in, 50mm.

## 6. Production plan

| Step | Owner | Output |
|---|---|---|
| Flow shots A1 to A5, B3, B4, C1 to C4 | Ruben | MP4s in production\ai-video\flow-raw |
| Bottle model, lighting, B1, B2, B5 | Claude (Blender, Eevee) | production\ai-video\blender |
| Kestrel spot D, all type, end cards, captions, format versions | Claude (Remotion) | production\ai-video\remotion |
| Music selection and mix | Claude (free licensed library) | production\ai-video\audio |
| Grade, assembly, encodes (H.264 MP4 plus WebM), posters | Claude (ffmpeg) | production\ai-video\masters, posters |
| Upload to existing R2 bucket | Claude, with Ruben's go-ahead | Public URLs |
| Page build, section by section, REVIEW.md gate | Claude on ai-video-rethink | Merge into phase-1-site when approved |

Constraint: the laptop renders Blender on Intel integrated graphics, so 3D uses
Eevee with short shots. Photoreal 4K would need cloud rendering later.

## 7. Performance and accessibility targets for the page

- No autoplay with sound; muted loops only for short silent previews; videos
  preload="none" with posters; play on visibility or intent.
- First view under 1.5 MB; page JS under 200 KB gzip (the current 568 KB
  ad-demo.js is replaced).
- Captions on every film; pause control on any continuous motion; keyboard
  operable feed and layer controls.