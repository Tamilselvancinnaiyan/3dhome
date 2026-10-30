# Three.js house explorer

Updated working model with the revised left-side pooja and utility, open right living area, master-partition sofa, front-wall TV, half-height kitchen–dining opening, and exact 20 × 5 ft sit-out. The existing viewer, exterior palette/material style, measurement overlay, room focus, walkthrough and exterior presets are retained.

## Run

Serve this directory over HTTP, for example:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/.

```sh
npm test
npm run build
```

Build validates geometry and rendered furniture, then packages the static working viewer in `dist/` with `area-summary.json`. Serve `dist/` over HTTP to use that package independently.

## Measurements

- Main-house built-up: **1,059.84375 sq ft**.
- Covered sit-out: **100 sq ft**.
- External staircase, including landing: **84 sq ft**.
- Additional circulation / open hall apron / thresholds: **117.375 sq ft**, included in the main house.
- Clear room targets total **815.25 sq ft**. Original targets summed to 806.25 sq ft; closing the Bedroom 2–pooja gap adds 9 sq ft to utility. Rooms plus sit-out now total 915.25 sq ft before walls/circulation.

See [geometry-derived measurement report](CORRECTED-PLAN-REPORT.md), [design audit](DESIGN-AUDIT.md), and `screenshots/`. The retained stair landing is 3 ft deep beside a 3.5 ft-wide flight and remains flagged for detailed design review. The model does not establish construction or structural compliance.

Pooja now shares the Bedroom 2 south wall; utility is 4.5 × 11.5 ft, including the recovered depth and a rear laundry storage counter.

Sit-out chairs and corner pots removed. Pooja and Bedroom 2 west-side windows and the attached bathroom stair-side window are closed. The main entrance matches the reference with a solid carved timber leaf, long handle and fixed glazed/slatted sidelight on the right. The door opening and swing are unchanged; glazing stays fixed beside the leaf.

## Downloadable 2D plan

Open **Reference & 2D plan** to view the current measured layout and download it as PNG or SVG. `npm run build` regenerates both images from `model-plan.mjs`; `npm run render:plan` regenerates only the image. PNG rendering uses `sharp`, resolving an installed package first and the bundled Codex workspace runtime second. The static viewer includes the generated files and needs no image-rendering library to display or download them.
