# Corrected 2BHK geometry and area report

The underlying walls, slabs, openings and furniture coordinates have been corrected, rather than only changing labels. Scale: **1 model unit = 1 foot**. Dimensions below are clear finished-face measurements. Living and dining are explicitly bounded measurement zones inside an open hall, not enclosed rectangles; their areas do not overlap.

## Original versus corrected dimensions

Original values are clear wall-face dimensions from the prior geometry audit, not the incorrect sidebar labels. The original living/dining hall had a combined allocated clear area of 389.9525 sq ft, with no independent room boundaries; the new requested non-overlapping zones total 309 sq ft.

| Space | Original actual clear size, ft | Corrected actual clear size | Corrected area, sq ft |
|---|---|---|---:|
| Living room | Not independently bounded (shared hall) | 16′ 0″ × 14′ 0″ (open-plan zone) | 224.00 |
| Dining | Not independently bounded (shared hall) | 10′ 0″ × 8′ 6″ (open-plan zone) | 85.00 |
| Kitchen | 11.55 × 6.55 | 10′ 0″ × 8′ 0″ | 80.00 |
| Master bedroom | 10.55 × 10.55 | 12′ 0″ × 13′ 0″ | 167.56 |
| Bedroom 2 | 9.55 × 10.55 | 11′ 0″ × 11′ 0″ | 121.00 |
| Common bathroom | 4.05 × 7.05 | 5′ 0″ × 7′ 6″ | 37.50 |
| Attached bathroom | 4.05 × 10.55 | 5′ 0″ × 8′ 0″ | 40.00 |
| Pooja room | 3.55 × 4.55 | 4′ 0″ × 5′ 0″ | 20.00 |
| Utility | 3.55 × 8.55 | 4′ 6″ × 9′ 6″ | 42.75 |
| Sit-out | 15 × 6 | 15′ 0″ × 6′ 0″ | 90.00 |

## Outside dimensions and main-house footprint

- Overall outer width: **35′ 7.5″** (35.625 ft).
- Overall outer depth: **29′ 9″** (29.75 ft).
- Rear wing: 35.625 ft wide × 9.5 ft deep.
- Front wing: 32.75 ft wide × 20.25 ft deep, immediately adjoining the rear wing at z=9.5.
- Closed L-shaped outline: (0,0), (35.625,0), (35.625,9.5), (32.75,9.5), (32.75,29.75), (0,29.75).
- Main-house built-up area = 35.625 × 9.5 + 32.75 × 20.25 = **1,001.63 sq ft**. The bounding rectangle is not used as its area.
- Main roof and structural floor follow this outline. There is no unassigned roofed external recess or unsupported oversized roof.

## Area reconciliation, without double-counting

| Component | Area, sq ft |
|---|---:|
| Total clear internal room zones | 817.81 |
| External wall area at floor level | 93.19 |
| Internal partition wall area, wall intersections counted once | 31.41 |
| Internal circulation, door thresholds and unassigned floor | 59.22 |
| **Main-house built-up area** | **1,001.63** |
| Sit-out | 90.00 |
| External stair flight and landing | 84.00 |
| **House + sit-out + stairs, no overlap** | **1,175.63** |
| Separate porch approach steps | 13.50 |
| **Combined ground footprint including approach steps** | **1,189.13** |

Totals use unrounded geometry. Door thresholds are circulation/floor, not wall area. Window sill walls remain wall footprint. The wall solid volumes are partitioned into non-overlapping cells; the same wall intersection is never counted as both external and internal wall. Floor finishes do not overlap each other or wall footprints. Main slab, porch, stairs and approach steps meet at edges rather than extending into each other. Roof and floor plan area are counted once, not summed as separate storeys.

## Layout and target-area trade-offs

Every requested room size fits. The main footprint exceeds 1,000 sq ft by **1.63 sq ft (0.163%)**. No room was reduced to force an exact total.

The retained row-and-column arrangement determines its dimensions: the rear bedroom/bathroom row needs 35.625 ft including wall thickness; the front kitchen/living/utility row needs 32.75 ft; the left bedroom/dining/kitchen stack needs 29.75 ft depth; the rear attached-bath wing needs 9.5 ft depth. These bands explain the small excess. This is a feasible compact arrangement, not a claim of a globally optimal packing of all possible floor plans.

Significant changes, disclosed before implementation: the rear wing widened; the master and both bathroom partitions moved; the right front wing steps inward; the kitchen/dining partition and slabs moved to finished-face coordinates. Rear bedrooms, attached-bath relationship, common-area bathroom access, front-left kitchen, open dining/living, pooja and living-access utility are retained. The main opening keeps x=12.8..16.3 (center x=14.55) and follows the corrected front face at z=29.75. North/front remains +Z. The independently accessed staircase remains on the right.

## Furniture, windows and circulation

- Beds retain exact 5 × 6.5 ft total envelopes, including their frames.
- Bedroom 2 wardrobe: 4 × 2 × 7 ft, with sliding doors. Door-side aisle: 4.1 ft; wardrobe access in front: 3.45 ft.
- Master wardrobe: 5 × 2 × 7 ft, with sliding doors. Bedside aisles: 3.5 ft; space in front of wardrobe: 4.15 ft.
- Both beds and wardrobes are checked against the actual rendered Three.js bounds, not just their plan descriptions.
- Dining table reduced to a practical 4 × 2.5 ft six-seat set to preserve the specified dining zone and a 2.51 ft side route. This changes furniture, not the required room dimensions.
- The master bedroom entrance is on its west side, accessed from the common hall like Bedroom 2, and opens into the bedroom clear of furniture.
- The kitchen sink is on a compact counter at the kitchen–dining corner; the dining passage stays clear.
- Full door sweeps are checked against walls and furniture. Hinges are on the opening-side finished face, with jamb gaps, so leaves do not clip through thick walls.
- A grid route test with 1.25 ft obstacle clearance on each side verifies 2.5 ft-wide essential paths from the entrance to all room destinations with doors open. This is a planning check, not an accessibility/code certification.
- Windows retain their existing timber/glass style, with openings repositioned to the corrected rooms. The TV is beside the front living window rather than across its opening. Kitchen upper cabinets avoid the windows. The three circular kitchen/bathroom exhaust openings are retained and repositioned into the corrected exterior walls.

## Sit-out and external stair

The sit-out is exactly 15 × 6 ft, starts at the exterior front face (z=29.75), and is centered on the original entrance x position. Two 9-inch square pillars support its flat 6-inch RCC-style canopy. Three 1-foot approach treads suit the corrected 1.58 ft plinth; their footprint is reported separately.

The staircase has **22 equal risers**, each 6.218 inches, **21 goings of 1′ 0″**, a 3′ 6″ clear modeled width and a 3-foot landing. The flight is 3.5 × 21 = 73.5 sq ft; the landing is 3.5 × 3 = 10.5 sq ft, total **84 sq ft**. Flight and landing meet at an edge. There is no overlap with the main building or sit-out. A continuous stair waist replaces floating tread meshes, and rails/posts connect to the flight and landing. Plain terrace guards are modeled at 3 ft above the roof to match the landing guard concept; final guard details need professional confirmation.

## Website and verification

The sidebar shows geometry-derived dimensions and a Building Area Summary. Measurements are optional in top view and include room/zone dimensions, outer building dimensions, both wall thicknesses, porch dimensions, stair dimensions and a north/front arrow. Orbit, zoom, pan, exterior, roof-hidden top view, walkthrough, room focus, labels, furniture, evening lighting, doors and image export remain available. Mobile settings and area summary remain accessible.

Run `npm run build` to run syntax and automated geometry/viewer checks, then produce the static website in `dist/` with `area-summary.json`. The build checks room sizes, wall thickness, 3D wall overlaps, area reconciliation, structural footprint overlaps, door sweeps, 2.5 ft routes, real rendered furniture bounds, stair/porch connections and viewer mode controls.

Changed/added implementation files: `app.js`, `model-plan.mjs`, `index.html`, `style.css`, `package.json`, `scripts/build.mjs`, `scripts/report.mjs`, `tests/geometry.test.mjs`, `tests/viewer.test.mjs`, `vendor/package.json`, `.gitignore`, `README.md`, this report, and a historical-snapshot note in `house-area-audit.md`. The unrelated existing `index.js` and the original plan image are unchanged. No files were deployed or pushed.

## Review status

This is a dimensionally consistent **preliminary architectural model** for review and preliminary area-based estimates. The external 9-inch and internal 4.5-inch wall thicknesses are finished-envelope modeling assumptions, not structural specifications. Foundations, reinforcement, structural spans, drainage, ventilation, setbacks, site boundaries and local approvals are not designed or certified by this model. An architect/structural engineer must confirm them before construction or a priced bill of quantities.
