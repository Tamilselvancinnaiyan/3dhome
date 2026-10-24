# 2BHK source geometry and design audit

Audit date: 20 October 2026. Scope: existing concept, 1 model unit = 1 ft. No structural approval or construction-readiness claim. PASS means only the stated tested criterion; FAIL may be a design criterion rather than a statutory violation. Manual verification is deliberately not PASS. Design preferences below are not asserted legal minima.

## Findings and safe correction scope

- Main-house stepped outline is **1,001.625 sq ft**, 1.625 sq ft above target. Gross bounding extents **35′ 7.5″ × 29′ 9″**; front block width 32.75 ft, rear width 35.625 ft. The bounding rectangle is not the area.
- All nine primary room zones match the current specified dimensions. Utility enlargement and master alcove are recorded separately. Living and dining are open measurement zones, not enclosed rooms.
- Two design failures: six-seat dining arrangement has almost no chair pull-out margin against west/bedroom walls; stair landing depth 3 ft is less than 3.5 ft flight width under this audit's design criterion.
- No confirmed structural geometry correction can safely be applied without a design decision. Landing extension would add 1.75 sq ft; this is proposed only. Dining furniture options need selection. User-requested geometry update: master south partition now reaches the outside wall; pooja shares it and remains 4 × 5 ft; utility is now 4.5 × 9.5 ft (+6.75 sq ft). The redundant partition and gap storage were removed. The former recess beside the attached bathroom is open to the master as a 2.5 × 4.625 ft alcove (+11.5625 sq ft), retaining its primary 12 × 13 ft zone. Main-house footprint is unchanged. Wall modifications are modeling proposals; structural engineer must confirm before construction.
- Confirmed validation defect corrected: rendered kitchen counters and dining handwash were omitted from the previous collision inventory. Their footprints are now included in shared door-sweep and route checks. Kitchen counter coordinates now share one definition with the renderer. Broader checks still find all selected 2.5 ft access routes reachable with doors fully open.
- Added geometry-derived Design Validation panel and optional top-view status overlay. Green is a measured check, amber is unresolved review, red is a failing criterion. Whole-building structural uncertainty remains explicit in the panel rather than masking the entire overlay.

## Audit register

| Check | Status / severity | Source measurement / evidence | Criterion | Exact code locations | Proposed correction / area impact |
|---|---|---|---|---|---|
| Footprint accounting | **PASS** / High | 1001.625 sq ft; bounding extents 35′ 7.5″ × 29′ 9″; stepped outline. Sit-out 90, stairs 84, approach steps 13.5 sq ft separately. | Union of floor outline, with disjoint room/wall/circulation accounting; target approximately 1,000 sq ft. | [model-plan.mjs:9](model-plan.mjs#L9), [model-plan.mjs:114](model-plan.mjs#L114) | Retain union accounting; never use the bounding rectangle as built-up area. No dimensional or area change. |
| Living room: clear measurement | **PASS** / High | 16′ 0″ × 14′ 0″ | 16 × 14 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:12](model-plan.mjs#L12) | Preserve finished-face boundaries. No dimensional or area change. |
| Dining: clear measurement | **PASS** / High | 10′ 0″ × 8′ 6″ | 10 × 8.5 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:13](model-plan.mjs#L13) | Preserve finished-face boundaries. No dimensional or area change. |
| Kitchen: clear measurement | **PASS** / High | 10′ 0″ × 8′ 0″ | 10 × 8 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:14](model-plan.mjs#L14) | Preserve finished-face boundaries. No dimensional or area change. |
| Master bedroom: clear measurement | **PASS** / High | 12′ 0″ × 13′ 0″ + 2.5 × 4.625 ft alcove (11.5625 sq ft) | 12 × 13 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:15](model-plan.mjs#L15) | Preserve finished-face boundaries. No dimensional or area change. |
| Bedroom 2: clear measurement | **PASS** / High | 11′ 0″ × 11′ 0″ | 11 × 11 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:16](model-plan.mjs#L16) | Preserve finished-face boundaries. No dimensional or area change. |
| Common bathroom: clear measurement | **PASS** / High | 5′ 0″ × 7′ 6″ | 5 × 7.5 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:17](model-plan.mjs#L17) | Preserve finished-face boundaries. No dimensional or area change. |
| Attached bathroom: clear measurement | **PASS** / High | 5′ 0″ × 8′ 0″ | 5 × 8 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:18](model-plan.mjs#L18) | Preserve finished-face boundaries. No dimensional or area change. |
| Pooja room: clear measurement | **PASS** / High | 4′ 0″ × 5′ 0″ | 4 × 5 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:19](model-plan.mjs#L19) | Preserve finished-face boundaries. No dimensional or area change. |
| Utility: clear measurement | **PASS** / High | 4′ 6″ × 9′ 6″ | 4.5 × 9.5 ft clear; exclude walls. Living and dining are non-overlapping open-plan zones. | [model-plan.mjs:20](model-plan.mjs#L20) | Preserve finished-face boundaries. No dimensional or area change. |
| Essential access routes | **FAIL** / High | bed2: reachable; master: reachable; common: reachable; attached: reachable; kitchen: blocked; dining: blocked; living: reachable; pooja: reachable; utility: reachable | 2.5 ft square envelope sampled on 0.25 ft grid; doors fully open; selected destinations only, not all furniture operating clearances. | [design-validation.mjs:9](design-validation.mjs#L9) | Retain routes; confirm occupied/appliance-door conditions on detailed plan. No dimensional or area change. |
| Wall thickness geometry | **PASS** / High | 9″ external, 4.5″ internal; wall height 9.4 ft. | 9″ / 4.5″ modeling assumptions; not a load-bearing-wall specification. | [model-plan.mjs:2](model-plan.mjs#L2), [model-plan.mjs:27](model-plan.mjs#L27) | Engineer must classify walls and design their support. No dimensional or area change. |
| front: door swing | **PASS** / High | 3.50 ft masonry opening, 3.38 ft modeled leaf; no sampled swing collision. | Clear full 0–90° sweep; sample 2° / 0.04 ft, not exact continuous collision proof. Clear hardware width requires review. | [model-plan.mjs:33](model-plan.mjs#L33), [model-plan.mjs:127](model-plan.mjs#L127) | Retain jamb clearance; confirm hardware and as-built clear opening. No dimensional or area change. |
| bed2-east: door swing | **PASS** / High | 3.00 ft masonry opening, 2.88 ft modeled leaf; no sampled swing collision. | Clear full 0–90° sweep; sample 2° / 0.04 ft, not exact continuous collision proof. Clear hardware width requires review. | [model-plan.mjs:34](model-plan.mjs#L34), [model-plan.mjs:127](model-plan.mjs#L127) | Retain jamb clearance; confirm hardware and as-built clear opening. No dimensional or area change. |
| common-south: door swing | **PASS** / High | 2.75 ft masonry opening, 2.63 ft modeled leaf; no sampled swing collision. | Clear full 0–90° sweep; sample 2° / 0.04 ft, not exact continuous collision proof. Clear hardware width requires review. | [model-plan.mjs:36](model-plan.mjs#L36), [model-plan.mjs:127](model-plan.mjs#L127) | Retain jamb clearance; confirm hardware and as-built clear opening. No dimensional or area change. |
| master-west: door swing | **PASS** / High | 3.00 ft masonry opening, 2.88 ft modeled leaf; no sampled swing collision. | Clear full 0–90° sweep; sample 2° / 0.04 ft, not exact continuous collision proof. Clear hardware width requires review. | [model-plan.mjs:37](model-plan.mjs#L37), [model-plan.mjs:127](model-plan.mjs#L127) | Retain jamb clearance; confirm hardware and as-built clear opening. No dimensional or area change. |
| master-east: door swing | **PASS** / High | 2.75 ft masonry opening, 2.63 ft modeled leaf; no sampled swing collision. | Clear full 0–90° sweep; sample 2° / 0.04 ft, not exact continuous collision proof. Clear hardware width requires review. | [model-plan.mjs:38](model-plan.mjs#L38), [model-plan.mjs:127](model-plan.mjs#L127) | Retain jamb clearance; confirm hardware and as-built clear opening. No dimensional or area change. |
| utility-west: door swing | **PASS** / High | 2.75 ft masonry opening, 2.63 ft modeled leaf; no sampled swing collision. | Clear full 0–90° sweep; sample 2° / 0.04 ft, not exact continuous collision proof. Clear hardware width requires review. | [model-plan.mjs:45](model-plan.mjs#L45), [model-plan.mjs:127](model-plan.mjs#L127) | Retain jamb clearance; confirm hardware and as-built clear opening. No dimensional or area change. |
| Living furniture spacing | **NEEDS MANUAL VERIFICATION** / Medium | Sofa–coffee table 3.10 ft; table–console 3.85 ft. | Use about 1.25–1.5 ft local reach gap; keep essential through-routes at least 2.5 ft. Seating gap is not a through-route. | [model-plan.mjs:65](model-plan.mjs#L65), [app.js:143](app.js#L143) | Confirm circulation while occupied; route around the table, not between sofa and table. No dimensional or area change. |
| Dining chair pull-out | **FAIL** / Medium | Occupied set margins: west 1.26, bedroom-wall side 1.41, east 1.26 ft. The six-seat table is centered in the dining area. | Design preference: about 2.5–3 ft behind occupied chairs where a walking route is required; provide usable pull-out space elsewhere. | [model-plan.mjs:68](model-plan.mjs#L68), [app.js:154](app.js#L154) | Review a smaller/four-seat table or bench against wall; confirm chair pull-out space for the centered six-seat set. Not applied. Furniture-only redesign can keep room sizes/area unchanged. |
| Kitchen and utility routes | **NEEDS MANUAL VERIFICATION** / Medium | Kitchen counters 2 ft deep; opposing sink/west run gap 6.00 ft; fridge–sink gap 5.55 ft. Kitchen/dining opening 3 ft. Utility entered from living through 2.75 ft opening. | Keep at least 2.5 ft essential routes; appliance doors, refrigerator ventilation, plumbing and cooking/exhaust clearances need specification. | [app.js:159](app.js#L159), [model-plan.mjs:70](model-plan.mjs#L70), [model-plan.mjs:45](model-plan.mjs#L45) | Check fridge door, hob/exhaust, sink drainage and utility door with actual appliances. No dimensional or area change. |
| bed2: beds and wardrobes | **NEEDS MANUAL VERIFICATION** / Medium | Bed 6′ 6″ × 5′ 0″; wardrobe 4′ 0″ × 2′ 0″ × 7 ft high. Bed-to-wardrobe front separation 3.45 ft; lateral bed gaps 0.40 / 4.10 ft. | Queen 5 × 6.5 ft including frame. At least 2.5 ft on essential access side, not necessarily every side; allow wardrobe operation. | [model-plan.mjs:52](model-plan.mjs#L52), [app.js:112](app.js#L112) | Bedroom 2 bed intentionally against one side; confirm user accepts single-side access and specify wardrobe doors. No dimensional or area change. |
| master: beds and wardrobes | **NEEDS MANUAL VERIFICATION** / Medium | Bed 5′ 0″ × 6′ 6″; wardrobe 5′ 0″ × 2′ 0″ × 7 ft high. Bed-to-wardrobe front separation 4.15 ft; lateral bed gaps 3.50 / 3.50 ft. | Queen 5 × 6.5 ft including frame. At least 2.5 ft on essential access side, not necessarily every side; allow wardrobe operation. | [model-plan.mjs:55](model-plan.mjs#L55), [app.js:112](app.js#L112) | Bedroom 2 bed intentionally against one side; confirm user accepts single-side access and specify wardrobe doors. No dimensional or area change. |
| Bathroom fixtures | **NEEDS MANUAL VERIFICATION** / Medium | Common 5 × 7.5 ft; attached 5 × 8 ft. Shower footprints 2.475 × 2.3 ft and 2.525 × 2.3 ft. | Design preference: approximately 3 × 3 ft shower where practical; verify WC and basin manufacturer clearances and waterproofing. | [model-plan.mjs:60](model-plan.mjs#L60), [model-plan.mjs:63](model-plan.mjs#L63) | Review wet-area arrangement before enlarging showers; door sweeps are checked separately. No dimensional or area change. |
| Sit-out dimensions and entry | **PASS** / Medium | 15′ 0″ × 6′ 0″ = 90 sq ft; two 0.75 ft square corner pillars. Door centered x=14.55; steps width 4.5 ft. Sit-out furniture and potted plants removed. | 15 × 6 ft slab; preserve centered, unobstructed entry. | [model-plan.mjs:47](model-plan.mjs#L47), [app.js:90](app.js#L90) | Keep middle approach clear; roof support capacity is unverified. No dimensional or area change. |
| Stair dimensional inventory | **PASS** / Medium | Width 3.5 ft gross; going 12″; 22 risers at 6.218″; total rise 11.40 ft. | Uniform modeled rise and going; this PASS covers inventory/consistency only, not regulations. | [model-plan.mjs:48](model-plan.mjs#L48), [app.js:97](app.js#L97) | Retain current dimensions pending staircase review. No dimensional or area change. |
| Stair landing depth | **FAIL** / High | 3.5 × 3 ft landing; flight 3.5 ft gross width. | Design review criterion: landing travel depth at least flight width (3.5 ft). Confirm applicable local requirement. | [model-plan.mjs:48](model-plan.mjs#L48), [app.js:102](app.js#L102) | Review extending landing by 0.5 ft toward rear: 1.75 sq ft extra footprint. Not applied because landing is structural. Proposed only: staircase +1.75 sq ft if disjoint extension; main-house/room areas unchanged. Engineer approval required. |
| Stair headroom, guards and access | **NEEDS MANUAL VERIFICATION** / High | 22 risers in one flight; roof top 9.9 ft, open-air flight; rails at about 3 ft with sparse posts and a midrail. Clear between round rails about 3.32 ft. No upper storey/headroom envelope or ground approach landing modeled. | Confirm allowable risers per flight, actual clear width, headroom, guard infill, non-slip finish and future floor access with local authority/engineer. | [app.js:104](app.js#L104), [app.js:78](app.js#L78), [model-plan.mjs:48](model-plan.mjs#L48) | Specify safe guards and future headroom; verify plot setbacks. No blanket code compliance conclusion. No dimensional or area change. |
| Daylight and ventilation | **NEEDS MANUAL VERIFICATION** / High | 10 window openings and 3 vents; pooja has no direct external opening. North/front is model +Z, not surveyed north. | Verify openable area, glazing transmission, neighbouring obstructions, setbacks, exhaust, and north orientation on site. Gross opening area is not effective ventilation area. | [model-plan.mjs:28](model-plan.mjs#L28), [model-plan.mjs:33](model-plan.mjs#L33), [app.js:355](app.js#L355) | Pooja needs ventilation strategy; porch shades kitchen/front hall openings; staircase may obstruct east utility window. No airflow/daylight calculation claimed. No dimensional or area change. |
| Future first floor and structural support | **NEEDS MANUAL VERIFICATION** / Critical | Roof visual slab 6.0″; porch visual span 15 × 6 ft on two 9″ pillars plus house edge; living zone 16 × 14 ft. No beam/column grid, reinforcement, foundation, soil, loads or material strengths. | Licensed structural design for present + future floor, soil bearing, seismic/wind loads, support/load paths and stair/porch connections. | [app.js:78](app.js#L78), [app.js:90](app.js#L90), [app.js:102](app.js#L102) | Engineer must establish structural system before changing masonry, pillars, slab or stair. Rendered sizes do not demonstrate capacity. No dimensional or area change. |
| ₹25 lakh budget | **NEEDS MANUAL VERIFICATION** / High | Main-house rate scenario ₹23.54 lakh; plus porch/stair at same rate ₹27.63 lakh. | ₹25 lakh target at user-specified ₹2,350/sq ft; verify what the quoted rate includes. | [model-plan.mjs:114](model-plan.mjs#L114) | Obtain itemized BOQ; price RCC stair/porch separately and future-floor structural provision, services and site works. No dimensional or area change. |

## Before / after area reconciliation

| Component | Before sq ft | After sq ft | Change sq ft |
|---|---:|---:|---:|
| Clear room zones | 799.5 | 817.813 | 18.313 |
| Net external wall footprints | 93.188 | 93.188 | 0 |
| Net internal partition footprints | 33.422 | 31.406 | -2.016 |
| Circulation/unassigned incl. thresholds | 75.516 | 59.219 | -16.297 |
| Main-house built-up | 1,001.625 | 1,001.625 | 0 |
| Sit-out slab | 90 | 90 | 0 |
| Stair flight + landing | 84 | 84 | 0 |
| Approach steps | 13.5 | 13.5 | 0 |
| Union without approach steps | 1,175.625 | 1,175.625 | 0 |
| Total modeled footprint incl. steps | 1,189.125 | 1,189.125 | 0 |

Clear zones + net external walls + net partitions + circulation = main-house union. Door thresholds/openings are assigned to circulation where outside clear room rectangles; wall footprints exclude door holes but include window sill bands. These are plan areas, not masonry surface areas or material quantities. Floor, roof and plinth slabs are not added repeatedly. Stair footprint is a horizontal projection, not its sloping concrete surface. Decorative ground/site slab is excluded. Sit-out/stairs/approach steps do not overlap main-house outline. No separate enclosed 1,000 sq ft plus hidden covered recess is counted.

## Room comparison (clear finished faces)

| Room | Before | After | Area sq ft |
|---|---|---|---:|
| Living room | 16′ 0″ × 14′ 0″ | 16′ 0″ × 14′ 0″ | 224 |
| Dining | 10′ 0″ × 8′ 6″ | 10′ 0″ × 8′ 6″ | 85 |
| Kitchen | 10′ 0″ × 8′ 0″ | 10′ 0″ × 8′ 0″ | 80 |
| Master bedroom | 12′ 0″ × 13′ 0″ | 12′ 0″ × 13′ 0″ + 11.5625 sq ft alcove | 167.563 |
| Bedroom 2 | 11′ 0″ × 11′ 0″ | 11′ 0″ × 11′ 0″ | 121 |
| Common bathroom | 5′ 0″ × 7′ 6″ | 5′ 0″ × 7′ 6″ | 37.5 |
| Attached bathroom | 5′ 0″ × 8′ 0″ | 5′ 0″ × 8′ 0″ | 40 |
| Pooja room | 4′ 0″ × 5′ 0″ | 4′ 0″ × 5′ 0″ | 20 |
| Utility | 4′ 6″ × 8′ 0″ | 4′ 6″ × 9′ 6″ | 42.75 |

## Openings inventory

Positions are X for walls on X axis, Z for walls on Z axis. Heights are model Y above slab datum; finished floor is 0.08 ft. Dimensions here describe wall holes, not guaranteed clear hardware width. Front door is x=12.8–16.3 on north/+Z face. Bed2 enters at z=8.5–11.5 on east wall; master enters z=10.5–13.5 on west wall; attached bath is via master east wall. Kitchen–dining partition is only 3.5 ft high and has a 3 ft opening. Utility access remains from living.

| Wall | Opening | Coordinate interval ft | Plan rectangle width × depth | Y sill–top ft | Operation |
|---|---|---|---|---|---|
| rear (external) | window | 8.25–11.25 | 3′ 0″ × 0′ 9″ | 3–7 | — |
| rear (external) | vent | 12.6–13.8 | 1′ 2.375″ × 0′ 9″ | 7.5–8.7 | — |
| rear (external) | window | 14–16 | 2′ 0″ × 0′ 9″ | 5.5–7 | — |
| rear (external) | window | 21–24 | 3′ 0″ × 0′ 9″ | 3–7 | — |
| rear (external) | vent | 30.5–31.7 | 1′ 2.375″ × 0′ 9″ | 7.5–8.7 | — |
| rear (external) | window | 32–33.5 | 1′ 6″ × 0′ 9″ | 5.5–7 | — |
| west (external) | window | 15–19 | 0′ 9″ × 4′ 0″ | 3–7 | — |
| west (external) | vent | 21.75–22.95 | 0′ 9″ × 1′ 2.375″ | 7.5–8.7 | — |
| west (external) | window | 24–27 | 0′ 9″ × 3′ 0″ | 3–7 | — |
| east-rear (external) | window | 5.5–7 | 0′ 9″ × 1′ 6″ | 5.5–7 | — |
| east-front (external) | window | 23.5–26.5 | 0′ 9″ × 3′ 0″ | 3–7 | — |
| front (external) | window | 4–8 | 4′ 0″ × 0′ 9″ | 3–7 | — |
| front (external) | door | 12.8–16.3 | 3′ 6″ × 0′ 9″ | 0–7 | hinge min, swing 1 |
| front (external) | window | 28.5–31 | 2′ 6″ × 0′ 9″ | 3–6 | — |
| bed2-east (internal) | door | 8.5–11.5 | 0′ 4.5″ × 3′ 0″ | 0–7 | hinge max, swing 1 |
| common-south (internal) | door | 14.125–16.875 | 2′ 9″ × 0′ 4.5″ | 0–7 | hinge min, swing 1 |
| master-west (internal) | door | 10.5–13.5 | 0′ 4.5″ × 3′ 0″ | 0–7 | hinge max, swing -1 |
| master-east (internal) | door | 5.5–8.25 | 0′ 4.5″ × 2′ 9″ | 0–7 | hinge min, swing 1 |
| kitchen-north (internal) | opening | 4–7 | 3′ 0″ × 0′ 4.5″ | 0–7 | — |
| pooja-west (internal) | opening | 16–18.5 | 0′ 4.5″ × 2′ 6″ | 0–7 | — |
| utility-west (internal) | door | 21.5–24.25 | 0′ 4.5″ × 2′ 9″ | 0–7 | hinge min, swing -1 |

Gross modeled window opening area: 95 sq ft; vents: 4.32 sq ft. These totals are not room daylight ratios or usable free ventilation area. Master/bed2 have rear openings; bed2 also west. Dining has west opening. Kitchen has west and front openings, but counter/cabinet heights affect use. Baths have high windows/vents. Living has front glazing, utility has east/front glazing. Pooja lacks direct exterior opening. Terrace stair beside east utility window and sit-out roof in front of kitchen/living need shadow/obstruction review. Site north is assumed from +Z annotation; no survey or wind data exists.

## Budget at requested ₹2,350/sq ft

| Same-rate scenario | Area sq ft | Amount | Difference from ₹25 lakh |
|---|---:|---:|---:|
| Main house only | 1,001.625 | ₹23,53,819 | ₹-1,46,181 |
| House + porch + staircase | 1,175.625 | ₹27,62,719 | ₹2,62,719 |
| All modeled footprint including steps | 1,189.125 | ₹27,94,444 | ₹2,94,444 |

Negative difference is remaining allowance. Main-house-only allowance is ₹1,46,181. All-footprint rate scenario exceeds target by ₹2,94,444. Do not treat the same flat rate applied to stairs/porch as a contractor estimate; obtain itemized quantities. No market rate verification was attempted: ₹2,350 is supplied by the user. No change in total footprint means no area-rate change before versus after; partition and fit-out costs require an itemized estimate. The possible 1.75 sq ft landing extension is ₹4,113 under this same-rate illustration only, not its structural cost.

Quote scope must identify soil/foundations, present + future-storey RCC design, reinforcement, waterproofing, approvals, MEP, sanitaryware, joinery/wardrobes, kitchen, external drains, sump/septic, compound, taxes, fees, escalation and contingency. These are not confirmed included/excluded by any supplied quotation.

## Required professional decisions

1. Architect: confirm surveyed north, plot/setbacks, local planning category, opening/ventilation strategy, dining furniture and wet-area practicality. Verify actual finished/hardware clearances, appliance operation, accessibility expectations, exterior ground approach, drainage and anti-skid finishes.
2. Structural engineer: soil investigation and foundation design for future first floor; complete column/beam/load-bearing system; slab spans, support and reinforcement; porch beam/pillar connections; stair waist/landing support and anchorage; seismic/wind/loading and future stair headroom. The 6-inch visual roof and 9-inch porch pillars are only meshes, not demonstrated adequate sections. There is no basis to identify safe load-bearing wall relocation from this model.
3. Stair review: single 22-riser flight, landing depth, actual clear width after handrails, guard infill/height, future overhead elements, independent access and legal setbacks. Open-air geometry alone is insufficient headroom proof for future construction.

Reference context only: [Tamil Nadu official 2019 rules](https://www.tnurbantree.tn.gov.in/wp-content/uploads/2020/06/TN_combined_development_building_rules_2019.pdf) and [BIS NBC scope](https://www.bis.gov.in/standards/national-building-code/?lang=en). Current amendments, jurisdiction and occupancy applicability require local verification; this audit does not certify compliance.

## Verification and limitations

Build runs room/area/wall tests, rendered-mesh comparisons, door sweeps, essential-route checks and validation-panel/overlay tests. Door checks sample rotation at 2° and leaf length at 0.04 ft; route checks use a 0.25 ft grid and a 2.5 ft square envelope, with all doors open. They do not prove every reachable point, dynamic wheelchair access, door-handle clearance, appliance opening or material tolerances. Exterior daylight is illustrative lighting, not a simulation. Furniture inventory excludes movable plants/decorative objects; porch layout review is by source and visual inspection. Before snapshot is audit/before.json, generated before audit edits.

Changed sources: README.md, model-plan.mjs, app.js, index.html, style.css, design-validation.mjs, scripts/build.mjs, scripts/audit-report.mjs, tests/geometry.test.mjs, tests/viewer.test.mjs, tests/validation.test.mjs. Generated: DESIGN-AUDIT.md, audit/before.json, dist output. model-plan.mjs includes the subsequently requested room alignment.
