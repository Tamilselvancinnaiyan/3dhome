# Measured 2BHK house explorer

A local Three.js viewer. One model unit is one foot. `model-plan.mjs` is the source of finished-face room bounds, external/internal walls, openings, porch and stairs. Both rendering and the sidebar area summary use that geometry.

The corrected main house is **1,001.625 sq ft**, plus a **90 sq ft** sit-out and **84 sq ft** external staircase. See [the generated report](CORRECTED-PLAN-REPORT.md) for the original/corrected room comparison, measurements, complete area reconciliation and review limitations.

## Run and build

Use Node.js 24 for development checks. With dependencies installed:

```sh
npm test
npm run build
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/dist/` for the tested build, or `http://localhost:8000/` for source preview. A WebGL-capable browser is required. Production is static HTML/CSS/JavaScript: no server-side Node.js dependency is needed. Existing GitHub Pages root hosting still works when the updated source files, new `model-plan.mjs`, and `vendor/` are included; `dist/` is an alternative complete static output.

Use **Top view → Measurements** for clear room/zone dimensions, wall thicknesses and outer dimensions. **Building Area Summary** reports wall, room, circulation, porch, stair and approach-step areas separately. Living/dining are non-overlapping measurement zones in an open hall.

These are preliminary finished-envelope wall assumptions (9 inches external, 4.5 inches internal), not structural or construction specifications. The original `plan.png` is retained as an approximate historical reference and does not represent the corrected geometry.

## Design audit

Open **Design Validation** in the sidebar for source-derived areas and check details. Enable **Highlight checks in Top View** for red failures, amber manual-review regions and green measured checks. These colors do not certify structural capacity or building-code compliance. See [DESIGN-AUDIT.md](DESIGN-AUDIT.md) for exact source locations, opening inventory, before/after areas and budget scenarios. `design-validation.mjs` must be deployed with the other static source files; `npm run build` includes it automatically.
