import {readFile,writeFile} from 'node:fs/promises';
import {designValidation} from '../design-validation.mjs';
import {rooms,wallSpecs,dimensionText,openingRect,feetInches} from '../model-plan.mjs';
const root=new URL('../',import.meta.url);
export async function writeAudit(){
 const a=designValidation(),s=a.areas,before=JSON.parse(await readFile(new URL('audit/before.json',root),'utf8'));
 const num=n=>n.toLocaleString('en-IN',{maximumFractionDigits:3}),money=n=>'₹'+n.toLocaleString('en-IN',{maximumFractionDigits:0});
 async function location(ref){const [file,anchor]=ref.split('|'),lines=(await readFile(new URL(file,root),'utf8')).split('\n'),line=lines.findIndex(l=>l.includes(anchor))+1;if(!line)throw Error('Missing source anchor: '+ref);return `[${file}:${line}](${file}#L${line})`;}
 const entries=[];for(const c of a.checks)entries.push(`| ${c.title} | **${c.status}** / ${c.severity} | ${c.existing} | ${c.criterion} | ${(await Promise.all(c.source.map(location))).join(', ')} | ${c.correction} ${c.impact} |`);
 const openingRows=wallSpecs.flatMap(w=>w.openings.map(o=>`| ${w.id} (${w.external?'external':'internal'}) | ${o.kind} | ${o.from}–${o.to} | ${dimensionText(openingRect(w,o))} | ${o.sill??0}–${o.top??7} | ${o.kind==='door'?`hinge ${o.hinge}, swing ${o.swing}`:'—'} |`));
 const areaRows=[['Clear room zones','clear'],['Net external wall footprints','external'],['Net internal partition footprints','partition'],['Circulation/unassigned incl. thresholds','circulation'],['Main-house built-up','main'],['Sit-out slab','porch'],['Stair flight + landing','stairs'],['Approach steps','steps'],['Union without approach steps','combinedWithoutSteps'],['Total modeled footprint incl. steps','combined']].map(([label,key])=>`| ${label} | ${num(before[key])} | ${num(s[key])} | ${num(s[key]-before[key])} |`);
 const text=`# 2BHK source geometry and design audit

Audit date: 20 October 2026. Scope: existing concept, 1 model unit = 1 ft. No structural approval or construction-readiness claim. PASS means only the stated tested criterion; FAIL may be a design criterion rather than a statutory violation. Manual verification is deliberately not PASS. Design preferences below are not asserted legal minima.

## Findings and safe correction scope

- Main-house stepped outline is **${num(s.main)} sq ft**, ${num(s.main-1000)} sq ft above target. Gross bounding extents **${dimensionText(a.mainBounds)}**; front block width 32.75 ft, rear width 35.625 ft. The bounding rectangle is not the area.
- All nine primary room zones match the current specified dimensions. Utility enlargement and master alcove are recorded separately. Living and dining are open measurement zones, not enclosed rooms.
- Two design failures: six-seat dining arrangement has almost no chair pull-out margin against west/bedroom walls; stair landing depth 3 ft is less than 3.5 ft flight width under this audit's design criterion.
- No confirmed structural geometry correction can safely be applied without a design decision. Landing extension would add 1.75 sq ft; this is proposed only. Dining furniture options need selection. User-requested geometry update: master south partition now reaches the outside wall; pooja shares it and remains 4 × 5 ft; utility is now 4.5 × 9.5 ft (+6.75 sq ft). The redundant partition and gap storage were removed. The former recess beside the attached bathroom is open to the master as a 2.5 × 4.625 ft alcove (+11.5625 sq ft), retaining its primary 12 × 13 ft zone. Main-house footprint is unchanged. Wall modifications are modeling proposals; structural engineer must confirm before construction.
- Confirmed validation defect corrected: rendered kitchen counters and dining handwash were omitted from the previous collision inventory. Their footprints are now included in shared door-sweep and route checks. Kitchen counter coordinates now share one definition with the renderer. Broader checks still find all selected 2.5 ft access routes reachable with doors fully open.
- Added geometry-derived Design Validation panel and optional top-view status overlay. Green is a measured check, amber is unresolved review, red is a failing criterion. Whole-building structural uncertainty remains explicit in the panel rather than masking the entire overlay.

## Audit register

| Check | Status / severity | Source measurement / evidence | Criterion | Exact code locations | Proposed correction / area impact |
|---|---|---|---|---|---|
${entries.join('\n')}

## Before / after area reconciliation

| Component | Before sq ft | After sq ft | Change sq ft |
|---|---:|---:|---:|
${areaRows.join('\n')}

Clear zones + net external walls + net partitions + circulation = main-house union. Door thresholds/openings are assigned to circulation where outside clear room rectangles; wall footprints exclude door holes but include window sill bands. These are plan areas, not masonry surface areas or material quantities. Floor, roof and plinth slabs are not added repeatedly. Stair footprint is a horizontal projection, not its sloping concrete surface. Decorative ground/site slab is excluded. Sit-out/stairs/approach steps do not overlap main-house outline. No separate enclosed 1,000 sq ft plus hidden covered recess is counted.

## Room comparison (clear finished faces)

| Room | Before | After | Area sq ft |
|---|---|---|---:|
${rooms.map(q=>`| ${q.name} | ${q.id==='utility'?'4′ 6″ × 8′ 0″':dimensionText(q.r)} | ${dimensionText(q.r)}${q.extra?.length?' + 11.5625 sq ft alcove':''} | ${num(s.roomAreas[q.id])} |`).join('\n')}

## Openings inventory

Positions are X for walls on X axis, Z for walls on Z axis. Heights are model Y above slab datum; finished floor is 0.08 ft. Dimensions here describe wall holes, not guaranteed clear hardware width. Front door is x=12.8–16.3 on north/+Z face. Bed2 enters at z=8.5–11.5 on east wall; master enters z=10.5–13.5 on west wall; attached bath is via master east wall. Kitchen–dining partition is only 3.5 ft high and has a 3 ft opening. Utility access remains from living.

| Wall | Opening | Coordinate interval ft | Plan rectangle width × depth | Y sill–top ft | Operation |
|---|---|---|---|---|---|
${openingRows.join('\n')}

Gross modeled window opening area: ${num(a.windows.filter(w=>w.kind==='window').reduce((s,w)=>s+w.grossArea,0))} sq ft; vents: ${num(a.windows.filter(w=>w.kind==='vent').reduce((s,w)=>s+w.grossArea,0))} sq ft. These totals are not room daylight ratios or usable free ventilation area. Master/bed2 have rear openings; bed2 also west. Dining has west opening. Kitchen has west and front openings, but counter/cabinet heights affect use. Baths have high windows/vents. Living has front glazing, utility has east/front glazing. Pooja lacks direct exterior opening. Terrace stair beside east utility window and sit-out roof in front of kitchen/living need shadow/obstruction review. Site north is assumed from +Z annotation; no survey or wind data exists.

## Budget at requested ₹2,350/sq ft

| Same-rate scenario | Area sq ft | Amount | Difference from ₹25 lakh |
|---|---:|---:|---:|
| Main house only | ${num(s.main)} | ${money(a.budget.main)} | ${money(a.budget.main-a.budget.target)} |
| House + porch + staircase | ${num(s.main+s.porch+s.stairs)} | ${money(a.budget.covered)} | ${money(a.budget.covered-a.budget.target)} |
| All modeled footprint including steps | ${num(s.combined)} | ${money(a.budget.all)} | ${money(a.budget.all-a.budget.target)} |

Negative difference is remaining allowance. Main-house-only allowance is ${money(a.budget.target-a.budget.main)}. All-footprint rate scenario exceeds target by ${money(a.budget.all-a.budget.target)}. Do not treat the same flat rate applied to stairs/porch as a contractor estimate; obtain itemized quantities. No market rate verification was attempted: ₹2,350 is supplied by the user. No change in total footprint means no area-rate change before versus after; partition and fit-out costs require an itemized estimate. The possible 1.75 sq ft landing extension is ${money(1.75*2350)} under this same-rate illustration only, not its structural cost.

Quote scope must identify soil/foundations, present + future-storey RCC design, reinforcement, waterproofing, approvals, MEP, sanitaryware, joinery/wardrobes, kitchen, external drains, sump/septic, compound, taxes, fees, escalation and contingency. These are not confirmed included/excluded by any supplied quotation.

## Required professional decisions

1. Architect: confirm surveyed north, plot/setbacks, local planning category, opening/ventilation strategy, dining furniture and wet-area practicality. Verify actual finished/hardware clearances, appliance operation, accessibility expectations, exterior ground approach, drainage and anti-skid finishes.
2. Structural engineer: soil investigation and foundation design for future first floor; complete column/beam/load-bearing system; slab spans, support and reinforcement; porch beam/pillar connections; stair waist/landing support and anchorage; seismic/wind/loading and future stair headroom. The 6-inch visual roof and 9-inch porch pillars are only meshes, not demonstrated adequate sections. There is no basis to identify safe load-bearing wall relocation from this model.
3. Stair review: single 22-riser flight, landing depth, actual clear width after handrails, guard infill/height, future overhead elements, independent access and legal setbacks. Open-air geometry alone is insufficient headroom proof for future construction.

Reference context only: [Tamil Nadu official 2019 rules](https://www.tnurbantree.tn.gov.in/wp-content/uploads/2020/06/TN_combined_development_building_rules_2019.pdf) and [BIS NBC scope](https://www.bis.gov.in/standards/national-building-code/?lang=en). Current amendments, jurisdiction and occupancy applicability require local verification; this audit does not certify compliance.

## Verification and limitations

Build runs room/area/wall tests, rendered-mesh comparisons, door sweeps, essential-route checks and validation-panel/overlay tests. Door checks sample rotation at 2° and leaf length at 0.04 ft; route checks use a 0.25 ft grid and a 2.5 ft square envelope, with all doors open. They do not prove every reachable point, dynamic wheelchair access, door-handle clearance, appliance opening or material tolerances. Exterior daylight is illustrative lighting, not a simulation. Furniture inventory excludes movable plants/decorative objects; porch layout review is by source and visual inspection. Before snapshot is audit/before.json, generated before audit edits.

Changed sources: README.md, model-plan.mjs, app.js, index.html, style.css, design-validation.mjs, scripts/build.mjs, scripts/audit-report.mjs, tests/geometry.test.mjs, tests/viewer.test.mjs, tests/validation.test.mjs. Generated: DESIGN-AUDIT.md, audit/before.json, dist output. model-plan.mjs includes the subsequently requested room alignment.
`;
 await writeFile(new URL('DESIGN-AUDIT.md',root),text);
}
